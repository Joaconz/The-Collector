# The Collector — Guia de Exposicion Oral

> Este documento es la **guia practica para la demo y el discurso**: que mostrar, en que orden, y que decir. Para justificar decisiones tecnicas en profundidad si el docente indaga, ver [CONOCIMIENTO_TECNICO.md](CONOCIMIENTO_TECNICO.md).

**Duracion objetivo: 15 minutos — dividida entre 6 personas (~2:30 min c/u)**

---

## ESTRUCTURA GENERAL Y REPARTO DE ORADORES

| # | Bloque | Tema | Tiempo | Orador |
|---|---|---|---|---|
| 1 | Bloque 1 | Introduccion y contexto del proyecto | ~2 min | **FEDE C** |
| 2 | Bloque 2a | Recorrido frontend — Home y Navegacion | ~2:30 min | **IÑAKI** |
| 3 | Bloque 2b | Recorrido frontend — Catalogo y Detalle de pieza | ~2:30 min | **SANTI** |
| 4 | Bloque 3a | Workflow del Comprador (Reserva, Oferta, Subasta) | ~2:30 min | **TOMI** |
| 5 | Bloque 3b | Workflow del Vendedor (Panel, Sala de Subasta) | ~2:30 min | **FEDE M** |
| 6 | Bloque 4 + 5 | Arquitectura + Seguridad + Oportunidades + Cierre | ~3 min | **JOAQUIN** |

> **Como usar esto:** cada persona lee SOLO su bloque antes de la exposicion, pero conviene que todos lean por lo menos el Bloque 1 (para tener el contexto general) y el propio. Las frases de transicion al final del documento sirven para pasarse la posta sin cortes incomodos. Practiquen al menos una vez los "handoffs" entre bloques — son los momentos donde mas se nota si el grupo ensayo o no.

---

## BLOQUE 1 — Introduccion (PERSONA 1, ~2 min)

"**The Collector** es un marketplace premium especializado en piezas de coleccion de alto valor: relojes de alta gama, joyeria, arte y numismatica.

La idea de negocio es crear una plataforma con estetica editorial y de lujo, que soporta **tres formas de transaccion distintas** — precio fijo con reserva directa, ofertas privadas con negociacion, y subastas en vivo.

Tecnicamente, pusimos un foco muy fuerte en la experiencia de usuario y el desarrollo del frontend:
- **Frontend en React 18 con Vite y Tailwind CSS**, disenado con una interfaz inmersiva, transiciones premium con Framer Motion, animaciones personalizadas basadas en scroll y una organizacion de componentes altamente reutilizables.
- **Backend en Java 17 con Spring Boot**, que provee la logica de negocio y seguridad en capas (controller/service/repository) lista para integrarse. Para la demo de hoy, el frontend cuenta con datos mockizados en un service local que simula todo el ciclo transaccional y de estados de manera fluida.

El sistema cuenta con flujos y paneles optimizados para dos roles principales: **COMPRADOR** y **VENDEDOR**, los cuales permiten gestionar desde favoritos y ofertas hasta un panel de negociacion interactivo."

---

## BLOQUE 2a — Recorrido del frontend: Home y Navegacion (PERSONA 2, ~2:30 min)

> *Abrir el navegador en `http://localhost:5173` antes de empezar (`cd frontend && npm run dev`).*

### Home (`/`)

"La primera pantalla que ve cualquier usuario es el **Home**. Decidimos darle una estetica editorial, de lujo — algo que comunique que esto no es un Mercado Libre.

Hay un hero, un marquee decorativo de fondo, y secciones inmersivas para cada categoria con imagenes y texto alternados.

*(scrollear lentamente para mostrar las animaciones)*

Todo esto esta construido con componentes de animacion reutilizables propios: `ScrollReveal`, `StaggerReveal`, `ParallaxImage` y `Marquee`. Para las animaciones complejas (drawer, modales) usamos Framer Motion; para el scroll-reveal usamos `IntersectionObserver` nativo del browser."

---

### Navbar y drawer

"La navegacion es mediante un **drawer lateral** que se abre desde el icono de menu (esquina superior izquierda). Tiene animacion de entrada con Framer Motion, bloquea el scroll del body mientras esta abierto, y cierra con la tecla Escape.

*(abrir el drawer y mostrar como cambia el contenido segun si hay sesion iniciada)*

