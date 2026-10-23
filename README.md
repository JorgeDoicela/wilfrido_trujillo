# Especificación Técnica y Arquitectura de Software: wilfrido_trujillo

Documento maestro de requerimientos, decisiones arquitectónicas, modelo de datos, sistema de diseño y dosier central de documentación técnica para la plataforma privada del Ing. Wilfrido Trujillo.

---

## 0. Dosier Central de Documentación Técnica (Docs-as-Code)

La documentación técnica exhaustiva del sistema se organiza bajo el paradigma **Docs-as-Code** y **Taxonomía Jerárquica Numérica** dentro de la carpeta `docs/`. Todos los módulos y contratos del sistema se encuentran especificados en las siguientes secciones:

### Estructura y Mapa de Navegación del Dosier

```text
docs/
├── 01-arquitectura/                                           # Visión macro y principios de diseño
│   ├── 01-vision-general.md                                   # Propósito, topología C4 y matriz de decisiones
│   └── 02-modelo-de-seguridad-pbac.md                         # Control de acceso basado en permisos (PBAC)
│
├── 02-base-de-datos/                                          # Persistencia y modelo relacional
│   ├── 01-modelo-entidad-relacion.md                          # Diagrama ER Mermaid y SQLite WAL
│   └── 02-diccionario-de-datos.md                             # Diccionario exhaustivo de las 9 entidades
│
├── 03-backend-especificacion-api/                             # Catálogo formal de endpoints y contratos REST
│   ├── 01-contratos-y-convenciones.md                         # Estándar RFC 7807 y códigos de estado
│   ├── 02-modulo-autenticacion.md                             # Cuentas, JWT y seeding de bootstrap
│   ├── 03-modulo-workspaces.md                                # Espacios académicos y tracking de inducción
│   ├── 04-modulo-evaluaciones-dinamicas.md                    # Cuestionarios en JSON y calificación sobre 10
│   ├── 05-modulo-recursos.md                                  # Plantillas oficiales y descarga condicional
│   ├── 06-modulo-documental-y-entregas.md                     # Buzón de entregas, Multer y ciclo de estados
│   ├── 07-modulo-eventos-y-conferencias.md                    # Portal público y encuestas de satisfacción
│   ├── 08-modulo-certificados-pdf-qr.md                       # Generador vectorial PDF A4 y validación QR
│   └── 09-modulo-auditor-documental.md                        # Agente heurístico RRA bajo IDocumentAuditor
│
├── 04-frontend-aplicacion-web/                                # Cliente SPA React 19 + Tailwind CSS v4
│   ├── 01-arquitectura-modular-y-enrutamiento.md              # Módulos por dominio, Bento Hub y guardias de sesión
│   ├── 02-flujo-estudiantil.md                                # Embudo pedagógico en 4 pasos del estudiante
│   ├── 03-panel-docente-administracion.md                     # Consola del Ingeniero y dictamen documental
│   ├── 04-portales-publicos.md                                # Acceso ligero a eventos y validador de diplomas
│   ├── 05-sistema-de-diseno-microsoft-365.md                  # Especificación Fluent 2 heredada
│   └── 06-sistema-de-diseno-glassmorphism.md                  # Sistema visual canónico Glassmorphism UX/UI
│
├── 05-operaciones-y-despliegue/                               # Configuración e infraestructura
│   ├── 01-configuracion-entorno.md                            # Matriz de variables backend y frontend
│   └── 02-guia-de-ejecucion-local.md                          # Prerrequisitos, scripts y usuarios iniciales
│
└── GUIA_IMPLEMENTACION.md                                     # Guía maestra de implementación secuencial
```

### Catálogo de Módulos Documentados

