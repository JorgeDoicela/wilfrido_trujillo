# Especificacion Tecnica y Arquitectura de Software: wilfrido_trujillo

Documento maestro de requerimientos, decisiones arquitectonicas, modelo de datos y diseno del sistema privado para el Ing. Wilfrido Trujillo.

---

## 1. Contexto, Origen y Motivacion

El proyecto nace a raiz de la demostracion en produccion del ecosistema modular de Jorge Doicela. El coordinador, Ing. Wilfrido Trujillo, observo la calidad, arquitectura y rendimiento del sistema y solicito el desarrollo de una herramienta a medida adaptada a sus necesidades profesionales y de gestion.

### 1.1 Funciones y Responsabilidades del Ingeniero
El Ing. Wilfrido Trujillo desempena un triple rol de coordinacion en un instituto de educacion superior de tercer nivel en Ecuador:
* Coordinador de Carrera.
* Coordinador de Practicas Preprofesionales (laborales).
* Coordinador de Vinculacion con la Sociedad (servicio comunitario).
* Adicionalmente, se desempena como conferencista, capacitador y ponente en talleres y eventos academicos y empresariales externos.

### 1.2 Problematica Operativa Detectada
1. Saturacion de canales informales (WhatsApp, correos personales e institucionales) con preguntas recurrentes de estudiantes.
2. Recepcion de documentos oficiales, bitacoras y convenios mal diligenciados, incompletos o con formatos obsoletos.
3. Desconocimiento generalizado de la normativa del RRA (Reglamento de Regimen Academico de Ecuador) por parte de los alumnos que inician practicas o vinculacion.
4. Falta de un mecanismo verificable para asegurar que el estudiante comprendio las directrices antes de presentar documentos.
5. Inexistencia de un canal formal y digitalizado para compartir recursos y constancias en conferencias externas.

---

## 2. Definicion Estrategica: Herramienta Privada y Soberana (No Institucional)

### 2.1 Justificacion Legal y Proteccion de Datos (LOPDP Ecuador)
El sistema **no es un software institucional ni dependera de los servidores del instituto**. Es una plataforma privada, soberana y personal del Ing. Wilfrido Trujillo por los siguientes motivos tecnicos y juridicos:
* **Autonomia Operativa:** No esta sujeta a burocracia institucional, autorizaciones de rectorado ni auditorias de departamentos de TI externos.
* **Cumplimiento de la LOPDP (Ley Organica de Proteccion de Datos Personales de Ecuador):** No se conectan bases de datos institucionales ni se exponen registros academicos confidenciales. El sistema opera como un canal pedagogico privado donde solo se procesan los datos estrictamente necesarios para el seguimiento formativo (nombre, cedula, correo, periodo academico, entregas).
* **Custodia y Evidencia:** El Ingeniero mantiene un respaldo inmutable de fechas, horas, visualizaciones de videos, intentos de evaluacion y entregas documentales para respaldar su gestion docente ante cualquier eventual reclamo estudiantil.

---

## 3. Los Dos Pilares Funcionales del Sistema

La plataforma se estructura en dos grandes areas de operacion:

### 3.1 Pilar A: Gestion de Practicas Preprofesionales y Vinculacion con la Sociedad
Dirigido a los estudiantes del instituto bajo su coordinacion. Implementa un flujo estricto y secuencial de onboarding obligatorio:

```text
[ Estudiante ]
      │
      ▼
1. Ingreso al portal con credenciales (Cedula y Correo)
      │
      ▼
2. Induccion Obligatoria (Video explicativo grabado por el Ingeniero)
   - El sistema registra el progreso de reproduccion.
   - No se permite avanzar hasta completar el video.
      │
      ▼
3. Evaluacion / Test de Conocimiento
   - Cuestionario interactivo sobre las directrices del video.
   - Requiere un puntaje minimo aprobatorio (ejemplo: 7/10 u 8/10).
   - Limite de intentos configurable.
      │
      ▼ (Condicion Aprobada)
4. Desbloqueo de Recursos y Formatos Oficiales
   - Descarga de plantillas oficiales (Word, Excel, PDF de convenios y bitacoras).
   - Acceso al formulario de carga de documentos.
      │
      ▼
5. Entrega de Evidencias y Documentos
   - Carga de borradores e informes en PDF.
   - Pasa por el pipeline de auditoria/pre-revision.
   - El Ingeniero revisa en su panel: Aprueba o emite observaciones especificas.
```

