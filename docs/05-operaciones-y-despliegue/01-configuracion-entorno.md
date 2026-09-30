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
| `CORS_ORIGIN` | `string` | `'http://localhost:5173,https://wilfridotrujillo.com'` | No | Lista separada por comas de orígenes HTTP autorizados para interactuar con la API mediante CORS. |

---

## 2. Variables de Entorno del Frontend (`frontend/.env`)

Archivo de referencia: `frontend/.env.example`

| Variable de Entorno | Tipo | Valor por Defecto | Obligatoria | Descripción Técnica |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_API_URL` | `string` | `'http://localhost:3000/api'` | **Sí** | URL base del servidor backend NestJS. En producción con proxy inverso Nginx en el mismo dominio, se configura como `'/api'`. |
| `VITE_APP_TITLE` | `string` | `'Ing. Wilfrido Trujillo \| Gestión Académica y Eventos'` | No | Título principal desplegado en las pestañas del navegador y encabezados generales. |
