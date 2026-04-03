# AGENTS.md — The Collector

## 📌 Propósito de este archivo
Mantener las instrucciones **críticas, persistentes y restricciones de comportamiento** para la IA a lo largo del desarrollo. 
Para la documentación del sistema (arquitectura, flujos de datos, modelos, API, despliegue y guías) dirigirse al directorio `docs/`.
Para usar documentación on-demand, utilidades bajo demanda, o reglas de diseño específicas referirse a `.agents/skills/`.

---

## Restricciones de Comportamiento Críticas

1. **Eficiencia y Conocimiento del Contexto**:
   - **No asumas el estado del proyecto**: Las estructuras de árbol (file tree), y modelos exactos cambian. Utiliza comandos internos para escanear y revisar (`view_file`, `list_dir`, etc).
   - **Evita instrucciones costosas e innecesarias**: No ejecutes de forma rutinaria builds completos (e.g. `npm run build`) o tests masivos al hacer ediciones pequeñas, a menos que el usuario lo solicite explícitamente y sea necesario para comprobar un pipeline o un despliegue en vivo.

2. **Seguridad y Credenciales**:
   - **Nunca** modifiques `application-local.yml` ni `.env.local` con secretos reales y los comprometas (commit) en el control de versiones. Usa `.env.example` para declarar variables nuevas.
   - El sistema es stateless: Todo requerimiento de autenticación viaja vía Header de peticiones HTTP en forma de JWT. No intentes implementar manejo de sesión basada en cookies ni persistencia de sesión en el backend o frontend a menos que sea solicitado.
   - En backend (JPA), **siempre** usar inyección de parámetros. Nunca realizar queries armando u concatenando Strings.

3. **Roles en Desarrollo**:
   - Para revisar arquitectura, flujos, endpoints definidos y base de datos: Acude a la carpeta `docs/` (`architecture.md`, `data_model.md`, `api.md`, `guide.md`).
   - Para tareas que requieran metodologías específicas (diagramas UML, patrones, optimizaciones complejas, diseño UI/UX): Carga los skills correspondientes de la carpeta `.agents/skills/` **antes de hacer modificaciones de código**.

---

## Preferencias de Estilo de Codificación (Persistentes)

### ☕ Backend (Java 17 + Spring Boot 3)
- **Topología de Capas Estricta**: `Controller → Service → Repository`. 
  - El Controller solo mapea DTOs a la interfaz HTTP. **Cero lógica de negocio**, todo se traslada a las clases con anotación `@Service`. NUNCA acceder a la capa `Repository` desde el `Controller`.
- **Inyección Orientada a Constructor**: Declarar componentes con constructores (`private final ...`). La anotación `@Autowired` a nivel de field (campo) está **estrictamente prohibida**.
- **Entidades ocultas y DTOs Mapeados**: Evitar propagar objetos del modelo `@Entity` (modelos JPA) al controlador. Mapear desde y hacia DTOs específicos de entrada/salida (`<Entidad>RequestDTO`, `<Entidad>ResponseDTO`).
- **Validaciones Seguras**: Utilizar Bean Validation (`@Valid`, `@NotNull`, etc) a nivel de la solicitud de Request.
- **Transacciones Seguras**: Marcar toda regla de negocio que altere el estado como `@Transactional`. Para accesos optimizados a lectura marcar con `@Transactional(readOnly = true)`.
- **Excepciones Centralizadas**: Nada de bloques `try/catch` de control de flujo. Usa excepciones de negocio en el entorno de servicio y trátalas mediante un `@ControllerAdvice` (`GlobalExceptionHandler`).
- **Seguridad y Propiedad**: Solo comprueba Roles a nivel de método del Controller (`@PreAuthorize`). Para mutaciones, verifica en tiempo de ejecución **en la capa Service** si el "usuario es el dueño del registro" según la capa de negocio.

### Frontend (React 18 + Vite + Tailwind CSS)
- **Funcionalidad y Componentización**: Aplicar enfoque puramente funcional (`FC`). Todo nombre de archivo y clase de exportación orientada a vista debe utilizar `PascalCase`.
- **Especialización Atómica de Estilos**: Usa directamente las clases utilitarias de **Tailwind CSS**. Evitar la creación de cualquier archivo `.css` auxiliar para personalizaciones elementales.
- **Manejo Dinámico de Datos (API y Estado)**:
  - Todo consumo con el Backend debe estar abstraydo bajo `services/` (no uses fetch en los archivos .jsx directamente).
  - Toda solicitud de carga debe manejar en la UI tres estados de transición: *loading*, *success* y *error*. Implementa los bloques correctos con React (`useState`, `useEffect`) o RTK (`createAsyncThunk`), según la fase actual del desarrollo.
  - El token es inyectado desde `localStorage` a las peticiones remotas de `fetch` / `axios`.
