# The Collector — Conocimiento Tecnico del Proyecto

> Este documento es material de **respaldo y justificacion tecnica**. No es para leer durante la exposicion — es para tenerlo a mano y responder preguntas que indaguen "por que se hizo asi", "que alternativas evaluaron" o "que harian distinto".
>
> Para la guia de la demo y el discurso de exposicion, ver [PRESENTACION.md](PRESENTACION.md).

---

## 1. Descripcion del proyecto

### Que hace la aplicacion

**The Collector** es un marketplace especializado en piezas de coleccion de alto valor: relojes de alta gama, joyeria, arte y numismatica. A diferencia de un e-commerce convencional, el sistema soporta **tres modalidades de transaccion distintas**, cada una con su propia logica de negocio:

1. **Precio fijo con reserva directa**: el comprador solicita reservar la pieza al precio publicado; el vendedor confirma o rechaza.
2. **Oferta privada con negociacion**: el comprador propone un precio menor al publicado; el vendedor puede aceptar, rechazar o contraofertar; el comprador puede aceptar la contraoferta o cancelar. Si se acepta en cualquier punto, se crea una reserva automaticamente.
3. **Subasta en vivo**: los compradores pujan con montos incrementales; al cerrar la subasta, el ganador obtiene una reserva.

El sistema tiene dos roles principales: **COMPRADOR** y **VENDEDOR**, cada uno con su propio conjunto de vistas, operaciones permitidas y restricciones de acceso.

### Stack tecnologico y justificacion

| Capa | Tecnologia | Justificacion |
|---|---|---|
| **Backend** | Java 17 + Spring Boot 4 | Ecosistema maduro para APIs REST empresariales. Spring Security provee JWT stateless nativo. Spring Data JPA simplifica el acceso a datos sin SQL manual. |
| **Base de datos** | PostgreSQL | Base relacional robusta, ideal para un dominio con muchas relaciones (publicaciones → productos, ofertas → reservas). `ddl-auto=update` permite iterar rapido en desarrollo. |
| **Frontend** | React 18 + Vite | React por su modelo de componentes y ecosistema; Vite por el HMR instantaneo vs. CRA/Webpack. |
| **Estilos** | Tailwind CSS 4 | Elimina archivos CSS auxiliares, toda la estilizacion vive en el componente. Consistente con la regla del proyecto de "Tailwind unicamente". |
| **Animaciones** | Framer Motion | Animaciones declarativas para drawer, modales y transiciones. Se usa junto con `IntersectionObserver` nativo para scroll-reveal. |
| **Estado** | `useState` en `App.jsx` (prop drilling) | Decision pragmatica: Redux Toolkit esta instalado pero no se usa activamente. El estado se levanta al componente raiz y se pasa por props. Ver seccion 5 para la discusion completa. |
| **Notificaciones** | Sonner | Toasts elegantes con tema dark, posicion bottom-right. Se usa en el panel del vendedor para confirmar acciones. |
| **Build** | Maven (backend), Vite (frontend) | Herramientas estandar de cada ecosistema. |

### Arquitectura general

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)               │
│                                                                 │
│  pages/              components/           data/                │
│  ├─ HomePage          ├─ layout/            └─ mockData.js      │
│  ├─ CatalogoPage      │   ├─ Navbar                            │
│  ├─ DetallePiezaPage  │   ├─ PageLayout     routes/             │
│  ├─ LoginPage         │   └─ Footer         └─ AppRouter.jsx    │
│  ├─ PanelVendedorPage ├─ cards/                                 │
│  ├─ OfertasPage       │   ├─ PublicacionCard                    │
│  ├─ ReservasPage      │   ├─ OfertaCard                         │
│  └─ (10 mas)          │   └─ ReservaCard                        │
│                       ├─ forms/                                 │
│                       │   ├─ OfertaModal                        │
│                       │   └─ NegociarModal                      │
│                       └─ ui/                                    │
│                           ├─ Button, Input, Badge               │
│                           ├─ Modal, ConfirmModal                │
│                           └─ ScrollReveal, Marquee, etc.        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ fetch (JWT en header Authorization)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot 4 + Java 17)           │
│                                                                 │
│  controller/         service/              repository/          │
│  ├─ AuthController    ├─ AuthService        ├─ UsuarioRepo      │
│  ├─ PublicacionCtrl   ├─ PublicacionService  ├─ PublicacionRepo  │
│  ├─ CarritoCtrl       ├─ CarritoService      ├─ CarritoItemRepo  │
│  ├─ FavoritoCtrl      ├─ FavoritoService     ├─ FavoritoRepo     │
│  ├─ OfertaCtrl        ├─ OfertaService       ├─ OfertaRepo       │
│  └─ ReservaCtrl       ├─ ReservaService      ├─ ReservaRepo      │
│                       └─ JwtService          └─ PujaRepo         │
│                                                                 │
│  config/             dto/                  model/               │
│  ├─ WebSecurityConfig ├─ ApiResponseDTO     ├─ Usuario           │
│  ├─ JwtAuthFilter     ├─ publicacion/       ├─ Publicacion       │
│  ├─ ApplicationConfig ├─ oferta/            ├─ Producto          │
│  ├─ JsonAuthEntry...  ├─ reserva/           ├─ Oferta, Reserva   │
│  └─ JsonAccessDenied  ├─ carrito/           ├─ CarritoItem       │
│                       └─ usuario/           ├─ Favorito, Puja    │
│                                             └─ Enums (7)         │
│                                                                 │
│  exception/                                                     │
│  ├─ GlobalExceptionHandler (@ControllerAdvice)                  │
│  └─ ResourceNotFoundException                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Spring Data JPA
                            ▼
                     ┌──────────────┐
                     │  PostgreSQL  │
                     │ thecollectordb│
                     └──────────────┘
