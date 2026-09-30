# Dosier de Documentación Técnica — Plataforma Ing. Wilfrido Trujillo

Bienvenido al repositorio central de documentación técnica bajo la metodología **Docs-as-Code** y **Taxonomía Jerárquica Numérica**. Este compendio describe la arquitectura, modelo de datos, especificación formal de la API REST, componentes del cliente web y procedimientos operacionales de la plataforma privada para el **Ing. Wilfrido Trujillo**.

---

## Estructura y Mapa de Navegación del Dosier

```text
docs/
├── README.md                                                  # Índice maestro de documentación
│
├── 01-arquitectura/                                           # Visión macro y principios de diseño
│   ├── 01-01-vision-general.md                                # Propósito, alcance, C4 y matriz de decisiones
│   └── 01-02-modelo-de-seguridad-pbac.md                      # Control de acceso basado en permisos (PBAC)
│
├── 02-base-de-datos/                                          # Persistencia y modelo relacional
│   ├── 02-01-modelo-entidad-relacion.md                       # Diagrama ER Mermaid y SQLite WAL
│   └── 02-02-diccionario-de-datos.md                          # Diccionario exhaustivo de las 9 entidades
│
├── 03-backend-especificacion-api/                             # Catálogo de endpoints y contratos REST
│   ├── 03-01-contratos-y-convenciones.md                      # Estándar RFC 7807 y códigos de estado
│   ├── 03-02-modulo-autenticacion.md                          # Cuentas, JWT y seeding de bootstrap
│   ├── 03-03-modulo-workspaces.md                             # Espacios académicos y tracking de inducción
│   ├── 03-04-modulo-evaluaciones-dinamicas.md                 # Cuestionarios en JSON y calificación sobre 10
│   ├── 03-05-modulo-recursos.md                               # Plantillas oficiales y bloqueo condicional
│   ├── 03-06-modulo-documental-y-entregas.md                  # Buzón de entregas, Multer y ciclo de estados
│   ├── 03-07-modulo-eventos-y-conferencias.md                 # Portal público y encuestas de satisfacción
│   ├── 03-08-modulo-certificados-pdf-qr.md                    # Generador PDFkit A4 y validación QR
│   └── 03-09-modulo-auditor-documental.md                     # Agente heurístico RRA bajo IDocumentAuditor
│
├── 04-frontend-aplicacion-web/                                # Cliente SPA React 19 + Tailwind CSS
│   ├── 04-01-arquitectura-modular-y-enrutamiento.md           # Módulos por dominio y navegación hash
│   ├── 04-02-flujo-estudiantil.md                             # Embudo pedagógico en 4 pasos del alumno
│   ├── 04-03-panel-docente-administracion.md                  # Consola del Ingeniero y dictamen documental
│   └── 04-04-portales-publicos.md                             # Acceso ligero a eventos y validador QR
│
└── 05-operaciones-y-despliegue/                               # Configuración e infraestructura
    ├── 05-01-configuracion-entorno.md                         # Matriz de variables backend y frontend
    └── 05-02-guia-de-ejecucion-local.md                       # Prerrequisitos, scripts y usuarios iniciales
```

---

## Resumen Ejecutivo de Módulos Documentados

| Código | Módulo Técnico | Enfoque Principal |
| :--- | :--- | :--- |
| **01-01** | [Visión General](01-arquitectura/01-01-vision-general.md) | Principios soberanos, topología C4 de componentes y justificación del stack (NestJS 11 + SQLite WAL + React 19). |
| **01-02** | [Seguridad PBAC](01-arquitectura/01-02-modelo-de-seguridad-pbac.md) | Autorización por capacidades atómicas desacoplada de nombres de rol fijos, guardias y decoradores. |
| **02-01** | [Modelo ER](02-base-de-datos/02-01-modelo-entidad-relacion.md) | Relaciones entre usuarios, espacios, matrículas, exámenes, entregas y certificados con SQLite en modo WAL. |
| **02-02** | [Diccionario de Datos](02-base-de-datos/02-02-diccionario-de-datos.md) | Especificación detallada de columnas, tipos, restricciones y esquemas de columnas JSON para las 9 entidades. |
| **03-01** | [Contratos REST](03-backend-especificacion-api/03-01-contratos-y-convenciones.md) | Respuestas directas sin envoltorios artificiales y manejo unificado de errores bajo la norma RFC 7807. |
| **03-02** | [Autenticación](03-backend-especificacion-api/03-02-modulo-autenticacion.md) | Endpoints de registro, login, emisión de JWT y siembra automática de credenciales maestras. |
| **03-03** | [Workspaces](03-backend-especificacion-api/03-03-modulo-workspaces.md) | Gestión de espacios, códigos de acceso cortos (`PRAC-XXXX`) y tracking al 100% de video de inducción. |
| **03-04** | [Evaluaciones](03-backend-especificacion-api/03-04-modulo-evaluaciones-dinamicas.md) | Motor de tests dinámicos en JSON, saneamiento de claves para estudiantes y cálculo automático de notas sobre 10. |
| **03-05** | [Recursos](03-backend-especificacion-api/03-05-modulo-recursos.md) | Almacenamiento y descarga condicional de plantillas normativas protegidas tras aprobación de inducción. |
| **03-06** | [Documental](03-backend-especificacion-api/03-06-modulo-documental-y-entregas.md) | Recepción de bitácoras en PDF con Multer, ciclo de estados (`submitted`, `observed`, `approved`) y feedback. |
| **03-07** | [Eventos](03-backend-especificacion-api/03-07-modulo-eventos-y-conferencias.md) | Acceso público por QR para conferencias presenciales, descarga de diapositivas y métricas de satisfacción en vivo. |
| **03-08** | [Certificados](03-backend-especificacion-api/03-08-modulo-certificados-pdf-qr.md) | Generador vectorial de diplomas PDF A4 con `pdfkit`, matriz QR con `qrcode` y token SHA-256 inmutable. |
| **03-09** | [Auditor Documental](03-backend-especificacion-api/03-09-modulo-auditor-documental.md) | Agente heurístico desacoplado bajo `IDocumentAuditor` con validación RRA, conteo de páginas y semáforo. |
| **04-01** | [Arquitectura Frontend](04-frontend-aplicacion-web/04-01-arquitectura-modular-y-enrutamiento.md) | Estructura modular por dominios (Domain-Driven Modules) y enrutador sincronizado mediante hash. |
| **04-02** | [Flujo Estudiantil](04-frontend-aplicacion-web/04-02-flujo-estudiantil.md) | Embudo pedagógico: Reproductor de inducción $\to$ Test diagnóstico $\to$ Descargas $\to$ Pre-auditoría de PDFs. |
| **04-03** | [Panel Docente](04-frontend-aplicacion-web/04-03-panel-docente-administracion.md) | Consola del Ingeniero: métricas, proyección de QR para talleres, bandeja de entregas y modal de dictamen. |
| **04-04** | [Portales Públicos](04-frontend-aplicacion-web/04-04-portales-publicos.md) | Páginas abiertas sin fricción de login para asistentes a charlas y validador de autenticidad de diplomas. |
| **05-01** | [Variables de Entorno](05-operaciones-y-despliegue/05-01-configuracion-entorno.md) | Tabla completa de parámetros de configuración de backend y frontend. |
| **05-02** | [Ejecución Local](05-operaciones-y-despliegue/05-02-guia-de-ejecucion-local.md) | Guía de instalación, comandos de desarrollo (`pnpm dev`), cuentas sembradas y verificación en puertos. |