Si no hay sesion, muestra las opciones publicas (Inicio, Catalogo, Categorias, Iniciar Sesion). Si hay un **comprador** logueado, aparecen los accesos a Favoritos, Mis Reservas y Mis Ofertas. Si es **vendedor**, aparece Panel de Control, Nueva Publicacion e Historial de Ventas. El footer del drawer muestra el avatar, nombre, email y rol del usuario actual."

> *Transicion sugerida hacia Persona 3: "Ahora les muestro el catalogo y como es ver una pieza en detalle."*

---

## BLOQUE 2b — Recorrido del frontend: Catalogo y Detalle de pieza (PERSONA 3, ~2:30 min)

### Catalogo (`/catalogo`)

"El catalogo tiene una experiencia inmersiva con **scroll snap**: cada pieza ocupa toda la pantalla con su imagen, descripcion, especificaciones destacadas y precio — en vez de un grid tradicional de tarjetas chiquitas.

*(scrollear para mostrar el snap entre piezas)*

Arriba hay una barra de filtros: por **categoria** (Relojes, Joyeria, Arte, Numismatica), por **modo** (Precio Fijo / Subasta), y un buscador por texto. A la derecha hay dots de navegacion rapida entre piezas.

*(aplicar un filtro de categoria para mostrar que funciona, y tocar el corazon para marcar un favorito)*"

---

### Detalle de pieza (`/publicaciones/:id`)

"Al hacer click en 'VER PIEZA COMPLETA' se va al detalle. Dependiendo del modo de venta de la publicacion, el panel de transaccion cambia:
- **Precio fijo**: boton de 'SOLICITAR RESERVA DIRECTA' y boton de 'HACER OFERTA PRIVADA'.
- **Subasta**: muestra la puja lider actual, tiempo restante, y un formulario para registrar una nueva puja con validacion de incremento minimo.

*(ir a una pieza de precio fijo y otra de subasta para mostrar ambos layouts)*

Las acciones economicas abren **modales de confirmacion transaccional** — antes de confirmar cualquier operacion, el sistema muestra exactamente que va a pasar: pieza, vendedor, precio, tipo de operacion. Esto evita clicks accidentales en transacciones de alto valor."

> *Transicion sugerida hacia Persona 4: "Ahora vamos a ver estos botones en accion, desde el lado del comprador."*

---

## BLOQUE 3a — Workflow del Comprador (PERSONA 4, ~2:30 min)

> *Loguear como comprador (usuario mock: Joaquin Gonzalez, rol COMPRADOR).*

**Hacer una reserva directa:**
"El comprador entra al detalle de una pieza de precio fijo y hace click en 'SOLICITAR RESERVA DIRECTA'. Se abre el modal de confirmacion con los datos de la operacion. Al confirmar, la reserva queda registrada con estado **PENDIENTE** y el usuario es redirigido a `/reservas`.

*(mostrar `/reservas` — el `ReservaCard` muestra la pieza, el precio acordado, el estado y la fecha)*"

---

**Hacer una oferta y negociar:**
"Si en cambio el comprador quiere negociar el precio, hace click en 'HACER OFERTA PRIVADA'. Se abre el `OfertaModal` donde ingresa el monto — siempre tiene que ser menor al precio publicado, el backend lo valida y rechaza si no se cumple.

La oferta queda en estado **EN_REVISION**. El vendedor puede aceptarla, rechazarla o hacer una contraoferta.

Si el vendedor contraoferta, el comprador lo ve en `/ofertas` con el `OfertaCard`, viendo el precio original, su oferta y la contraoferta lado a lado, y puede aceptarla o cancelarla.

*(mostrar la pagina de ofertas con una oferta en estado CONTRAOFERTA_RECIBIDA)*"

---

**Participar en una subasta (pujas):**
"Para las piezas publicadas bajo la modalidad de subasta, la experiencia de compra cambia. El usuario ve la puja lider actual, el historial de ofertas y el tiempo restante.
Al decidir participar, ingresa un monto. El frontend valida en tiempo real que la puja propuesta sea mayor a la puja lider actual mas un incremento minimo. Tras hacer click en 'REALIZAR PUJA', se abre el `ConfirmModal` y, al confirmar, la nueva puja se registra en el log y el sistema actualiza la puja lider y el pujador actual al instante de forma reactiva.

