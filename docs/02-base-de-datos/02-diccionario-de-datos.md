# Diccionario de Datos Exhaustivo

Este documento describe la totalidad de tablas, columnas, tipos de datos, restricciones de integridad referencial, índices y columnas dinámicas JSON implementadas en la base de datos SQLite del sistema.

---

## 1. Tabla: `users`
Almacena las cuentas de usuario maestras del sistema (docente y estudiantes).

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del usuario. |
| `email` | `VARCHAR` | No | — | Unique Index | Correo electrónico en minúsculas normalizadas. |
| `identification` | `VARCHAR` | No | — | Unique Index | Número de cédula o pasaporte alfanumérico. |
| `fullName` | `VARCHAR` | No | — | — | Nombres y apellidos completos del titular. |
| `roleKey` | `VARCHAR` | No | `'ESTUDIANTE'` | — | Etiqueta clasificadora orientativa (`INGENIERO`, `ESTUDIANTE`). |
| `permissionsJson` | `TEXT` (`simple-json`) | Sí | `NULL` | — | Arreglo de strings con los permisos PBAC asignados. |
| `passwordHash` | `VARCHAR` | No | — | — | Hash de la contraseña con bcrypt (costo 10). |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de registro. |
| `updatedAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de última modificación. |

---

## 2. Tabla: `workspaces`
Representa los espacios de trabajo académicos o de eventos organizados por el docente.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del espacio. |
| `title` | `VARCHAR` | No | — | — | Título del espacio académico o conferencia. |
| `description` | `TEXT` | Sí | `NULL` | — | Descripción detallada y directrices de trabajo. |
| `type` | `VARCHAR` | No | — | — | Tipo de espacio: `'PRACTICAS'`, `'VINCULACION'`, `'EVENTO'`. |
| `accessCode` | `VARCHAR` | No | — | Unique Index | Código corto de acceso alfanumérico en mayúsculas (`PRAC-2026`). |
| `inductionVideoUrl` | `VARCHAR` | Sí | `NULL` | — | URL del video de inducción alojado en YouTube/Vimeo. |
| `isActive` | `BOOLEAN` | No | `true` | — | Estado operativo del espacio (permite o bloquea inscripciones). |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de creación. |
| `updatedAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de actualización. |

---

## 3. Tabla: `workspace_enrollments`
Registra la inscripción de un estudiante en un espacio de trabajo y su progreso de inducción.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco de la matrícula. |
| `userId` | `VARCHAR(36)` | No | — | Foreign Key (`users.id`) ON DELETE CASCADE | Identificador del estudiante matriculado. |
| `workspaceId` | `VARCHAR(36)` | No | — | Foreign Key (`workspaces.id`) ON DELETE CASCADE | Identificador del espacio de trabajo. |
| `status` | `VARCHAR(50)` | No | `'active'` | — | Estado de matrícula: `'active'`, `'completed'`, `'dropped'`. |
| `inductionVideoWatched` | `BOOLEAN` | No | `false` | — | `true` cuando el estudiante visualizó el 100% del video de inducción. |
| `testPassed` | `BOOLEAN` | No | `false` | — | `true` cuando aprobó la evaluación diagnóstica de inducción. |
| `enrolledAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se completó la inscripción. |
| `completedAt` | `DATETIME` | Sí | `NULL` | — | Fecha y hora en que completó todos los requisitos. |

---

## 4. Tabla: `resource_files`
Almacena los formatos oficiales, normativas institucionales y plantillas de trabajo.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del recurso. |
| `workspaceId` | `VARCHAR(36)` | No | — | Foreign Key (`workspaces.id`) ON DELETE CASCADE | Espacio de trabajo al que pertenece la plantilla. |
| `title` | `VARCHAR` | No | — | — | Nombre formal del recurso oficial. |
| `description` | `TEXT` | Sí | `NULL` | — | Indicaciones de uso de la plantilla. |
| `fileUrl` | `VARCHAR` | No | — | — | Nombre físico del archivo en el directorio local de almacenamiento. |
| `fileType` | `VARCHAR` | No | — | — | Tipo MIME o extensión (`application/pdf`, `.docx`). |
| `fileSize` | `INTEGER` | No | `0` | — | Tamaño del archivo en bytes. |
| `isLockedUntilTestPass` | `BOOLEAN` | No | `true` | — | Si es `true`, solo se puede descargar tras aprobar el examen. |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de publicación. |

---

## 5. Tabla: `tests`
Estructura las evaluaciones de inducción diagnóstica mediante bancos dinámicos en formato JSON.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del test. |
| `workspaceId` | `VARCHAR(36)` | No | — | Foreign Key (`workspaces.id`) ON DELETE CASCADE | Espacio al que se vincula el examen. |
| `title` | `VARCHAR` | No | — | — | Título del cuestionario diagnóstico. |
| `description` | `TEXT` | Sí | `NULL` | — | Instrucciones de resolución y tiempo límite. |
| `minimumScore` | `INTEGER` | No | `7` | — | Calificación mínima aprobatoria sobre 10 puntos. |
| `questionsJson` | `TEXT` (`simple-json`) | No | — | — | Colección JSON de preguntas, opciones y claves correctas. |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de creación. |
| `updatedAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de modificación. |

