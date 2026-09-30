# Módulo de Certificados Digitales PDF con Verificación QR (`/api/certificates`)

## 1. Descripción del Módulo

El módulo `CertificatesModule` genera y valida certificados académicos de participación y aprobación en formato PDF vectorial. Integra la librería `pdfkit` para el maquetado apaisado A4 de alta definición y `qrcode` para la generación local de matrices QR físicas. Cada certificado incluye un código criptográfico único que permite a cualquier tercero (o lector QR de smartphone) verificar su autenticidad sin necesidad de contar con una cuenta en la plataforma.

---

## 2. Anatomía del Certificado PDF Generado

```text
+-----------------------------------------------------------------------------------+
|  [MARCO DOBLE AZUL COBALTO Y LÍNEA INTERNA DORADA]                                |
|                                                                                   |
|                               UNIVERSIDAD NACIONAL                                |
|                        FACULTAD DE INGENIERÍA EN SISTEMAS                         |
|                                                                                   |
|                             OTORGA EL PRESENTE                                    |
|                               CERTIFICADO                                         |
|                                                                                   |
|                           A: JUAN CARLOS PÉREZ LÓPEZ                              |
|                                (C.I. 0601234567)                                  |
|                                                                                   |
|           Por haber participado y aprobado satisfactoriamente el taller:          |
|     "ARQUITECTURA DE SOFTWARE SOBERANA Y AGENTES INTELIGENTES"                    |
|                        Con una duración de 40 Horas.                              |
|                                                                                   |
|       [CÓDIGO QR FÍSICO]                             ______________________       |
|    http://.../certificados/                          Ing. Wilfrido Trujillo       |
|    validar/WT-XXXX-XXXX-XXXX                         Docente y Coordinador        |
|                                                                                   |
|    Código de Registro Criptográfico: WT-7F89-A2C4-0012-98EF                       |
+-----------------------------------------------------------------------------------+
```

### Características Técnicas del Archivo:
* **Dimensiones:** A4 Apaisado (*Landscape*: 841.89 puntos de ancho × 595.28 puntos de alto).
* **Generación en Memoria:** Procesado en menos de 50 ms mediante streams en buffer sin renderizado de navegadores.
* **Hash Criptográfico:** Token de formato `WT-XXXX-XXXX-XXXX` obtenido a partir de SHA-256 sobre la identidad del titular, el espacio académico y la marca temporal.
* **Matriz QR Embebida:** Imagen PNG de 130×130 puntos generada con nivel de corrección de error 'M'.

---

## 3. Catálogo de Endpoints

### 3.1 Emisión Directa de Certificado (Docente)
* **Método y Ruta:** `POST /api/certificates/issue`
* **Permiso Requerido:** `certificate:manage`
* **Payload de Entrada (`IssueCertificateDto`):**
  ```json
  {
    "workspaceId": "e4b3c2a1-9f8e-7d6c-5b4a-3a2b1c0d9e8f",
    "recipientName": "Ing. Patricio Silva",
    "recipientEmail": "psilva@unach.edu.ec",
    "recipientIdentification": "0609876543",
    "hours": 40,
    "topicTitle": "Inteligencia Artificial Aplicada a la Educación Superior"
  }
  ```
* **Respuestas:**
  * `201 Created`: Devuelve la entidad `Certificate` con el campo `verificationHash` asignado y el PDF almacenado en disco.

---

### 3.2 Reclamo de Certificado por Asistentes a Eventos
* **Método y Ruta:** `POST /api/certificates/claim/:code`
* **Permiso Requerido:** `certificate:claim`
* **Descripción:** Permite a los asistentes inscritos reclamar su constancia digital tras haber completado la encuesta del evento.
* **Respuestas:** `201 Created` (Entidad `Certificate`).

---

### 3.3 Verificación Pública Criptográfica de Autenticidad
* **Método y Ruta:** `GET /api/certificates/verify/:hash`
* **Acceso:** **Público (abierto)**.
* **Descripción:** Valida la legitimidad de un certificado ante terceros escaneando el código QR.
* **Respuestas:**
  * `200 OK`:
    ```json
    {
      "isValid": true,
      "recipientName": "ING. PATRICIO SILVA",
      "recipientIdentification": "0609876543",
      "topicTitle": "Inteligencia Artificial Aplicada a la Educación Superior",
      "hours": 40,
      "issuedAt": "2026-09-23T22:00:00.000Z",
      "verificationHash": "WT-7F89-A2C4-0012-98EF",
      "issuer": "Ing. Wilfrido Trujillo - Coordinador Académico",
      "hasPdf": true
    }
    ```
  * `404 Not Found`:
    ```json
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "El código de certificado \"WT-INVALIDO\" no figura en los registros oficiales o ha sido revocado."
    }
    ```

---

### 3.4 Descarga del Archivo PDF del Certificado
* **Método y Ruta:** `GET /api/certificates/:id/download`
* **Acceso:** Público (requiere ID legítimo) o mediante hash.
* **Respuestas:** `200 OK` (Stream binario `application/pdf`).