### 3.2 Pilar B: Conferencias, Charlas y Talleres Externos
Dirigido a publicos externos (universidades, empresas, congresos, masterclasses). Permite proyectar un codigo QR o enlace al final de cada evento:
* **Acceso Rapido via QR:** Los asistentes escanean el codigo y acceden sin registros engorrosos.
* **Descarga de Material:** Diapositivas de la ponencia, guias practicas y plantillas de trabajo.
* **Evaluacion o Encuesta de Satisfaccion:** Test rapido de 3 a 5 preguntas o formulario de retroalimentacion.
* **Certificado Digital de Asistencia:** Generacion automatica de constancia en PDF con codigo unico de validacion digital.
* **Networking y Base de Contactos:** El Ingeniero consolida una base de datos limpia de asistentes interesados en futuras capacitaciones o consultorias.

---

## 4. Evaluacion y Decision del Stack Tecnologico

### 4.1 Frontend: React 19 + Vite + Tailwind CSS (Decision Definitiva)
Se descarta Next.js en favor de React con Vite con base en los siguientes criterios de ingenieria:

1. **Velocidad y Experiencia de Desarrollo:**
   * Vite utiliza esbuild y Hot Module Replacement (HMR) nativo en menos de 50 ms.
   * Elimina la compilacion bajo demanda de rutas que hace que Next.js dev se sienta lento (retrasos de 2 a 4 segundos por pagina visitada).
2. **Consumo de Memoria Zero-RAM en el Servidor:**
   * Next.js requiere un runtime activo de Node.js corriendo Server-Side Rendering (SSR) permanentemente, consumiendo entre 90 y 150 MB de memoria RAM en el servidor.
   * React + Vite compila una Single Page Application (SPA) pura compuesta por archivos estaticos (.html, .js, .css). Nginx sirve estos archivos directamente desde disco con consumo de 0 MB de RAM en Node.js.
3. **Innecesidad de SEO Masivo:**
   * El sistema es un portal privado de gestion y acceso por QR/enlace directo. No requiere indexacion publica en Google de formularios, bitacoras ni tests.
4. **Navegacion Fluida e Interactiva:**
   * La navegacion entre vistas, reproductores de video, cuestionarios y formularios opera a 60/120 FPS sin peticiones intermedias de HTML al servidor.
5. **Erradicacion de Problemas de Hidratacion:**
   * Al no existir renderizado en servidor de componentes cliente, se eliminan por completo los errores de hydration mismatch, directivas use client forzadas y conflictos con window o localStorage.

### 4.2 Backend: NestJS 11 + TypeScript
* **Arquitectura Limpia en Tres Capas:** Controladores ultradelgados, Servicios con logica de negocio pura y Entidades/Repositorios para persistencia.
* **ORM Oficial (TypeORM):** Integracion de `@nestjs/typeorm` y `typeorm` con el patron Repository. Permite tipado estricto de entidades, migraciones seguras y manejo transparente de columnas JSON (`simple-json`). Driver de alto rendimiento: `better-sqlite3`.
* **Inyeccion de Dependencias Nativa:** Alta cohesion y desacoplamiento absoluto entre modulos.
* **Control de Acceso Basado en Permisos (PBAC/RBAC Desacoplado):** Guards e interceptores (`PermissionsGuard`) para evaluar capacidades tecnicas atomicas mediante `@RequirePermissions(...)`, completamente agnostico a los nombres de roles definitivos.
* **Contrato de API REST Limpio (Sin Envoltorios Artificiales):**
  * **En Exito:** Devolucion directa de la carga util (Payload puro) acompanada de su codigo HTTP semantico (`200 OK`, `201 Created`, `204 No Content`). Erradica el antipatron `res.data.data` en el cliente Axios.
  * **En Error (Estandar RFC 7807 / NestJS):** Filtro Global de Excepciones (`HttpExceptionFilter`) que unifica cualquier fallo (400, 401, 403, 404, 500) en una estructura predecible:
    ```json
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "Mensaje descriptivo del error o array de validaciones",
      "timestamp": "2026-09-23T21:46:00.000Z",
      "path": "/api/v1/..."
    }
    ```