*(ir al detalle de una subasta activa, ingresar una puja valida y confirmarla para mostrar la actualizacion inmediata del panel)*"

> *Transicion sugerida hacia Persona 5: "Veamos ahora la otra cara de la moneda: como ve y gestiona estas acciones el vendedor en su panel operativo."*

---

## BLOQUE 3b — Workflow del Vendedor (PERSONA 5, ~2:30 min)

> *Loguear como vendedor (usuario mock: Aura Dolce Galeria, rol VENDEDOR).*

"El vendedor tiene un **Panel de Control** (`/vendedor`) que es su hub operativo. Tiene tres secciones principales:

1. **Solicitudes de Reserva Directa pendientes** — tarjetas con la pieza y el precio, con botones de check (confirmar) y X (rechazar). Al confirmar, en el backend real se descuenta el stock del producto y, si llega a cero, la publicacion pasa a estado VENDIDA.
2. **Propuestas de Oferta Privada recibidas** — botones de 'REVISAR' que abren el `NegociarModal`, donde el vendedor elige: ACEPTAR, RECHAZAR o CONTRAOFERTAR con un monto especifico. El modal muestra en tiempo real la diferencia entre el precio de lista, la oferta del comprador y la contraoferta que se esta armando.
3. **Tabla de publicaciones consignadas** — con el estado de cada una (Badge de color), el modo de venta (Subasta / Precio Fijo), y accesos rapidos a 'EDITAR DETALLES' y, si es subasta activa, 'SALA EN VIVO'.

*(mostrar el panel, abrir el NegociarModal y elegir CONTRAOFERTAR para ver el input animado)*

---

**Gestion de subastas en tiempo real (Sala en Vivo):**
"Para las subastas activas, el vendedor cuenta con una vista dedicada en `/vendedor/:id/subasta` — la `GestionSubastaPage` o **Sala en Vivo**.
Esta pantalla funciona como el panel de control del martillero en tiempo real: muestra la pieza actual, la puja lider y un historial cronologico de las pujas recibidas. Para fines de la demo academica, incluimos un **simulador integrado** que permite recibir ofertas automaticas simuladas de otros usuarios para ver como el feed del frontend reacciona en vivo.

*(ir a la Sala en Vivo de una subasta y activar el simulador de pujas para demostrar la reactividad de la UI)*

El vendedor tambien puede crear nuevas publicaciones en `/vendedor/nueva` (formulario de 2 pasos: detalles del producto → modo y precio) y editarlas en `/vendedor/:id/editar`, y ver su historial de ventas completadas en `/vendedor/historial` con estadisticas y comisiones."

> *Transicion sugerida hacia Persona 6: "Para cerrar, Joaquin nos va a contar como manejamos la seguridad y proteccion de estas vistas en el codigo, ademas de la arquitectura general."*

---

## BLOQUE 4 — Organizacion del codigo, arquitectura y seguridad (PERSONA 6, parte 1 de 3, ~1:30 min)

> *Mostrar el IDE o el explorador de archivos mientras se habla.*

### Seguridad de rutas (Doble Capa)

"Un pilar fundamental de la aplicacion es la seguridad de los flujos y rutas, implementada tanto en el cliente como en el servidor:

- **En el Frontend (`AppRouter.jsx`)**: Protegemos las rutas del lado del cliente mediante guardas reactivos. Si un usuario intenta acceder a `/vendedor` sin el rol correspondiente, o a `/reservas` u `/ofertas` sin sesion activa, es redirigido inmediatamente al login.
- **En el Backend (Doble validacion)**: Primero, `WebSecurityConfig` exige un JWT valido en cada endpoint privado. Segundo, en la capa de **Service**, validamos en tiempo de ejecucion el ownership. Por ejemplo, `OfertaService` valida que solo el vendedor real de la publicacion pueda aceptar o contraofertar, y solo el comprador dueño de la oferta pueda cancelarla.

Esto significa que aunque alguien intente vulnerar la interfaz enviando un request directo via Postman o curl, el backend rechazara la operacion si no tiene el rol o el ownership adecuado."

---

### Arquitectura del backend

"Para el backend optamos por una arquitectura de **tres capas estrictas** (`controller → service → repository`). Los controllers solo se encargan del mapeo HTTP, delegando toda la logica y validaciones a los servicios, mientras que los repositorios interactuan con la base de datos a traves de Spring Data JPA. El contrato de la API se maneja integramente mediante DTOs para nunca exponer las entidades de base de datos directamente."