```

---

## 2. Decisiones tecnicas clave

### 2.1. Arquitectura de tres capas estrictas en el backend

**Que se decidio**: separacion rigida `controller → service → repository`. Los controllers no tienen logica de negocio; los services no conocen HTTP; los repositories solo definen queries.

**Por que tiene sentido**: cada capa tiene una unica responsabilidad. Cuando un docente pregunta "donde vive la validacion de que no podes ofertar sobre tu propia publicacion", la respuesta siempre es "en el service" (`OfertaService.java:58-59`). Esto facilita testear la logica sin levantar el servidor web.

**Alternativa descartada**: poner logica en los controllers (patron "fat controller"). Es mas rapido de escribir pero mezcla responsabilidades y hace imposible reusar logica entre endpoints.

### 2.2. JWT stateless para autenticacion

**Que se decidio**: autenticacion basada en JWT sin sesion en el servidor. El token viaja en `Authorization: Bearer <token>`. La sesion es completamente stateless.

**Implementacion**: `JwtAuthenticationFilter` (extiende `OncePerRequestFilter`) intercepta cada request, extrae el token del header, valida firma y expiracion via `JwtService`, y carga el `SecurityContext`. La firma usa HMAC-SHA256 con una clave secreta configurable por variable de entorno.

**Por que tiene sentido**: en una arquitectura desacoplada (frontend separado del backend), no hay cookies de sesion. JWT permite que el frontend almacene el token en `localStorage` y lo envie en cada request. Ademas, es escalable horizontalmente — cualquier instancia del backend puede validar el token sin consultar una base de sesiones.

**Alternativa descartada**: sesiones con cookies (Spring Session + Redis). Agrega una dependencia de infraestructura (Redis) y acopla el frontend al backend via cookies, lo cual complica el CORS y el despliegue en dominios separados.

### 2.3. Soft delete en Publicacion y Producto

**Que se decidio**: en vez de borrar registros de la base de datos, se marca `activo = false`. La anotacion `@SQLRestriction("activo = true")` en las entidades `Publicacion` y `Producto` filtra automaticamente los registros "eliminados" en todas las queries JPA.

**Por que tiene sentido**: un marketplace nunca deberia perder historial de transacciones. Si se borra una publicacion que tenia reservas u ofertas asociadas, se romperian las foreign keys. Con soft delete, las reservas historicas siguen apuntando a la publicacion original.

**Alternativa descartada**: borrado fisico (`DELETE FROM`). Rompe integridad referencial y pierde trazabilidad.

### 2.4. Estado global centralizado en App.jsx (sin Redux activo)

**Que se decidio**: todo el estado reactivo del frontend (usuario actual, favoritos, reservas, ofertas, pujas) vive en `App.jsx` como `useState`. Se pasa a los componentes hijos via props a traves de `AppRouter`.

**Por que tiene sentido**: para un prototipo con datos mock (sin llamadas async reales), este patron es simple y predecible. No hay race conditions ni middleware innecesario. Cada handler (`handleAddReserva`, `handleResponderOferta`, etc.) muta el mock y luego sincroniza el estado de React con `setReservas([...getReservas()])`.

**Alternativa existente (instalada pero no usada)**: Redux Toolkit. Esta en `package.json` (`@reduxjs/toolkit`, `react-redux`) pero no hay ningun slice, store ni provider configurado. La razon es que con datos mock sincronicos, Redux agrega complejidad sin beneficio. Si se integrara el backend real con llamadas async, Redux con `createAsyncThunk` seria la eleccion logica para manejar loading/success/error de forma centralizada.

### 2.5. Proteccion de rutas: doble capa (frontend + backend)

**Que se decidio**: las rutas del frontend se protegen con guardas en `AppRouter.jsx` (redirect a `/login` si no hay usuario, o si el rol no coincide). En el backend, `WebSecurityConfig` define que endpoints son publicos y cuales requieren autenticacion, y los services verifican ownership del recurso.

**Frontend** (`AppRouter.jsx`):
```jsx
// Ruta protegida para vendedor
currentUser && currentUser.rol === 'VENDEDOR'
  ? <PanelVendedorPage ... />
  : <Navigate to="/login" replace />