* **Validacion Fuerte de DTOs:** Integracion de class-validator y class-transformer para saneamiento estricto de entradas. La identificacion de usuarios se valida como cadena de texto alfanumerica limpia sin algoritmos matematicos restrictivos ni forzados.

### 4.3 Base de Datos: SQLite de Alto Rendimiento (better-sqlite3 en Modo WAL)
Se selecciona **SQLite en modo WAL** como motor principal de persistencia para el VPS de bajo costo (1 GB de RAM) por los siguientes fundamentos tecnicos:

1. **Eficiencia Extrema de Memoria (Zero-Daemon):**
   * PostgreSQL requiere un servicio independiente (daemon) que consume entre 90 MB y 160 MB de RAM base en reposo por su pool de conexiones.
   * SQLite corre embebido directamente en el proceso de Node.js/NestJS, consumiendo unicamente entre **10 MB y 20 MB de memoria RAM**. Esto preserva el 15% de toda la memoria del VPS de 1 GB.
2. **Concurrencia y Velocidad con Modo WAL (Write-Ahead Logging):**
   * Las lecturas son completamente no bloqueantes frente a escrituras concurrentes (`PRAGMA journal_mode = WAL;`).
   * Las consultas ocurren a velocidad de memoria y disco local, sin latencias de socket TCP ni serializacion de red entre backend y base de datos.
3. **Manejo Nativo de JSON para Cuestionarios y Bitacoras:**
   * TypeORM maneja columnas `@Column({ type: 'simple-json' })` de forma transparente sobre SQLite, permitiendo almacenar preguntas, opciones, respuestas y rubricas de evaluacion dinamicas sin requerir tablas intermedias innecesarias.
4. **Respaldo y Portabilidad Inmediata:**
   * Todo el estado de la aplicacion reside en un unico archivo (`wilfrido.sqlite`). Un cron job puede respaldarlo en caliente o sincronizarlo a Cloudflare R2 sin necesidad de comandos pesados como `pg_dump`.
5. **Ruta de Escalabilidad Garantizada (Migracion Zero-Refactor):**
   * Gracias al uso de TypeORM y el patron Repository, si en el futuro la plataforma escala a decenas de miles de usuarios y se adquiere un servidor dedicado, migrar a PostgreSQL toma unicamente modificar el archivo de conexion (`ormconfig`), sin reescribir entidades, servicios ni controladores.

### 4.4 Almacenamiento de Archivos y Streaming de Videos
* **Documentos (PDF, DOCX, XLSX):** Almacenamiento local en disco del servidor bajo rutas privadas protegidas o almacenamiento compatible S3 (Cloudflare R2 / MinIO). La descarga solo es accesible mediante endpoints autenticados o URLs firmadas con expiracion temporal.
* **Videos Educativos:** No se alojan archivos de video directamente en el servidor para evitar saturacion de ancho de banda y almacenamiento. Se integran reproductores embebidos protegidos (YouTube Unlisted o Vimeo) con listener del reproductor para registrar que el usuario miro el contenido en su totalidad.

---

## 5. Arquitectura del Frontend: Modular por Dominios de Negocio (Domain-Driven Modules)

