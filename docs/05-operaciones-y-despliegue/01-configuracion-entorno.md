# Configuración del Entorno y Variables

Este documento describe la totalidad de variables de entorno requeridas tanto por el backend (NestJS) como por el cliente web (Vite) para su correcta ejecución en desarrollo y producción.

---

## 1. Variables de Entorno del Backend (`backend/.env`)

Archivo de referencia: `backend/.env.example`

| Variable de Entorno | Tipo | Valor por Defecto | Obligatoria | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | `number` | `3000` | No | Puerto TCP en el que el servidor NestJS escucha peticiones HTTP. |
| `NODE_ENV` | `string` | `'development'` | No | Entorno de ejecución (`development`, `production`, `test`). Controla la sincronización automática del ORM. |
| `JWT_SECRET` | `string` | — | **Sí** | Clave secreta criptográfica utilizada para firmar y validar tokens JWT. Debe cambiarse en producción por una cadena aleatoria de al menos 64 caracteres. |
| `JWT_EXPIRES_IN` | `string` | `'7d'` | No | Tiempo de vigencia de los tokens JWT emitidos tras el inicio de sesión. |
| `DATABASE_PATH` | `string` | `'./data/wilfrido.sqlite'` | No | Ruta relativa o absoluta hacia el archivo físico de base de datos SQLite. |
| `UPLOAD_LOCATION` | `string` | `'./uploads'` | No | Directorio base para el almacenamiento en disco de evidencias, certificados y plantillas. |
| `MAX_FILE_SIZE_MB` | `number` | `25` | No | Límite máximo de tamaño en megabytes para archivos subidos mediante Multer. |
| `APP_URL` | `string` | `'http://localhost:5173'` | No | URL base del cliente web. Utilizada por NestJS para construir los hipervínculos de validación en códigos QR de certificados PDF. |
| `CORS_ORIGIN` | `string` | `'http://localhost:5173,https://wilfridotrujillo.com'` | No | Lista separada por comas de orígenes HTTP autorizados para interactuar con la API mediante CORS. Si `APP_URL` no está en la lista, el sistema lo incorpora defensivamente en tiempo de arranque. |

---

## 2. Variables de Entorno del Frontend (`frontend/.env`)

Archivo de referencia: `frontend/.env.example`

| Variable de Entorno | Tipo | Valor por Defecto | Obligatoria | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_PORT` | `number` | `5173` | No | Puerto local TCP en el que el servidor de desarrollo de Vite escucha peticiones. Configura `strictPort: true` para evitar cambios automáticos de puerto por colisión. |
| `VITE_API_URL` | `string` | `'http://localhost:3000/api'` | **Sí** | URL base del servidor backend NestJS. En producción con proxy inverso Nginx en el mismo dominio, se configura como `'/api'`. |
| `VITE_APP_TITLE` | `string` | `'Ing. Wilfrido Trujillo \| Gestión Académica y Eventos'` | No | Título principal desplegado en las pestañas del navegador y encabezados generales. |

---

## 3. Modelo Arquitectónico de Configuración (SSOT por Dominio)

El proyecto adopta el patrón de **Fuentes de Verdad Autónomas por Dominio**:

* **Backend (`backend/.env`):** Administra de forma exclusiva el ciclo de vida del servidor, credenciales criptográficas (`JWT_SECRET`), base de datos SQLite y orígenes autorizados. Ningún secreto del servidor se expone o procesa en el cliente web.
* **Frontend (`frontend/.env`):** Administra exclusivamente los parámetros de compilación y runtime del cliente web (`VITE_*`).
* **Desacoplamiento:** Los archivos de código fuente (`.ts`, `.tsx`) no contienen puertos ni URLs quemadas; toda referencia se inyecta mediante `ConfigService` en NestJS e `import.meta.env` en Vite.
