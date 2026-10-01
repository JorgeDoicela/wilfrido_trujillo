# Memoria Técnica del Proyecto — Plataforma Ing. Wilfrido Trujillo

Este documento preserva las decisiones arquitectónicas, convenciones operacionales, estado de desarrollo y lecciones aprendidas del repositorio `wilfrido_trujillo`. Es de actualización continua y persistencia local en el repositorio.

---

## 1. Decisiones Arquitectónicas Consolidadas

* **Monorepo con pnpm Workspaces:**
  * Estructura unificada en dos paquetes principales: `backend/` (NestJS 11) y `frontend/` (React 19 + Vite + Tailwind CSS v4).
  * Orquestación de desarrollo concurrente con `pnpm dev` (`concurrently`) y compilación sincronizada con `pnpm -r run build`.
* **Persistencia Embebida Zero-Daemon con SQLite WAL:**
  * Driver de alto rendimiento: `better-sqlite3`.
  * Parámetros forzados de inicialización en `DatabaseModule`: `PRAGMA journal_mode = WAL;` (concurrencia de lecturas no bloqueante) y `PRAGMA foreign_keys = ON;`.
  * Consumo base de memoria RAM en reposo: 10 a 20 MB (optimizado para VPS con 1 GB de RAM).
  * 9 Entidades relacionales TypeORM: `User`, `Workspace`, `WorkspaceEnrollment`, `ResourceFile`, `Test`, `TestAttempt`, `DocumentSubmission`, `Certificate`, `EventFeedback`.
  * Columnas dinámicas en formato `simple-json` para bancos de preguntas, respuestas de intentos y dictámenes estructurados de auditoría.
* **Control de Acceso Basado en Permisos (PBAC Desacoplado):**
  * Prohibición estricta de evaluar nombres de rol literales en controladores y componentes.
  * Catálogo de 12 permisos atómicos en el enum `Permission`.
  * Decorador `@RequirePermissions(...)` evaluado por `PermissionsGuard` contra el arreglo `permissions` del payload JWT.
  * Consumo en frontend mediante el componente `<Can permission="...">` y el hook `usePermission(...)`.
* **Contrato REST Limpio y Manejo de Errores RFC 7807:**
  * Respuestas HTTP directas con cargas útiles puras (eliminación del envoltorio redundante `data.data`).
  * Filtro global de excepciones `HttpExceptionFilter` que unifica los fallos en estructura canónica con `statusCode`, `error`, `message`, `timestamp` y `path`.
* **Generación Soberana de Certificados PDF con Verificación QR:**
  * Maquetado apaisado A4 Landscape (841.89 × 595.28 pt) generado en memoria con `pdfkit`.
  * Matriz QR física de 130 pt incrustada localmente con `qrcode` apuntando a `#/certificados/validar/:hash`.
  * Identificador unívoco indexado de formato criptográfico `WT-XXXX-XXXX-XXXX` derivado de SHA-256.
* **Agente Auditor Documental Desacoplado bajo DIP:**
  * Inversión de Dependencias formal bajo la interfaz `IDocumentAuditor` y el token de inyección `DOCUMENT_AUDITOR`.
  * Implementación heurística de Fase 1 (`HeuristicDocumentAuditorService`): validación de cabecera `%PDF-`, conteo de páginas, densidad de caracteres legibles (alerta de escaneos sin OCR), verificación de secciones académicas normativas RRA (Datos, Objetivos, Actividades, Conclusiones, Firmas), análisis de metadatos y semáforo tripartito (Verde, Amarillo, Rojo).
  * Endpoints dedicados para auditoría de entregas almacenadas y pre-auditoría en memoria en el buzón estudiantil.
* **Sistema de Diseño Microsoft 365 Moderno (Fluent UI v9 Oficial):**
  * Estandarización visual y funcional 100% fiel a la suite moderna de **Microsoft 365 / Teams / SharePoint**:
    * **Suite Bar Superior (48px):** Fondo en Microsoft Brand Blue `#0f6cbd`, App Launcher Waffle (matriz 3x3 de 9 puntos que despliega el menú oficial de aplicaciones `M365WaffleMenu`), buscador central en cápsula con atajo `Ctrl+K`, y avatar con halo de presencia verde `#107c10` que despliega el `M365ProfileFlyout` institucional.
    * **Profile Persona Flyout M365 (`M365ProfileFlyout.tsx`):** Menú flotante oficial de cuenta que encapsula la identidad del usuario, permisos atómicos activos y el conmutador de roles PBAC (Estudiante / Docente Evaluador), erradicando cajas toscas de simulación del lienzo de trabajo.
    * **Barra Lateral Unificada (Unified Navigation Sidebar):** Sustitución del antiguo esquema de doble columna adyacente (rail de 56px + drawer de 220px) por una sola barra lateral limpia (`w-64` expandida, `w-14` colapsada) con un único borde derecho `#e0e0e0`. Integra navegación principal por módulos, selector contextual de espacios de trabajo y botón de contracción bajo una sola columna continua sin doble separación visual ni tarjetas accesorias.
    * **M365 Command Bar (44px):** Barra horizontal de herramientas blanca con acciones operativas (`+ Nuevo`, `Sincronizar`, `Filtrar`) y breadcrumbs dinámicos según el módulo.
    * **Vistas Modulares Focalizadas (Cero Apilamiento):** Cada pestaña de navegación renderiza exclusivamente su vista de negocio en pantalla completa sin concatenar tarjetas de otros módulos debajo.
    * **Canvas y Tarjetas de Trabajo:** Fondo general gris neutro limpio `#f5f5f5`, tarjetas en blanco puro con esquinas redondeadas modernas de 8px (`rounded-lg`), bordes sutiles `#e0e0e0` y sombras de elevación neutras Fluent 2.
    * **Data Grid M365 Lists:** Cabeceras limpias `#fafafa`, bordes de fila `#edebe9`, hover suave `#f7f9fa` y badges redondeados planos (`.m365-badge`).
    * **Flujo Secuencial (Fluent Stepper):** Stepper horizontal de 4 etapas con nodos circulares, numeración Fluent y badges de estado claros.
