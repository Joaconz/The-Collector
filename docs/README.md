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

1. **La exclusividad es real.** Cada publicación representa una pieza. No hay "agregar al
   carrito y pedir 3". El flujo está diseñado para que la adquisición se sienta como lo que es:
   única.

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
- La única restricción absoluta es que **nadie puede comprar sus propias publicaciones**.

---

## Modos de publicación

Cada publicación elige uno de dos modos al crearse. No se puede cambiar de modo una vez
publicado.

### Modo Precio Fijo

El vendedor establece un precio. El comprador puede:

- Comprarlo directamente al precio publicado (genera una reserva).
- Hacer una oferta privada con un precio distinto. Esta negociación es visible únicamente
  para el comprador y el vendedor involucrados. Nadie más sabe que existe.
- El vendedor puede aceptar, rechazar, o contraofertar. Si cualquiera de las partes acepta
  un precio, se genera una reserva automáticamente con ese precio acordado.

### Modo Subasta

El vendedor establece un precio base y abre la subasta al público. Cualquier visitante
puede ver las pujas activas. Cualquier usuario autenticado puede pujar, siempre superando
la puja anterior.

- La subasta puede cerrarse en cualquier momento por el vendedor, con un límite máximo
  de 3 meses desde su apertura.
- Al cerrarse (ya sea por el vendedor o por vencimiento del plazo), se genera una reserva
  automática con el mayor postor.
- El vendedor confirma o rechaza esa reserva. Si la rechaza, la publicación vuelve al
  estado activo sin ganador.

---

## Reglas de negocio

### Reservas

Una reserva representa la intención de compra formal. Puede originarse de tres formas:
compra directa a precio fijo, oferta privada aceptada, o cierre de subasta.

- Al crearse una reserva, el stock de la pieza queda **bloqueado** para otros compradores.
- La reserva pasa por estados: `PENDIENTE → CONFIRMADA | RECHAZADA | CANCELADA`.
- Solo al **confirmarse** se descuenta el stock definitivamente y la publicación pasa a
  estado `VENDIDA`.
- Si se rechaza o cancela, el stock se libera y la publicación vuelve a estar disponible.
- Un comprador puede cancelar su propia reserva mientras esté en estado `PENDIENTE`.

### Ofertas privadas (modo Precio Fijo)

- Solo el comprador y el vendedor involucrados pueden ver la oferta.
- El vendedor puede aceptar, rechazar, o contraofertar con un precio distinto.
- El comprador puede aceptar la contraoferta o cancelar la oferta.
- Una oferta aceptada (en cualquier dirección) genera una reserva automáticamente.
- No puede haber más de una oferta activa del mismo comprador sobre la misma publicación.

### Pujas (modo Subasta)

- Cada puja debe superar el precio base o la puja anterior.
- Un usuario no puede pujar sobre su propia subasta.
- Al cierre, la reserva se genera automáticamente con el precio de la puja ganadora.
- Si no hubo ninguna puja al momento del cierre, no se genera reserva.

### Lista de deseos

- El comprador puede guardar publicaciones en su lista de deseos.
- Desde la lista puede iniciar una compra directa, una oferta, o participar en una subasta.
- No se puede agregar la misma publicación dos veces.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Java 17 + Spring Boot 3 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL |
| Seguridad | JWT stateless (Bearer token, 24 hs) |
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Estado global | Redux Toolkit |
| Testing backend | JUnit 5 + Mockito |
| Testing frontend | Vitest + React Testing Library |

---

## Estructura del repositorio

```
The Collector/
├── README.md
├── AGENTS.md
├── docs/
│   ├── business-logic.md   # Flujos detallados, estados, reglas por entidad
│   └── architecture.md     # Capas, comunicación frontend ↔ backend
├── backend/
│   └── src/
│       ├── main/java/com/The Collector/
│       │   ├── auth/
│       │   ├── usuario/
│       │   ├── producto/
│       │   ├── publicacion/
│       │   ├── reserva/
│       │   ├── oferta/
│       │   ├── puja/
│       │   ├── favorito/
│       │   └── config/
│       └── resources/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── store/
        ├── services/
        ├── hooks/
        └── routes/
```

Para detalles de configuración del entorno de desarrollo, ver `AGENTS.md`.

---

## Documentación adicional

- [`docs/business-logic.md`](docs/business-logic.md) — Flujos completos, diagramas de estados,
  reglas de negocio detalladas por entidad.
- [`docs/architecture.md`](docs/architecture.md) — Decisiones de arquitectura, capas del sistema,
  patrones aplicados.
