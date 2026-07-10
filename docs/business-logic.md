# Business Logic — The Collector

Este documento describe en detalle los flujos de negocio, los estados de cada entidad,
y las reglas que el backend hace cumplir hoy (verificadas contra `PublicacionService`,
`PujaService`, `OfertaService`, `ReservaService` y `CarritoService`). Es la fuente de verdad
para cualquier decisión de implementación en la capa de servicio.

---

## Roles y permisos

### Modelo de roles

The Collector usa un modelo de roles flexible. El rol inicial se elige al registrarse
(`Rol`: `COMPRADOR` o `VENDEDOR`), pero un usuario puede actuar en ambos contextos.

| Acción | COMPRADOR | VENDEDOR |
|---|---|---|
| Ver catálogo y detalle de pieza | ✅ | ✅ |
| Agregar a lista de deseos / carrito | ✅ | ✅ |
| Comprar / ofertar / pujar | ✅ | ✅ (en publicaciones ajenas) |
| Publicar piezas | ❌ (requiere rol VENDEDOR) | ✅ |
| Confirmar / rechazar reservas directas propias | ❌ | ✅ |
| Gestionar ofertas recibidas | ❌ | ✅ |
| Cerrar subasta propia | ❌ | ✅ |

`POST /api/publicaciones` exige `hasRole('VENDEDOR')` a nivel de controller. No hay endpoint
para que un `COMPRADOR` "actúe como vendedor" sin cambiar de rol registrado.

### Restricción absoluta

**Ningún usuario puede comprar, ofertar, ni pujar sobre sus propias publicaciones.** Esta
validación se hace en la capa de servicio (`PublicacionService`, `OfertaService`, `PujaService`,
`ReservaService`, `CarritoService`), comparando el `id` del vendedor de la publicación contra el
usuario autenticado.

---

## Modos de publicación

Cada publicación tiene un `modo` que se define al crearla y **no puede modificarse** una
vez publicada.

| Modo | Descripción |
|---|---|
| `PRECIO_FIJO` | Precio fijo con posibilidad de compra directa (carrito o reserva), o de oferta privada entre comprador y vendedor |
| `SUBASTA` | Precio base público, incremento mínimo, fecha límite; cualquier usuario autenticado puede pujar |

---

## Flujo 1: Compra directa vía Carrito (modo PRECIO_FIJO)

El camino más rápido: no genera `Reserva`, no requiere aprobación del vendedor.

```
COMPRADOR                          SISTEMA
    │                                  │
    ├─ Agrega piezas al carrito ──────►│  Verifica: publicacion.estado == ACTIVA,
    │                                  │  producto.stock > 0, comprador != vendedor,
    │                                  │  no está ya en el carrito
    ├─ Checkout ───────────────────────►│
    │                                  ├─ Por cada ítem: verifica estado/stock de nuevo
    │                                  ├─ Descuenta stock (-1) por ítem
    │                                  ├─ Si stock llega a 0 → publicación VENDIDA
    │                                  └─ Vacía el carrito
```

No hay entidad `Reserva` ni `Orden` involucrada en este camino: la transacción queda
representada únicamente por el descuento de stock.

---

## Flujo 2: Reserva directa (modo PRECIO_FIJO, requiere aprobación)

Alternativa a la compra vía carrito, iniciada desde el detalle de la pieza
("Solicitar Reserva Directa"). Es el único camino de `Reserva` que pasa por un estado
intermedio `PENDIENTE` a la espera del vendedor.

```
COMPRADOR                          SISTEMA                         VENDEDOR
    │                                  │                                │
    ├─ Compra directa ────────────────►│                                │
    │                                  ├─ Verifica: publicacion.estado == ACTIVA
    │                                  ├─ Verifica: producto.stock > 0
    │                                  ├─ Verifica: comprador != vendedor
    │                                  ├─ Verifica: modo == PRECIO_FIJO
    │                                  │  (en SUBASTA no se admiten reservas manuales)
    │                                  ├─ Verifica: no hay otra Reserva PENDIENTE
    │                                  │  del mismo comprador sobre la publicación
    │                                  ├─ Crea Reserva (origen=DIRECTA, estado=PENDIENTE)
    │◄─ Reserva creada ────────────────┤
    │                                  │                           Ve reserva pendiente
    │                                  │                           Confirma o Rechaza
    │                                  │◄───────────────────────────────┤
    │◄─ CONFIRMADA: descuenta stock,   │
    │   VENDIDA si stock llega a 0 ────┤
    │   o RECHAZADA: sin cambio de stock
```

