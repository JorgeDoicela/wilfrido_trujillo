# Contratos y Convenciones de la API REST

## 1. Principio Rector: Contrato Limpio sin Envoltorios Artificiales

La API REST del sistema sigue un diseño estrictamente semántico y directo, erradicando el antipatrón de envoltorios artificiales tipo `{ success: true, data: { ... } }` que obligan a realizar llamadas anidadas redundantes en el cliente HTTP (`response.data.data`).

* **Respuestas Exitosas:** El backend devuelve directamente la entidad o arreglo correspondiente acompañado del código de estado HTTP semántico (`200 OK`, `201 Created`, `204 No Content`).
* **Prefijo Global de Rutas:** Todos los endpoints se exponen bajo el prefijo unificado `/api`.

---

## 2. Estandarización de Errores bajo RFC 7807 (Problem Details)

Cualquier excepción producida en la aplicación (errores de validación DTO, autenticación, autorización o fallos de dominio) es interceptada por el filtro global `HttpExceptionFilter` ubicado en `backend/src/common/filters/http-exception.filter.ts`.

### Estructura de Respuesta de Error Unificada:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Debes adjuntar un archivo digital para tu entrega.",
  "timestamp": "2026-09-29T20:25:00.000Z",
  "path": "/api/submissions/upload"
}
```

### Campos del Esquema de Error:
| Campo | Tipo | Descripción Técnica |
| :--- | :--- | :--- |
| `statusCode` | `number` | Código de estado HTTP estándar (400, 401, 403, 404, 409, 500). |
| `error` | `string` | Título canónico del error HTTP según IANA. |
| `message` | `string` \| `string[]` | Mensaje descriptivo del motivo del fallo o lista de infracciones detectadas por `class-validator`. |
| `timestamp` | `string` (ISO 8601) | Momento exacto en que se generó la excepción en el servidor. |
| `path` | `string` | Ruta URL solicitada que originó el problema. |

---

## 3. Códigos de Estado HTTP Utilizados

| Código HTTP | Significado | Escenario de Aplicación |
| :--- | :--- | :--- |
| `200 OK` | Petición exitosa | Consultas GET, actualizaciones exitosas (PATCH/PUT) y ejecuciones de auditoría. |
| `201 Created` | Recurso creado | Creación exitosa de usuarios, espacios de trabajo, intentos de examen o emisión de certificados. |
| `204 No Content` | Sin contenido | Eliminación exitosa de un recurso (ej. borrado de plantillas). |
| `400 Bad Request` | Petición inválida | Parámetros DTO mal formados, archivos faltantes, reglas de negocio no satisfechas (ej. test no aprobado). |
| `401 Unauthorized` | No autenticado | Token JWT ausente, expirado o credenciales de inicio de sesión erróneas. |
| `403 Forbidden` | Acceso denegado | Token válido pero carente de los permisos requeridos por el decorador `@RequirePermissions`. |
| `404 Not Found` | No encontrado | Identificador de espacio, entrega, evaluación o certificado inexistente en la base de datos. |
| `409 Conflict` | Conflicto de unicidad | Intento de registrar un correo, cédula o código de acceso que ya existe. |
| `500 Internal Error` | Error de servidor | Excepciones no controladas o fallos inesperados de E/S en disco. |