| Carpeta / Índice | Documento Técnico | Enfoque Principal |
| :--- | :--- | :--- |
| **01-arquitectura** / `01` | [Visión General](docs/01-arquitectura/01-vision-general.md) | Principios soberanos, topología C4 de componentes y justificación del stack (NestJS 11 + SQLite WAL + React 19). |
| **01-arquitectura** / `02` | [Seguridad PBAC](docs/01-arquitectura/02-modelo-de-seguridad-pbac.md) | Autorización por capacidades atómicas desacoplada de nombres de rol fijos, guardias y decoradores. |
| **02-base-de-datos** / `01` | [Modelo ER](docs/02-base-de-datos/01-modelo-entidad-relacion.md) | Relaciones entre usuarios, espacios, matrículas, exámenes, entregas y certificados con SQLite en modo WAL. |
| **02-base-de-datos** / `02` | [Diccionario de Datos](docs/02-base-de-datos/02-diccionario-de-datos.md) | Especificación detallada de columnas, tipos, restricciones y esquemas de columnas JSON para las 9 entidades. |
| **03-backend-especificacion-api** / `01` | [Contratos REST](docs/03-backend-especificacion-api/01-contratos-y-convenciones.md) | Respuestas directas sin envoltorios artificiales y manejo unificado de errores bajo la norma RFC 7807. |
| **03-backend-especificacion-api** / `02` | [Autenticación](docs/03-backend-especificacion-api/02-modulo-autenticacion.md) | Endpoints de registro, login, emisión de JWT y siembra automática de credenciales maestras. |
| **03-backend-especificacion-api** / `03` | [Workspaces](docs/03-backend-especificacion-api/03-modulo-workspaces.md) | Gestión de espacios, códigos de acceso cortos (`PRAC-XXXX`) y tracking al 100% de video de inducción. |
| **03-backend-especificacion-api** / `04` | [Evaluaciones](docs/03-backend-especificacion-api/04-modulo-evaluaciones-dinamicas.md) | Motor de tests dinámicos en JSON, saneamiento de claves para estudiantes y cálculo automático de notas sobre 10. |
| **03-backend-especificacion-api** / `05` | [Recursos](docs/03-backend-especificacion-api/05-modulo-recursos.md) | Almacenamiento y descarga condicional de plantillas normativas protegidas tras aprobación de inducción. |
| **03-backend-especificacion-api** / `06` | [Documental](docs/03-backend-especificacion-api/06-modulo-documental-y-entregas.md) | Recepción de bitácoras en PDF con Multer, ciclo de estados (`submitted`, `observed`, `approved`) y feedback. |
| **03-backend-especificacion-api** / `07` | [Eventos](docs/03-backend-especificacion-api/07-modulo-eventos-y-conferencias.md) | Acceso público por QR para conferencias presenciales, descarga de diapositivas y métricas de satisfacción en vivo. |
| **03-backend-especificacion-api** / `08` | [Certificados](docs/03-backend-especificacion-api/08-modulo-certificados-pdf-qr.md) | Generador vectorial de diplomas PDF A4 con `pdfkit`, matriz QR con `qrcode` y token SHA-256 inmutable. |
| **03-backend-especificacion-api** / `09` | [Auditor Documental](docs/03-backend-especificacion-api/09-modulo-auditor-documental.md) | Agente heurístico desacoplado bajo `IDocumentAuditor` con validación RRA, conteo de páginas y semáforo. |
| **04-frontend-aplicacion-web** / `01` | [Arquitectura Frontend](docs/04-frontend-aplicacion-web/01-arquitectura-modular-y-enrutamiento.md) | Estructura modular por dominios (Domain-Driven Modules), tablero Bento y enrutador sincronizado mediante hash. |
| **04-frontend-aplicacion-web** / `02` | [Flujo Estudiantil](docs/04-frontend-aplicacion-web/02-flujo-estudiantil.md) | Embudo pedagógico: Reproductor de inducción $\to$ Test diagnóstico $\to$ Descargas $\to$ Pre-auditoría de PDFs. |
| **04-frontend-aplicacion-web** / `03` | [Panel Docente](docs/04-frontend-aplicacion-web/03-panel-docente-administracion.md) | Consola del Ingeniero: métricas, proyección de QR para talleres, bandeja de entregas y modal de dictamen. |
| **04-frontend-aplicacion-web** / `04` | [Portales Públicos](docs/04-frontend-aplicacion-web/04-portales-publicos.md) | Páginas abiertas sin fricción de login para asistentes a charlas y validador interactivo de diplomas. |
| **04-frontend-aplicacion-web** / `05` | [Sistema de Diseño M365](docs/04-frontend-aplicacion-web/05-sistema-de-diseno-microsoft-365.md) | Especificación de componentes y roles heredados. |
| **04-frontend-aplicacion-web** / `06` | [Sistema de Diseño Glassmorphism](docs/04-frontend-aplicacion-web/06-sistema-de-diseno-glassmorphism.md) | Estándar visual canónico: 5 tonos Figma, tipografía Montserrat, tablero Bento y orbes lumínicos ambientales. |
| **05-operaciones-y-despliegue** / `01` | [Variables de Entorno](docs/05-operaciones-y-despliegue/01-configuracion-entorno.md) | Tabla completa de parámetros de configuración de backend y frontend. |
| **05-operaciones-y-despliegue** / `02` | [Ejecución Local](docs/05-operaciones-y-despliegue/02-guia-de-ejecucion-local.md) | Guía de instalación, comandos de desarrollo (`pnpm dev`), cuentas sembradas y verificación en puertos. |

