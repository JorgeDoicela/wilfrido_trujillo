# Módulo de Espacios de Trabajo e Inducción (`/api/workspaces`)

## 1. Descripción del Módulo

El módulo `WorkspacesModule` administra los espacios colaborativos organizados por el docente para prácticas preprofesionales, vinculación comunitaria y conferencias. Administra la generación de códigos de acceso cortos, el enrolamiento de estudiantes y el tracking de visualización al 100% de los videos obligatorios de inducción.

---

## 2. Catálogo de Endpoints

### 2.1 Creación de Espacio de Trabajo
* **Método y Ruta:** `POST /api/workspaces`
* **Permiso Requerido:** `workspace:create`
* **Payload de Entrada (`CreateWorkspaceDto`):**
  ```json
  {
    "title": "Prácticas Preprofesionales Periodo 2026-1",
    "description": "Espacio para seguimiento de prácticas y bitácoras semanales.",
    "type": "PRACTICAS",
    "accessCode": "PRAC-2026",
    "inductionVideoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }
  ```
* **Respuestas:**
  * `201 Created`: Devuelve la entidad `Workspace` creada.
  * `409 Conflict`: El código de acceso ya se encuentra registrado.

---

### 2.2 Listado General de Espacios
* **Método y Ruta:** `GET /api/workspaces`
* **Permiso Requerido:** `workspace:read`
* **Descripción:** Devuelve la totalidad de espacios de trabajo ordenados por fecha de creación descendente.
* **Respuestas:** `200 OK` (Arreglo de `Workspace[]`).

---

### 2.3 Espacios en los que está Matriculado el Usuario
* **Método y Ruta:** `GET /api/workspaces/my-workspaces`
* **Acceso:** Autenticado (`JwtAuthGuard`).
* **Descripción:** Devuelve los espacios a los que el estudiante autenticado se encuentra inscrito, incluyendo su progreso (`inductionVideoWatched`, `testPassed`).
* **Respuestas:** `200 OK` (Arreglo de `WorkspaceEnrollment[]` con relación `workspace` poblada).

---

### 2.4 Búsqueda de Espacio por Código de Acceso
* **Método y Ruta:** `GET /api/workspaces/code/:code`
* **Acceso:** Autenticado.
* **Descripción:** Localiza un espacio a partir de su código alfanumérico (ej. `PRAC-2026`).
* **Respuestas:**
  * `200 OK`: Entidad `Workspace`.
  * `404 Not Found`: Código no encontrado.

---

### 2.5 Inscripción a un Espacio mediante Código
* **Método y Ruta:** `POST /api/workspaces/join/:code`
* **Acceso:** Autenticado.
* **Descripción:** Matricula al usuario en sesión dentro del espacio correspondiente. Si el espacio no está activo, rechaza la operación.
* **Respuestas:**
  * `201 Created`: Registro `WorkspaceEnrollment`.
  * `400 Bad Request`: El estudiante ya se encuentra matriculado o el espacio está inactivo.
  * `404 Not Found`: Código inexistente.

---

### 2.6 Registro de Finalización de Video de Inducción
* **Método y Ruta:** `POST /api/workspaces/:workspaceId/induction/complete`
* **Acceso:** Autenticado.
* **Descripción:** Marca la bandera `inductionVideoWatched = true` en la matrícula del estudiante tras comprobarse que el reproductor emitió el evento de finalización al 100%. Desbloquea la posibilidad de rendir la evaluación diagnóstica.
* **Respuestas:**
  * `200 OK`: Devuelve la matrícula actualizada.
  * `400 Bad Request`: El estudiante no está matriculado en este espacio.

---

### 2.7 Consulta de Estado de Inducción
* **Método y Ruta:** `GET /api/workspaces/:workspaceId/induction/status`
* **Acceso:** Autenticado.
* **Respuestas:**
  * `200 OK`:
    ```json
    {
      "enrolled": true,
      "inductionVideoWatched": true,
      "testPassed": false,
      "status": "active"
    }
    ```