**Importante:** el stock no queda "bloqueado" al crear la reserva — solo se verifica que sea
mayor a 0 en ese momento. El descuento real ocurre recién al confirmar. El código actual no
implementa ningún mecanismo de lock (pesimista u optimista) para evitar que dos compradores
reserven la última unidad en simultáneo; es una condición de carrera latente, no cubierta por
tests ni por lógica explícita.

---

## Flujo 3: Oferta privada (modo PRECIO_FIJO)

Negociación privada entre comprador y vendedor. Nadie más puede ver esta oferta. A diferencia
del flujo de reserva directa, **aceptar una oferta genera una reserva ya `CONFIRMADA`**: no hay
un segundo paso de aprobación del vendedor sobre la reserva resultante (el vendedor ya dio su
aprobación al aceptar la oferta).

```
COMPRADOR                          VENDEDOR
    │                                  │
    ├─ Hace oferta (precio X) ────────►│
    │  estado: PENDIENTE               │
    │                                 ├─ ACEPTA
    │                                 │   └─ Crea Reserva CONFIRMADA (precio = X, origen=OFERTA)
    │                                 │       Descuenta stock, VENDIDA si llega a 0
    │                                 ├─ RECHAZA
    │                                 │   └─ Oferta cerrada
    │                                 ├─ CONTRAOFERTA (precio Y)
    │◄─────────────────────────────────┤
    ├─ ACEPTA contraoferta             │
    │   └─ Crea Reserva CONFIRMADA (precio = Y, origen=OFERTA)
    ├─ CANCELA oferta                  │
    │   └─ Oferta cerrada             │
```

### Estados de Oferta

```
PENDIENTE ──► ACEPTADA      (vendedor acepta oferta original → Reserva CONFIRMADA)
          ──► RECHAZADA     (vendedor rechaza)
          ──► CONTRAOFERTA  (vendedor propone nuevo precio)
                 └──► ACEPTADA   (comprador acepta contraoferta → Reserva CONFIRMADA)
                 └──► CANCELADA  (comprador cancela)
          ──► CANCELADA     (comprador cancela antes de respuesta)
```

### Reglas de Oferta

- Solo aplica a publicaciones en modo `PRECIO_FIJO` y en estado `ACTIVA`.
- No puede haber más de una oferta en estado `PENDIENTE` o `CONTRAOFERTA` del mismo
  comprador sobre la misma publicación.
- El precio ofertado debe ser mayor a cero y **estrictamente menor** al precio publicado
  (`precioOfertado < producto.precio`; una oferta igual o mayor se rechaza con 422 — para pagar
  el precio de lista o más se usa el carrito/reserva directa, o la puja en subasta).
- La contraoferta del vendedor debe ser **mayor** al precio ofertado por el comprador y
  **menor** al precio de lista.
- Solo el vendedor dueño de la publicación puede responder (aceptar/rechazar/contraofertar)
  una oferta.
- Solo el comprador que hizo la oferta puede cancelarla o aceptar una contraoferta.
- Si no hay stock disponible al momento de aceptar (oferta o contraoferta), la aceptación falla.

---

## Flujo 4: Subasta pública (modo SUBASTA)

```
VENDEDOR                       SISTEMA                          PUJADORES
    │                              │                                  │
    ├─ Publica en modo SUBASTA ───►│                                  │
    │  precioBase, incrementoMinimo,                                  │
    │  fechaLimiteSubasta (≤ 3 meses desde hoy)                       │
    │                              │◄─ Puja (monto ≥ líder/base + incrementoMinimo) ─┤
    │                              │   Valida pujador != vendedor                    │
    │                              │   Valida subasta ABIERTA y no vencida           │
    │                              │   Registra puja                                 │
    │                              │                                                  │
    ├─ Cierra manualmente ────────►│                                                  │
    │  (o vence fechaLimiteSubasta,│
    │   detectado por job cada 60s)│
    │                              ├─ Adjudica de inmediato:
    │                              │   Si hay puja líder:
    │                              │     Crea Reserva CONFIRMADA (origen=SUBASTA, precio=monto)
    │                              │     Descuenta stock → publicación VENDIDA
    │                              │   Si no hubo pujas:
    │                              │     Publicación → PAUSADA
    │                              │   estadoSubasta → CERRADA
```

### Estados de Subasta

La subasta es un estado de la `Publicacion`, no una entidad separada. Se maneja mediante
campos adicionales en `Publicacion`:

