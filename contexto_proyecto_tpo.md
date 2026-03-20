# Contexto del Proyecto TPO — Aplicaciones Interactivas (3.4.082)

## Datos académicos

- **Materia:** Aplicaciones Interactivas
- **Código:** 3.4.082 | Clase 14792
- **Institución:** UADE — Facultad FAIN, Departamento DETIN
- **Año y cuatrimestre:** 2026 — 1er cuatrimestre
- **Modalidad:** Virtual
- **Clases sincrónicas:** Viernes de 18:30 a 21:30 hs

---

## Descripción del proyecto

**Nombre tentativo:** The Collector — Marketplace de coleccionables premium

Plataforma de e-commerce orientada a coleccionistas, donde usuarios pueden comprar y vender piezas únicas o de edición limitada: relojes vintage, joyería, arte, numismática y objetos de valor histórico.

Cada producto incluye una **narrativa descriptiva** ("historia del producto") que resalta su origen, características y relevancia, diferenciando la experiencia de un e-commerce genérico.

---

## Objetivo general

Desarrollar una aplicación web fullstack completa que incluya:

- Gestión de usuarios con roles (comprador y vendedor)
- Publicaciones de productos con stock limitado
- Catálogo con filtros por categoría, precio y estado
- Carrito de compras y proceso de checkout
- API REST en Spring Boot
- Frontend dinámico en React con estado global en Redux
- Autenticación y autorización con JWT

---

## Stack tecnológico (obligatorio por la materia)

| Capa | Tecnología |
|---|---|
| Backend | Java + Spring Boot |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | Relacional (MySQL / PostgreSQL) |
| Seguridad | JWT (JSON Web Tokens) |
| Frontend | React + Vite |
| Estado global | Redux Toolkit |
| Estilos | CSS / librería a definir |
| Testing de endpoints | Insomnia |

---

## Arquitectura

Aplicación de **3 capas** con arquitectura monolítica (requerimiento de la materia para el TPO):

```
Frontend (React + Redux)
        ↓ HTTP (Fetch / Promises)
Backend (Spring Boot — REST API)
        ↓ JPA / Hibernate
Base de datos relacional
```

---

## Modelo de datos (entidades principales)

### `Usuario`
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| nombre | String | |
| email | String | único |
| password | String | hasheado |
| rol | Enum | COMPRADOR / VENDEDOR |
| fechaRegistro | LocalDate | |

### `Producto`
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| nombre | String | |
| descripcion | String | |
| historia | String | narrativa del producto |
| precio | BigDecimal | |
| stock | Integer | limitado |
| categoria | Enum / String | relojes, joyería, arte, etc. |
| imagenUrl | String | |
| vendedor | Usuario | FK |

### `Publicacion`
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| producto | Producto | FK |
| vendedor | Usuario | FK |
| estado | Enum | ACTIVA / PAUSADA / VENDIDA |
| fechaPublicacion | LocalDate | |

### `Orden`
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| comprador | Usuario | FK |
| fecha | LocalDateTime | |
| total | BigDecimal | |
| estado | Enum | PENDIENTE / CONFIRMADA / CANCELADA |

### `OrdenItem`
| Campo | Tipo | Notas |
|---|---|---|
| id | Long | PK |
| orden | Orden | FK |
| producto | Producto | FK |
| cantidad | Integer | |
| precioUnitario | BigDecimal | precio al momento de la compra |

---

## Relaciones JPA

- `Usuario` → `Publicacion`: OneToMany (un vendedor puede tener muchas publicaciones)
- `Publicacion` → `Producto`: OneToOne
- `Orden` → `OrdenItem`: OneToMany
- `OrdenItem` → `Producto`: ManyToOne
- `Orden` → `Usuario` (comprador): ManyToOne

---

## Endpoints REST principales (API)

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login, devuelve JWT |

### Productos / Catálogo
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos (con filtros opcionales) |
| GET | `/api/productos/{id}` | Detalle de un producto |
| POST | `/api/productos` | Crear producto (solo VENDEDOR) |
| PUT | `/api/productos/{id}` | Editar producto (solo dueño) |
| DELETE | `/api/productos/{id}` | Eliminar producto (solo dueño) |

### Carrito / Órdenes
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/ordenes` | Mis órdenes (comprador autenticado) |
| POST | `/api/ordenes` | Crear orden (checkout) |
| GET | `/api/ordenes/{id}` | Detalle de una orden |

### Publicaciones
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/publicaciones` | Listar publicaciones activas |
| POST | `/api/publicaciones` | Crear publicación (VENDEDOR) |
| PUT | `/api/publicaciones/{id}` | Actualizar estado |

---

## Pantallas del frontend (React)

| Pantalla | Descripción |
|---|---|
| Home / Catálogo | Grilla de productos con filtros (categoría, precio, disponibilidad) |
| Detalle de producto | Imagen, historia, precio, stock, botón agregar al carrito |
| Carrito | Lista de ítems, totales, botón checkout |
| Checkout | Formulario de confirmación de compra |
| Login / Registro | Formulario de autenticación |
| Panel vendedor | Mis publicaciones, crear/editar productos |
| Mis órdenes | Historial de compras del comprador |

---

## Estado global con Redux (slice principales)

| Slice | Responsabilidad |
|---|---|
| `authSlice` | usuario autenticado, token JWT, rol |
| `catalogoSlice` | lista de productos, filtros activos |
| `carritoSlice` | ítems en el carrito, total |
| `ordenSlice` | órdenes del usuario |

---

## Entregas obligatorias del TPO

| # | Contenido | Fecha límite |
|---|---|---|
| 1 | Definición del modelo de datos y diseño de entidades JPA | 07/04 |
| 2 | Implementación de seguridad con JWT en la capa de acceso a datos | 22/04 |
| 3 | Maquetación visual del frontend (HTML/CSS/JS) | 20/05 |
| 4 | Maquetado de componentes y routing en React | 04/06 |
| 5 | Integración frontend y backend (Fetch + Promises) | 18/06 |
| 6 | Refactorización e integración de Redux | 02/07 |

**Examen parcial:** Sábado 13/06  
**Examen final regular:** Viernes 24/07

---

## Diferenciadores del proyecto

- **Historia del producto:** cada ítem tiene un campo narrativo que enriquece la experiencia y diferencia del e-commerce tradicional.
- **Stock limitado explícito:** el sistema refleja la exclusividad; al agotar stock, la publicación cambia de estado automáticamente.
- **Roles diferenciados:** la UX cambia según si el usuario es comprador o vendedor.
- **Catálogo curado:** enfoque en calidad y descripción por sobre cantidad.

---

## Notas para el agente de IA

- El backend se desarrolla en **Java con Spring Boot**. No sugerir Node.js, Django ni otros frameworks alternativos salvo que se consulte explícitamente.
- El frontend usa **React con Vite** y **Redux Toolkit**. No usar Angular, Vue ni Context API como reemplazo de Redux.
- La arquitectura es **monolítica** (no microservicios), aunque la materia introduce ambos conceptos teóricamente.
- La autenticación es con **JWT stateless**; no usar sesiones ni cookies de sesión.
- Las respuestas HTTP deben seguir buenas prácticas REST: códigos de estado correctos (200, 201, 400, 401, 403, 404, etc.).
- Priorizar claridad del código sobre optimizaciones prematuras: es un proyecto académico que también se evalúa en demo en vivo.