### Esquema del Campo `questionsJson`:
```json
[
  {
    "id": "q1",
    "questionText": "¿Cuántas horas mínimas de prácticas preprofesionales exige el RRA?",
    "options": [
      { "id": "opt1", "text": "120 horas" },
      { "id": "opt2", "text": "240 horas" },
      { "id": "opt3", "text": "160 horas" }
    ],
    "correctOptionId": "opt3",
    "explanation": "El artículo normativo estipula 160 horas obligatorias."
  }
]
```

---

## 6. Tabla: `test_attempts`
Registra cada uno de los intentos de rendición efectuados por los estudiantes.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del intento. |
| `testId` | `VARCHAR(36)` | No | — | Foreign Key (`tests.id`) ON DELETE CASCADE | Cuestionario evaluado. |
| `userId` | `VARCHAR(36)` | No | — | Foreign Key (`users.id`) ON DELETE CASCADE | Estudiante que presentó el intento. |
| `score` | `INTEGER` | No | — | — | Puntaje obtenido ponderado sobre 10 puntos. |
| `isPassed` | `BOOLEAN` | No | — | — | `true` si `score >= test.minimumScore`. |
| `answersJson` | `TEXT` (`simple-json`) | No | — | — | Mapa de respuestas seleccionadas (`{ "q1": "opt3" }`). |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora de finalización del intento. |

---

## 7. Tabla: `document_submissions`
Controla el flujo de entregas de documentos digitales (bitácoras e informes) cargados por los estudiantes.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco de la entrega. |
| `enrollmentId` | `VARCHAR(36)` | No | — | Foreign Key (`workspace_enrollments.id`) ON DELETE CASCADE | Matrícula del estudiante remitente. |
| `documentTitle` | `VARCHAR` | No | — | — | Denominación de la evidencia (ej. *Bitácora Semanal 1*). |
| `fileUrl` | `VARCHAR` | No | — | — | Nombre físico del archivo PDF en `uploads/documents/`. |
| `status` | `VARCHAR(50)` | No | `'submitted'` | — | Estado actual: `'submitted'`, `'observed'`, `'approved'`. |
| `feedbackNotes` | `TEXT` | Sí | `NULL` | — | Comentarios y observaciones emitidos por el docente. |
| `auditScore` | `INTEGER` | Sí | `NULL` | — | Calificación obtenida por el auditor heurístico (0 a 100). |
| `auditResult` | `TEXT` (`simple-json`) | Sí | `NULL` | — | Estructura detallada del análisis heurístico o IA. |
| `auditedAt` | `DATETIME` | Sí | `NULL` | — | Fecha y hora en que se ejecutó la auditoría documental. |
| `approvedAt` | `DATETIME` | Sí | `NULL` | — | Fecha y hora en que el docente aprobó la entrega. |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha de carga del archivo. |
| `updatedAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha de última actualización. |

### Esquema del Campo `auditResult`:
```json
{
  "isValid": true,
  "score": 85,
  "status": "passed",
  "numPages": 4,
  "characterCount": 3420,
  "missingFields": [],
  "observations": [
    "Estructura formal validada.",
    "Se identificaron objetivos de práctica.",
    "Sección de firmas detectada."
  ],
  "metadata": {
    "title": "Informe Final de Prácticas",
    "author": "Estudiante",
    "creationDate": "2026-09-23T20:00:00.000Z"
  }
}
```

---

## 8. Tabla: `certificates`
Almacena los certificados oficiales expedidos en eventos y talleres académicos.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco del certificado. |
| `workspaceId` | `VARCHAR(36)` | No | — | Foreign Key (`workspaces.id`) ON DELETE CASCADE | Evento o conferencia de procedencia. |
| `recipientName` | `VARCHAR` | No | — | — | Nombres completos del beneficiario. |
| `recipientEmail` | `VARCHAR` | No | — | — | Correo electrónico de notificación. |
| `recipientIdentification` | `VARCHAR` | Sí | `NULL` | — | Cédula o número de documento del titular. |
| `hours` | `INTEGER` | No | `40` | — | Horas académicas certificadas. |
| `topicTitle` | `VARCHAR` | No | — | — | Título del evento o temática de capacitación. |
| `verificationHash` | `VARCHAR` | No | — | Unique Index | Hash criptográfico público de verificación (`WT-XXXX-XXXX-XXXX`). |
| `pdfUrl` | `VARCHAR` | Sí | `NULL` | — | Nombre del archivo PDF generado en disco. |
| `issuedAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha de expedición formal. |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Marca temporal de creación del registro. |

---

## 9. Tabla: `event_feedbacks`
Registra las encuestas rápidas de satisfacción completadas por los asistentes a conferencias.

| Columna | Tipo de Dato | Nulo | Por Defecto | Restricciones / Índices | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | No | UUIDv4 | Primary Key | Identificador unívoco de la respuesta. |
| `workspaceId` | `VARCHAR(36)` | No | — | Foreign Key (`workspaces.id`) ON DELETE CASCADE | Evento calificado. |
| `attendeeName` | `VARCHAR` | No | — | — | Nombre del asistente encuestado. |
| `attendeeEmail` | `VARCHAR` | No | — | — | Correo electrónico del asistente. |
| `attendeeIdentification` | `VARCHAR` | Sí | `NULL` | — | Cédula o identificación del asistente. |
| `rating` | `INTEGER` | No | `5` | — | Puntuación general otorgada (1 a 5 estrellas). |
| `comments` | `TEXT` | Sí | `NULL` | — | Observaciones cualitativas o sugerencias. |
| `createdAt` | `DATETIME` | No | `CURRENT_TIMESTAMP` | — | Fecha y hora en que se envió la encuesta. |
