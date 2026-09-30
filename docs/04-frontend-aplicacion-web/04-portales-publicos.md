# Portales Públicos sin Autenticación

El sistema expone dos portales públicos de acceso directo que no requieren que el usuario posea una cuenta ni inicie sesión, garantizando máxima velocidad y cero fricción:

---

## 1. Portal Ligero de Eventos y Conferencias (`#/eventos/:code`)

### Propósito Operativo:
Diseñado específicamente para ser proyectado en pantallas gigantes durante charlas, seminarios y conferencias presenciales o virtuales organizadas por el Ing. Wilfrido Trujillo. Los asistentes escanean el código QR con la cámara de sus teléfonos inteligentes y aterrizan instantáneamente en esta vista ligera.

```mermaid
flowchart TD
    ASISTENTE["Asistente escanea QR en diapositiva"] --> URL["#/eventos/:code"]
    URL --> PORTAL["Portal Ligero del Evento"]
    
    PORTAL --> DESCARGA["Descarga en 1 Clic\n(Diapositivas y material en PDF)"]
    PORTAL --> ENCUESTA["Encuesta de Satisfacción\n(1 a 5 estrellas + comentarios)"]
    
    ENCUESTA --> RECLAMO["Reclamo de Certificado\n(Constancia digital con QR)"]
```

### Componentes Clave:
* **Tarjeta de Materiales:** Botón prominente de descarga directa de la presentación en PDF o guías complementarias.
* **Formulario Rápido de Calificación:** Escala interactiva de 1 a 5 estrellas y caja de comentarios opcionales. Al enviar, envía la petición a `POST /api/events/public/:code/feedback`.

---

## 2. Validador Público de Certificados Criptográficos (`#/certificados/validar/:hash`)

### Propósito Operativo:
Permite a reclutadores, empleadores, instituciones académicas o evaluadores de comités verificar la autenticidad formal de un certificado emitido por el Ing. Wilfrido Trujillo simplemente apuntando la cámara a la matriz QR impresa en la constancia física o digital.

```mermaid
sequenceDiagram
    actor Verificador as Evaluador / Empleador
    participant Camara as Lector QR de Smartphone
    participant SPA as VerifyCertificatePortal (#/certificados/validar/:hash)
    participant API as Backend (/api/certificates/verify/:hash)

    Verificador->>Camara: Escanea código QR en certificado impreso
    Camara->>SPA: Abre URL con el hash criptográfico
    SPA->>API: GET /api/certificates/verify/WT-7F89-A2C4-0012-98EF
    
    alt Hash Legítimo
        API-->>SPA: 200 OK { isValid: true, recipientName, hours, topicTitle, issuer }
        SPA-->>Verificador: Despliega sello institucional verde de autenticidad y botón de descarga del PDF original
    else Hash Inválido o Revocado
        API-->>SPA: 404 Not Found
        SPA-->>Verificador: Despliega alerta roja indicando que el certificado no consta en registros oficiales
    end
```

### Elementos Visuales del Validador (`VerifyCertificatePortal.tsx`):
1. **Sello Oficial de Autenticidad:** Emblema con bordes esmeralda e indicador de certificación válida.
2. **Ficha Técnica del Titular:** Nombre del beneficiario en mayúsculas, cédula de identidad, horas de capacitación acreditadas y fecha de expedición.
3. **Firma y Responsable:** Certificación suscrita digitalmente por el Ing. Wilfrido Trujillo.
4. **Descarga de Evidencia:** Enlace directo para obtener una copia idéntica del archivo PDF oficial emitido.
