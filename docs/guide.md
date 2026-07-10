# Guía del Proyecto (The Collector)

## Dev environment setup

### Requisitos previos
- Java 17+
- Node.js 18+
- PostgreSQL corriendo localmente en el puerto 5432
- Base de datos creada: `CREATE DATABASE thecollectordb;`

### Backend

La configuración vive en `backend/src/main/resources/application.properties` y usa variables de
entorno con valores por defecto ya aptos para desarrollo local (Postgres en `localhost:5432`,
usuario/contraseña `postgres`, base `thecollectordb`):

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/thecollectordb}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
application.security.jwt.secret-key=${JWT_SECRET:...}
application.security.jwt.expiration=${JWT_EXPIRATION:86400000}
```

Si tus credenciales locales difieren de los defaults, exportá las variables de entorno
correspondientes (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION`) antes
de levantar la app — el `.env` de ejemplo en la raíz del repo lista estas variables. No hay
necesidad de un `application-local.yml` para levantar el proyecto: alcanza con Postgres
corriendo con esos valores por defecto, o con las variables de entorno seteadas.

```bash
cd backend
./mvnw spring-boot:run
# API disponible en http://localhost:8080
```

Al arrancar, `spring.jpa.hibernate.ddl-auto=update` crea/actualiza el esquema automáticamente y
`data.sql` (con `spring.sql.init.mode=always`) carga datos de ejemplo.

### Frontend

```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173
```

Crear `frontend/.env.local` a partir de `frontend/.env.example`:

```
VITE_API_URL=http://localhost:8080/api
```

(Este archivo está ignorado por git).

---

## Comandos útiles

```bash
# Backend
./mvnw spring-boot:run                  # levantar la API
./mvnw test                             # correr todos los tests
./mvnw spotless:apply                   # formatear código Java (Google Style)
./mvnw spotless:check                   # verificar formato sin modificar

# Frontend
npm run dev                             # levantar la app
npm run build                           # build de producción
npm run lint                            # ESLint
```

---

## Sugerencia de división de trabajo (4 integrantes)

| Integrante | Responsabilidad |
|---|---|
| Dev 1 | Backend: `auth` + `usuario` + `producto` + `publicacion` |
| Dev 2 | Backend: `carrito` + `reserva` + `oferta` + `puja` + `favorito` |
| Dev 3 | Frontend: autenticación + catálogo + detalle de pieza + carrito |
| Dev 4 | Frontend: lista de deseos + reservas + ofertas + subastas + panel vendedor |

Cada dev crea su rama desde `main` con el formato `feature/<modulo>` y hace PR al terminar.
