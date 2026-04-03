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
- **Carrito de compras:** el comprador agrega piezas al carrito y desde ahí realiza el checkout.
  El checkout descuenta el stock. No hay procesamiento de pago real.
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
| Seguridad | Spring Security + JWT stateless (Bearer token) |
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Estado global | Redux Toolkit (desde Entrega 6) |

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
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── model/
│       │   │   ├── dto/
│       │   │   │   ├── usuario/
│       │   │   │   ├── producto/
│       │   │   │   ├── publicacion/
│       │   │   │   ├── carrito/
│       │   │   │   ├── reserva/
│       │   │   │   ├── oferta/
│       │   │   │   └── favorito/
│       │   │   ├── exception/
│       │   │   └── config/          # SecurityConfig, CORS, beans globales
│       │   └── resources/
│       │       ├── application.yml               ← configuración base
│       │       └── application-local.yml         ← NO commitear
│       └── test/
└── frontend/
    ├── .env.local                               ← NO commitear
    └── src/
        ├── components/      # componentes reutilizables (Button, Card, Modal…)
        ├── pages/           # una carpeta por página/ruta
        ├── store/           # slices de Redux — se crea en Entrega 6
        ├── services/        # funciones de llamada a la API — se crea en Entrega 5
        ├── hooks/           # custom hooks
        └── routes/          # definición de rutas con React Router
```

### Estructura de capas del backend

La arquitectura sigue el modelo de **3 capas** visto en la materia (UVA 1):

```
Controller  →  Service  →  Repository
```

- **`controller/`** — recibe el request HTTP, delega al service, devuelve la respuesta.
  Sin lógica de negocio.
- **`service/`** — contiene toda la lógica de negocio. Es la única capa que puede llamar
  al repository.
- **`repository/`** — acceso a la base de datos mediante Spring Data JPA.
- **`model/`** — entidades JPA. Nunca se exponen directamente en la API.
- **`dto/`** — objetos de transferencia de datos, organizados en subcarpetas por entidad.
  Cada entidad tiene su `<Entidad>RequestDTO` y `<Entidad>ResponseDTO`.
- **`exception/`** — excepciones de dominio custom (ej: `PublicacionNotFoundException`)
  y el `GlobalExceptionHandler` con `@ControllerAdvice`.
- **`config/`** — configuración de Spring Security, CORS y otros beans globales.

Los controllers **nunca** acceden al repository directamente. Todo pasa por el service.

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

Crear `backend/src/main/resources/application-local.yml` (ignorado por git):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/thecollector
    username: postgres
    password: TU_PASSWORD
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: una_clave_secreta_de_al_menos_32_caracteres
  expiration-ms: 86400000
```

`application.yml` base (sí se commitea, sin secretos):
```yaml
spring:
  profiles:
    active: local
  application:
    name: thecollector

server:
  port: 8080
```

Los valores de `jwt.secret` y credenciales de BD **nunca** van hardcodeados ni commiteados.

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

### Flujo de compra

```
COMPRADOR
    │
    ├─ Explora el catálogo
    ├─ Agrega pieza al carrito
    ├─ Realiza checkout
    │  → se descuenta el stock
    │  → si stock llega a 0, publicación pasa a VENDIDA
```

### Flujo de reserva (2 pasos)

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
- Al hacer checkout del carrito, verificar stock disponible antes de descontar.
- Un comprador no puede reservar su propia publicación.
- Un comprador no puede hacer oferta sobre una publicación propia.
- Solo el vendedor dueño de la publicación puede confirmar/rechazar reservas y ofertas.

---

## API REST

Todos los endpoints protegidos con 🔒 requieren header `Authorization: Bearer <token>`.
Las respuestas siempre en JSON. Usar códigos HTTP semánticos.

### Formato de respuesta de error

Todas las respuestas de error siguen esta estructura, producida por el `GlobalExceptionHandler`:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Publicacion con id 42 no encontrada",
  "path": "/api/publicaciones/42",
  "timestamp": "2025-04-01T12:00:00Z"
}
```

Para errores de validación (422), se agrega el campo `details`:

```json
{
  "status": 422,
  "error": "Unprocessable Entity",
  "message": "Error de validación",
  "details": [
    { "field": "precioOfertado", "message": "must be greater than 0" }
  ]
}
```

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registro. Body: `{ nombre, email, password, rol }`. Devuelve 201. |
| POST | `/api/auth/login` | ❌ | Devuelve `{ token, rol, nombre, id }` |

### Productos y Publicaciones
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/publicaciones` | ❌ | Catálogo. Query params: `categoria`, `precioMin`, `precioMax`, `orden` (reciente/precio), `page` (default 0), `size` (default 20) |
| GET | `/api/publicaciones/{id}` | ❌ | Detalle con producto completo (incluye `historia`) |
| POST | `/api/publicaciones` | 🔒 VENDEDOR | Crear publicación + producto en un solo request. Devuelve 201. |
| PUT | `/api/publicaciones/{id}` | 🔒 dueño | Editar publicación propia |
| PATCH | `/api/publicaciones/{id}/estado` | 🔒 dueño | Cambiar estado: ACTIVA / PAUSADA |
| DELETE | `/api/publicaciones/{id}` | 🔒 dueño | Solo si no tiene reservas PENDIENTES. Devuelve 204. |

