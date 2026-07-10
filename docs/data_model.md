# Modelo de Datos — The Collector

## Entidades y relaciones

```
Usuario         → Publicacion   : OneToMany  (un vendedor tiene muchas publicaciones)
Usuario         → Favorito      : OneToMany  (lista de deseos del comprador)
Usuario         → CarritoItem   : OneToMany  (carrito del comprador)
Usuario         → Reserva       : OneToMany  (como comprador)
Usuario         → Oferta        : OneToMany  (como comprador)
Usuario         → Puja          : OneToMany  (como pujador)
Publicacion     → Producto      : OneToOne   (cascade ALL)
Publicacion     → Reserva       : OneToMany
Publicacion     → Oferta        : OneToMany
Publicacion     → Puja          : OneToMany  (solo modo SUBASTA)
Publicacion     → Favorito      : OneToMany
Publicacion     → CarritoItem   : OneToMany
Reserva         → Oferta        : ManyToOne  (nullable — reserva puede venir de una oferta/contraoferta aceptada)
Reserva         → Puja          : ManyToOne  (nullable — reserva puede venir del cierre de una subasta)
```

`Producto` y `Publicacion` implementan **soft-delete**: tienen un campo `activo` (Boolean) y
`@SQLRestriction("activo = true")`, por lo que las filas dadas de baja quedan en la base pero
no aparecen en ninguna query de Spring Data JPA.

## Campos clave por entidad

**Usuario:** `id`, `nombre`, `email` (único), `password` (BCrypt), `rol` (`COMPRADOR`/`VENDEDOR`),
`fechaRegistro` (LocalDate)

**Producto:** `id`, `activo` (soft-delete), `nombre`, `descripcion`, `historia` (TEXT), `precio`
(BigDecimal), `stock` (Integer), `categoria` (Enum: `RELOJ`, `JOYERIA`, `ARTE`, `NUMISMATICA`,
`OTRO`), `imagenUrl`, `imagenes` (List\<String\>), `especificaciones` (Map\<String, String\>)

**Publicacion:** `id`, `activo` (soft-delete), `producto`, `vendedor`, `modo`
(`PRECIO_FIJO`/`SUBASTA`), `estado` (`ACTIVA`/`PAUSADA`/`VENDIDA`), `destacado` (Boolean),
`precioBase` (solo SUBASTA), `incrementoMinimo` (solo SUBASTA), `fechaLimiteSubasta` (solo
SUBASTA), `estadoSubasta` (`ABIERTA`/`CERRADA`, solo SUBASTA), `fechaPublicacion`

**Puja:** `id`, `publicacion`, `pujador`, `monto` (BigDecimal), `fechaPuja`
— la puja ganadora es siempre la de mayor `monto` sobre una publicación; el historial no se
borra al cerrar la subasta.

**Favorito:** `id`, `comprador`, `publicacion`, `fechaAgregado`
— Un comprador no puede agregar la misma publicación dos veces.

**CarritoItem:** `id`, `comprador`, `publicacion`, `fechaAgregado`
— Un comprador no puede agregar la misma publicación dos veces; el checkout lo elimina.

**Oferta:** `id`, `comprador`, `publicacion`, `precioOfertado`, `precioContraoferta`
(nullable), `estado` (`PENDIENTE`/`ACEPTADA`/`RECHAZADA`/`CONTRAOFERTA`/`CANCELADA`),
`fechaOferta`

**Reserva:** `id`, `comprador`, `publicacion`, `precioAcordado`, `estado`
(`PENDIENTE`/`CONFIRMADA`/`RECHAZADA`/`CANCELADA`), `origen`
(`DIRECTA`/`OFERTA`/`SUBASTA`), `oferta` (nullable FK), `puja` (nullable FK), `fechaReserva`,
`fechaRespuesta` (nullable)

## Reglas de negocio a respetar en el backend

- Al crear una `Reserva` de origen `DIRECTA`, verificar `publicacion.estado == ACTIVA`,
  `producto.stock > 0`, `modo == PRECIO_FIJO` y que no exista ya otra `Reserva` `PENDIENTE`
  del mismo comprador sobre la misma publicación.
- Al confirmar una `Reserva` `PENDIENTE`, decrementar `producto.stock`. Si queda en 0, cambiar
  `publicacion.estado` a `VENDIDA`.
- Las reservas originadas en una `Oferta` aceptada o en el cierre de una `Subasta` se crean
  **directamente en estado `CONFIRMADA`**, con el stock ya decrementado en el mismo paso — no
  pasan por `PENDIENTE`.
- Al hacer checkout del carrito, verificar estado/stock de cada ítem y descontar stock por
  ítem; no se crea `Reserva` en este camino.
- Al cerrar una subasta (manual o por vencimiento de `fechaLimiteSubasta`), si hay puja líder se
  adjudica de inmediato (Reserva `CONFIRMADA`, stock descontado, publicación `VENDIDA`); si no
  hubo pujas, la publicación pasa a `PAUSADA`.
- Un comprador no puede reservar, ofertar, pujar ni agregar al carrito su propia publicación.
- El precio ofertado debe ser estrictamente menor al precio de lista; la contraoferta debe ser
  mayor a la oferta original y menor al precio de lista.
- Cada puja debe superar la puja líder (o el precio base) en al menos `incrementoMinimo`.
- Solo el vendedor dueño de la publicación puede confirmar/rechazar reservas directas y
  responder ofertas; solo el comprador involucrado puede cancelar su reserva/oferta o aceptar
  una contraoferta.
