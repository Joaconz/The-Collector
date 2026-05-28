# Business Logic — The Collector

Este documento describe en detalle los flujos de negocio, los estados de cada entidad,
y las reglas que el backend debe hacer cumplir. Es la fuente de verdad para cualquier
decisión de implementación en la capa de servicio.

---

## Roles y permisos

### Modelo de roles

The Collector usa un modelo de roles flexible. El rol inicial se elige al registrarse,
pero un usuario puede actuar en ambos contextos.

| Acción | COMPRADOR | VENDEDOR |
|---|---|---|
| Ver catálogo y detalle de pieza | ✅ | ✅ |
| Agregar a lista de deseos | ✅ | ✅ |
| Comprar / ofertar / pujar | ✅ | ✅ (en publicaciones ajenas) |
| Publicar piezas | ✅ (rol extendido) | ✅ |
| Confirmar / rechazar reservas propias | ❌ | ✅ |
| Gestionar ofertas recibidas | ❌ | ✅ |
| Cerrar subasta propia | ❌ | ✅ |

### Restricción absoluta

**Ningún usuario puede comprar, ofertar, ni pujar sobre sus propias publicaciones.**
Esta validación debe hacerse en la capa de servicio del backend, no solo en el frontend.

---

## Modos de publicación

Cada publicación tiene un `modo` que se define al crearla y **no puede modificarse** una
vez publicada.

| Modo | Descripción |
|---|---|
| `PRECIO_FIJO` | Precio fijo con posibilidad de oferta privada entre comprador y vendedor |
| `SUBASTA` | Precio base público, cualquier usuario autenticado puede pujar |

---

## Flujo 1: Compra directa (modo PRECIO_FIJO)

El camino más simple. El comprador decide pagar el precio publicado sin negociar.

```
COMPRADOR                          SISTEMA
    │                                  │
    ├─ Compra directa ────────────────►│
    │                                  ├─ Verifica: publicacion.estado == ACTIVA
    │                                  ├─ Verifica: producto.stock > 0
    │                                  ├─ Verifica: comprador != vendedor
    │                                  ├─ Crea Reserva (estado: PENDIENTE)
    │                                  ├─ Bloquea stock
    │◄─ Reserva creada ────────────────┤
    │                                  │
    │                             VENDEDOR confirma o rechaza
    │                                  │
    │◄─ CONFIRMADA: stock descontado ──┤
    │   o RECHAZADA: stock liberado    │
```

---

## Flujo 2: Oferta privada (modo PRECIO_FIJO)

Negociación privada entre comprador y vendedor. Nadie más puede ver esta oferta.

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ Hace oferta (precio X) ────────►│
    │  estado: PENDIENTE               │
    │                                 ├─ ACEPTA
    │                                 │   └─ Crea Reserva (precio = X)
    │                                 ├─ RECHAZA
    │                                 │   └─ Oferta cerrada
    │                                 ├─ CONTRAOFERTA (precio Y)
    │◄─────────────────────────────────┤
    ├─ ACEPTA contraoferta             │
    │   └─ Crea Reserva (precio = Y)  │
    ├─ CANCELA oferta                  │
    │   └─ Oferta cerrada             │
```

### Estados de Oferta

```
PENDIENTE ──► ACEPTADA      (vendedor acepta oferta original)
          ──► RECHAZADA     (vendedor rechaza)
          ──► CONTRAOFERTA  (vendedor propone nuevo precio)
                 └──► ACEPTADA   (comprador acepta contraoferta)
                 └──► CANCELADA  (comprador cancela)
          ──► CANCELADA     (comprador cancela antes de respuesta)