```

**Backend** (`WebSecurityConfig.java`):
```java
.requestMatchers("/api/auth/**").permitAll()
.requestMatchers(HttpMethod.GET, "/api/publicaciones/**").permitAll()
.anyRequest().authenticated()
```

**Backend (verificacion de ownership en services)**: `OfertaService.verificarVendedor()` compara el email del token JWT con el email del vendedor de la publicacion.

**Por que tiene sentido**: la proteccion del frontend es UX (no mostrar pantallas a las que el usuario no tiene acceso). La proteccion del backend es seguridad real (aunque alguien haga un request directo con curl, el backend lo rechaza). Son complementarias, no redundantes.

### 2.6. DTOs como contrato de la API

**Que se decidio**: las entidades JPA (`@Entity`) nunca se exponen en la API. Cada recurso tiene `RequestDTO` (para recibir datos del cliente) y `ResponseDTO` (para enviar datos al cliente). Todo se envuelve en un `ApiResponseDTO<T>` generico con `status`, `message`, `data` y `timestamp`.

**Ejemplo de ApiResponseDTO**:
```json
{
  "status": 200,
  "message": "Oferta creada exitosamente",
  "data": { "id": 1, "compradorNombre": "Joaquin", ... },
  "timestamp": "2026-06-12T10:30:00"
}
```

**Por que tiene sentido**: desacopla el modelo interno de la API publica. Si se agrega un campo a la entidad (por ejemplo, un campo interno de auditoria), no se expone accidentalmente al cliente. Ademas, la validacion con `@Valid` se aplica sobre los DTOs, no sobre las entidades.

### 2.7. Catalogo con scroll snap inmersivo

**Que se decidio**: en `CatalogoPage.jsx`, en vez de un grid tradicional de tarjetas, cada pieza ocupa el 100% del viewport y se navega con scroll snap vertical. Se usa `IntersectionObserver` para detectar la pieza activa y actualizar los dots de navegacion.

**Por que tiene sentido**: refuerza la estetica editorial de lujo del marketplace. Cada pieza tiene espacio completo para imagen, descripcion, especificaciones y precio. Es una decision de UX que diferencia el producto de un listado generico.

**Alternativa descartada**: grid de tarjetas con paginacion (mas estandar, pero pierde la experiencia inmersiva que busca el proyecto).

### 2.8. Modales de confirmacion transaccional

**Que se decidio**: toda accion economica (reservar, pujar, aceptar oferta, rechazar) pasa por un `ConfirmModal` que muestra los detalles de la operacion antes de ejecutarla. El estado del modal se gestiona con un objeto en `useState` que incluye titulo, descripcion, detalles, variante y callback `onConfirm`.

**Implementacion** (`DetallePiezaPage.jsx:81-107`):
```jsx
setConfirmModal({
  isOpen: true,
  title: 'Confirmar Solicitud de Reserva',
  details: [
    { label: 'PIEZA', value: pub.nombre },
    { label: 'VALOR DE ADQUISICION', value: formatCurrency(pub.precio) },
  ],
  onConfirm: () => {
    onAddReserva(pub.id, pub.precio, pub.vendedor);
    closeConfirmModal();
    navigate('/reservas');
  },
});
```

**Por que tiene sentido**: en un sistema de transacciones de alto valor, un click accidental puede ser costoso. El modal actua como "segundo factor de intencion" — el usuario ve exactamente que va a pasar antes de confirmar.

---

## 3. Flujo de datos completo

### 3.1. Flujo: Oferta privada con negociacion (end-to-end)

Este es el flujo mas complejo del sistema porque involucra multiples pasos, dos actores y transiciones de estado.

#### Paso 1: Comprador envia oferta

1. **Trigger**: el comprador esta en `DetallePiezaPage`, hace click en "HACER OFERTA PRIVADA".
2. **Componente**: se abre `OfertaModal` (componente en `components/forms/OfertaModal.jsx`).
3. **Validacion frontend**: el modal valida que el monto ingresado sea menor al precio publicado.
4. **Handler**: al confirmar, se llama a `handleOfertaSubmit(monto)` en `DetallePiezaPage`, que invoca `onAddOferta(pub.id, pub.precio, monto, pub.vendedor)`.
5. **Propagacion**: `onAddOferta` es una prop que viene de `App.jsx`. En `App.jsx`, `handleAddOferta()` llama a `addOferta()` de `mockData.js`, que crea el objeto de oferta con estado `EN_REVISION` y lo agrega al array `ofertas`.
6. **Sincronizacion de estado**: `setOfertas([...getOfertas()])` fuerza un re-render. React propaga el nuevo estado a todos los componentes que reciben `ofertas` como prop.
7. **Navegacion**: el usuario es redirigido a `/ofertas` para ver su oferta enviada.

**En el backend real** (ya implementado en `OfertaService.hacerOferta()`):
- Valida publicacion activa, modo precio fijo, no es el vendedor, precio < publicado, no hay oferta activa previa.
- Crea la entidad `Oferta` con estado `PENDIENTE`.
- Retorna `OfertaResponseDTO` envuelto en `ApiResponseDTO`.

#### Paso 2: Vendedor responde con contraoferta

1. **Trigger**: el vendedor entra a `PanelVendedorPage`, ve la oferta en la seccion "PROPUESTAS DE OFERTA PRIVADA" y hace click en "REVISAR".
2. **Componente**: se abre `NegociarModal` que muestra el precio original, la oferta del comprador y tres botones: RECHAZAR, CONTRAOFERTAR, ACEPTAR.
3. **Accion**: el vendedor elige CONTRAOFERTAR, ingresa un monto (por ejemplo, $75,000 sobre una pieza de $78,000 donde la oferta fue $72,000).
4. **Handler**: `handleNegociarConfirm({ accion: 'CONTRAOFERTA', montoContraoferta: 75000 })` llama a `onResponderOferta(id, 'CONTRAOFERTA', 75000)`.
5. **Propagacion**: en `App.jsx`, `handleResponderOferta()` llama a `responderOferta()` de `mockData.js`, que muta el estado de la oferta a `CONTRAOFERTA_RECIBIDA` y setea `precioContraoferta`.
6. **Toast**: `toast.success('Contraoferta enviada')` informa al vendedor.

**En el backend real** (`OfertaService.contraofertar()`):
- Verifica que el usuario autenticado es el vendedor de la publicacion.
- Verifica que la oferta esta en estado `PENDIENTE`.
- Setea `precioContraoferta` y cambia estado a `CONTRAOFERTA`.

#### Paso 3: Comprador acepta la contraoferta

1. **Trigger**: el comprador entra a `OfertasPage`, ve su oferta con estado `CONTRAOFERTA_RECIBIDA` y el monto de la contraoferta.
2. **Accion**: hace click en "ACEPTAR CONTRAOFERTA".
3. **Resultado**: la oferta cambia a `ACEPTADA` y se crea automaticamente una `Reserva` con `precioAcordado = precioContraoferta` y origen `OFERTA`.

**En el backend real** (`OfertaService.aceptarContraoferta()`):
- Cambia estado de la oferta a `ACEPTADA`.
- Crea una nueva `Reserva` con `OrigenReserva.OFERTA` y `precioAcordado = precioContraoferta`.
- La reserva se vincula a la oferta original via `reserva.setOferta(oferta)`.

#### Diagrama de estados de una Oferta

```
PENDIENTE ──┬── ACEPTADA ──────→ Se crea Reserva (origen: OFERTA)
            ├── RECHAZADA
            ├── CANCELADA (por el comprador)
            └── CONTRAOFERTA ──┬── ACEPTADA → Se crea Reserva (precio = contraoferta)
                               ├── CANCELADA (por el comprador)
                               └── (no hay rechazo de contraoferta en el modelo actual)