---

## 1. Contexto, Origen y Motivación

El proyecto nace a raíz de la demostración en producción del ecosistema modular de Jorge Doicela. El coordinador, Ing. Wilfrido Trujillo, observó la calidad, arquitectura y rendimiento del sistema y solicitó el desarrollo de una herramienta a medida adaptada a sus necesidades profesionales y de gestión docente.

### 1.1 Funciones y Responsabilidades del Ingeniero
El Ing. Wilfrido Trujillo desempeña un rol integral de coordinación académica:
* Coordinador de Carrera.
* Coordinador de Prácticas Preprofesionales (laborales).
* Coordinador de Vinculación con la Sociedad (servicio comunitario).
* Adicionalmente, se desempeña como conferencista, capacitador y ponente en talleres y eventos académicos y empresariales externos.

### 1.2 Problemática Operativa Detectada
1. Saturación de canales informales (WhatsApp, correos personales e institucionales) con preguntas recurrentes de estudiantes.
2. Recepción de documentos oficiales, bitácoras y convenios mal diligenciados, incompletos o con formatos obsoletos.
3. Desconocimiento generalizado de la normativa del RRA (Reglamento de Régimen Académico de Ecuador) por parte de los alumnos que inician prácticas o vinculación.
4. Falta de un mecanismo verificable para asegurar que el estudiante comprendió las directrices antes de presentar documentos.
5. Inexistencia de un canal formal y digitalizado para compartir recursos y constancias en conferencias externas.

---

## 2. Definición Estratégica: Herramienta Privada y Soberana (No Institucional)

### 2.1 Justificación Legal y Protección de Datos (LOPDP Ecuador)
El sistema **no es un software institucional ni dependerá de los servidores del instituto**. Es una plataforma privada, soberana y personal del Ing. Wilfrido Trujillo por los siguientes motivos técnicos y jurídicos:
* **Autonomía Operativa:** No está sujeta a burocracia institucional, autorizaciones de rectorado ni auditorías de departamentos de TI externos.
* **Cumplimiento de la LOPDP (Ley Orgánica de Protección de Datos Personales de Ecuador):** No se conectan bases de datos institucionales ni se exponen registros académicos confidenciales. El sistema opera como un canal pedagógico privado donde solo se procesan los datos estrictamente necesarios para el seguimiento formativo (nombre, cédula, correo, periodo académico, entregas).
* **Custodia y Evidencia:** El Ingeniero mantiene un respaldo inmutable de fechas, horas, visualizaciones de videos, intentos de evaluación y entregas documentales para respaldar su gestión docente ante cualquier eventual reclamo estudiantil.

---

## 3. Los Dos Pilares Funcionales del Sistema

La plataforma se estructura en dos grandes áreas de operación:

### 3.1 Pilar A: Gestión de Prácticas Preprofesionales y Vinculación con la Sociedad
Dirigido a los estudiantes bajo su coordinación. Implementa un flujo estricto y secuencial de inducción obligatoria:

```text
[ Estudiante ]
      │
      ▼
1. Ingreso al portal con credenciales (Cédula y Correo)
      │
      ▼
2. Inducción Obligatoria (Video explicativo grabado por el Ingeniero)
   - El sistema registra el progreso de reproducción al 100%.
   - No se permite avanzar hasta completar el video.
      │
      ▼
3. Evaluación / Test de Conocimiento
   - Cuestionario interactivo sobre las directrices del video.
   - Requiere un puntaje mínimo aprobatorio (sobre 10).
   - Límite de intentos configurable.
      │
      ▼ (Condición Aprobada)
4. Desbloqueo de Recursos y Formatos Oficiales
   - Descarga de plantillas oficiales (Word, Excel, PDF de convenios y bitácoras).
   - Acceso al formulario de carga de documentos.
      │
      ▼
5. Entrega de Evidencias y Documentos
   - Carga de borradores e informes en PDF.
   - Pasa por el pipeline de auditoría heurística (conteo de páginas, legibilidad, estructura RRA).
   - El Ingeniero revisa en su panel: Aprueba o emite observaciones específicas.
```