---

### Arquitectura del frontend

"En el frontend, la arquitectura esta disenada para lograr una aplicacion modular, escalable y altamente interactiva:

- **Estructura de Directorios**:
  - **`pages/`** (15 vistas en total): Cada pagina funciona como un componente orquestador que maneja el estado local y define el flujo de la ruta.
  - **`components/`**: Separados de forma jerarquica en `ui/` para atomos de diseño y componentes genericos (Button, Badge, modales), `cards/` para componentes de dominio (ReservaCard, OfertaCard) y `forms/` para modales transaccionales (OfertaModal, NegociarModal).
  - **`data/mockData.js`**: Funciona como un motor de base de datos local en memoria. Centraliza todas las colecciones de prueba y las funciones mutadoras, simulando el comportamiento transaccional del backend.

- **Gestion de Estado (Single Source of Truth)**:
  El estado transaccional global (usuario autenticado, favoritos, reservas, ofertas y pujas) se centraliza en `App.jsx` mediante `useState`. Este se distribuye reactivamente por props a traves del router (`AppRouter.jsx`). Aunque contamos con Redux Toolkit instalado para futuras integraciones asincronicas reales, decidimos mantener este flujo reactivo directo para evitar boilerplate innecesario mientras trabajamos con datos mock.

- **Diseño y Animaciones Premium**:
  Buscamos una experiencia inmersiva de lujo sin comprometer el rendimiento. Combinamos **Tailwind CSS** para un estilo consistente con **Framer Motion** para transiciones fluidas de overlays (como el drawer del navbar y modales). Para las animaciones de revelacion por scroll, creamos envoltorios personalizados (`ScrollReveal`, `StaggerReveal`) basados en la API nativa `IntersectionObserver` del navegador, evitando depender de librerias externas pesadas."

---

## BLOQUE 5 — Oportunidades de mejora (PERSONA 6, parte 2 de 3, ~1 min)

"Si tuvieramos mas tiempo, identificamos mejoras concretas, en orden de prioridad:

1. **Conectar el frontend al backend real.** Hoy el frontend usa datos mock en `mockData.js`. El backend ya tiene todos los endpoints de dominio funcionando con sus validaciones. La integracion es mecanica: crear una capa `services/` con `api.js` que inyecte el JWT, y reemplazar las funciones de `mockData` por `fetch` reales.

2. **Cierre automatico de subastas.** Actualmente el tiempo restante de una subasta es informativo y las pujas se registran manualmente, pero no hay un proceso que cierre la subasta al vencer `fechaLimiteSubasta` y genere la reserva del ganador automaticamente. Requeriria un scheduler (`@Scheduled`) en el backend.

3. **Vista de subastas del comprador.** Nos falto desarrollar un panel centralizado para que el comprador pueda realizar un seguimiento en tiempo real de todas las subastas en las que esta participando activamente (ver si sigue siendo el lider, tiempo restante, etc.), similar a la consola que tiene el vendedor.

4. **Tests.** No hay tests unitarios de los services ni tests de componentes en el frontend. Las validaciones de negocio (como las de `OfertaService`) son candidatas ideales para tests con Mockito.

Con eso, el sistema estaria listo para un deploy real."

---

## CIERRE (PERSONA 6, parte 3 de 3)

"En resumen: **The Collector** tiene un dominio de negocio completo con logica no trivial — tres modos de transaccion, negociacion en multiples pasos, subastas, control de acceso por rol y por ownership —, todo implementado de forma coherente tanto en el backend como en el frontend.

¿Alguna pregunta?"

> *Las preguntas del docente las puede responder cualquiera, pero conviene que cada uno tenga preparada al menos la parte de [CONOCIMIENTO_TECNICO.md](CONOCIMIENTO_TECNICO.md) que corresponde a su bloque (ver tabla de reparto al inicio de este documento).*

---

## DEMO PRESENTACION

