# Módulo de Eventos y Conferencias Externas (`/api/events`)

## 1. Descripción del Módulo

El módulo `EventsModule` provee la infraestructura ligera para eventos presenciales y conferencias magistrales dictadas por el Ing. Wilfrido Trujillo. Permite a los asistentes acceder a un portal web rápido escaneando un código QR proyectado en pantalla, descargar diapositivas y materiales en un toque, y completar una encuesta de satisfacción en tiempo real que alimenta las métricas agregadas del docente.

---

## 2. Catálogo de Endpoints

### 2.1 Consulta Pública de Evento por Código QR
* **Método y Ruta:** `GET /api/events/public/:code`
* **Acceso:** **Público (sin autenticación)**.
* **Descripción:** Permite a cualquier asistente que escanee el código QR (ejemplo: `CONF-IA`) obtener la información general del evento, las diapositivas oficiales y el estado de la encuesta de satisfacción.
* **Respuestas:**
  * `200 OK`:
    ```json
    {
      "id": "e4b3c2a1-9f8e-7d6c-5b4a-3a2b1c0d9e8f",
      "title": "Conferencia: Inteligencia Artificial y Soberanía Tecnológica",
      "description": "Taller magistral sobre agentes locales, LLMs y desarrollo de software moderno.",
      "accessCode": "CONF-IA",
      "resources": [
        {
          "id": "res-1234-abcd",
          "title": "Diapositivas Oficiales - Presentación en PDF",
          "fileUrl": "diapositivas_ia_2026.pdf",
          "fileType": "application/pdf",
          "fileSize": 8450120
        }
      ]
    }
    ```
  * `404 Not Found`: No se encontró ningún evento con ese código.

---

### 2.2 Envío de Encuesta Rápida de Satisfacción
* **Método y Ruta:** `POST /api/events/public/:code/feedback`
* **Acceso:** **Público (sin autenticación)**.
* **Descripción:** Registra la retroalimentación de un asistente al taller.
* **Payload de Entrada (`CreateFeedbackDto`):**
  ```json
  {
    "attendeeName": "Ing. María Elena Paredes",
    "attendeeEmail": "mparedes@unach.edu.ec",
    "attendeeIdentification": "0603456789",
    "rating": 5,
    "comments": "Excelente exposición sobre arquitectura soberana y SQLite WAL."
  }
  ```
* **Validación:** El campo `rating` debe ser un número entero entre 1 y 5.
* **Respuestas:**
  * `201 Created`: Devuelve la entidad `EventFeedback` registrada.

---

### 2.3 Métricas Agregadas de Satisfacción (Panel Docente)
* **Método y Ruta:** `GET /api/events/:workspaceId/feedback-summary`
* **Permiso Requerido:** `workspace:read`
* **Descripción:** Computa en el servidor el total de encuestas recibidas, el promedio general de satisfacción y la distribución porcentual por estrellas.
* **Respuestas:**
  * `200 OK`:
    ```json
    {
      "workspaceId": "e4b3c2a1-9f8e-7d6c-5b4a-3a2b1c0d9e8f",
      "totalResponses": 85,
      "averageRating": 4.88,
      "breakdown": {
        "5_stars": 75,
        "4_stars": 8,
        "3_stars": 2,
        "2_stars": 0,
        "1_star": 0
      },
      "latestComments": [
        {
          "name": "Ing. María Elena Paredes",
          "rating": 5,
          "comments": "Excelente exposición sobre arquitectura soberana y SQLite WAL.",
          "createdAt": "2026-09-23T21:40:00.000Z"
        }
      ]
    }
    ```