### 3.2 Pilar B: Conferencias, Charlas y Talleres Externos
Dirigido a públicos externos (universidades, empresas, congresos, masterclasses). Permite proyectar un código QR o enlace al final de cada evento:
* **Acceso Rápido vía QR:** Los asistentes escanean el código y acceden sin registros engorrosos.
* **Descarga de Material:** Diapositivas de la ponencia, guías prácticas y plantillas de trabajo.
* **Evaluación o Encuesta de Satisfacción:** Test rápido de 3 a 5 preguntas o formulario de retroalimentación en 1 a 5 estrellas.
* **Certificado Digital de Asistencia:** Generación automática de constancia en PDF con código único de validación digital y matriz QR.
* **Networking y Base de Contactos:** El Ingeniero consolida una base de datos limpia de asistentes interesados en futuras capacitaciones o consultorías.

---

## 4. Evaluación y Decisión del Stack Tecnológico

### 4.1 Frontend: React 19 + Vite + Tailwind CSS v4 (Decisión Definitiva)
* **Velocidad y Experiencia de Desarrollo:** HMR nativo en menos de 50 ms mediante Vite y esbuild.
* **Consumo Zero-RAM en el Servidor:** Compilación estática pura (SPA) servida por Nginx con 0 MB de consumo de RAM Node.js en el host.
* **Tipografía Oficial Única (Montserrat):** Tipografía geométrica canónica en pesos 300 a 800 para toda la aplicación.
* **Glassmorphism Estructural Puro:** Paleta canónica de 5 tonos, malla lumínica volumétrica subyacente (`AmbientBackground.tsx`), tablero Bento Hub de 4 tarjetas operativas y estricta prohibición de cercos o cápsulas alrededor de palabras e íconos.
* **Enrutamiento por Hash:** Acceso directo a rutas profundas públicas (`#/eventos/:code`, `#/certificados/validar/:hash`) sin requerir reescrituras complejas de servidor.
* **Guardias de Sesión Preventivas:** Prevención de cascadas `401 Unauthorized` mediante la verificación de `wt_auth_token` antes de solicitar recursos protegidos.

### 4.2 Backend: NestJS 11 + TypeScript
* **Arquitectura Limpia en Tres Capas:** Controladores ultradelgados, Servicios con lógica de dominio pura y Repositorios TypeORM.
* **ORM Oficial (TypeORM):** Integración de `@nestjs/typeorm` y `typeorm` con el patrón Repository. Manejo transparente de columnas JSON (`simple-json`). Driver: `better-sqlite3`.
* **Inyección de Dependencias Nativa:** Alta cohesión y desacoplamiento absoluto entre módulos.
* **Control de Acceso Basado en Permisos (PBAC Desacoplado):** Evaluación de capacidades atómicas (`@RequirePermissions(...)` y `PermissionsGuard`), agnóstico a nombres de roles definitivos.
* **Contrato de API REST Limpio (RFC 7807):** Devolución directa de la carga útil en éxito y filtro global `HttpExceptionFilter` en error.
* **Validación Fuerte de DTOs:** Integración de `class-validator` y `class-transformer` para saneamiento estricto de entradas.

### 4.3 Base de Datos: SQLite de Alto Rendimiento (better-sqlite3 en Modo WAL)
* **Eficiencia Extrema de Memoria (Zero-Daemon):** SQLite corre embebido directamente en el proceso de Node.js, consumiendo únicamente entre 10 MB y 20 MB de memoria RAM.
* **Concurrencia con Modo WAL:** Lecturas completamente no bloqueantes frente a escrituras concurrentes (`PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`).
* **Columnas JSON Nativas:** Soporte transparente de esquemas variables en cuestionarios y entregas sin sobrecarga de tablas intermedias.
* **Respaldo Inmediato:** Toda la base de datos reside en un único archivo portable (`backend/data/wilfrido.sqlite`).

### 4.4 Almacenamiento de Archivos y Generación de PDF/QR
* **Documentos (PDF, DOCX, XLSX):** Almacenamiento local en disco bajo rutas privadas protegidas (`uploads/`). Descarga mediante endpoints autenticados.
* **Motor de PDF:** `pdfkit` para generación vectorial en memoria en menos de 50 ms sin requerir instancias de navegadores headless.
* **Generación QR:** `qrcode` para generación local soberana de matrices bidimensionales.
* **Auditoría Documental:** `pdf-parse` con analizador heurístico desacoplado bajo `IDocumentAuditor`.