El endpoint `GET /api/publicaciones` devuelve siempre paginado:
```json
{
  "content": [ ],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

### Carrito
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/carrito` | 🔒 COMPRADOR | Ver carrito activo |
| POST | `/api/carrito/{publicacionId}` | 🔒 COMPRADOR | Agregar pieza al carrito. 409 si ya existe. |
| DELETE | `/api/carrito/{publicacionId}` | 🔒 COMPRADOR | Quitar pieza del carrito |
| POST | `/api/carrito/checkout` | 🔒 COMPRADOR | Confirmar compra → descuenta stock. Devuelve 200. |

### Favoritos (Lista de deseos)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/favoritos` | 🔒 COMPRADOR | Mi lista de deseos |
| POST | `/api/favoritos/{publicacionId}` | 🔒 COMPRADOR | Agregar a lista. 409 si ya existe. Devuelve 201. |
| DELETE | `/api/favoritos/{publicacionId}` | 🔒 COMPRADOR | Quitar de lista. Devuelve 204. |

### Reservas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/reservas` | 🔒 COMPRADOR | Crear reserva. Body: `{ publicacionId }`. Devuelve 201. |
| GET | `/api/reservas/comprador` | 🔒 COMPRADOR | Mis reservas como comprador |
| GET | `/api/reservas/vendedor` | 🔒 VENDEDOR | Reservas pendientes de mis publicaciones |
| PATCH | `/api/reservas/{id}/confirmar` | 🔒 dueño pub. | Confirmar reserva → stock se descuenta |
| PATCH | `/api/reservas/{id}/rechazar` | 🔒 dueño pub. | Rechazar reserva → stock liberado |
| PATCH | `/api/reservas/{id}/cancelar` | 🔒 comprador | Cancelar reserva propia (si PENDIENTE) |

### Ofertas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/ofertas` | 🔒 COMPRADOR | Hacer oferta. Body: `{ publicacionId, precioOfertado }`. Devuelve 201. |
| GET | `/api/ofertas/comprador` | 🔒 COMPRADOR | Mis ofertas enviadas |
| GET | `/api/ofertas/vendedor` | 🔒 VENDEDOR | Ofertas recibidas en mis publicaciones |
| PATCH | `/api/ofertas/{id}/aceptar` | 🔒 dueño pub. | Acepta → crea Reserva automáticamente |
| PATCH | `/api/ofertas/{id}/rechazar` | 🔒 dueño pub. | Rechaza oferta |
| PATCH | `/api/ofertas/{id}/contraofertar` | 🔒 dueño pub. | Body: `{ precioContraoferta }` |
| PATCH | `/api/ofertas/{id}/aceptar-contraoferta` | 🔒 comprador | Acepta → crea Reserva |
| PATCH | `/api/ofertas/{id}/cancelar` | 🔒 comprador | Cancela oferta propia (si PENDIENTE) |

---

## Páginas del frontend

| Página | Ruta | Acceso | Descripción |
|---|---|---|---|
| Home / Catálogo | `/` | público | Grilla de publicaciones con filtros |
| Detalle pieza | `/publicaciones/:id` | público | Historia, imágenes, precio, botones acción |
| Login | `/login` | público | |
| Registro | `/register` | público | Selección de rol al registrarse |
| Carrito | `/carrito` | COMPRADOR | Piezas en el carrito + checkout |
| Lista de deseos | `/favoritos` | COMPRADOR | Piezas guardadas + acción de reservar/ofertar |
| Mis reservas | `/reservas` | COMPRADOR | Historial y estado de reservas |
| Mis ofertas | `/ofertas` | COMPRADOR | Ofertas enviadas y contraofertas recibidas |
| Panel vendedor | `/vendedor` | VENDEDOR | Mis publicaciones, reservas y ofertas pendientes |
| Nueva publicación | `/vendedor/nueva` | VENDEDOR | Formulario crear producto + publicación |
| Editar publicación | `/vendedor/:id/editar` | VENDEDOR | |

