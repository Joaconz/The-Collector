# Arquitectura del Sistema — The Collector

## Estructura de capas del backend

La arquitectura sigue el modelo de **3 capas** visto en la materia (UVA 1), bajo el paquete raíz
`com.uade.tpo.thecollector.backend`:

```
Controller  →  Service  →  Repository
```

- **`controller/`** — recibe el request HTTP, delega al service, devuelve la respuesta envuelta
  en `ApiResponseDTO`. Sin lógica de negocio. Autorización declarativa con `@PreAuthorize`.
- **`service/`** — contiene toda la lógica de negocio (`@Transactional` en mutaciones,
  `@Transactional(readOnly = true)` en lecturas). Es la única capa que puede llamar al
  repository. También verifica ownership del recurso cuando `@PreAuthorize` no alcanza (p. ej.
  "solo el dueño de la publicación puede editarla").
- **`repository/`** — acceso a la base de datos mediante Spring Data JPA (`JpaRepository` +
  queries `@Query` declarativas para filtros de catálogo, subastas vencidas, etc.).
- **`model/`** — entidades JPA y enums de estado. Nunca se exponen directamente en la API.
  `Producto` y `Publicacion` implementan **soft-delete** vía un campo `activo` +
  `@SQLRestriction("activo = true")`.
- **`dto/`** — objetos de transferencia de datos, organizados en subcarpetas por dominio
  (`usuario/`, `producto/`, `publicacion/`, `puja/`, `subasta/`, `reserva/`, `oferta/`,
  `carrito/`, `favorito/`). Cada entidad principal tiene su `<Entidad>RequestDTO` y
  `<Entidad>ResponseDTO`. `ApiResponseDTO<T>` envuelve toda respuesta exitosa.
- **`exception/`** — `ResourceNotFoundException`, `ErrorResponseDTO` y el
  `GlobalExceptionHandler` con `@ControllerAdvice`.
- **`config/`** — `WebSecurityConfig` (reglas CORS y de autorización HTTP), `JwtAuthenticationFilter`,
  `ApplicationConfig`, `JsonAuthenticationEntryPoint` / `JsonAccessDeniedHandler` (401/403 en JSON).

Los controllers **nunca** acceden al repository directamente. Todo pasa por el service.

Un job programado (`@Scheduled(fixedRate = 60000)` en `PublicacionService`, habilitado con
`@EnableScheduling` en `BackendApplication`) cierra automáticamente las subastas cuya
`fechaLimiteSubasta` ya venció.

JWT stateless: el token viaja en `Authorization: Bearer <token>`. No hay sesión en el servidor.
Inyección de dependencias siempre por constructor (`private final`).

---

## Flujos de negocio clave

### Flujo de compra directa vía Carrito

```
COMPRADOR
    │
    ├─ Agrega pieza al carrito
    ├─ Realiza checkout
    │  → se descuenta el stock de cada ítem de inmediato (sin generar Reserva)
    │  → si stock llega a 0, publicación pasa a VENDIDA
```

### Flujo de reserva directa (2 pasos, requiere aprobación del vendedor)

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ "Solicitar Reserva Directa" ───►│
    │  (Reserva, origen=DIRECTA,       │
    │   estado: PENDIENTE)             │
    │                                 ├─ Ve reserva pendiente en su panel
    │                                 ├─ Confirma o Rechaza
    │◄─────────────────────────────────┤
    │  Si CONFIRMADA: stock descontado │
    │  Si RECHAZADA: sin cambios de stock (nunca se bloqueó)
```

### Flujo de oferta (reserva automática al aceptar)

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ Hace oferta con precio X ──────►│
    │  (estado: PENDIENTE)             │
    │                                 ├─ Acepta → crea Reserva CONFIRMADA al instante
    │                                 │   (origen=OFERTA, stock descontado ya)
    │                                 ├─ Rechaza → oferta cerrada
    │                                 ├─ Contraoferta con precio Y
    │◄─────────────────────────────────┤
    ├─ Acepta contraoferta             │
    │   └─ Reserva CONFIRMADA al instante
```

Estados de `Oferta`: `PENDIENTE` → `ACEPTADA` | `RECHAZADA` | `CONTRAOFERTA` | `CANCELADA`.
`CONTRAOFERTA` → `ACEPTADA` (comprador) | `CANCELADA` (comprador).

### Flujo de subasta (adjudicación automática al cierre)

```
VENDEDOR / SCHEDULER               SISTEMA
    │                                  │
    ├─ Cierra manualmente ────────────►│
    │  (o vence fechaLimiteSubasta,    │
    │   detectado por el job cada 60s) │
    │                                  ├─ Busca la puja líder
    │                                  ├─ Si hay líder:
    │                                  │   crea Reserva CONFIRMADA (origen=SUBASTA)
    │                                  │   descuenta stock → publicación VENDIDA
    │                                  ├─ Si no hubo pujas:
    │                                  │   publicación pasa a PAUSADA
    │                                  └─ estadoSubasta → CERRADA
```

No hay paso posterior de confirmación/rechazo por parte del vendedor: la adjudicación es
inmediata y definitiva en el mismo cierre.

---

## Frontend — arquitectura de estado y capas