### 🟢 PASO 1: Navegación Pública (Sin sesión)
1. **Abrir navegador** en `http://localhost:5173`.
2. **Home (`/`)**: Haz un scroll lento hacia abajo para mostrar los efectos visuales y las animaciones de revelado (`ScrollReveal`).
3. **Drawer (Menú)**: Toca el icono de menú de la izquierda para desplegar el drawer. Muestra que no hay sesión iniciada.
4. **Catálogo (`/catalogo`)**: Entra al catálogo. Haz scroll vertical para lucir el **Scroll Snap** (cada pieza ocupa toda la pantalla).
5. **Filtros**: Aplica el filtro "Relojes" o busca por texto para mostrar que la UI responde. Toca el icono de corazón en alguna pieza para marcarla como favorito (se sumará al contador del navbar).

---

### 🔵 PASO 2: Workflow del Comprador
1. **Login**: Ve a *Iniciar Sesión* y loguéate usando el botón rápido de **Comprador** (*Joaquin Gonzalez*).
2. **Reserva Directa (Precio Fijo)**:
   * Busca en el catálogo una pieza de precio fijo (ej. *Rolex Submariner*) y haz clic en **"VER PIEZA COMPLETA"**.
   * Haz clic en **"SOLICITAR RESERVA DIRECTA"**.
   * **Confirma** en el modal transaccional. La app te redirigirá a `/reservas` mostrando el estado **PENDIENTE**.
3. **Oferta Privada (Negociación)**:
   * Vuelve al catálogo y entra al detalle de otra pieza de precio fijo.
   * Haz clic en **"HACER OFERTA PRIVADA"**.
   * Ingresa un monto menor al original (ej. si vale $50,000, ofrece $45,000) y confirma. Te redirigirá a `/ofertas` mostrando la oferta **EN REVISIÓN**.
4. **Pujar en Subasta**:
   * Filtra el catálogo por "Subastas" y entra al detalle de una subasta activa (ej. *Moneda de Oro*).
   * Ingresa un monto superior a la puja actual más el incremento mínimo.
   * Haz clic en **"REALIZAR PUJA"** y confirma. Muestra cómo sube el valor del "Pujador Líder" en tiempo real.
5. **Cerrar Sesión**: Toca el menú lateral y haz clic en *Cerrar Sesión*.

---

### 🟡 PASO 3: Workflow del Vendedor (Panel y Subasta en Vivo)
1. **Login**: Inicia sesión usando el acceso rápido de **Vendedor** (*Aura Dolce Galeria*).
2. **Panel de Control (`/vendedor`)**:
   * **Aceptar Reserva**: En la sección de *Reservas Pendientes*, haz clic en el **check verde** de la reserva que creaste en el paso anterior y confirma. (Esto descuenta el stock en el backend real).
   * **Contraofertar**: En la sección de *Ofertas Recibidas*, haz clic en **"REVISAR"** sobre la oferta de $45,000. Selecciona **"CONTRAOFERTAR"**, ingresa un monto intermedio (ej. $48,000) y haz clic en enviar.
3. **Sala de Subasta en Vivo**:
   * En la tabla de publicaciones del panel de control, busca la subasta donde pujaste antes y haz clic en **"SALA EN VIVO"** (va a `/vendedor/:id/subasta`).
   * **Simulador**: Haz clic en el botón de **"Simular Puja"** un par de veces para mostrar cómo el feed del frontend reacciona dinámicamente agregando nuevas ofertas simuladas al historial en vivo.
4. **Cerrar Sesión**.

---

### 🔵 PASO 4: Cierre de la Negociación (Comprador)
1. **Login**: Inicia sesión otra vez como **Comprador** (*Joaquin Gonzalez*).
2. **Aceptar Contraoferta**:
   * Ve a **Mis Ofertas** (`/ofertas`) desde el menú lateral.
   * Busca la oferta enviada. Verás que cambió al estado **CONTRAOFERTA RECIBIDA** mostrando el monto de $48,000 ofrecido por el vendedor.
   * Haz clic en **"ACEPTAR CONTRAOFERTA"** y confirma.
3. **Verificación final**: Ve a **Mis Reservas** (`/reservas`) y muestra que la oferta aceptada se transformó automáticamente en una reserva con estado **PENDIENTE** por el monto acordado ($48,000).

---

💡 **Tip para la presentación**: Mantén una pestaña con el código de `AppRouter.jsx` o `OfertaService.java` abierta de fondo. Si el docente interrumpe con alguna pregunta sobre seguridad o lógica de negocio, puedes hacer una transición instantánea al código para justificar.