Para evitar la sobrecarga cognitiva y la dispersion de codigo que provoca Feature-Sliced Design (FSD) en equipos agiles, el frontend adopta una **Arquitectura Modular por Dominios de Negocio** (estandar Feature/Domain Modules). Todo lo que pertenece a un area de negocio reside dentro de su respectivo modulo con alta cohesion y bajo acoplamiento:

```text
frontend/src/
├── app/                                 # Capa de Inicializacion y Contexto Global
│   ├── routes/                          # Configuracion de rutas declarativas (React Router)
│   ├── providers/                       # Proveedores globales (AuthProvider, ToastProvider, ThemeProvider)
│   └── main.tsx                         # Punto de entrada de Vite
│
├── shared/                              # Nucleo Transversal Compartido (Agnostico al Negocio)
│   ├── components/                      # UI Kit atomico reutilizable (Button, Modal, Input, Badge, Table, Card)
│   ├── hooks/                           # Hooks utilitarios genericos (useDebounce, useLocalStorage, useModal)
│   ├── lib/                             # Cliente HTTP Axios/Fetch tipado con interceptores JWT y manejo de errores
│   └── types/                           # Tipos globales genericos (ApiResponse, Pagination, UserRole)
│
└── modules/                             # MODULOS DE NEGOCIO 100% AUTONOMOS
    │
    ├── auth/                            # Modulo: Autenticacion y Seguridad
    │   ├── api/                         # auth.api.ts (login, register, reset-password)
    │   ├── components/                  # LoginForm, RegisterForm, RoleGuard
    │   ├── hooks/                       # useAuth, useSession
    │   └── pages/                       # LoginPage.tsx, RegisterPage.tsx
    │
    ├── admin/                           # Modulo: Panel de Gestion del Ingeniero (Superadmin)
    │   ├── api/                         # admin.api.ts (metricas, periodos, aprobaciones)
    │   ├── components/                  # MetricSummaryCards, SubmissionsInboxTable, AuditModal
    │   ├── hooks/                       # useAdminDashboard, useSubmissionsReview
    │   ├── pages/                       # AdminDashboardPage.tsx, AdminStudentsPage.tsx
    │   └── types/                       # Interfaces de gestion administrativa
    │
    ├── practicas/                       # Modulo: Practicas Preprofesionales
    │   ├── api/                         # practicas.api.ts (estados, videos, carga de informes)
    │   ├── components/                  # InductionVideoPlayer, QuestionnaireTest, DocumentUploader
    │   ├── hooks/                       # usePracticasFlow, useInductionProgress
    │   ├── pages/                       # PracticasOverviewPage.tsx, PracticasTestPage.tsx
    │   └── types/                       # Interfaces y estados del flujo de practicas
    │
    ├── vinculacion/                     # Modulo: Vinculacion con la Sociedad
    │   ├── api/                         # vinculacion.api.ts (proyectos, bitacoras, formatos)
    │   ├── components/                  # ProjectTemplateViewer, EvidenceUploader
    │   ├── hooks/                       # useVinculacionFlow
    │   ├── pages/                       # VinculacionOverviewPage.tsx, VinculacionSubmitPage.tsx
    │   └── types/                       # Interfaces del flujo de vinculacion
    │
    └── eventos/                         # Modulo: Conferencias, Talleres y Acceso QR
        ├── api/                         # eventos.api.ts (recursos, encuestas, certificados)
        ├── components/                  # SlidesDownloadCard, QuickSurvey, CertificateViewer
        ├── hooks/                       # useEventAccess, useCertificateClaim
        ├── pages/                       # EventLandingPage.tsx, ClaimCertificatePage.tsx
        └── types/                       # Interfaces de eventos y constancias digitales
```