---

## Code style

### Backend (Java)

#### Arquitectura en capas
- Flujo estricto: `Controller → Service → Repository`. Los controllers **nunca** acceden al
  repository directamente.
- Los controllers son delgados: solo reciben el request, delegan al service y devuelven la
  respuesta. Cero lógica de negocio en el controller.
- Toda lógica de negocio vive en `@Service`. Los servicios son stateless.

#### Inyección de dependencias
- Usar siempre **inyección por constructor**. Nunca `@Autowired` en campos.
- Declarar las dependencias como `private final`.

```java
// ✅ Correcto
@Service
public class PublicacionService {
    private final PublicacionRepository publicacionRepository;
    private final ProductoRepository productoRepository;

    public PublicacionService(PublicacionRepository publicacionRepository,
                              ProductoRepository productoRepository) {
        this.publicacionRepository = publicacionRepository;
        this.productoRepository = productoRepository;
    }
}

// ❌ Incorrecto
@Service
public class PublicacionService {
    @Autowired
    private PublicacionRepository publicacionRepository;
}
```

#### DTOs
- Usar DTOs para request y response. Las entidades JPA **nunca** se exponen en la API.
- Cada entidad tiene su propio par en `dto/<entidad>/`:
  - `<Entidad>RequestDTO.java` — lo que llega del cliente, con validaciones.
  - `<Entidad>ResponseDTO.java` — lo que se devuelve al cliente.
- Validar los request DTOs con `@Valid` + Bean Validation (`@NotNull`, `@Email`,
  `@Positive`, `@Size`, etc.).
- La conversión de entidad a ResponseDTO se hace en el service, no en el controller.

```java
// dto/oferta/OfertaRequestDTO.java
public class OfertaRequestDTO {
    @NotNull
    private Long publicacionId;

    @NotNull
    @Positive(message = "El precio ofertado debe ser mayor a 0")
    private BigDecimal precioOfertado;
}
```

#### Transacciones
- Anotar con `@Transactional` los métodos de servicio que escriben en la BD.
- Para operaciones de solo lectura usar `@Transactional(readOnly = true)`.

```java
@Transactional
public ReservaResponseDTO confirmarReserva(Long reservaId, Long vendedorId) { ... }

@Transactional(readOnly = true)
public List<ReservaResponseDTO> getReservasPorComprador(Long compradorId) { ... }
```

#### Manejo de excepciones
- Definir excepciones de dominio custom en `exception/`
  (ej: `PublicacionNotFoundException`, `StockInsuficienteException`).
- Un único `GlobalExceptionHandler` con `@ControllerAdvice` maneja todas las excepciones.
  Nunca usar `try/catch` en controllers.
- Devolver siempre la estructura de error estandarizada definida en la sección de API REST.

```java
// exception/GlobalExceptionHandler.java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PublicacionNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(PublicacionNotFoundException ex,
                                                           HttpServletRequest request) {
        // construir ErrorResponseDTO con status 404
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex,
                                                             HttpServletRequest request) {
        // construir ErrorResponseDTO con status 422 y lista de campos inválidos
    }
}
```

#### Logging
- Usar SLF4J. Declarar el logger como `private static final`.
- Usar mensajes parametrizados, nunca concatenación de strings.

```java
private static final Logger logger = LoggerFactory.getLogger(CarritoService.class);

// ✅ Correcto
logger.info("Checkout realizado por usuario id={}", usuarioId);

// ❌ Incorrecto
logger.info("Checkout realizado por usuario id=" + usuarioId);
```

#### Repositorios
- Extender `JpaRepository<Entidad, Long>` para operaciones CRUD estándar.
- Para consultas que no cubre Spring Data por convención de nombres, usar `@Query` con JPQL.

```java
@Query("SELECT p FROM Publicacion p WHERE p.estado = 'ACTIVA' AND p.producto.categoria = :categoria")
List<Publicacion> findActivasByCategoria(@Param("categoria") Categoria categoria);
```

#### Acceso y autorización
- Usar `@PreAuthorize` en el controller para control de rol (COMPRADOR / VENDEDOR).
- Validar en el **service** que el usuario autenticado sea el dueño del recurso antes de
  cualquier mutación. El controller solo verifica el rol, el service verifica la propiedad.
- Nombres de clases, métodos y variables en inglés. Comentarios en español si hacen falta.

---

### Frontend (React)

El frontend se construye en fases que siguen el cronograma de la materia. Cada fase tiene
su propio enfoque; no adelantar implementaciones de fases posteriores.

#### Fase 1 — Entregas 3 y 4: maquetado y routing (sin llamadas a la API)

