# AGENTS.md — The Collector

## Project overview

Marketplace de coleccionables premium donde cualquier usuario puede registrarse como
**COMPRADOR** o **VENDEDOR**. Los vendedores publican piezas únicas o de edición limitada
(relojes vintage, joyería, arte, numismática). Cada producto tiene una narrativa descriptiva
llamada "historia del producto" que enriquece la experiencia más allá de un e-commerce genérico.

### Modelo de negocio

- **Marketplace abierto:** cualquier usuario puede convertirse en vendedor y publicar sus piezas.
- **Piezas únicas:** el stock es típicamente 1 por publicación. El sistema soporta stock > 1
  pero el flujo está diseñado para exclusividad.
- **Lista de deseos como carrito:** el comprador agrega piezas a su lista de deseos y desde
  ahí genera una reserva. No hay "agregar múltiples cantidades de la misma pieza".
- **Flujo de compra en 2 pasos:** el comprador reserva → el vendedor confirma o rechaza.
  El stock se bloquea al reservar y se descuenta definitivamente al confirmar.
- **Sistema de ofertas:** el comprador puede hacer una oferta con precio distinto al publicado.
  El vendedor puede aceptar, rechazar o contraofertar.
- **Favoritos / Lista de deseos:** el comprador guarda piezas de interés. Desde la lista de
  deseos puede iniciar una reserva o una oferta.

### Stack

| Capa | Tecnología |
|---|---|
| Backend | Java 17 + Spring Boot 3 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL |
| Seguridad | JWT stateless (Bearer token) |
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Estado global | Redux Toolkit |
| Testing backend | JUnit 5 + Mockito |
| Testing frontend | Vitest + React Testing Library |

---

## Estructura del repositorio

Monorepo con backend y frontend en el mismo repositorio. Arquitectura monolítica.

```
thecollector/
├── AGENTS.md
├── .gitignore
├── backend/
│   └── src/
│       ├── main/
│       │   ├── java/com/thecollector/
│       │   │   ├── auth/            # JWT, filtros, SecurityConfig
│       │   │   ├── usuario/         # entidad, repo, service, controller, DTO
│       │   │   ├── producto/
│       │   │   ├── publicacion/
│       │   │   ├── reserva/         # flujo reserva + confirmación del vendedor
│       │   │   ├── oferta/          # flujo oferta / contraoferta
│       │   │   ├── favorito/        # lista de deseos
│       │   │   └── config/          # CORS, beans globales
│       │   └── resources/
│       │       ├── application.properties
│       │       └── application-local.properties  ← NO commitear
│       └── test/
└── frontend/
    ├── .env.local                               ← NO commitear
    └── src/
        ├── components/      # componentes reutilizables (Button, Card, Modal…)
        ├── pages/           # una carpeta por página/ruta
        ├── store/           # slices de Redux
        ├── services/        # todas las llamadas a la API
        ├── hooks/           # custom hooks
        └── routes/          # definición de rutas con React Router
```

Dentro de cada módulo del backend, respetar siempre esta estructura de capas:
```
<modulo>/
├── <Entidad>.java
├── <Entidad>Repository.java
├── <Entidad>Service.java
├── <Entidad>Controller.java
├── <Entidad>RequestDTO.java
└── <Entidad>ResponseDTO.java
```

---

## Dev environment setup

### Requisitos previos
- Java 17+
- Node.js 18+
- PostgreSQL corriendo localmente en puerto 5432
- Base de datos creada: `CREATE DATABASE thecollector;`

### Backend

```bash
cd backend
./mvnw spring-boot:run
# API disponible en http://localhost:8080
```

Crear `backend/src/main/resources/application-local.properties` (ignorado por git):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/thecollector
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD
jwt.secret=una_clave_secreta_de_al_menos_32_caracteres
jwt.expiration-ms=86400000
```

En `application.properties` activar el perfil local:
```properties
spring.profiles.active=local
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173
```

Crear `frontend/.env.local` (ignorado por git):
```
VITE_API_URL=http://localhost:8080/api
```

---

## Flujos de negocio clave

### Flujo de compra (2 pasos)

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ Agrega pieza a Lista de deseos  │
    ├─ Desde lista, genera Reserva ───►│
    │  (estado: PENDIENTE)             │
    │  Stock queda bloqueado           │
    │                                 ├─ Ve reserva pendiente en su panel
    │                                 ├─ Confirma o Rechaza
    │◄─────────────────────────────────┤
    │  Si CONFIRMADA: stock descontado │
    │  Si RECHAZADA: stock liberado    │
```