```

---

### 3.2. Flujo: Reserva directa con confirmacion del vendedor

Este flujo es mas lineal pero igualmente involucra dos actores y transiciones de estado.

#### Paso 1: Comprador solicita reserva

1. **Trigger**: el comprador esta en `DetallePiezaPage` de una pieza con modo `PRECIO_FIJO`, hace click en "SOLICITAR RESERVA DIRECTA".
2. **Componente**: se abre `ConfirmModal` con los detalles: pieza, vendedor, precio, tipo de operacion.
3. **Handler**: al confirmar, se llama `onAddReserva(pub.id, pub.precio, pub.vendedor)` → `App.jsx:handleAddReserva()` → `mockData.addReserva()`.
4. **Resultado**: se crea una reserva con estado `PENDIENTE` y se redirige a `/reservas`.

**En el backend real** (`ReservaService.crearReserva()`):
- Valida: publicacion activa, stock > 0, no es el vendedor, no es subasta, no hay reserva pendiente duplicada.
- Crea `Reserva` con `OrigenReserva.DIRECTA` y `precioAcordado = precio del producto`.

#### Paso 2: Vendedor confirma la reserva

1. **Trigger**: el vendedor ve la solicitud en `PanelVendedorPage`, seccion "SOLICITUDES DE RESERVA DIRECTA".
2. **Accion**: hace click en el boton de check (confirmar).
3. **Componente**: se abre `ConfirmModal` con variante `success`.
4. **Handler**: `handleConfirmarReserva()` remueve la reserva de la lista local.

**En el backend real** (`ReservaService.confirmarReserva()`):
- Verifica que el vendedor es el dueno de la publicacion.
- Decrementa `producto.stock` en 1.
- Si `stock == 0`, cambia el estado de la publicacion a `VENDIDA`.
- Cambia el estado de la reserva a `CONFIRMADA` y registra `fechaRespuesta`.

#### Diagrama de estados de una Reserva

```
PENDIENTE ──┬── CONFIRMADA (vendedor confirma → stock--, si stock=0 → publicacion VENDIDA)
            ├── RECHAZADA (vendedor rechaza)
            └── CANCELADA (comprador cancela)
