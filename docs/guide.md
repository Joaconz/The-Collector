# Guía del Proyecto (The Collector)

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

Crear `backend/src/main/resources/application-local.yml` usando la plantilla provista o basándose en sus credenciales locales. (Este archivo está ignorado por git para que las credenciales no se filtren).

### Frontend

```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173
```

Crear `frontend/.env.local` a partir de `.env.example` en la raíz (ignorado por git).

---

## Sugerencia de división de trabajo (4 integrantes)

| Integrante | Responsabilidad |
|---|---|
| Dev 1 | Backend: `auth` + `usuario` + `producto` + `publicacion` |
| Dev 2 | Backend: `carrito` + `reserva` + `oferta` + `favorito` |
| Dev 3 | Frontend: autenticación + catálogo + detalle de pieza + carrito |
| Dev 4 | Frontend: lista de deseos + reservas + ofertas + panel vendedor |

Cada dev crea su rama desde `main` con el formato `feature/<modulo>` y hace PR al terminar.