* **Skill Maestra de Diseño UI/UX (`diseno-wilfrido`):**
  * Especificación en `.agents/skills/diseno-wilfrido/SKILL.md` y documentación formal en `docs/04-frontend-aplicacion-web/05-sistema-de-diseno-microsoft-365.md`.
  * Reglas mandatorias e inviolables:
    * 100% Microsoft 365 Moderno (Fluent Design System 2 / Fluent UI v9) puro sin mezclas estéticas.
    * Paleta de color oficial: Brand `#0f6cbd`, Hover `#115ea3`, Pressed `#0c3b5e`, Canvas `#f5f5f5`, Superficies `#ffffff`, Bordes `#e0e0e0`, Divisores `#edebe9`, Textos `#242424` / `#616161`, Presencia/Success `#107c10`.
    * Tipografía oficial: Segoe UI / Segoe UI Variable con escala de texto jerárquica estandarizada.
    * Cero Cajas o Píldoras con Color de Fondo para Palabras o Íconos: Prohibido encerrar palabras, categorías o íconos SVG dentro de cuadros u óvalos con fondos de color (`bg-[#ebf3fc]`, etc.) como adorno sobre títulos o secciones. La jerarquía se expresa con tipografía pura, peso y colores neutros.
    * Cero Información Irrelevante o Relleno: Todo texto debe ser fáctico, técnico y operativo para la gestión académica; cero lemas publicitarios.
    * Layout Suite: Suite Bar (48px), Barra Lateral Unificada (`w-64` / `w-14`), Command Bar (44px). Prohibido el doble carril adyacente o doble separación vertical.
    * Radios de curvatura contenidos: 4px para controles interactivos y 8px para tarjetas/modales (prohibidos radios superiores a 12px).
    * Cero emojis en toda la interfaz, código y documentación técnica.
    * Uso funcional mínimo de SVG (16px a 20px), sin saturación decorativa.
    * Prohibición de bloques superiores masivos de KPIs; priorización de densidad de datos y flujos de acción.
    * Vistas modulares por pestañas independientes sin apilamiento de páginas.



---

## 2. Convenciones del Repositorio

* **Tono de Comunicación y Código:**
  * Estrictamente sobrio, fáctico y técnico. Cero emojis en documentación, código fuente, pruebas y mensajes de commit.
  * Cero lenguaje inflado o comercial.
