# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Java 17 + Spring Boot 4 + Maven)

```bash
cd backend
./mvnw spring-boot:run                                      # API en http://localhost:8080
./mvnw test                                                 # Todos los tests
./mvnw -Dtest=BackendApplicationTests test                  # Un test específico
./mvnw spotless:apply                                       # Formatear código Java (Google Style)
./mvnw spotless:check                                       # Verificar formato sin modificar
./mvnw dependency:go-offline                                # Cachear dependencias sin red
```

Requiere PostgreSQL corriendo en `localhost:5432` con base `thecollectordb`. Crear `backend/src/main/resources/application-local.yml` con credenciales locales (ignorado por git, nunca commitear).

### Frontend (React 18 + Vite + Tailwind CSS)

```bash
cd frontend
npm install
npm run dev      # App en http://localhost:5173
npm run build    # Build de producción
npm run preview  # Preview del build
```

Crear `frontend/.env.local` con `VITE_API_URL=http://localhost:8080/api` (ignorado por git).

---

## Architecture

### Backend — 3-layer strict

```
controller/ → service/ → repository/
```

- **`controller/`** — mapea HTTP ↔ DTOs. Sin lógica de negocio. Autorización con `@PreAuthorize`.
- **`service/`** — toda la lógica de negocio. `@Transactional` en mutaciones, `@Transactional(readOnly = true)` en lecturas. Verifica ownership del recurso.
- **`repository/`** — acceso a datos via Spring Data JPA únicamente.
- **`dto/`** — `<Entidad>RequestDTO` / `<Entidad>ResponseDTO` por entidad. Las `@Entity` nunca se exponen en la API.
- **`exception/`** — `ResourceNotFoundException` y `GlobalExceptionHandler` con `@ControllerAdvice`. Sin bloques `try/catch` para control de flujo.
- **`config/`** — `WebSecurityConfig`, `JwtAuthenticationFilter`, `ApplicationConfig`.

JWT stateless: el token viaja en `Authorization: Bearer <token>`. No hay sesión en el servidor.

Inyección de dependencias **siempre por constructor** (`private final`). `@Autowired` a nivel de campo está prohibido.

### Frontend — Presentation layer

```
pages/ → components/ → services/ → (backend API)
         hooks/
         store/ (Redux)
```

- **`pages/`** — un archivo por ruta. Orquestan estado y llaman a services via hooks.
- **`components/layout/`** — `Navbar`, `Layout` (con `<Outlet />`), `ProtectedRoute` (guard por rol).
- **`components/ui/`** — átomos reutilizables (`Button`, `Spinner`, etc.) con Tailwind.
- **`services/`** — toda llamada fetch vive aquí. `api.js` inyecta el JWT desde `localStorage` y lee `import.meta.env.VITE_API_URL`. Nunca usar `fetch` directamente en `.jsx`.
- **`store/`** — Redux Toolkit: `authSlice` (token + usuario + rol) y `carritoSlice` (items). Redux DevTools activo por defecto en desarrollo.
- **`hooks/`** — `useAuth()` accede al store de auth; `useFetch()` encapsula el patrón loading/success/error.
- **`utils/`** — helpers puros (formateo de precios, fechas, etc.).

### Key data flows

- **Auth**: `authService.login()` → `authSlice` guarda token en Redux + `localStorage` → `ProtectedRoute` lo lee via `useAuth()`.
- **API calls**: `services/api.js` → inyecta JWT → `fetch(BASE_URL + path)` → 3 estados UI en el componente (loading / success / error).
- **Catalog**: `publicacionService.getCatalogo(filtros)` → respuesta paginada `{ content, page, totalPages }`.

### Roles y rutas protegidas

| Rol | Acceso |
|---|---|
| público | `/`, `/publicaciones/:id`, `/login`, `/register` |
| `COMPRADOR` | `/carrito`, `/favoritos`, `/reservas`, `/ofertas` |
| `VENDEDOR` | `/vendedor`, `/vendedor/nueva`, `/vendedor/:id/editar` |

`ProtectedRoute` redirige a `/login` si no hay token, o a `/` si el rol no coincide.

### Coding rules (frontend)

- Solo componentes funcionales (`FC`). PascalCase para archivos de componentes.
- Tailwind CSS únicamente — sin archivos `.css` auxiliares.
- Todo request async debe manejar los tres estados en la UI: *loading*, *success*, *error*.
- Usar `createAsyncThunk` (RTK) para estado global async; `useState` + `useEffect` para estado local.
