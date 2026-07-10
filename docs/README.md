# The Collector

Marketplace de coleccionables premium donde piezas únicas encuentran a sus próximos dueños.
Relojes vintage, joyería, arte, numismática: cada publicación es un objeto con historia,
no un producto genérico.

---

## Qué resuelve

El e-commerce tradicional está diseñado para productos en serie: muchas unidades, precio fijo,
compra inmediata. The Collector está diseñado para lo opuesto: piezas únicas o de edición muy
limitada donde el valor es subjetivo, la historia importa, y el precio es frecuentemente
negociable.

El sistema resuelve tres fricciones concretas del mercado de coleccionables:

1. **La exclusividad es real.** Cada publicación representa una pieza. El flujo está diseñado
   para que la adquisición se sienta como lo que es: única.

2. **El precio no siempre es fijo.** Un vendedor puede optar por precio fijo con negociación
   privada, o abrir una subasta pública. El comprador tiene herramientas para hacer una oferta
   y contraofertar sin que eso sea visible para el resto del mundo.

3. **La narrativa agrega valor.** Cada producto tiene un campo `historia` de texto libre donde
   el vendedor puede contar la procedencia, el contexto, la rareza de la pieza. Eso diferencia
   la experiencia de cualquier marketplace genérico.

---

## Roles de usuario

The Collector tiene un modelo de roles flexible: **cualquier usuario puede actuar como comprador
o como vendedor**. El rol se define al registrarse, pero no es permanente ni excluyente.

- Un **comprador** puede publicar piezas propias (actuando como vendedor).
- Un **vendedor** puede comprar piezas de otros vendedores.
- La única restricción absoluta es que **nadie puede comprar, ofertar ni pujar sobre sus propias
  publicaciones**. Esta validación se hace en la capa de servicio del backend.

---

## Modos de publicación

Cada publicación elige uno de dos modos al crearse (`modo`). No se puede cambiar de modo una vez
publicada.

### Modo Precio Fijo

El vendedor establece un precio. El comprador puede:

- **Comprar directamente**, por dos caminos posibles hoy en la app:
  - Agregar la pieza al **carrito** y hacer checkout: descuenta el stock de inmediato, sin
    intervención del vendedor.
  - Desde el detalle de la pieza, **"Solicitar Reserva Directa"**: crea una `Reserva` en estado
    `PENDIENTE` que el vendedor debe confirmar o rechazar antes de que se descuente el stock.
- Hacer una **oferta privada** con un precio menor al publicado. Esta negociación es visible
  únicamente para el comprador y el vendedor involucrados.
- El vendedor puede aceptar, rechazar, o contraofertar. **Al aceptarse un precio (por cualquiera
  de las partes), se genera automáticamente una `Reserva` ya `CONFIRMADA`** — no requiere un paso
  adicional de aprobación, el stock se descuenta en el acto.

### Modo Subasta

El vendedor establece un precio base, un incremento mínimo y una fecha límite (hasta 3 meses
desde la publicación). Cualquier visitante puede ver las pujas activas; cualquier usuario
autenticado (salvo el propio vendedor) puede pujar, siempre superando la puja anterior (o el
precio base) por al menos el incremento mínimo.

- La subasta puede cerrarse manualmente por el vendedor en cualquier momento, o se cierra
  **automáticamente** cuando vence la fecha límite (un job programado corre cada 60 segundos).
- Al cerrarse, el sistema **adjudica la subasta al instante**: si hubo pujas, genera una
  `Reserva` ya `CONFIRMADA` con el postor líder, descuenta el stock y marca la publicación como
  `VENDIDA`. Si no hubo pujas, la publicación pasa a `PAUSADA`. No hay un paso posterior de
  confirmación/rechazo por parte del vendedor.

---

## Reglas de negocio

### Reservas

Una `Reserva` representa una transacción. Puede originarse de tres formas (`origen`):
`DIRECTA` (solicitud manual del comprador), `OFERTA` (oferta o contraoferta aceptada), o
`SUBASTA` (cierre de subasta con postor ganador).

- **Solo las reservas de origen `DIRECTA` pasan por un estado `PENDIENTE`** que el vendedor debe
  confirmar o rechazar. Las de origen `OFERTA` y `SUBASTA` nacen ya `CONFIRMADA`s, con el stock
  ya descontado.
- Al **confirmar** una reserva `PENDIENTE`, se descuenta el stock definitivamente; si llega a 0,
  la publicación pasa a `VENDIDA`.
- Si se **rechaza** o **cancela** una reserva `PENDIENTE`, no hay stock que liberar (nunca se
  bloqueó: solo se verificó su disponibilidad al momento de crear la reserva).
- Un comprador puede cancelar su propia reserva mientras esté en estado `PENDIENTE`.