```

### Reglas de Oferta

- No puede haber más de una oferta `PENDIENTE` o en estado `CONTRAOFERTA` del mismo
  comprador sobre la misma publicación.
- El precio ofertado debe ser mayor a cero.
- El precio ofertado no puede superar el precio publicado (oferta implica negociación a
  la baja; si el comprador quiere pagar más, usa la compra directa o puja en subasta).
- Solo el vendedor dueño de la publicación puede responder una oferta.
- Solo el comprador que hizo la oferta puede cancelarla o aceptar una contraoferta.

---

## Flujo 3: Subasta pública (modo SUBASTA)

```
VENDEDOR                           SISTEMA                        PUJADORES
    │                                  │                               │
    ├─ Publica en modo SUBASTA ───────►│                               │
    │  precio_base, fecha_limite       │                               │
    │  (máximo 3 meses desde hoy)      │                               │
    │                                  │◄─ Puja (monto > puja actual) ─┤
    │                                  │   Valida monto > precio_base  │
    │                                  │   Valida pujador != vendedor  │
    │                                  │   Registra puja               │
    │                                  │──► Notifica nueva puja líder ►│
    │                                  │                               │
    ├─ Cierra subasta ────────────────►│                               │
    │  (o vence fecha_limite)          │                               │
    │                                  ├─ Si hay puja ganadora:        │
    │                                  │   Crea Reserva automática     │
    │                                  │   (precio = monto puja)       │
    │                                  ├─ Si no hubo pujas:            │
    │                                  │   Publicación vuelve a ACTIVA │
    │◄─ Ve reserva en su panel ────────┤                               │
    ├─ CONFIRMA o RECHAZA              │                               │
```

### Estados de Subasta

La subasta es un estado de la `Publicacion`, no una entidad separada. Se maneja mediante
campos adicionales en `Publicacion`:

| Campo | Tipo | Descripción |
|---|---|---|
| `modo` | Enum | `PRECIO_FIJO` o `SUBASTA` |
| `precioBase` | Decimal | Solo relevante en modo SUBASTA |
| `fechaLimiteSubasta` | DateTime | Fecha máxima de cierre (hasta 3 meses) |
| `estadoSubasta` | Enum | `ABIERTA`, `CERRADA` |
| `pujaActual` | Decimal | Monto de la puja líder actual (nullable) |
| `pujadorActual` | Usuario | Quien lidera la subasta (nullable) |

### Reglas de Subasta

- La `fechaLimiteSubasta` no puede superar 3 meses desde la fecha de publicación.
- Cada nueva puja debe superar la puja anterior (o el precio base si no hubo pujas).
- Un usuario no puede pujar sobre su propia subasta.
- Un usuario no puede hacer dos pujas consecutivas sin que alguien más puje en el medio
  (no se puede "autopujar" para subir el precio artificialmente).
- El vendedor puede cerrar la subasta en cualquier momento antes de la fecha límite.
- Al vencer la fecha límite, el sistema cierra la subasta automáticamente.
- Si hay puja ganadora al cierre: se crea Reserva automática con estado `PENDIENTE`.
- El vendedor puede confirmar o rechazar esa reserva (igual que en cualquier otra reserva).
- Si el vendedor rechaza: la publicación vuelve a estado `ACTIVA` con `estadoSubasta = CERRADA`.
  La pieza no se re-subasta automáticamente; el vendedor debe crear una nueva publicación
  o editar la existente si quiere volver a intentarlo.

---

## Flujo 4: Reserva (estados y transiciones)

La `Reserva` es la entidad central del proceso de compra. Toda transacción pasa por aquí.

### Diagrama de estados

```
                    ┌─────────────┐
                    │   PENDIENTE  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        CONFIRMADA      RECHAZADA   CANCELADA
       (vendedor)       (vendedor)  (comprador)