```

---

## 4. Componentes y su responsabilidad

### 4.1. Componentes de pagina (pages/)

| Componente | Responsabilidad | Estado que maneja | Props que recibe |
|---|---|---|---|
| `HomePage` | Landing page editorial con hero, manifesto, categorias, newsletter | `email` (local, para newsletter) | Ninguna |
| `CatalogoPage` | Catalogo inmersivo con scroll snap, filtros por categoria/modo/busqueda | `publicacionesList`, `categoriaFiltro`, `busqueda`, `modoFiltro`, `activePieza`, `showSearch` (todos locales) | `favoritos`, `onToggleFavorito` |
| `DetallePiezaPage` | Detalle completo de una pieza con galeria, panel de transaccion, modal de oferta, modal de confirmacion | `pub`, `imagenActiva`, `ofertaModalOpen`, `confirmModal`, `pujaMonto`, `pujaError` (todos locales) | `currentUser`, `favoritos`, `onToggleFavorito`, `onAddReserva`, `onAddOferta`, `pujas`, `onAddPuja` |
| `LoginPage` | Formulario de login con seleccion de rol rapida | `email`, `password` (local) | `onLogin`, `currentUser` |
| `RegisterPage` | Registro de usuario con seleccion de rol | `nombre`, `email`, `password`, `rol` (local) | `onLogin`, `currentUser` |
| `FavoritosPage` | Lista de piezas guardadas como favoritos | `piezas` (local, derivado del mock) | `favoritos`, `onToggleFavorito` |
| `ReservasPage` | Reservas del comprador agrupadas por estado | Ninguno propio | `reservas` |
| `OfertasPage` | Ofertas del comprador con tabs por estado | `tab` (local) | `ofertas`, `onUpdateOfertaEstado` |
| `PanelVendedorPage` | Hub operativo del vendedor: reservas pendientes, ofertas, tabla de publicaciones | `misPublicaciones`, `solicitudesReserva`, `ofertasRecibidas`, `negociarModal`, `confirmModal` (todos locales) | `onResponderOferta` |
| `NuevaPublicacionPage` | Formulario de 2 pasos para crear publicacion (detalles → modo/precio) | `step`, `formData`, campos del formulario (local) | Ninguna |
| `EditarPublicacionPage` | Edicion de publicacion con tabs (detalles / modo-precio) | `pub`, `activeTab`, campos editables (local) | Ninguna |
| `HistorialVentasPage` | Tabla de ventas completadas con estadisticas | `ventas`, `filtro`, `stats` (local) | Ninguna |
| `GestionSubastaPage` | Sala de subasta en vivo con log de pujas y simulador | `pujas`, `simuladorActivo` (local) | Ninguna |
| `PerfilPage` | Configuracion de perfil (nombre, password) | `nombre`, `password` (local) | `currentUser`, `onLogin` |

### 4.2. Componentes de layout

| Componente | Responsabilidad | Props |
|---|---|---|
| `PageLayout` | Wrapper que compone `Navbar` + contenido + `Footer`. Inyecta el layout consistente. | `currentUser`, `onLogout`, `favoritosCount`, `children` |
| `Navbar` | Barra fija superior con hamburger, logo centrado, avatar/login. Drawer lateral animado con categorias, secciones por rol y logout. | `currentUser`, `onLogout`, `favoritosCount` |
| `Footer` | Pie de pagina con 4 columnas: marca, explorar, transparencia, newsletter. | Ninguna |

### 4.3. Componentes de tarjeta (cards/)

| Componente | Responsabilidad | Props |
|---|---|---|
| `PublicacionCard` | Tarjeta de pieza en grid: imagen con overlay de favorito, precio, badge de modo (subasta/fijo), link al detalle. | `pieza`, `isFavorito`, `onToggleFavorito` |
| `OfertaCard` | Tarjeta horizontal de oferta: imagen, precios (original/ofertado/contraoferta), badge de estado, botones de accion contextuales, ConfirmModal interno. | `oferta`, `onUpdateEstado` |
| `ReservaCard` | Tarjeta horizontal de reserva: imagen, fecha, vendedor, precio acordado, link al detalle, boton de "descargar titulo" si confirmada. | `reserva` |

### 4.4. Componentes de formulario (forms/)

| Componente | Responsabilidad | Props |
|---|---|---|
| `OfertaModal` | Modal para hacer oferta privada. Valida que el monto sea menor al precio. Pre-llena sugerencia (-5%). | `isOpen`, `onClose`, `publicacion`, `onConfirm` |
| `NegociarModal` | Modal del vendedor para responder ofertas. Muestra comparacion de precios y 3 acciones: rechazar, contraofertar (con input animado), aceptar. Calcula deltas en tiempo real. | `isOpen`, `onClose`, `oferta`, `pieza`, `onResponder` |

### 4.5. Componentes UI reutilizables (ui/)

| Componente | Responsabilidad |
|---|---|
| `Button` | Boton con variantes `primary`, `outline`, `danger`. Props: `fullWidth`, `disabled`, `type`. |
| `Input` | Campo de formulario con label, error, helper text, auto-ID. Soporta text/email/password/number/datetime-local. |
| `Modal` | Contenedor modal animado (Framer Motion scale/opacity). Cierra con backdrop click y bloquea scroll del body. |
| `ConfirmModal` | Modal de confirmacion transaccional con icono, titulo, descripcion, detalles como pares label-value, y botones variantes. Z-index 100 (maximo). |
| `Badge` | Indicador de estado con colores mapeados: ACTIVA (verde), PENDIENTE (amarillo), VENDIDA (gris), etc. |
| `Marquee` | Texto en scroll infinito horizontal con duplicacion de spans. Usado como decoracion en el hero del home. |
| `ParallaxImage` | Imagen con offset vertical basado en scroll (Framer Motion `useScroll` + `useTransform`). |
| `ScrollReveal` | Fade in + translate al entrar en viewport. Soporta 4 direcciones: up/down/left/right. Usa `IntersectionObserver`. |
| `StaggerReveal` | Revela hijos secuencialmente con delay entre cada uno al hacer scroll. |

---

## 5. Gestion del estado

### Estado local (useState)

Se usa para todo lo que es efimero o especifico de una pantalla:

- **Formularios**: campos de login, registro, nueva publicacion, edicion (`LoginPage`, `RegisterPage`, `NuevaPublicacionPage`).
- **Estado de UI**: tab activo, modal abierto/cerrado, imagen seleccionada en galeria, filtros de busqueda (`CatalogoPage`, `DetallePiezaPage`, `OfertasPage`).
- **Datos derivados del mock**: listas cargadas en `useEffect` desde `mockData.js` (`PanelVendedorPage`, `CatalogoPage`).

**Por que useState**: estos datos no necesitan ser compartidos entre paginas. Cuando el usuario navega a otra ruta, el estado se descarta naturalmente.

### Estado "global" (App.jsx como Single Source of Truth)

Los siguientes datos se manejan en `App.jsx` y se pasan como props:

| Estado | Tipo | Quien lo consume | Por que es "global" |
|---|---|---|---|
| `currentUser` | `Object \| null` | Navbar, AppRouter, todas las paginas protegidas | Determina que rutas se muestran y que acciones se habilitan |
| `favoritos` | `number[]` | CatalogoPage, DetallePiezaPage, FavoritosPage | Se muestra el corazon lleno/vacio en multiples vistas |
| `reservas` | `Object[]` | ReservasPage, PanelVendedorPage | Se actualiza desde DetallePiezaPage (nueva reserva) y PanelVendedorPage (confirmar/rechazar) |
| `ofertas` | `Object[]` | OfertasPage, PanelVendedorPage | Se actualiza desde DetallePiezaPage (nueva oferta) y PanelVendedorPage (responder) |
| `pujas` | `Object[]` | DetallePiezaPage, GestionSubastaPage | Se agregan desde la vista de detalle |

### Estructura del store (Redux — instalado pero no activo)

Redux Toolkit esta en `package.json` pero **no hay ninguna configuracion activa**: no hay `store.js`, no hay slices, no hay `<Provider>`. El `CLAUDE.md` del proyecto menciona `authSlice` y `carritoSlice` como la estructura deseada, pero en la implementacion actual el estado vive en `App.jsx`.

**Razon pragmatica**: el frontend usa datos mock sincronicos. `addReserva()` retorna inmediatamente el objeto creado, no hay estados intermedios de loading. Redux agrega boilerplate (slices, reducers, middleware) sin beneficio cuando no hay asincronismo real.

**Plan de migracion** (si se conectara al backend real):
1. Crear `store/index.js` con `configureStore`.
2. `authSlice`: `login` y `logout` como `createAsyncThunk`, token en Redux + `localStorage`.
3. `favoritosSlice`, `reservasSlice`, `ofertasSlice`: cada uno con sus thunks async y estados `loading/success/error`.
4. Envolver `<App>` en `<Provider store={store}>` en `main.jsx`.

---

## 6. Comunicacion con el backend

### Estrategia actual: datos mock

En la implementacion actual, **no hay llamadas HTTP al backend**. Todo el estado se simula con `mockData.js`, que exporta:

- **Arrays estáticos**: `mockPublicaciones`, `mockReservas`, `mockOfertas`, `mockPujas`, `mockVentas`.
- **Funciones mutadoras**: `addReserva()`, `addOferta()`, `responderOferta()`, `addPuja()`, `updatePublicacion()`.
- **Funciones de lectura**: `getPublicaciones()`, `getPublicacionById()`, `getFavoritos()`, `getReservas()`, `getOfertas()`.

Las funciones mutan arrays a nivel de modulo (closure), lo que simula persistencia durante la sesion del navegador. Al recargar la pagina, se pierden los cambios.

### Arquitectura preparada para integracion

El backend tiene **todos los endpoints implementados y funcionando**. La API sigue este patron consistente:

```
POST   /api/auth/register          → AuthResponseDTO (token + rol)
POST   /api/auth/login             → AuthResponseDTO