Estados de `Reserva`: `PENDIENTE` → `CONFIRMADA` | `RECHAZADA` | `CANCELADA`

### Flujo de oferta

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ Hace oferta con precio X ──────►│
    │  (estado: PENDIENTE)             │
    │                                 ├─ Acepta → se crea Reserva automáticamente
    │                                 ├─ Rechaza → oferta cerrada
    │                                 ├─ Contraoferta con precio Y
    │◄─────────────────────────────────┤
    ├─ Acepta contraoferta             │
    │  (se crea Reserva)               │
```

Estados de `Oferta`: `PENDIENTE` → `ACEPTADA` | `RECHAZADA` | `CONTRAOFERTA` | `CANCELADA`

---

## Data model

### Entidades y relaciones

```
Usuario         → Publicacion   : OneToMany  (un vendedor tiene muchas publicaciones)
Usuario         → Favorito      : OneToMany  (lista de deseos del comprador)
Usuario         → Reserva       : OneToMany  (como comprador)
Usuario         → Oferta        : OneToMany  (como comprador)
Publicacion     → Producto      : OneToOne
Publicacion     → Reserva       : OneToMany
Publicacion     → Oferta        : OneToMany
Reserva         → Oferta        : OneToOne   (nullable — reserva puede venir de oferta aceptada)
```

### Campos clave por entidad

**Usuario:** `id`, `nombre`, `email`, `password` (BCrypt), `rol` (COMPRADOR/VENDEDOR),
`fechaRegistro`

**Producto:** `id`, `nombre`, `descripcion`, `historia` (TEXT), `precio`, `stock` (Int),
`categoria` (Enum: RELOJ, JOYERIA, ARTE, NUMISMATICA, OTRO), `imagenUrl`

**Publicacion:** `id`, `producto`, `vendedor`, `estado` (ACTIVA/PAUSADA/VENDIDA),
`fechaPublicacion`

**Favorito:** `id`, `comprador`, `publicacion`, `fechaAgregado`
— Un comprador no puede agregar la misma publicación dos veces (unique constraint).

**Reserva:** `id`, `comprador`, `publicacion`, `precioAcordado`, `estado`, `fechaReserva`,
`fechaRespuesta`, `oferta` (nullable FK)

**Oferta:** `id`, `comprador`, `publicacion`, `precioOfertado`, `precioContraoferta`
(nullable), `estado`, `fechaOferta`

### Reglas de negocio a respetar en el backend

- Al crear una `Reserva`, verificar que `publicacion.estado == ACTIVA` y `producto.stock > 0`.
- Al confirmar una `Reserva`, decrementar `producto.stock`. Si queda en 0, cambiar
  `publicacion.estado` a `VENDIDA`.
- Al rechazar o cancelar una `Reserva` con estado `PENDIENTE`, liberar el stock bloqueado.
- Un comprador no puede reservar su propia publicación.
- Un comprador no puede hacer oferta sobre una publicación propia.
- Solo el vendedor dueño de la publicación puede confirmar/rechazar reservas y ofertas.

---

## API REST

Todos los endpoints protegidos con 🔒 requieren header `Authorization: Bearer <token>`.
Las respuestas siempre en JSON. Usar códigos HTTP semánticos.

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registro. Body: `{ nombre, email, password, rol }`. Devuelve 201. |
| POST | `/api/auth/login` | ❌ | Devuelve `{ token, rol, nombre, id }` |

### Productos y Publicaciones
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/publicaciones` | ❌ | Catálogo. Query params: `categoria`, `precioMin`, `precioMax`, `orden` (reciente/precio) |
| GET | `/api/publicaciones/{id}` | ❌ | Detalle con producto completo (incluye `historia`) |
| POST | `/api/publicaciones` | 🔒 VENDEDOR | Crear publicación + producto en un solo request |
| PUT | `/api/publicaciones/{id}` | 🔒 dueño | Editar publicación propia |
| PATCH | `/api/publicaciones/{id}/estado` | 🔒 dueño | Cambiar estado: ACTIVA / PAUSADA |
| DELETE | `/api/publicaciones/{id}` | 🔒 dueño | Solo si no tiene reservas PENDIENTES |