### 5.1 Reglas de Oro de la Arquitectura Modular Frontend:
1. **Alta Cohesion Local:** Todo lo que necesita un modulo (sus llamadas a API, sus componentes graficos, sus tipos y sus hooks) vive dentro de su propia carpeta.
2. **Cero Importaciones Cruzadas entre Modulos de Negocio:** El modulo `practicas` jamas importa nada de `vinculacion` ni de `eventos`. Si ambos modulos necesitan un componente comun (ejemplo: un reproductor de video generico o un uploader de archivos), este se promociona a `shared/components/`.
3. **Escalabilidad Inmediata y Segura:** Si en el futuro el Ingeniero solicita agregar un nuevo modulo (ejemplo: `bolsa-empleo` o `asesorias-tesis`), basta con crear la carpeta `modules/bolsa-empleo/` sin alterar el funcionamiento del resto del sistema.
4. **Independencia del Enrutamiento:** El frontend funciona exactamente igual si se navega mediante rutas relativas (`/practicas`, `/vinculacion`, `/eventos`) o si en el futuro se activan alias de subdominios (`practicas.wilfridotrujillo.com`) gestionados por Nginx/Cloudflare hacia esas mismas rutas.

### 5.2 Estrategia de Dominio y Enrutamiento Semantico (Decision Definitiva)
Se adopta **un solo dominio central con rutas semanticas** (`wilfridotrujillo.com`) como el estandar de oro de la aplicacion:

* **Mapa de Enrutamiento:**
  * `wilfridotrujillo.com/` -> Portada profesional y presentacion del Ing. Wilfrido Trujillo.
  * `wilfridotrujillo.com/practicas` -> Modulo de Practicas Preprofesionales (induccion, test, informes).
  * `wilfridotrujillo.com/vinculacion` -> Modulo de Vinculacion con la Sociedad (formatos, bitacoras).
  * `wilfridotrujillo.com/eventos/:id` -> Acceso directo por QR a conferencias/talleres (descargas, encuestas, certificados).
  * `wilfridotrujillo.com/admin` -> Panel privado de control y revision del docente.
  * `wilfridotrujillo.com/api/` -> Proxy reverso hacia el backend NestJS (puerto 3000).

* **Fundamentos Tecnicos de la Decision:**
  1. **Sesion y Autenticacion Unificada (Cero Friccion de CORS):** El token JWT reside en un unico origen. No existe fragmentacion de sesiones ni necesidad de sincronizar almacenamiento local o cookies wildcard entre subdominios distintos.
  2. **Navegacion SPA Instantanea (0 ms):** El cambio entre areas de trabajo ocurre de forma inmediata sin recarga de pagina completa ni descargas redundantes de recursos estaticos.
  3. **Soporte para Enlaces Cortos (Vanity URLs):** Si el docente requiere compartir enlaces directos en diapositivas o material impreso (ejemplo: `practicas.wilfridotrujillo.com`), Cloudflare o Nginx ejecutan una redireccion 301 instantanea hacia `wilfridotrujillo.com/practicas`, manteniendo el backend y frontend totalmente limpios.

---

## 6. Arquitectura del Agente Auditor y Revisor de Documentos (Diseno Pluggable)

Siguiendo el Principio de Inversion de Dependencias (DIP) de SOLID, el sistema de revision documental no dependera de ninguna libreria o proveedor de IA especifico. Se define una interfaz abstracta:

```typescript
export interface DocumentAuditResult {
  isValid: boolean;
  score: number;
  missingFields: string[];
  observations: string[];
  rawAnalysis?: Record<string, unknown>;
}

export interface IDocumentAuditor {
  audit(fileBuffer: Buffer, documentType: string): Promise<DocumentAuditResult>;
}
```

### 6.1 Fases de Implementacion del Auditor:
* **Fase 1 (Inmediata / Heuristica sin costo):** Validador estructural local. Comprueba que el archivo sea un PDF valido, legible, que contenga texto real (no paginas escaneadas en blanco), limite de tamano adecuado y metadatos basicos.
* **Fase 2 (Agente de IA Integrable):** Adaptador enchufable (Gemini API, OpenAI o modelo local Ollama) que extrae el texto del documento y lo contrasta contra una rubrica:
  - Verificacion de presencia de firmas o lineas de firma.
  - Comprobacion de fechas coherentes con el periodo lectivo.
  - Deteccion de campos clave requeridos segun la plantilla oficial.
  - Entrega de sugerencias inmediatas al estudiante antes de la revision final del Ingeniero.

