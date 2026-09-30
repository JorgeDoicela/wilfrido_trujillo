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
* **Sistema de Diseño Microsoft Fluent Design 2 (Referencia ISTPET / M365 Desktop):**
  * Adopción del estándar formal de **Microsoft Fluent Design 2 Desktop Shell** conforme a la especificación de `titulacion-istpet`.
  * Layout estructural M365:
    * Topbar (48px de altura fija) en Navy Institucional `#1b2a4a` con acento Gold `#c59b27`, buscador central sobrio, alternador rápido de simulación PBAC y perfil de usuario.
    * Left Icon Rail (48px de ancho fijo) en Navy `#12213a` con indicador activo vertical en Gold (`border-left: 3px solid #c59b27`).
    * Secondary Sidebar (220px de ancho) en blanco puro con navegación por dominios RRA (`practicas`, `vinculacion`, `eventos`, `certificados`), conteos numéricos y selector de espacios activos.
    * Main Content Workspace sobre fondo Canvas neutro `#e8eaf0`, tarjetas operativas en blanco puro `#ffffff` con borde sutil `rgba(0,0,0,0.08)`.
  * Radios geométricos estrictos: `--radius-input: 2px;`, `--radius-card: 4px;` (prohibido `> 4px` en tarjetas), `--radius-panel: 8px;`, `--radius-badge: 12px;`, `--radius-pill: 999px;`.
  * Grilla de datos Fluent Data Grid (`.fluent-table`): alta densidad tipográfica (padding 8px 12px), cabecera gris `#faf9f8`, estados mediante badges planos (`.fluent-badge--success`, `--warning`, `--info`), y botones de acción sólidos Navy (`.fluent-btn-action`).
  * Biblioteca de componentes atómicos en `src/shared/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Modal`) y componentes de negocio adaptados para heredar automáticamente estos tokens sin sombras de colores teñidos ni tarjetas flotantes oscuras.
* **Skill Maestra de Diseño UI/UX (`diseno-wilfrido`):**
  * Especificación en `.agents/skills/diseno-wilfrido/SKILL.md`.
  * Reglas mandatorias: Cero emojis, uso funcional mínimo de SVG (solo donde aporte affordance), prohibición de bloques gigantescos de KPIs superiores (priorizando la densidad de datos y flujos de trabajo) y cero componentes genéricos/plantillas comerciales.



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
  * Prohibidas las importaciones cruzadas entre módulos de negocio; componentes compartidos promovidos a `frontend/src/shared/`.
* **Enrutamiento SPA Sincronizado por Hash:**
  * Enrutador declarativo en `App.tsx` que escucha `hashchange` para soportar navegación directa a rutas profundas públicas (`#/eventos/:code`, `#/certificados/validar/:hash`) en servidores web estáticos sin reescritura compleja de Nginx.
* **Retención de Directorios en Git:**
  * Todo directorio que deba existir en instalaciones limpias cuenta con su respectivo `.gitkeep`.
  * Reglas de `.gitignore` afinadas para retener los `.gitkeep` de carpetas de almacenamiento local (`uploads/`, `backend/uploads/`).

---

## 3. Estado Actual del Sistema y Deuda Técnica

* **Estado Operativo:**
  * Pasos 1 al 17 de la Guía de Implementación completados al 100% y verificados.
  * Backend y frontend compilan con código de salida 0 mediante `pnpm -r run build`.
  * Seeding automático de arranque (`onApplicationBootstrap`): cuentas maestras (`0600000001` - Ing. Wilfrido Trujillo y `0600000002` - Estudiante) y espacios iniciales (`PRAC-2026`, `VINC-2026`, `CONF-IA`).
  * Dosier de documentación técnica modular Docs-as-Code publicado en `docs/` con 19 documentos organizados del `01-` al `05-`.
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
