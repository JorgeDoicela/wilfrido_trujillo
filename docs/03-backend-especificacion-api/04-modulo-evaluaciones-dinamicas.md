# Módulo de Evaluaciones Dinámicas (`/api/tests`)

## 1. Descripción del Módulo

El módulo `TestsModule` implementa el motor de cuestionarios diagnósticos de inducción. Almacena las preguntas, opciones de respuesta múltiple y justificaciones en columnas `simple-json`, computa la calificación automática sobre 10 puntos en el servidor, sanea las claves correctas para evitar filtraciones en el cliente y activa la bandera `testPassed = true` que desbloquea la descarga de formatos y la entrega de bitácoras.

---

## 2. Catálogo de Endpoints

### 2.1 Creación o Actualización de Cuestionario
* **Método y Ruta:** `POST /api/tests`
* **Permiso Requerido:** `test:manage`
* **Payload de Entrada (`CreateTestDto`):**
  ```json
  {
    "workspaceId": "d8a1c2e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e",
    "title": "Evaluación Diagnóstica de Inducción Normativa RRA",
    "description": "Examen obligatorio de 5 preguntas sobre deberes y derechos en prácticas.",
    "minimumScore": 7,
    "questions": [
      {
        "id": "q1",
        "questionText": "¿Cuál es la carga horaria mínima requerida por el RRA para prácticas preprofesionales?",
        "options": [
          { "id": "opt1", "text": "80 horas" },
          { "id": "opt2", "text": "160 horas" },
          { "id": "opt3", "text": "240 horas" }
        ],
        "correctOptionId": "opt2",
        "explanation": "El artículo normativo estipula 160 horas obligatorias."
      }
    ]
  }
  ```
* **Respuestas:**
  * `201 Created`: Devuelve la entidad `Test` registrada.

---

### 2.2 Obtención de Evaluación de un Espacio
* **Método y Ruta:** `GET /api/tests/workspace/:workspaceId`
* **Permiso Requerido:** `test:take`
* **Comportamiento de Seguridad y Saneamiento:**
  * Si el usuario no tiene permisos docentes (`test:manage`), el servicio **elimina el campo `correctOptionId`** de todas las preguntas antes de enviar la respuesta JSON al navegador. Esto previene que los estudiantes inspeccionen el DOM o las respuestas de red para copiar las claves.
* **Respuestas:**
  * `200 OK`: Datos del examen con preguntas saneadas.
  * `404 Not Found`: No existe evaluación configurada para este espacio.

---

### 2.3 Envío y Calificación de Intento
* **Método y Ruta:** `POST /api/tests/:testId/submit`
* **Permiso Requerido:** `test:take`
* **Regla de Negocio:** Requiere que el alumno haya visto el video de inducción al 100% (`inductionVideoWatched = true`). Si no lo ha hecho, se emite una excepción `400 Bad Request`.
* **Payload de Entrada (`SubmitTestDto`):**
  ```json
  {
    "answers": {
      "q1": "opt2",
      "q2": "opt1",
      "q3": "opt3"
    }
  }
  ```
* **Algoritmo de Calificación:**
  $$\text{Score} = \text{round}\left( \frac{\text{Respuestas Correctas}}{\text{Total de Preguntas}} \times 10 \right)$$
  Si $\text{Score} \ge \text{minimumScore}$, se marca `isPassed = true` y se actualiza `testPassed = true` en `WorkspaceEnrollment`.
* **Respuestas:**
  * `200 OK`:
    ```json
    {
      "attemptId": "a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
      "score": 10,
      "minimumScore": 7,
      "isPassed": true,
      "totalQuestions": 5,
      "correctAnswersCount": 5
    }
    ```

---

### 2.4 Historial de Intentos del Estudiante
* **Método y Ruta:** `GET /api/tests/:testId/my-attempts`
* **Permiso Requerido:** `test:take`
* **Respuestas:** `200 OK` (Arreglo con los intentos previos, puntajes y marcas temporales).