```

### Reglas de Reserva

| Transición | Quién | Efecto en stock |
|---|---|---|
| Crear reserva | Comprador | Stock bloqueado (no decrementado) |
| Confirmar | Vendedor (dueño) | Stock decrementado. Si llega a 0 → publicación `VENDIDA` |
| Rechazar | Vendedor (dueño) | Stock liberado |
| Cancelar | Comprador | Stock liberado |

**Validaciones al crear una reserva:**
- `publicacion.estado` debe ser `ACTIVA`.
- `producto.stock` debe ser mayor a 0.
- El comprador no puede ser el mismo usuario que el vendedor de la publicación.
- En modo `SUBASTA`: no se puede crear una reserva manual; solo se crea automáticamente
  al cerrar la subasta.
- No puede existir otra reserva `PENDIENTE` del mismo comprador sobre la misma publicación.

---

## Lista de deseos (Favoritos)

La lista de deseos es una colección personal del comprador. No tiene efecto en el stock
ni en la disponibilidad de la pieza.

### Reglas

- Un usuario no puede agregar la misma publicación dos veces (unique constraint en BD).
- Se puede agregar una publicación de cualquier modo (precio fijo o subasta).
- Al eliminar una publicación del marketplace, los favoritos asociados se eliminan
  en cascada.
- Desde la lista de deseos el comprador puede iniciar cualquier acción disponible
  según el modo de la publicación: compra directa, oferta privada, o ir a la página
  de subasta.

---

## Entidades y campos relevantes para la lógica

### Usuario

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `email` | String | Único |
| `password` | String | BCrypt, nunca se devuelve en respuestas |
| `rol` | Enum | `COMPRADOR`, `VENDEDOR` |
| `fechaRegistro` | DateTime | |

### Producto

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `nombre` | String | |
| `descripcion` | String | |
| `historia` | Text | Narrativa larga, campo diferenciador |
| `precio` | Decimal | Precio de referencia |
| `stock` | Integer | Típicamente 1 |
| `categoria` | Enum | `RELOJ`, `JOYERIA`, `ARTE`, `NUMISMATICA`, `OTRO` |
| `imagenUrl` | String | |

### Publicacion

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `producto` | Producto | OneToOne |
| `vendedor` | Usuario | ManyToOne |
| `modo` | Enum | `PRECIO_FIJO`, `SUBASTA` |
| `estado` | Enum | `ACTIVA`, `PAUSADA`, `VENDIDA` |
| `precioBase` | Decimal | Solo modo SUBASTA |
| `fechaLimiteSubasta` | DateTime | Solo modo SUBASTA |
| `estadoSubasta` | Enum | `ABIERTA`, `CERRADA` — solo modo SUBASTA |
| `fechaPublicacion` | DateTime | |

### Puja

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `publicacion` | Publicacion | ManyToOne |
| `pujador` | Usuario | ManyToOne |
| `monto` | Decimal | Debe superar la puja anterior |
| `fechaPuja` | DateTime | |

La puja ganadora es siempre la de mayor `monto` sobre una publicación dada. No se borra
el historial de pujas al cerrar la subasta.

### Oferta

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne — solo modo PRECIO_FIJO |
| `precioOfertado` | Decimal | |
| `precioContraoferta` | Decimal | Nullable |
| `estado` | Enum | `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CONTRAOFERTA`, `CANCELADA` |
| `fechaOferta` | DateTime | |

### Reserva

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne |
| `precioAcordado` | Decimal | Precio final de la transacción |
| `estado` | Enum | `PENDIENTE`, `CONFIRMADA`, `RECHAZADA`, `CANCELADA` |
| `origen` | Enum | `DIRECTA`, `OFERTA`, `SUBASTA` — para trazabilidad |
| `oferta` | Oferta | Nullable FK — si vino de una oferta aceptada |
| `puja` | Puja | Nullable FK — si vino del cierre de una subasta |
| `fechaReserva` | DateTime | |
| `fechaRespuesta` | DateTime | Nullable — cuando el vendedor responde |

---

## Casos límite a tener en cuenta

1. **Publicación pausada durante una subasta activa.** Si el vendedor pausa la publicación,
   las pujas existentes quedan registradas pero no se pueden hacer nuevas. Al reactivar,
   la subasta continúa desde donde estaba.

2. **Dos compradores intentan reservar simultáneamente.** El sistema debe usar una
   transacción con lock pesimista (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) al verificar
   y bloquear el stock para evitar condiciones de carrera.

3. **Subasta vence sin pujas.** La publicación vuelve a `ACTIVA` sin crear reserva.
   El vendedor puede extender la fecha límite o cambiar el precio base (editando la publicación).

4. **Oferta sobre publicación que luego pasa a modo VENDIDA.** Si la publicación se vende
   mientras hay una oferta `PENDIENTE`, esa oferta debe pasar automáticamente a `CANCELADA`.
   Esto se resuelve en el servicio de confirmación de reserva.
