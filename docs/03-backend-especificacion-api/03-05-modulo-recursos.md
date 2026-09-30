# Módulo de Recursos y Formatos Oficiales (`/api/resources`)

## 1. Descripción del Módulo

El módulo `ResourcesModule` gestiona el catálogo de documentos institucionales, plantillas normativas (formatos de bitácora semanal, convenios y guías de informe final) en formatos PDF, DOCX o XLSX. Implementa una directriz de acceso condicional estricto: las plantillas marcadas con `isLockedUntilTestPass = true` solo pueden ser descargadas por estudiantes que hayan aprobado la evaluación diagnóstica de inducción.

---

## 2. Catálogo de Endpoints

### 2.1 Listado de Recursos de un Espacio
* **Método y Ruta:** `GET /api/resources/workspace/:workspaceId`
* **Permiso Requerido:** `resource:download`
* **Descripción:** Devuelve la lista de recursos disponibles en el espacio, indicando tamaño, tipo de archivo y estado de bloqueo.
* **Respuestas:** `200 OK` (Arreglo de `ResourceFile[]`).

---

### 2.2 Carga de Archivo de Plantilla Oficial
* **Método y Ruta:** `POST /api/resources/upload`
* **Permiso Requerido:** `resource:manage`
* **Formato de Envío:** `multipart/form-data`
* **Parámetros del Formulario:**
  * `workspaceId` (string, UUID): Espacio destino.
  * `title` (string): Nombre formal del documento.
  * `description` (string, opcional): Instrucciones de llenado.
  * `isLockedUntilTestPass` (boolean): `true` para requerir inducción aprobada.
  * `file` (archivo binario): Archivo PDF/Word/Excel (límite: 25 MB).
* **Respuestas:**
  * `201 Created`: Devuelve la entidad `ResourceFile` persistida.

---

### 2.3 Descarga Protegida y Condicional de Recursos
* **Método y Ruta:** `GET /api/resources/:id/download`
* **Acceso:** Autenticado (`JwtAuthGuard`).
* **Lógica de Protección:**
  1. Si el usuario cuenta con permisos de gestión (`resource:manage`), se autoriza la descarga inmediata.
  2. Si es un estudiante:
     * Se consulta su matrícula en el espacio asociado al recurso.
     * Si `isLockedUntilTestPass === true` y `enrollment.testPassed === false`, se rechaza la descarga emitiendo:
       ```json
       {
         "statusCode": 403,
         "error": "Forbidden",
         "message": "Este recurso se encuentra bloqueado. Debes completar la inducción obligatoria y aprobar el test diagnóstico antes de descargarlo."
       }
       ```
  3. Si la validación es satisfactoria, se transmite el archivo binario con encabezados `Content-Disposition: attachment; filename="..."` y el MIME type correspondiente.
* **Respuestas:**
  * `200 OK`: Stream binario del archivo descargado.
  * `403 Forbidden`: Examen diagnóstico pendiente.
  * `404 Not Found`: Recurso no encontrado.

---

### 2.4 Eliminación de Recurso
* **Método y Ruta:** `DELETE /api/resources/:id`
* **Permiso Requerido:** `resource:manage`
* **Descripción:** Elimina el registro en la base de datos y borra el archivo físico correspondiente en disco.
* **Respuestas:** `204 No Content`.