---

## 7. Arquitectura de Control de Acceso: RBAC Desacoplado Basado en Permisos (PBAC)

Dado que **los roles operativos definitivos aun no estan cerrados ni fijados**, la arquitectura de autorizacion se desacopla por completo para evitar deuda tecnica y refactorizaciones futuras.

### 7.1 Principio Rector: Autorizacion Basada en Capacidades (Permissions-First)
* **Prohibido evaluar nombres de roles en el codigo:** Ningun controlador de NestJS ni componente de React evaluara condicionales rigidos como `if (user.role === 'ADMIN')` o `@Roles('INGENIERO')`.
* **Evaluacion por Permisos Atomicos:** El sistema protege recursos y rutas evaluando **capacidades y acciones concretas** (ejemplo: `document:review`, `workspace:create`, `test:take`).
* **Los Roles como Agrupadores Configurables:** Un Rol es unicamente una etiqueta contenedora que agrupa un conjunto de permisos. Cuando se definan los roles definitivos en el negocio, bastara con asociar la lista de permisos a cada rol sin modificar una sola linea de codigo en backend ni en frontend.

### 7.2 Catalogo de Permisos Atomicos del Sistema:
1. **Espacios de Trabajo (Workspaces):**
   * `workspace:create` - Crear nuevos espacios academicos o de eventos.
   * `workspace:update` - Modificar directrices, videos y estado de los espacios.
   * `workspace:delete` - Archivar o eliminar espacios.
   * `workspace:read` - Acceder y consultar el contenido del espacio.
2. **Materiales y Recursos:**
   * `resource:manage` - Subir plantillas oficiales y guias.
   * `resource:download` - Descargar recursos desbloqueados.
3. **Evaluaciones e Induccion:**
   * `test:manage` - Crear cuestionarios, configurar banco de preguntas y puntajes.
   * `test:take` - Rendir evaluaciones de verificacion o encuestas.
4. **Gestion Documental y Auditoria:**
   * `document:submit` - Cargar entregas de bitacoras e informes (PDF).
   * `document:review` - Emitir observaciones, aprobar o rechazar entregas.
   * `document:audit_ia` - Ejecutar la auditoria automatica heuristica o con IA.
5. **Eventos y Certificacion:**
   * `certificate:manage` - Configurar plantillas de certificados y firmas.
   * `certificate:issue` - Generar y firmar constancias digitales con QR.
   * `certificate:claim` - Reclamar y descargar certificado individual.

### 7.3 Implementacion Tecnica:
* **Backend (NestJS 11):**
  Decorador declarativo `@RequirePermissions(...)` combinado con un `PermissionsGuard` global que valida el payload del JWT:
  ```typescript
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.DOCUMENT_REVIEW)
  @Post('submissions/:id/review')
  async reviewSubmission(...) { ... }
  ```
* **Frontend (React 19):**
  Componente declarativo `<Can>` y hook reactivo `usePermission` para renderizado condicional de acciones y botones en la UI:
  ```tsx
  <Can do="document:review">
    <SubmissionFeedbackPanel submissionId={submission.id} />
  </Can>
  ```
* **Ambitos (Scopes):**
  * **Permisos Globales:** Acciones a nivel de plataforma (ej. administracion general).
  * **Permisos Contextuales (por Workspace):** Asignados a traves de la inscripcion (`workspace_enrollments`), permitiendo que un mismo usuario actue como revisor en un espacio y como participante en otro.

---

## 8. Modelo de Datos Relacional (`wilfrido.sqlite`)