### Favoritos (Lista de deseos)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/favoritos` | 🔒 COMPRADOR | Mi lista de deseos |
| POST | `/api/favoritos/{publicacionId}` | 🔒 COMPRADOR | Agregar a lista. 409 si ya existe. |
| DELETE | `/api/favoritos/{publicacionId}` | 🔒 COMPRADOR | Quitar de lista |

### Reservas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/reservas` | 🔒 COMPRADOR | Crear reserva. Body: `{ publicacionId }` |
| GET | `/api/reservas/comprador` | 🔒 COMPRADOR | Mis reservas como comprador |
| GET | `/api/reservas/vendedor` | 🔒 VENDEDOR | Reservas pendientes de mis publicaciones |
| PATCH | `/api/reservas/{id}/confirmar` | 🔒 dueño pub. | Confirmar reserva → stock se descuenta |
| PATCH | `/api/reservas/{id}/rechazar` | 🔒 dueño pub. | Rechazar reserva → stock liberado |
| PATCH | `/api/reservas/{id}/cancelar` | 🔒 comprador | Cancelar reserva propia (si PENDIENTE) |

### Ofertas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/ofertas` | 🔒 COMPRADOR | Hacer oferta. Body: `{ publicacionId, precioOfertado }` |
| GET | `/api/ofertas/comprador` | 🔒 COMPRADOR | Mis ofertas enviadas |
| GET | `/api/ofertas/vendedor` | 🔒 VENDEDOR | Ofertas recibidas en mis publicaciones |
| PATCH | `/api/ofertas/{id}/aceptar` | 🔒 dueño pub. | Acepta → crea Reserva automáticamente |
| PATCH | `/api/ofertas/{id}/rechazar` | 🔒 dueño pub. | Rechaza oferta |
| PATCH | `/api/ofertas/{id}/contraofertar` | 🔒 dueño pub. | Body: `{ precioContraoferta }` |
| PATCH | `/api/ofertas/{id}/aceptar-contraoferta` | 🔒 comprador | Acepta → crea Reserva |
| PATCH | `/api/ofertas/{id}/cancelar` | 🔒 comprador | Cancela oferta propia (si PENDIENTE) |

---

## Redux — Slices

| Slice | Estado | Notas |
|---|---|---|
| `authSlice` | `{ usuario, token, rol, isAuthenticated }` | Token persiste en `localStorage` |
| `catalogoSlice` | `{ publicaciones[], filtros, loading, error }` | Filtros: categoría, precio, orden |
| `favoritosSlice` | `{ items[], loading }` | Se carga al autenticarse como COMPRADOR |
| `reservasSlice` | `{ reservas[], loading }` | Vistas de comprador y vendedor |
| `ofertasSlice` | `{ ofertas[], loading }` | Vistas de comprador y vendedor |

El token JWT se inyecta en cada request desde `services/api.js`. Ningún componente ni slice
llama a `fetch` directamente; todo pasa por las funciones en `/services`.

---

## Páginas del frontend

| Página | Ruta | Acceso | Descripción |
|---|---|---|---|
| Home / Catálogo | `/` | público | Grilla de publicaciones con filtros |
| Detalle pieza | `/publicaciones/:id` | público | Historia, imágenes, precio, botones acción |
| Login | `/login` | público | |
| Registro | `/register` | público | Selección de rol al registrarse |
| Lista de deseos | `/favoritos` | COMPRADOR | Piezas guardadas + acción de reservar/ofertar |
| Mis reservas | `/reservas` | COMPRADOR | Historial y estado de reservas |
| Mis ofertas | `/ofertas` | COMPRADOR | Ofertas enviadas y contraofertas recibidas |
| Panel vendedor | `/vendedor` | VENDEDOR | Mis publicaciones, reservas y ofertas pendientes |
| Nueva publicación | `/vendedor/nueva` | VENDEDOR | Formulario crear producto + publicación |
| Editar publicación | `/vendedor/:id/editar` | VENDEDOR | |