### Ofertas privadas (modo Precio Fijo)

- Solo el comprador y el vendedor involucrados pueden ver la oferta.
- El precio ofertado debe ser **estrictamente menor** al precio publicado.
- El vendedor puede aceptar, rechazar, o contraofertar con un precio distinto (debe ser mayor a
  la oferta original y menor al precio de lista).
- El comprador puede aceptar la contraoferta o cancelar la oferta.
- Aceptar una oferta (en cualquier dirección) genera de inmediato una `Reserva` `CONFIRMADA`.
- No puede haber más de una oferta `PENDIENTE` o `CONTRAOFERTA` del mismo comprador sobre la
  misma publicación.

### Pujas (modo Subasta)

- Cada puja debe superar la puja líder actual (o el precio base si no hubo pujas) por al menos
  el `incrementoMinimo` de la publicación.
- Un usuario no puede pujar sobre su propia subasta.
- Al cierre (manual o por vencimiento), la reserva se genera automáticamente con el precio de la
  puja ganadora, ya `CONFIRMADA`.

### Lista de deseos (Favoritos) y Carrito

- El comprador puede guardar publicaciones en su lista de deseos (`Favorito`); no se puede
  agregar la misma publicación dos veces.
- El **carrito** (`CarritoItem`) permite juntar varias piezas de precio fijo y hacer checkout de
  todas juntas, descontando stock inmediatamente sin generar `Reserva`. El backend (`/api/carrito`)
  y el estado Redux (`features/carrito`) están implementados, pero **actualmente no hay página ni
  ruta en el frontend** que exponga esta funcionalidad al usuario.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 17 + Spring Boot 4 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL (`thecollectordb`) |
| Seguridad | Spring Security + JWT stateless (Bearer token, 24 hs por defecto) |
| Frontend | React 19 + Vite |
| Estilos | Tailwind CSS 4 (plugin Vite) |
| Estado global | Redux Toolkit + redux-persist |
| Cliente HTTP | Axios |
| Routing | React Router 7 |
| UI / feedback | Framer Motion (animaciones), Sonner (toasts) |
| Testing backend | JUnit 5 + Spring Boot Test |
| Formato de código backend | Spotless (Google Style) |

> No hay suite de testing automatizado en el frontend (no hay Vitest ni React Testing Library
> instalados a la fecha).

---

## Estructura del repositorio

```
The Collector/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── docs/
│   ├── README.md            # Este archivo
│   ├── api.md                # Referencia de endpoints REST
│   ├── architecture.md       # Capas, comunicación frontend ↔ backend
│   ├── business-logic.md     # Flujos detallados, estados, reglas por entidad
│   ├── data_model.md         # Entidades, campos y relaciones
│   └── guide.md               # Setup de entorno de desarrollo
├── backend/
│   └── src/main/java/com/uade/tpo/thecollector/backend/
│       ├── controller/        # AuthController, PublicacionController, CarritoController,
│       │                      # FavoritoController, ReservaController, OfertaController,
│       │                      # StatusController
│       ├── service/            # Lógica de negocio (Auth, Publicacion, Puja, Carrito,
│       │                      # Favorito, Reserva, Oferta, Jwt)
│       ├── repository/         # Spring Data JPA
│       ├── model/              # Entidades JPA + enums de estado
│       ├── dto/                 # <Entidad>RequestDTO / <Entidad>ResponseDTO por dominio
│       ├── exception/           # ResourceNotFoundException + GlobalExceptionHandler
│       └── config/               # WebSecurityConfig, JwtAuthenticationFilter, etc.
└── frontend/
    └── src/
        ├── pages/               # Una página por ruta
        ├── components/          # cards/, forms/, layout/, ui/
        ├── features/             # Redux Toolkit por dominio: auth, publicaciones, favoritos,
        │                       # ofertas, reservas, subastas, carrito (slice + thunks)
        ├── services/              # Llamadas HTTP (Axios) por dominio
        ├── store/                  # configureStore + redux-persist
        ├── hooks/                   # useCountdown, useFavoritos
        ├── routes/                   # AppRouter
        ├── utils/                     # adapters.js (mapeos backend ↔ frontend)
        └── data/                       # mockData.js (constantes de dominio)
```

Para detalles de configuración del entorno de desarrollo, ver [`docs/guide.md`](guide.md) y
`CLAUDE.md`.

---

## Documentación adicional

- [`docs/api.md`](api.md) — Referencia completa de endpoints REST.
- [`docs/architecture.md`](architecture.md) — Decisiones de arquitectura, capas del sistema,
  páginas del frontend.
- [`docs/business-logic.md`](business-logic.md) — Flujos completos, diagramas de estados,
  reglas de negocio detalladas por entidad.
- [`docs/data_model.md`](data_model.md) — Entidades, campos y relaciones.