```
routes/AppRouter → pages/ → components/ (cards, forms, layout, ui)
                       │
                       ├─ hooks/  (useFavoritos, useCountdown)
                       ├─ features/<dominio>/  (slice.js + thunks.js — Redux Toolkit)
                       └─ services/<dominio>Service.js  → services/api.js (Axios) → backend
```

- **`services/api.js`** — instancia única de Axios. Interceptor de request inyecta el JWT desde
  `localStorage` (clave `tc_auth`); interceptor de response desempaqueta `ApiResponseDTO.data` y
  normaliza los errores a una clase `ApiError { status, message, details }` (limpia la sesión
  automáticamente ante un 401).
- **`features/`** — un slice + thunks por dominio: `auth`, `publicaciones`, `favoritos`,
  `ofertas`, `reservas`, `subastas`, `carrito`. Cada `<dominio>Thunks.js` usa `createAsyncThunk`
  y llama al `services/<dominio>Service.js` correspondiente. `features/shared/asyncState.js`
  centraliza el shape común de estado async (`idle/loading/success/error`).
- **`store/store.js`** — `combineReducers` de los 7 slices + **redux-persist** (whitelist: todos
  menos `auth`, que se hidrata desde `localStorage` dentro del propio `authSlice`). Redux
  DevTools activo en desarrollo.
- **`hooks/`** — `useFavoritos()` (toggle de favorito con validación de rol y toast) y
  `useCountdown(fechaLimite)` (cuenta regresiva en vivo para subastas, actualiza cada segundo).
- **`utils/adapters.js`** — mapeos entre el shape de respuesta del backend y el shape que
  consumen los componentes.
- **`components/`** — `cards/` (`PublicacionCard`, `ReservaCard`, `OfertaCard`, `SubastaCard`),
  `forms/` (`OfertaModal`, `NegociarModal`), `layout/` (`Navbar`, `Footer`, `PageLayout`,
  `ProtectedRoute`), `ui/` (`Button`, `Input`, `Modal`, `ConfirmModal`, `Badge`, `Spinner`,
  `Marquee`, `ParallaxImage`, `ScrollReveal`, `StaggerReveal`).

---

## Páginas del frontend

| Página | Ruta | Guard (`ProtectedRoute`) | Descripción |
|---|---|---|---|
| Home | `/` | público | Landing / destacados |
| Catálogo | `/catalogo` | público | Grilla de publicaciones con filtros (soporta `?cat=`) |
| Detalle pieza | `/publicaciones/:id` | público | Historia, imágenes, especificaciones, panel de acción según modo |
| Login | `/login` | público | |
| Registro | `/register` | público | Selección de rol al registrarse |
| Lista de deseos | `/favoritos` | público* | Piezas guardadas (*sin wrapper de `ProtectedRoute` en el router actual) |
| Mis subastas | `/subastas` | `rol="COMPRADOR"` | Subastas en las que se participa, con resultado |
| Mis reservas | `/reservas` | autenticado (sin rol) | Historial y estado de reservas |
| Mis ofertas | `/ofertas` | autenticado (sin rol) | Ofertas enviadas y contraofertas recibidas |
| Panel vendedor | `/vendedor` | `rol="VENDEDOR"` | Mis publicaciones, reservas y ofertas pendientes |
| Historial de ventas | `/vendedor/historial` | `rol="VENDEDOR"` | Piezas vendidas y estadísticas |
| Nueva publicación | `/vendedor/nueva` | `rol="VENDEDOR"` | Formulario crear producto + publicación |
| Editar publicación | `/vendedor/:id/editar` | `rol="VENDEDOR"` | |
| Gestión de subasta | `/vendedor/:id/subasta` | `rol="VENDEDOR"` | Ver pujas, cerrar subasta manualmente |
| Perfil | `/perfil` | autenticado (sin rol) | |
| 404 | `*` | público | `NotFoundPage` |

`ProtectedRoute` (`components/layout/ProtectedRoute.jsx`) redirige a `/login` si no hay sesión
en el store de auth; si recibe la prop `rol` y no coincide con el del usuario, redirige a `/`.

---

## Flujo de confirmación transaccional

Toda acción que implique una modificación de estado (reserva, oferta, puja, confirmar/rechazar)
pasa por un modal de confirmación (`components/ui/ConfirmModal.jsx`) **antes** de ejecutarse.
El modal muestra el desglose de la transacción y requiere confirmación explícita del usuario.

```
Usuario pulsa acción
    │
    ├─ Se abre ConfirmModal con:
    │    • título e icono descriptivos
    │    • descripción del impacto de la acción
    │    • desglose: pieza, precio, tipo, vendedor
    │    • variante visual: success (verde/dorado) | danger (rojo)
    │
    ├─ Usuario cancela → modal se cierra, nada cambia
    │
    └─ Usuario confirma → se ejecuta la mutación y el modal se cierra
```

Puntos de integración actuales: `DetallePiezaPage` (Solicitar Reserva Directa, Registrar Puja),
`PanelVendedorPage` (Confirmar Reserva / Rechazar Reserva), `OfertaCard` (Aceptar / Rechazar
Contraoferta) y `NegociarModal` (flujo de contraoferta).