GET    /api/publicaciones          → Page<PublicacionResponseDTO> (paginado, filtros)
GET    /api/publicaciones/{id}     → PublicacionResponseDTO
POST   /api/publicaciones          → PublicacionResponseDTO (@PreAuthorize VENDEDOR)

POST   /api/ofertas                → OfertaResponseDTO
GET    /api/ofertas/comprador      → List<OfertaResponseDTO>
GET    /api/ofertas/vendedor       → List<OfertaResponseDTO>
PATCH  /api/ofertas/{id}/aceptar   → ReservaResponseDTO (crea reserva automaticamente)
PATCH  /api/ofertas/{id}/contraofertar → OfertaResponseDTO

POST   /api/reservas               → ReservaResponseDTO
PATCH  /api/reservas/{id}/confirmar → ReservaResponseDTO (decrementa stock)
```

Todas las respuestas vienen envueltas en `ApiResponseDTO<T>`:
```json
{
  "status": 200,
  "message": "Operacion exitosa",
  "data": { ... },
  "timestamp": "2026-06-12T10:00:00"
}
```

### Manejo de errores en el backend

El `GlobalExceptionHandler` (`@ControllerAdvice`) centraliza todas las excepciones:

| Excepcion | HTTP Status | Uso |
|---|---|---|
| `ResourceNotFoundException` | 404 | Entidad no encontrada por ID |
| `MethodArgumentNotValidException` | 422 | Falla de validacion en DTOs (`@Valid`) — incluye detalle por campo |
| `IllegalArgumentException` | 409 | Regla de negocio violada ("no puedes ofertar sobre tu propia publicacion") |
| `IllegalStateException` | 409 | Estado invalido ("la publicacion no esta activa") |
| `AccessDeniedException` | 403 | El usuario no tiene permiso sobre este recurso |
| `BadCredentialsException` | 401 | Credenciales incorrectas en login |
| `Exception` (generico) | 500 | Error inesperado |

### Manejo de estados de carga en el frontend

En la implementacion actual con datos mock, no hay estados de carga porque todas las operaciones son sincronicas. Sin embargo, los componentes UI estan preparados:

- `Button` tiene prop `disabled` para bloquear durante carga.
- Los modales se cierran al confirmar, lo que previene doble-submit.
- El `CLAUDE.md` establece como regla: "Todo request async debe manejar los tres estados en la UI: loading, success, error."

---

## 7. Posibles preguntas del docente — con respuestas

### Pregunta 1: "¿Por que el frontend no esta conectado al backend si ya tienen los endpoints?"

**Respuesta**: Fue una decision de alcance y tiempo. Priorizamos implementar el dominio de negocio completo en ambas capas por separado antes de integrarlas. El backend tiene todos los endpoints con validaciones de negocio, y el frontend tiene todos los flujos de usuario con UX completa (modales, confirmaciones, navegacion). La integracion es mecanica — reemplazar las llamadas a `mockData.js` por `fetch()` al backend. Esto fue una decision deliberada: es mejor tener dos capas completas que una integracion a medias con flujos incompletos.

### Pregunta 2: "¿Por que no usan Redux si lo tienen instalado?"

**Respuesta**: Redux Toolkit esta instalado porque era parte del plan original de arquitectura. En la practica, el frontend usa datos mock sincronicos, donde Redux agrega complejidad sin beneficio (no hay estados de loading, no hay side effects, no hay cache). El estado vive en `App.jsx` como prop drilling. Si integraramos el backend real, migrariamos a Redux con `createAsyncThunk` para cada slice (auth, ofertas, reservas), porque ahi si necesitamos manejar loading/error/success de forma centralizada.

### Pregunta 3: "¿Como funciona la seguridad JWT? ¿Que pasa si el token expira?"

**Respuesta**: El flujo es: (1) login envia email+password → backend valida → genera JWT con claims `{email, rol}` firmado con HMAC-SHA256 → retorna token. (2) El frontend guarda el token en `localStorage`. (3) Cada request HTTP incluye `Authorization: Bearer <token>`. (4) `JwtAuthenticationFilter` intercepta, extrae el token, valida firma y expiracion con `JwtService.isTokenValid()`, y carga el `SecurityContext`. Si el token expiro, el filtro no setea autenticacion → Spring Security retorna 401 via `JsonAuthenticationEntryPoint` con JSON `{"error": "No autenticado o token invalido"}`. No hay refresh token — el usuario debe re-loguearse. Es una simplificacion aceptable para el alcance del proyecto.

### Pregunta 4: "¿Por que `OfertaService.hacerOferta()` tiene tantas validaciones?"

**Respuesta** (referencia: `OfertaService.java:46-68`): Son 6 validaciones de negocio, cada una previene un caso de uso invalido real:
1. Publicacion activa → no ofertar sobre algo vendido o pausado.
2. Modo precio fijo → las subastas tienen otro mecanismo (pujas).
3. No es el vendedor → no podes ofertar sobre tu propia publicacion.
4. Precio menor al publicado → una oferta al precio publicado o mayor no tiene sentido, para eso esta la reserva directa.
5. No hay oferta activa previa → previene spam de ofertas del mismo comprador.

Estas validaciones viven en el service, no en el controller, porque son reglas de negocio — no dependen del protocolo HTTP.

### Pregunta 5: "¿Que patron usan para las animaciones del frontend?"

**Respuesta**: Usamos dos estrategias complementarias. Para animaciones complejas (drawer del navbar, modales, transiciones de pagina) usamos **Framer Motion** porque permite animar mount/unmount con `AnimatePresence` y definir variantes de animacion de forma declarativa. Para animaciones basadas en scroll (reveal de elementos, parallax) usamos **IntersectionObserver nativo** encapsulado en componentes reutilizables (`ScrollReveal`, `StaggerReveal`). El `Marquee` del home es CSS puro con `@keyframes`. Esta separacion evita depender de Framer Motion para cosas que el browser ya resuelve nativamente.

### Pregunta 6: "¿Como manejan la eliminacion de publicaciones? ¿Que pasa con las reservas asociadas?"

**Respuesta**: Usamos **soft delete** — `Publicacion` y `Producto` tienen un campo `activo` (boolean). Cuando se "elimina" una publicacion, se setea `activo = false`. La anotacion `@SQLRestriction("activo = true")` hace que JPA filtre automaticamente los registros inactivos en todas las queries. En `PublicacionService.eliminarPublicacion()`, antes de marcar como inactiva, se verifica que no haya reservas pendientes — si las hay, se lanza una excepcion. Las reservas y ofertas historicas (ya confirmadas/rechazadas) siguen apuntando a la publicacion desactivada, preservando la trazabilidad.

### Pregunta 7: "¿Por que no usan un componente `ProtectedRoute` reutilizable en el router?"

**Respuesta**: Es una decision pragmatica. El `AppRouter.jsx` implementa la proteccion inline con ternarios:
```jsx
currentUser && currentUser.rol === 'VENDEDOR'
  ? <PanelVendedorPage />
  : <Navigate to="/login" replace />