| Campo | Tipo | Descripción |
|---|---|---|
| `modo` | Enum | `PRECIO_FIJO` o `SUBASTA` |
| `precioBase` | BigDecimal | Obligatorio en modo SUBASTA |
| `incrementoMinimo` | BigDecimal | Monto mínimo que cada nueva puja debe superar a la anterior |
| `fechaLimiteSubasta` | LocalDateTime | Fecha máxima de cierre (hasta 3 meses desde la publicación) |
| `estadoSubasta` | Enum | `ABIERTA`, `CERRADA` |
| `pujaActual` (calculado, no persistido) | BigDecimal | Monto de la puja líder, calculado en el `PublicacionResponseDTO` a partir del historial de `Puja` |

### Reglas de Subasta

- `fechaLimiteSubasta` no puede superar 3 meses (90 días) desde la fecha de creación.
- Cada nueva puja debe ser mayor o igual a `(puja líder actual o precioBase) + incrementoMinimo`.
- Un usuario no puede pujar sobre su propia subasta.
- No se puede pujar si la subasta no está `ABIERTA`, o si ya venció `fechaLimiteSubasta`.
- El vendedor puede cerrar la subasta en cualquier momento (`POST /{id}/cerrar-subasta`) antes
  de la fecha límite.
- Un job programado (`@Scheduled(fixedRate = 60000)`) cierra automáticamente las subastas
  cuya `fechaLimiteSubasta` ya pasó.
- **La adjudicación es inmediata y automática al cierre** (manual o por vencimiento): si hay
  puja líder se genera la `Reserva` ya `CONFIRMADA` y se descuenta el stock en el mismo paso; si
  no hubo pujas, la publicación pasa a `PAUSADA` (no vuelve a `ACTIVA` automáticamente — el
  vendedor debe reactivarla manualmente, por ejemplo cambiando el estado o editando la
  publicación). **No existe** un paso separado de "el vendedor confirma o rechaza la reserva de
  subasta": para cuando la reserva aparece en el panel del vendedor ya está `CONFIRMADA`.

---

## Flujo 5: Reserva (estados y transiciones)

La `Reserva` es la entidad central de la transacción. Su comportamiento depende del `origen`:

```
                    ┌─────────────┐
   origen=DIRECTA   │   PENDIENTE  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        CONFIRMADA      RECHAZADA   CANCELADA
       (vendedor)       (vendedor)  (comprador)

   origen=OFERTA / SUBASTA  →  nace directamente en CONFIRMADA
```

### Reglas de Reserva

| Transición | Quién | Efecto en stock |
|---|---|---|
| Crear reserva directa | Comprador | Ninguno todavía; solo se verifica `stock > 0` |
| Confirmar (solo origen DIRECTA) | Vendedor (dueño) | Stock decrementado. Si llega a 0 → publicación `VENDIDA` |
| Rechazar (solo origen DIRECTA) | Vendedor (dueño) | Ninguno (nunca se había descontado) |
| Cancelar (solo origen DIRECTA, mientras PENDIENTE) | Comprador | Ninguno |
| Oferta/contraoferta aceptada | Sistema (automático) | Stock decrementado en el mismo paso, ya `CONFIRMADA` |
| Cierre de subasta con puja líder | Sistema (automático) | Stock decrementado en el mismo paso, ya `CONFIRMADA` |

**Validaciones al crear una reserva directa (`POST /api/reservas`):**
- `publicacion.estado` debe ser `ACTIVA`.
- `producto.stock` debe ser mayor a 0.
- El comprador no puede ser el mismo usuario que el vendedor de la publicación.
- La publicación debe estar en modo `PRECIO_FIJO` (en modo `SUBASTA` no se admiten reservas
  manuales; solo se generan al cerrar la subasta).
- No puede existir otra reserva `PENDIENTE` del mismo comprador sobre la misma publicación.

---

## Lista de deseos (Favoritos) y Carrito

### Favoritos

- Un usuario no puede agregar la misma publicación dos veces (verificado en el service antes
  de insertar; también hay unique constraint implícita en el repositorio).
- Se puede agregar una publicación de cualquier modo (precio fijo o subasta).
- No hay reglas adicionales de negocio sobre favoritos (no afecta stock ni disponibilidad).

### Carrito

- Un ítem no puede agregarse dos veces al carrito del mismo comprador.
- No se puede agregar una publicación propia, pausada/vendida, o sin stock.
- El checkout descuenta stock por cada ítem y vacía el carrito; si algún ítem ya no está
  disponible al momento del checkout, toda la operación falla (no hay checkout parcial).
- El carrito no genera `Reserva`: es un camino de compra directo e inmediato, independiente
  del flujo de reservas.

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
| `fechaRegistro` | LocalDate | |