---

## Code style

### Backend (Java)
- Arquitectura en capas estricta: `Controller → Service → Repository`. Los controllers no
  acceden directamente al repositorio nunca.
- Usar DTOs para request y response. Las entidades JPA **nunca** se exponen directamente en la API.
- Validar los request DTOs con `@Valid` + anotaciones de Bean Validation (`@NotNull`, `@Email`, etc.).
- Excepciones manejadas globalmente en un `@ControllerAdvice`. No usar `try/catch` en controllers.
- Control de acceso con `@PreAuthorize`. Validar además que el usuario sea dueño del recurso
  en la capa de servicio.
- Nombres de clases, métodos y variables en inglés. Comentarios en español si hacen falta.

### Frontend (React)
- Solo componentes funcionales. Sin class components.
- Un componente por archivo. PascalCase para el nombre del archivo y del componente.
- Toda lógica de fetch va en `/services`. Los slices llaman a funciones de services, nunca usan
  `fetch` directamente.
- Rutas protegidas con un componente `<PrivateRoute role="COMPRADOR">` que redirige a `/login`
  si no hay sesión activa o si el rol no coincide.
- Tailwind directo en JSX. Evitar archivos CSS salvo para animaciones o efectos imposibles con
  utilidades de Tailwind.

---

## Testing

### Backend
```bash
cd backend
./mvnw test                                    # toda la suite
./mvnw test -Dtest=ReservaServiceTest          # test específico
```
- Tests unitarios para toda la capa de servicio con Mockito.
- Tests de integración por controller con `@SpringBootTest` + `MockMvc`:
  verificar código HTTP, estructura JSON y reglas de negocio (ej: no reservar pieza propia).
- La suite completa debe estar en verde antes de cada entrega obligatoria.

### Frontend
```bash
cd frontend
npm run test          # Vitest modo watch
npm run test -- --run # una sola pasada
```
- Testear reducers de Redux (son funciones puras, fácil).
- Testear los formularios críticos: login, registro, nueva publicación, oferta.

---

## Security considerations

- **Nunca** commitear `application-local.properties` ni `.env.local`. Agregarlos al `.gitignore`
  desde el primer commit.
- JWT stateless con expiración de 24 hs. El backend no guarda sesión.
- Validar en el **servicio** (no solo en el controller) que el usuario autenticado sea el dueño
  del recurso antes de cualquier mutación.
- CORS configurado explícitamente en `SecurityConfig` para aceptar solo `http://localhost:5173`
  en desarrollo.
- Passwords hasheados con BCrypt. Nunca loguear ni devolver la password en ninguna respuesta.
- Si se trabaja en ramas, nunca mergear a `main` sin que los tests pasen.

---

## Sugerencia de división de trabajo (4 integrantes)

Una vez que lo definan, pueden organizarse así para evitar conflictos:

| Integrante | Módulos sugeridos |
|---|---|
| Dev 1 | Backend: `auth` + `usuario` + `producto` + `publicacion` |
| Dev 2 | Backend: `favorito` + `reserva` + `oferta` |
| Dev 3 | Frontend: autenticación + catálogo + detalle de pieza |
| Dev 4 | Frontend: lista de deseos + reservas + ofertas + panel vendedor |

Cada dev crea su rama desde `main` con el formato `feature/<modulo>` y hace PR al terminar.

---

## Entregas obligatorias (TPO)

| # | Contenido | Fecha límite |
|---|---|---|
| 1 | Modelo de datos y entidades JPA con relaciones | 07/04 |
| 2 | Seguridad con JWT integrada a la capa de datos | 22/04 |
| 3 | Maquetación visual del frontend (Tailwind) | 20/05 |
| 4 | Componentes React y routing con React Router | 04/06 |
| 5 | Integración frontend ↔ backend (Fetch + Promises) | 18/06 |
| 6 | Refactorización e integración de Redux Toolkit | 02/07 |

Cada entrega se defiende con **demo en vivo** (5–10 min por grupo).
El código debe correr sin errores al momento de la presentación.

**Parcial:** Sábado 13/06 &nbsp;|&nbsp; **Final regular:** Viernes 24/07