```
Un componente `ProtectedRoute` reutilizable seria mas elegante y evitaria la repeticion, pero con solo 6 rutas protegidas, la ganancia es minima. El `CLAUDE.md` menciona `ProtectedRoute` como parte de la arquitectura ideal; es una mejora identificada.

### Pregunta 8: "¿Como garantizan que un comprador no pueda acceder a endpoints de vendedor directamente?"

**Respuesta**: Hay tres capas de proteccion:
1. **Frontend (UX)**: el router redirige a `/login` si el rol no coincide.
2. **Backend (autenticacion)**: `WebSecurityConfig` exige token valido para todos los endpoints no publicos.
3. **Backend (autorizacion a nivel de recurso)**: cada service verifica ownership. Por ejemplo, `OfertaService.verificarVendedor()` compara el email del JWT con el vendedor de la publicacion. Si no coincide, lanza `AccessDeniedException` → HTTP 403. Incluso si alguien forja una request con curl, el backend la rechaza. Ademas, el controller de publicaciones usa `@PreAuthorize("hasAuthority('VENDEDOR')")` para el POST de crear publicacion.

### Pregunta 9: "¿Como funciona la subasta? ¿Tiene temporizador real?"

**Respuesta**: El modelo de subasta tiene los campos `fechaLimiteSubasta` y `estadoSubasta` (ABIERTA/CERRADA) en la entidad `Publicacion`, y las pujas se registran en la entidad `Puja` con `monto` y `fechaPuja`. En el backend, `PujaRepository` tiene queries para obtener la puja lider y la ultima puja. Sin embargo, **no hay un scheduler automatico** que cierre la subasta al llegar a `fechaLimiteSubasta` — eso requeriria un `@Scheduled` o un sistema de cron jobs que no se implemento. En el frontend, el temporizador de `DetallePiezaPage` esta hardcodeado como `"0d 12h 30m"` — no es un countdown real. La `GestionSubastaPage` tiene un simulador de pujas para la demo. Es un [REVISAR CON EL EQUIPO] — el cierre automatico de subastas es funcionalidad pendiente.

### Pregunta 10: "¿Por que usan `Intl.NumberFormat` en vez de una libreria de formateo?"

**Respuesta**: `Intl.NumberFormat` es API nativa del browser — no agrega dependencias, soporta localizacion (usamos `'es-AR'` con moneda `'USD'`), y el resultado es consistente: `US$ 32.500`. Es la herramienta correcta para este caso. Una libreria como `numeral.js` o `currency.js` agregaria peso al bundle sin beneficio adicional. La unica desventaja es que el helper `formatCurrency()` esta duplicado en varios componentes en vez de estar en un `utils/format.js` centralizado — es una mejora menor identificada.

---

## 8. Puntos debiles y como defenderlos

### 8.1. Frontend y backend no estan integrados

**Problema**: el frontend usa datos mock en `mockData.js`. No hay una sola llamada `fetch()` al backend. Son dos aplicaciones que funcionan de forma independiente.

**Por que se hizo asi**: priorizamos completitud funcional sobre integracion. Era preferible tener un backend con todos los endpoints validados y un frontend con todos los flujos de UX completos, que una integracion parcial donde algunos flujos funcionan y otros no. Ademas, la integracion es mecanica (reemplazar `mockData.addOferta()` por `fetch('/api/ofertas', { method: 'POST', ... })`), no requiere reescribir logica.

**Mejora con mas tiempo**: crear una capa `services/` en el frontend con `api.js` (interceptor que inyecta JWT) y un service por recurso (`ofertaService.js`, `reservaService.js`). Reemplazar los imports de `mockData` por llamadas al backend.

### 8.2. Prop drilling excesivo

**Problema**: `App.jsx` pasa 12 props a `AppRouter`, que a su vez las distribuye a 15 rutas. Agregar un nuevo dato compartido requiere modificar App → AppRouter → cada pagina que lo necesite.

**Por que se hizo asi**: con datos mock sincronicos, el prop drilling funciona sin problemas de rendimiento. Es el patron mas simple y explicito — no hay "magia" de contexto o store global que dificulte rastrear de donde viene un dato.

**Mejora con mas tiempo**: migrar a Redux Toolkit (ya instalado) o React Context API. Redux es la eleccion correcta si hay estado async complejo; Context es suficiente si solo se quiere evitar el prop drilling sin agregar middleware.

### 8.3. No hay tests

**Problema**: no hay un solo test unitario ni de integracion en el frontend. El backend tiene un unico `BackendApplicationTests.java` que es el test placeholder de Spring Boot.

**Por que se hizo asi**: el alcance del proyecto priorizaba funcionalidad sobre cobertura de tests. En un contexto academico con tiempo limitado, el costo-beneficio de escribir tests vs. implementar features se inclino hacia features.

**Mejora con mas tiempo**: backend → tests unitarios de services con Mockito (mockear repositorios) + tests de integracion con `@SpringBootTest` + H2 in-memory. Frontend → tests de componentes con React Testing Library + tests de hooks. Las validaciones de negocio de los services son candidatos ideales para testing porque tienen inputs y outputs claros.

### 8.4. Formateo de moneda duplicado

**Problema**: la funcion `formatCurrency()` esta copiada y pegada en `DetallePiezaPage`, `PanelVendedorPage`, `HistorialVentasPage`, `CatalogoPage` y otros componentes. No hay un `utils/format.js` centralizado.

**Por que se hizo asi**: se fue agregando organicamente en cada componente que lo necesitaba. No se refactorizo porque no causa bugs — el comportamiento es identico en todos los casos.

**Mejora con mas tiempo**: extraer a `utils/formatCurrency.js` e importar desde ahi. Es un refactor de 5 minutos.

### 8.5. Temporizador de subasta no es real

**Problema**: el tiempo restante de la subasta en `DetallePiezaPage` esta hardcodeado como `"0d 12h 30m"`. No hay un `setInterval` que decremente el tiempo real basado en `fechaLimiteSubasta`. Tampoco hay un scheduler en el backend que cierre la subasta automaticamente.

**Por que se hizo asi**: implementar un countdown real en el frontend es sencillo, pero el cierre automatico en el backend requiere un `@Scheduled` o un sistema de jobs (Quartz, Spring Scheduler) que agrega complejidad de infraestructura. Se priorizo el flujo feliz de la subasta (pujar, ver pujas) sobre la mecanica temporal.

**Mejora con mas tiempo**: frontend → componente `Countdown` con `useEffect` + `setInterval` que calcula la diferencia entre `Date.now()` y `fechaLimiteSubasta`. Backend → `@Scheduled(fixedRate = 60000)` que revisa publicaciones con subasta abierta cuya `fechaLimiteSubasta` ya paso y las cierra, creando la reserva del ganador automaticamente.

### 8.6. No hay validacion de formularios con libreria

**Problema**: la validacion de formularios se hace manualmente con condicionales en `handleSubmit`. No hay schema validation (Zod, Yup) ni form management (React Hook Form).

**Por que se hizo asi**: los formularios del proyecto son relativamente simples (login: 2 campos, registro: 4 campos, oferta: 1 campo). La validacion manual con `if (!email || !password)` es legible y suficiente para este alcance.

**Mejora con mas tiempo**: React Hook Form + Zod para formularios mas complejos como `NuevaPublicacionPage` (que tiene 2 pasos con multiples campos). Mejoraria la experiencia del desarrollador y agregaria type safety a las validaciones.

### 8.7. Imagenes estaticas de placeholder

**Problema**: las imagenes de los productos apuntan a rutas locales (`/images/watch-movement-calibre.jpg`) y los avatares a URLs de Unsplash. No hay un servicio de almacenamiento de imagenes ni upload de archivos.

**Por que se hizo asi**: el foco del proyecto es la logica de negocio (transacciones, negociacion, subastas), no la gestion de archivos multimedia.

**Mejora con mas tiempo**: integracion con un servicio de almacenamiento (S3, Cloudinary) + endpoint de upload en el backend + componente de upload con preview en el frontend.

### 8.8. CORS no configurado

**Problema**: el backend no tiene configuracion de CORS. Si se intentara conectar el frontend (puerto 5173) con el backend (puerto 8080), el browser bloquearia las requests por politica de same-origin.

**Por que se hizo asi**: como el frontend usa datos mock sin llamadas HTTP, CORS nunca fue necesario.

**Mejora**: agregar `@CrossOrigin` en los controllers o una configuracion global con `WebMvcConfigurer.addCorsMappings()` para permitir el origen del frontend.
