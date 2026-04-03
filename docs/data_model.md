# Modelo de Datos — The Collector

## Entidades y relaciones

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

## Campos clave por entidad

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

## Reglas de negocio a respetar en el backend

- Al crear una `Reserva`, verificar que `publicacion.estado == ACTIVA` y `producto.stock > 0`.
- Al confirmar una `Reserva`, decrementar `producto.stock`. Si queda en 0, cambiar
  `publicacion.estado` a `VENDIDA`.
- Al rechazar o cancelar una `Reserva` con estado `PENDIENTE`, liberar el stock bloqueado.
- Al hacer checkout del carrito, verificar stock disponible antes de descontar.
- Un comprador no puede reservar su propia publicación.
- Un comprador no puede hacer oferta sobre una publicación propia.
- Solo el vendedor dueño de la publicación puede confirmar/rechazar reservas y ofertas.