### Producto

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `activo` | Boolean | Soft-delete (`@SQLRestriction("activo = true")`) |
| `nombre` | String | |
| `descripcion` | String | |
| `historia` | Text | Narrativa larga, campo diferenciador |
| `precio` | BigDecimal | Precio de referencia (precio fijo o base de negociación) |
| `stock` | Integer | Típicamente 1 |
| `categoria` | Enum | `RELOJ`, `JOYERIA`, `ARTE`, `NUMISMATICA`, `OTRO` |
| `imagenUrl` | String | Imagen principal |
| `imagenes` | List\<String\> | Galería completa |
| `especificaciones` | Map\<String, String\> | Ficha técnica libre (clave → valor) |

### Publicacion

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `activo` | Boolean | Soft-delete |
| `producto` | Producto | OneToOne, cascade ALL |
| `vendedor` | Usuario | ManyToOne |
| `modo` | Enum | `PRECIO_FIJO`, `SUBASTA` |
| `estado` | Enum | `ACTIVA`, `PAUSADA`, `VENDIDA` |
| `destacado` | Boolean | Marca de destaque en catálogo/home |
| `precioBase` | BigDecimal | Solo modo SUBASTA |
| `incrementoMinimo` | BigDecimal | Solo modo SUBASTA |
| `fechaLimiteSubasta` | LocalDateTime | Solo modo SUBASTA |
| `estadoSubasta` | Enum | `ABIERTA`, `CERRADA` — solo modo SUBASTA |
| `fechaPublicacion` | LocalDateTime | |

### Puja

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `publicacion` | Publicacion | ManyToOne |
| `pujador` | Usuario | ManyToOne |
| `monto` | BigDecimal | Debe superar la puja anterior (o precioBase) por al menos `incrementoMinimo` |
| `fechaPuja` | LocalDateTime | |

La puja ganadora es siempre la de mayor `monto` sobre una publicación dada. No se borra
el historial de pujas al cerrar la subasta.

### Favorito

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne |
| `fechaAgregado` | LocalDateTime | |

### CarritoItem

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne |
| `fechaAgregado` | LocalDateTime | |

### Oferta

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne — solo modo PRECIO_FIJO |
| `precioOfertado` | BigDecimal | Estrictamente menor al precio de lista |
| `precioContraoferta` | BigDecimal | Nullable |
| `estado` | Enum | `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CONTRAOFERTA`, `CANCELADA` |
| `fechaOferta` | LocalDateTime | |

### Reserva

| Campo | Tipo | Notas |
|---|---|---|
| `id` | Long | PK |
| `comprador` | Usuario | ManyToOne |
| `publicacion` | Publicacion | ManyToOne |
| `precioAcordado` | BigDecimal | Precio final de la transacción |
| `estado` | Enum | `PENDIENTE`, `CONFIRMADA`, `RECHAZADA`, `CANCELADA` |
| `origen` | Enum | `DIRECTA`, `OFERTA`, `SUBASTA` |
| `oferta` | Oferta | Nullable FK — si vino de una oferta/contraoferta aceptada |
| `puja` | Puja | Nullable FK — si vino del cierre de una subasta |
| `fechaReserva` | LocalDateTime | |
| `fechaRespuesta` | LocalDateTime | Nullable — cuando queda resuelta (confirmación automática o manual) |

---

## Casos límite conocidos (estado real del código, no aspiracional)

1. **Concurrencia en reserva directa.** No hay lock pesimista ni optimista sobre `Producto` al
   crear o confirmar una reserva directa. Dos compradores podrían crear sendas reservas
   `PENDIENTE` sobre la última unidad; solo al confirmar la primera se descuenta stock, y la
   segunda confirmación fallaría porque el stock ya sería 0 — pero el service no valida
   explícitamente stock al confirmar, así que puede quedar en negativo si esto no se corrige.
2. **Publicación pausada durante una subasta activa.** El job de cierre automático solo filtra
   por `modo=SUBASTA`, `estadoSubasta=ABIERTA` y `fechaLimiteSubasta` vencida — no excluye
   publicaciones `PAUSADA`, por lo que una subasta pausada igual podría adjudicarse al vencer.
3. **Subasta vence sin pujas.** La publicación pasa a `PAUSADA` (no a `ACTIVA`). El vendedor
   debe reactivarla manualmente (`PATCH /estado`) o editarla para volver a intentarlo.
4. **Oferta sobre publicación vendida por otro camino.** Si la publicación se vende (vía
   carrito, reserva directa u otra oferta) mientras hay una oferta `PENDIENTE` de otro
   comprador, esa oferta **no** se cancela automáticamente; al intentar aceptarla más tarde,
   fallará por falta de stock.
