# API REST — The Collector

Base URL local: `http://localhost:8080`. Todos los endpoints protegidos con 🔒 requieren header
`Authorization: Bearer <token>`. Las respuestas siempre en JSON.

## Formato de respuesta exitosa

Toda respuesta exitosa (`ResponseEntity` con body) va envuelta en `ApiResponseDTO<T>`:

```json
{
  "status": 200,
  "message": "Publicaciones obtenidas correctamente",
  "data": { },
  "timestamp": "2026-07-10T12:00:00"
}
```

El campo `data` contiene el payload real (objeto, lista, o `Page`). Los endpoints `DELETE`
devuelven `204 No Content` sin body.

## Formato de respuesta de error

Todas las respuestas de error siguen esta estructura, producida por el `GlobalExceptionHandler`:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Publicación con id 42 no encontrada",
  "path": "/api/publicaciones/42",
  "timestamp": "2026-07-10T12:00:00"
}
```

Para errores de validación de Bean Validation, se agrega el campo `details` con la lista de
campos inválidos.

## Endpoints

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Body: `{ nombre, email, password, rol }` (`rol`: `COMPRADOR` \| `VENDEDOR`). Devuelve 201 con `AuthResponseDTO`. |
| POST | `/api/auth/login` | ❌ | Body: `{ email, password }`. Devuelve `AuthResponseDTO`: `{ token, rol, nombre, id }` |

### Publicaciones y Pujas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/publicaciones` | ❌ | Catálogo paginado, solo publicaciones `ACTIVA`. Query params: `categoria`, `precioMin`, `precioMax`, `orden` (`reciente` default \| `precio`), `page` (default 0), `size` (default 20) |
| GET | `/api/publicaciones/mis-subastas` | 🔒 COMPRADOR | Subastas en las que el usuario tiene al menos una puja, con `pujaUsuario`, `pujaLider` y `resultado` (`GANADA` \| `NO_ADJUDICADA` \| `null` si sigue abierta) |
| GET | `/api/publicaciones/mias` | 🔒 VENDEDOR | Publicaciones propias (todos los estados) |
| GET | `/api/publicaciones/{id}` | ❌ | Detalle con producto completo (incluye `historia`, `especificaciones`, `imagenes`) |
| POST | `/api/publicaciones` | 🔒 VENDEDOR | Crea publicación + producto en un solo request. Body: `PublicacionRequestDTO` (`modo`, `producto`, y si `modo=SUBASTA`: `precioBase`, `fechaLimiteSubasta` ≤ 3 meses, `incrementoMinimo`). Devuelve 201. |
| PUT | `/api/publicaciones/{id}` | 🔒 dueño | Edita datos del producto/publicación. `isAuthenticated()` a nivel de ruta; el service verifica ownership y lanza 403 si no coincide el vendedor autenticado. |
| PATCH | `/api/publicaciones/{id}/estado` | 🔒 dueño | Body: `{ estado }` (`ACTIVA` \| `PAUSADA` \| `VENDIDA`) |
| POST | `/api/publicaciones/{id}/cerrar-subasta` | 🔒 VENDEDOR + dueño | Cierra la subasta manualmente y adjudica de inmediato (crea `Reserva` `CONFIRMADA` si hay postor líder, o pasa la publicación a `PAUSADA` si no hubo pujas) |
| DELETE | `/api/publicaciones/{id}` | 🔒 dueño | Soft-delete (`activo = false`). Falla si tiene reservas `PENDIENTE`. Devuelve 204. |
| POST | `/api/publicaciones/{id}/pujas` | 🔒 COMPRADOR | Body: `{ monto }`. Registra una puja sobre una subasta `ABIERTA`. Devuelve 201. |
| GET | `/api/publicaciones/{id}/pujas` | ❌ | Historial de pujas de la publicación, ordenado por monto descendente |

El endpoint `GET /api/publicaciones` devuelve `data` como página de Spring:
```json
{
  "content": [ ],
  "number": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

### Carrito
> Implementado en backend y en el store Redux del frontend, pero sin página/ruta conectada en
> la UI actualmente.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/carrito` | 🔒 | Ver carrito activo |
| POST | `/api/carrito/{publicacionId}` | 🔒 | Agregar pieza al carrito. Falla si ya está agregada, si no hay stock, o si es publicación propia. |
| DELETE | `/api/carrito/{publicacionId}` | 🔒 | Quitar pieza del carrito. Devuelve 204. |
| POST | `/api/carrito/checkout` | 🔒 | Confirma la compra de todo el carrito: **descuenta stock de inmediato por cada ítem** (no genera `Reserva`). Falla si el carrito está vacío o si alguna pieza ya no tiene stock/no está `ACTIVA`. Vacía el carrito al terminar. |

### Favoritos (Lista de deseos)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/favoritos` | 🔒 | Mi lista de deseos |
| POST | `/api/favoritos/{publicacionId}` | 🔒 | Agregar a lista. Falla si ya existe. Devuelve 201. |
| DELETE | `/api/favoritos/{publicacionId}` | 🔒 | Quitar de lista. Devuelve 204. |

### Reservas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/reservas` | 🔒 | Crea una reserva `PENDIENTE` de origen `DIRECTA` sobre una publicación `PRECIO_FIJO` con stock. Body: `{ publicacionId }`. Devuelve 201. |
| GET | `/api/reservas/comprador` | 🔒 | Mis reservas como comprador |
| GET | `/api/reservas/vendedor` | 🔒 | Reservas de mis publicaciones (como vendedor) |
| PATCH | `/api/reservas/{id}/confirmar` | 🔒 dueño pub. | Confirma reserva `PENDIENTE` → descuenta stock, marca `VENDIDA` si llega a 0 |
| PATCH | `/api/reservas/{id}/rechazar` | 🔒 dueño pub. | Rechaza reserva `PENDIENTE` |
| PATCH | `/api/reservas/{id}/cancelar` | 🔒 comprador | Cancela reserva propia (solo si `PENDIENTE`) |

Solo las reservas de origen `DIRECTA` llegan `PENDIENTE`; las de origen `OFERTA` o `SUBASTA` se
crean directamente `CONFIRMADA` y no pasan por estos endpoints de confirmar/rechazar.

### Ofertas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/ofertas` | 🔒 | Hacer oferta sobre publicación `PRECIO_FIJO` `ACTIVA`. Body: `{ publicacionId, precioOfertado }`. El precio debe ser menor al de lista. Devuelve 201. |
| GET | `/api/ofertas/comprador` | 🔒 | Mis ofertas enviadas |
| GET | `/api/ofertas/vendedor` | 🔒 | Ofertas recibidas en mis publicaciones |
| PATCH | `/api/ofertas/{id}/aceptar` | 🔒 dueño pub. | Acepta oferta `PENDIENTE` → crea `Reserva` `CONFIRMADA` automáticamente (descuenta stock) |
| PATCH | `/api/ofertas/{id}/rechazar` | 🔒 dueño pub. | Rechaza oferta `PENDIENTE` |
| PATCH | `/api/ofertas/{id}/contraofertar` | 🔒 dueño pub. | Body: `{ precioContraoferta }` (mayor a la oferta original, menor al precio de lista) |
| PATCH | `/api/ofertas/{id}/aceptar-contraoferta` | 🔒 comprador | Acepta contraoferta → crea `Reserva` `CONFIRMADA` automáticamente |
| PATCH | `/api/ofertas/{id}/cancelar` | 🔒 comprador | Cancela oferta propia (si `PENDIENTE` o `CONTRAOFERTA`) |

### Status
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/status` | ❌ | Health check simple |