```text
┌─────────────────┐       ┌─────────────────┐       ┌────────────────────────┐
│     users       │       │   workspaces    │       │     resource_files     │
├─────────────────┤       ├─────────────────┤       ├────────────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)                │
│ email (UQ)      │       │ title           │       │ workspaceId (FK)       │
│ identification  │       │ description     │       │ title                  │
│ fullName        │       │ type (ENUM)     │       │ fileUrl                │
│ roleKey (VARCHAR│       │ isActive        │       │ fileType (template/doc)│
│ permissionsJson │       │ accessCode (UQ) │       │ isLockedUntilTestPass  │
│ passwordHash    │       └────────┬────────┘       └────────────────────────┘
└────────┬────────┘                │
         │                         │ 1
         │                         │ N
         │ N                       │
┌────────┴─────────────────────────┴────────┐
│           workspace_enrollments           │
├───────────────────────────────────────────┤
│ id (PK)                                   │
│ userId (FK -> users.id)                   │
│ workspaceId (FK -> workspaces.id)         │
│ inductionVideoWatched (BOOLEAN)           │
│ testPassed (BOOLEAN)                      │
│ testScore (DECIMAL)                       │
│ status (active / completed / dropped)     │
└──────────────────┬────────────────────────┘
                   │
                   │ 1
                   │ N
┌──────────────────┴────────────────────────┐       ┌────────────────────────┐
│           document_submissions            │       │         tests          │
├───────────────────────────────────────────┤       ├────────────────────────┤
│ id (PK)                                   │       │ id (PK)                │
│ enrollmentId (FK)                         │       │ workspaceId (FK)       │
│ documentTitle                             │       │ title                  │
│ fileUrl                                   │       │ passingScore (INTEGER) │
│ status (submitted / observed / approved)  │       │ questions (simple-json)│
│ feedbackNotes (TEXT)                      │       │ timeLimitMinutes       │
│ auditedAt (TIMESTAMP)                     │       └───────────┬────────────┘
│ approvedAt (TIMESTAMP)                    │                   │
└───────────────────────────────────────────┘                   │ 1
                                                                │ N
                                                    ┌───────────┴────────────┐
                                                    │     test_attempts      │
                                                    ├────────────────────────┤
                                                    │ id (PK)                │
                                                    │ enrollmentId (FK)      │
                                                    │ testId (FK)            │
                                                    │ scoreObtained          │
                                                    │ passed (BOOLEAN)       │
                                                    │ answersSubmitted(json) │
                                                    │ completedAt            │
                                                    └────────────────────────┘
```

---

## 9. Estructura Sugerida para el Repositorio `wilfrido_trujillo`

El proyecto se estructurara como un monorepo ligero gestionado con pnpm workspaces:

```text
wilfrido_trujillo/
├── package.json                   # Definicion de workspaces raiz
├── pnpm-workspace.yaml            # packages: ['backend', 'frontend']
├── README.md                      # Documentacion general del sistema
│
├── backend/                       # Servidor API NestJS 11 (Puerto 3000)
│   ├── src/
│   │   ├── auth/                  # Autenticacion JWT y decoradores RBAC
│   │   ├── users/                 # Gestion de usuarios e identificaciones
│   │   ├── workspaces/            # Gestion de materias, practicas, vinculacion y eventos
│   │   ├── tests/                 # Motor de cuestionarios y calificaciones (simple-json)
│   │   ├── resources/             # Repositorio de formatos, plantillas y videos
│   │   ├── submissions/           # Recepcion, revision y trazabilidad de entregas
│   │   ├── auditor/               # Adaptador pluggable de pre-revision documental
│   │   │   ├── interfaces/        # IDocumentAuditor y DTOs de auditoria
│   │   │   └── services/          # HeuristicAuditorService (Fase 1) / AiAuditorService (Fase 2)
│   │   └── certificates/          # Generacion de certificados PDF con codigo de verificacion
│   ├── data/
│   │   └── wilfrido.sqlite        # Base de datos física SQLite en modo WAL (en .gitignore)
│   ├── Dockerfile
│   └── package.json
│
└── frontend/                      # Cliente SPA React 19 + Vite + Tailwind CSS (Puerto 5173 o build estático)
    ├── src/
    │   ├── app/                   # Providers globales y React Router declarativo
    │   ├── shared/                # UI Kit agnóstico, lib (Axios tipado), hooks y tipos globales
    │   └── modules/               # Módulos de negocio 100% aislados
    │       ├── auth/              # Login, registro, sesiones y guardias de rol
    │       ├── admin/             # Panel del Ingeniero (monto de alumnos, bandeja de revisión, métricas)
    │       ├── practicas/         # Flujo guiado de prácticas (inducción, test, entrega)
    │       ├── vinculacion/       # Flujo guiado de vinculación con la sociedad
    │       └── eventos/           # Portal público para conferencias, talleres y certificados QR
    ├── vite.config.ts
    └── package.json
```

