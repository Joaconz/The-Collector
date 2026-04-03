# Arquitectura del Sistema — The Collector

## Estructura de capas del backend

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