- Solo componentes funcionales. Un componente por archivo, PascalCase.
- Tailwind directo en JSX desde el primer día. No crear archivos CSS salvo para animaciones
  que Tailwind no pueda resolver.
- Routing con `react-router-dom`. Todas las rutas definidas en `routes/`.
- Rutas protegidas con un componente `<PrivateRoute role="COMPRADOR">` que redirige a
  `/login` si no hay sesión activa o el rol no coincide.
- El estado de sesión en esta fase puede ser local (useState) o hardcodeado para poder
  navegar durante el desarrollo visual.
- Props para pasar datos entre componentes padre e hijo. Sin fetch, sin Redux todavía.

#### Fase 2 — Entrega 5: integración con el backend (fetch + useEffect)

- Crear la carpeta `services/` con una función por recurso de la API. Los componentes
  **nunca** llaman a `fetch` directamente.
- Usar `useEffect` para disparar las llamadas al backend al montar el componente.
- El token JWT se lee de `localStorage` y se adjunta en el header `Authorization` desde
  cada función de `services/`.
- Manejar los tres estados de cada llamada: cargando, éxito y error. Mostrar feedback
  visual al usuario en cada caso.

```jsx
// services/publicacionService.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getPublicaciones(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const res = await fetch(`${API_URL}/publicaciones?${params}`);
  if (!res.ok) throw new Error('Error al obtener publicaciones');
  return res.json();
}

// pages/Catalogo/Catalogo.jsx
function Catalogo() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicaciones()
      .then(setPublicaciones)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  return ( /* renderizar publicaciones */ );
}
```

#### Fase 3 — Entrega 6: refactorización a Redux Toolkit

- Crear la carpeta `store/` con un slice por recurso principal.
- Migrar el estado y las llamadas a la API de los componentes a los slices usando
  `createAsyncThunk`.
- Las funciones de `services/` **no cambian**: los thunks las llaman igual que antes
  lo hacían los componentes. Solo cambia dónde vive el estado y quién dispara el fetch.
- Los componentes dejan de tener estado local para datos remotos: leen del store con
  `useSelector` y despachan acciones con `useDispatch`.

```jsx
// store/catalogoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPublicaciones } from '../services/publicacionService';

export const fetchPublicaciones = createAsyncThunk(
  'catalogo/fetchPublicaciones',
  async (filtros) => getPublicaciones(filtros)
);

const catalogoSlice = createSlice({
  name: 'catalogo',
  initialState: { publicaciones: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicaciones.pending, (state) => { state.loading = true; })
      .addCase(fetchPublicaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.publicaciones = action.payload;
      })
      .addCase(fetchPublicaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default catalogoSlice.reducer;
```

#### Slices de Redux (Entrega 6)

| Slice | Estado |
|---|---|
| `authSlice` | `{ usuario, token, rol, isAuthenticated }` — token persiste en `localStorage` |
| `catalogoSlice` | `{ publicaciones[], filtros, loading, error }` |
| `carritoSlice` | `{ items[], loading }` |
| `favoritosSlice` | `{ items[], loading }` |
| `reservasSlice` | `{ reservas[], loading }` |
| `ofertasSlice` | `{ ofertas[], loading }` |

---

## Security considerations

- **Nunca** commitear `application-local.yml` ni `.env.local`. Están en `.gitignore`
  desde el primer commit.
- JWT stateless con expiración de 24 hs. El backend no guarda sesión.
- Validar en el **service** (no solo en el controller) que el usuario autenticado sea el dueño
  del recurso antes de cualquier mutación.
- CORS configurado explícitamente en `SecurityConfig` para aceptar solo `http://localhost:5173`
  en desarrollo.
- Passwords hasheados con BCrypt. Nunca loguear ni devolver la password en ninguna respuesta.
- Usar JPQL o Spring Data para toda interacción con la BD. Nunca construir queries por
  concatenación de strings (prevención de SQL injection).
- Si se trabaja en ramas, nunca mergear a `main` con el backend que no levanta o el
  frontend que no compila.

---

## Sugerencia de división de trabajo (4 integrantes)

| Integrante | Responsabilidad |
|---|---|
| Dev 1 | Backend: `auth` + `usuario` + `producto` + `publicacion` |
| Dev 2 | Backend: `carrito` + `reserva` + `oferta` + `favorito` |
| Dev 3 | Frontend: autenticación + catálogo + detalle de pieza + carrito |
| Dev 4 | Frontend: lista de deseos + reservas + ofertas + panel vendedor |

Cada dev crea su rama desde `main` con el formato `feature/<modulo>` y hace PR al terminar.

---
