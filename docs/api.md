# API REST — The Collector

Todos los endpoints protegidos con 🔒 requieren header `Authorization: Bearer <token>`.
Las respuestas siempre en JSON. Usar códigos HTTP semánticos.

## Formato de respuesta de error

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

## Endpoints

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