---

## 5. Arquitectura del Frontend: Modular por Dominios de Negocio (Domain-Driven Modules)

```text
frontend/src/
├── app/                                 # Capa de Inicialización y Contexto Global
│   ├── main.tsx                         # Punto de entrada de Vite
│   └── App.tsx                          # Orquestador raíz de vistas, navegación y shells
│
├── shared/                              # Núcleo Transversal Compartido (Agnóstico al Negocio)
│   ├── api/                             # Clientes API transversales (workspaces.api.ts)
│   ├── components/                      # UI Kit atómico (FluentShell, Navbar, Can, Modales, AmbientBackground)
│   ├── hooks/                           # Hooks utilitarios (usePermission, useAuth)
│   ├── lib/api.ts                       # Cliente HTTP Axios tipado con clave wt_auth_token
│   └── types/                           # Tipos globales (workspace, document, test, certificate)
│
└── modules/                             # MÓDULOS DE NEGOCIO AUTÓNOMOS
    ├── landing/                         # Portada principal y Tablero Bento de Cristal Puro
    │   ├── components/                  # LandingBentoHub, LandingHeader, LandingFooter, BentoCard
    │   ├── hooks/                       # useLandingHeaderScroll
    │   └── pages/                       # LandingPage.tsx
    ├── auth/                            # Módulo: Autenticación y Seguridad
    ├── admin/                           # Módulo: Panel de Gestión del Ingeniero
    ├── practicas/                       # Módulo: Prácticas Preprofesionales
    ├── vinculacion/                     # Módulo: Vinculación con la Sociedad
    └── eventos/                         # Módulo: Conferencias, Talleres y Acceso QR
```

### Reglas de Oro de la Arquitectura Frontend:
1. **Alta Cohesión Local:** Todo lo que necesita un módulo vive dentro de su propia carpeta.
2. **Cero Importaciones Cruzadas:** El módulo `practicas` jamás importa nada de `vinculacion` ni de `eventos`. Lo compartido se promueve a `shared/`.
3. **Escalabilidad Inmediata:** Nuevos módulos pueden agregarse como carpetas independientes en `modules/` sin alterar el núcleo.

---

## 6. Arquitectura del Agente Auditor y Revisor de Documentos (Diseño Pluggable)

Siguiendo el Principio de Inversión de Dependencias (DIP) de SOLID, el sistema de revisión documental no depende de ninguna librería o proveedor específico:

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

* **Fase 1 (Heurística en Memoria):** Validador estructural local con `pdf-parse`. Comprueba legibilidad, texto real, límite de tamaño, conteo de páginas y secciones normativas RRA.
* **Fase 2 (Agente de IA Integrable):** Adaptador enchufable (Gemini API o modelo local Ollama) para contrastar el contenido contra rúbricas de evaluación avanzadas.

---

## 7. Arquitectura de Control de Acceso: PBAC Desacoplado

* **Prohibido evaluar nombres de roles en el código:** Ningún controlador ni componente evalúa condicionales como `if (user.role === 'ADMIN')`.
* **Evaluación por Permisos Atómicos:** El sistema protege recursos evaluando capacidades atómicas mediante `@RequirePermissions(...)` en backend y `<Can permission="...">` / `usePermission(...)` en frontend.

---

## 8. Modelo de Datos Relacional (`backend/data/wilfrido.sqlite`)

```text
┌─────────────────┐       ┌─────────────────┐       ┌────────────────────────┐
│     users       │       │   workspaces    │       │     resource_files     │
├─────────────────┤       ├─────────────────┤       ├────────────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)                │
│ email (UQ)      │       │ title           │       │ workspaceId (FK)       │
│ identification  │       │ description     │       │ title                  │
│ fullName        │       │ type (ENUM)     │       │ fileUrl                │
│ roleKey         │       │ isActive        │       │ fileType (template/doc)│
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

## 9. Comandos de Operación y Entorno Local

```bash
# Instalación de dependencias
pnpm install

# Ejecución en desarrollo concurrente (backend + frontend)
pnpm dev

# Compilación completa para producción
pnpm -r run build

# Análisis estático de código
pnpm -r run lint

# Pruebas unitarias
pnpm --filter backend run test
```

* **Frontend:** [http://localhost:5173/](http://localhost:5173/) *(o puerto 5180 si está ocupado)*
* **Backend:** [http://localhost:3000/api](http://localhost:3000/api) *(o puerto 3010)*