* **Commits Semánticos en Español:**
  * Formato: `tipo: descripción concisa en minúsculas` (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
  * Rama principal: `master` sincronizada contra `origin/master`.
* **Estructura Modular por Dominios en Frontend:**
  * Todo recurso perteneciente a un dominio funcional reside dentro de su carpeta en `frontend/src/modules/` (`auth`, `admin`, `practicas`, `vinculacion`, `eventos`).
  * **Aislamiento Estricto Verificado:** Prohibidas las importaciones cruzadas directas entre módulos hermanos.
  * **Servicios e Infraestructura Compartida (`src/shared/`):**
    * Autenticación y sesión (`AuthContext.tsx`, `useAuth.ts`): reside canónicamente en `src/shared/context/` y `src/shared/hooks/`, eliminando la dependencia invertida desde componentes transversales hacia `modules/auth`.
    * API de Espacios de Trabajo (`workspaces.api.ts`): reside canónicamente en `src/shared/api/`, accesible sin acoplamiento a `modules/admin`.
    * Modales y Tablas Operativas de Prácticas (`CreateTestModal`, `UploadResourceModal`, `ReviewDocumentModal`, `SubmissionsReviewTable`): reubicados con alta cohesión dentro de `src/modules/practicas/components/`, consumiendo sus APIs locales relativas sin depender de `admin`.
* **Landing Page Soberana (`src/modules/landing/`):**
  * Portada pública ejecutiva que reproduce con fidelidad la composición limpia y espaciosa de `jorge_doicela/frontend/web/src/app/(landing)/page.tsx`, adaptada bajo Segoe UI, `#0f6cbd`, fondo `#f5f5f5`, tarjetas `#ffffff` con borde `#e0e0e0` y cero elementos de relleno.
  * Directriz de Nomenclatura: Eliminados todos los títulos académicos ("Ing.", "Ingeniero", "M.Sc."), así como menciones de la universidad, facultad, carrera o "Suite M365". La plataforma se presenta directamente bajo el nombre soberano de "Wilfrido Trujillo".
  * Estructura centrada en 4 secciones cardinales dentro de `<main className="max-w-5xl ...">`:
    * `LandingHeader`: Cabecera flotante pura (sin enlaces horizontales) con logo `WT`, nombre `Wilfrido Trujillo`, `QuitoClockBadge` (reloj de Riobamba UTC-5) y botón `Acceder`, con ocultamiento dinámico mediante `useLandingHeaderScroll`.
    * `LandingHero`: Titular monumental `Wilfrido Trujillo` en Segoe UI display, párrafo sobrio directo y botones de acción limpios (`Explorar lo más destacado` y `Acceder al Portal`).
    * `LandingHighlightsCarousel`: Carrusel amplio con visuales en 3 columnas limpias (Prácticas Preprofesionales, Vinculación con la Sociedad, Eventos y Certificación Criptográfica).
    * `LandingDetailExplorer`: Explorador con botones de selección vertical para roles (Estudiantes, Tutores, Empresas, Validación Pública) y ventana de especificación en 3 columnas.
    * `LandingBentoSection`: Sección de exactamente 2 BentoCards en cuadrícula `grid-cols-1 md:grid-cols-2`:
      * Tarjeta 1: Canales y accesos directos (Acceso al Portal, Módulo de Prácticas, Módulo de Vinculación, Validación SHA-256).
      * Tarjeta 2: Filosofía & Enfoque y cita editorial de Wilfrido Trujillo.
    * `LandingFooter`: Pie limpio en una sola línea con copyright y áreas de gestión (`Prácticas · Vinculación · Certificación`).
* **Enrutamiento SPA Sincronizado por Hash:**
  * Ruta raíz (`#/` o vacía): Presenta la Landing Page soberana de Wilfrido Trujillo.
  * Ruta operativa (`#/app`, `#/practicas`, `#/vinculacion`, `#/certificados`, `#/eventos`, `#/espacios`): Despliega la Suite M365 `FluentShell` con transición fluida.
  * Rutas profundas públicas (`#/eventos/:code`, `#/certificados/validar/:hash`): Acceso directo sin fricción de autenticación.
  * Retorno instantáneo a la Portada Institucional desde el título de la Suite Bar y el menú de aplicaciones Waffle.
* **Retención de Directorios en Git:**
  * Todo directorio que deba existir en instalaciones limpias cuenta con su respectivo `.gitkeep`.
  * Reglas de `.gitignore` afinadas para retener los `.gitkeep` de carpetas de almacenamiento local (`uploads/`, `backend/uploads/`).

---

## 3. Estado Actual del Sistema y Deuda Técnica

* **Estado Operativo:**
  * Pasos 1 al 17 de la Guía de Implementación completados al 100% y verificados.
  * Backend y frontend compilan con código de salida 0 mediante `pnpm -r run build`.
  * Seeding automático de arranque (`onApplicationBootstrap`): cuentas maestras (`0600000001` - Ing. Wilfrido Trujillo y `0600000002` - Estudiante) y espacios iniciales (`PRAC-2026`, `VINC-2026`, `CONF-IA`).
  * Dosier de documentación técnica modular Docs-as-Code publicado en `docs/` con 20 documentos organizados del `01-` al `05-` (incluyendo la especificación canónica del Sistema de Diseño Microsoft 365).
* **Ruta de Escalabilidad (Fase 2 del Auditor):**
  * La arquitectura está lista para incorporar un adaptador de IA generativa (`AiDocumentAuditorService` mediante Gemini API u Ollama local) sustituyendo o enriqueciendo el proveedor `DOCUMENT_AUDITOR` sin modificar los controladores ni la capa de persistencia.
* **Deuda Técnica Identificada:**
  * Ninguna deuda técnica crítica. No existen castings forzados a `any`, no hay `try-catch` vacíos y el modelo relacional opera con claves foráneas activas.

---

## 4. Lecciones Aprendidas y Directrices de Depuración

* **Módulos ESM en Node.js:**
  * Al compilar bajo `"type": "module"`, las importaciones internas relativas de TypeScript deben incluir la extensión `.js` en el código fuente (ej. `import { User } from './user.entity.js'`).
* **Driver `better-sqlite3`:**
  * Requiere compilación nativa según la plataforma host. Se encuentra declarado en `onlyBuiltDependencies` dentro de `package.json` de la raíz.
* **Validación de Archivos con Multer:**
  * Para pre-auditoría en memoria, se utiliza almacenamiento en buffer (`memoryStorage`), evitando la creación y borrado innecesario de archivos temporales en disco.
  * Para entregas oficiales persistidas, se utiliza `diskStorage` con nombres sanitizados basados en marcas temporales unívocas.