### 9.1 Matriz de Variables de Entorno (`.env.example`)

#### Backend (`backend/.env.example`):
```bash
# Servidor
PORT=3000
NODE_ENV=development

# Seguridad y Autenticacion
JWT_SECRET=super_secret_jwt_key_wilfrido_2026_change_in_production
JWT_EXPIRES_IN=7d

# Persistencia SQLite (better-sqlite3)
DATABASE_PATH=./data/wilfrido.sqlite

# Almacenamiento Local de Documentos (PDFs, Plantillas)
UPLOAD_LOCATION=./uploads
MAX_FILE_SIZE_MB=25

# CORS (Orígenes permitidos en desarrollo y producción)
CORS_ORIGIN=http://localhost:5173,https://wilfridotrujillo.com
```

#### Frontend (`frontend/.env.example`):
```bash
# URL Base de la API NestJS
# En desarrollo: llamada directa al puerto 3000
# En produccion: /api (gestionado por proxy inverso Nginx en el mismo dominio)
VITE_API_URL=http://localhost:3000/api

# Nombre público de la aplicación
VITE_APP_TITLE="Ing. Wilfrido Trujillo | Gestión Académica y Eventos"
```

---

## 10. Plan de Implementacion por Fases

### Fase 1: Cimientos y Autenticacion
1. Creacion del repositorio independiente `wilfrido_trujillo`.
2. Configuracion del monorepo con pnpm (backend NestJS + frontend Vite).
3. Modelo de persistencia con TypeORM y SQLite en modo WAL (`wilfrido.sqlite`).
4. Autenticacion JWT y decoradores RBAC.
5. Setup de la Arquitectura Modular por Dominios en el frontend React con Tailwind CSS.

### Fase 2: Modulo de Workspaces, Induccion y Evaluaciones
1. CRUD de Espacios (Practicas, Vinculacion, Conferencias).
2. Reproductor de video con deteccion de tiempo de visualizacion.
3. Motor de tests dinamicos almacenados en simple-json con calificacion automatica.
4. Desbloqueo condicional de recursos al aprobar la evaluacion.

### Fase 3: Modulo Documental y Sistema de Entregas
1. Subida y descarga segura de plantillas y formatos oficiales.
2. Formulario de carga de documentos de estudiantes (PDF).
3. Panel de revision del Ingeniero con estados (Pendiente, Observado, Aprobado).
4. Validador estructural heuristico basico (Fase 1 del Agente Auditor).

### Fase 4: Modulo de Eventos y Conferencias Externas
1. Pagina de aterrizaje ligera accesible por codigo QR.
2. Descarga rapida de diapositivas y materiales.
3. Generacion automatica de certificados PDF con hash de verificacion.

### Fase 5: Agente de IA para Auditoria Documental
1. Implementacion del adaptador de IA (Gemini API o modelo local Ollama).
2. Analisis de texto extraido de PDFs contrastado contra rubricas de evaluacion.
3. Retroalimentacion instantanea al estudiante previa a la revision del docente.
