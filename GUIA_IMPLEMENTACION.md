# Guía Maestra de Implementación Paso a Paso: wilfrido_trujillo

> **INSTRUCCIÓN OBLIGATORIA PARA EL AGENTE DE IA:**  
> Este documento rige la ejecución del proyecto. **Debes trabajar de forma estrictamente secuencial, paso a paso.**  
> * Queda terminantemente prohibido adelantarse o ejecutar múltiples pasos en un solo turno.  
> * Al finalizar cada paso, debes ejecutar los comandos de verificación indicados, reportar los resultados al desarrollador y **DETENERTE INMEDIATAMENTE** a esperar su aprobación explícita (*"OK"*, *"Aprobado"* o *"Pasa al siguiente"*) antes de tocar cualquier archivo del paso posterior.

---

## Reglas Maestras Inviolables del Proyecto

1. **Monorepo pnpm:** La gestión de paquetes se realiza siempre con filtro cuando sea por subproyecto:
   ```bash
   pnpm --filter backend add <paquete>
   pnpm --filter frontend add <paquete>
   ```
2. **Backend (NestJS 11 + TypeORM + SQLite better-sqlite3):**
   * Persistencia en archivo único embebido: `backend/data/wilfrido.sqlite` en modo WAL (`PRAGMA journal_mode = WAL;`).
   * Arquitectura en 3 capas puras: Controladores delgados, Servicios de negocio y Entidades/Repositorios TypeORM.
   * Contrato REST puro: En éxito devuelve payload directo con su código HTTP semántico (`200`, `201`, `204`). En error, todas las respuestas pasan por `HttpExceptionFilter` (RFC 7807).
   * PBAC (Permissions-Based Access Control): Prohibido evaluar nombres de roles en el código. Se usa `@RequirePermissions(...)` y `PermissionsGuard`.
3. **Frontend (React 19 + Vite + Tailwind CSS):**
   * Arquitectura Modular por Dominios (`src/modules/` y `src/shared/`). Cero importaciones cruzadas entre módulos hermanos (`practicas` no importa nada de `vinculacion`).
   * Un solo dominio central con rutas semánticas (`/practicas`, `/vinculacion`, `/eventos`, `/admin`).
   * Manejo de permisos en cliente con componente declarativo `<Can do="...">` y hook `usePermission`.

---

# FASE 1: Cimientos, Monorepo y Scaffolding Base

---

### PASO 1: Configuración de la Raíz del Monorepo
* **Objetivo:** Establecer la infraestructura del workspace pnpm y scripts orquestadores.
* **Archivos a crear/modificar en la raíz:**
  1. `package.json`: Definición de monorepo privado con scripts `"dev"`, `"build"`, `"lint"`.
  2. `pnpm-workspace.yaml`:
     ```yaml
     packages:
       - 'backend'
       - 'frontend'
     ```
  3. `.gitignore`: Ignorar `node_modules`, `dist`, `.env`, `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm`, `uploads/`.
  4. `.editorconfig` y `.prettierrc`: Estandarización de formato.
* **Comandos de ejecución:**
  ```bash
  pnpm install
  ```
* **Criterio de Verificación:**
  * El comando `pnpm -v` responde correctamente.
  * Los archivos de la raíz están limpios y sin advertencias.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 2: Scaffolding y Depuración del Backend (NestJS 11)
* **Objetivo:** Inicializar la aplicación NestJS dentro de `backend/`, limpiar archivos plantilla innecesarios y configurar TypeScript estricto.
* **Acciones:**
  1. Inicializar NestJS dentro de `backend/` con TypeScript.
  2. Eliminar controladores y servicios demo (`app.controller.ts`, `app.service.ts`, `app.controller.spec.ts`).
  3. Instalar dependencias de infraestructura backend:
     ```bash
     pnpm --filter backend add @nestjs/config @nestjs/typeorm typeorm better-sqlite3 class-validator class-transformer
     pnpm --filter backend add -D @types/better-sqlite3
     ```
  4. Crear `backend/.env.example` y `backend/.env` con las variables acordadas.
  5. Crear la carpeta `backend/data/` (con un `.gitkeep` y protegida en `.gitignore`).
* **Criterio de Verificación:**
  ```bash
  pnpm --filter backend build
  ```
  La compilación de TypeScript debe terminar con código 0 sin errores.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 3: Scaffolding y Depuración del Frontend (React 19 + Vite)
* **Objetivo:** Inicializar la aplicación React 19 con Vite y Tailwind CSS en `frontend/`, configurando la estructura modular de carpetas.
* **Acciones:**
  1. Crear la SPA en `frontend/` mediante `pnpm create vite frontend --template react-ts`.
  2. Instalar dependencias esenciales de cliente:
     ```bash
     pnpm --filter frontend add react-router-dom axios lucide-react clsx tailwind-merge
     pnpm --filter frontend add -D tailwindcss @tailwindcss/vite
     ```
  3. Configurar Tailwind CSS y limpiar el CSS boilerplate (`App.css`, logos de React/Vite).
  4. Crear el árbol de carpetas de Arquitectura Modular:
     * `src/app/` (routes, providers, main.tsx)
     * `src/shared/` (components, hooks, lib, types)
     * `src/modules/` (auth, admin, practicas, vinculacion, eventos)
  5. Crear `frontend/.env.example` y `frontend/.env`.
* **Criterio de Verificación:**
  ```bash
  pnpm --filter frontend build
  ```
  Vite debe compilar el bundle estático en `frontend/dist/` sin advertencias de tipos.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 4: Orquestación de Desarrollo Paralelo (`pnpm dev`)
* **Objetivo:** Permitir que con un solo comando en la raíz se levanten ambos servicios en paralelo.
* **Acciones:**
  1. Instalar `concurrently` en la raíz como dependencia de desarrollo:
     ```bash
     pnpm add -D -w concurrently
     ```
  2. Configurar el script en el `package.json` raíz:
     ```json
     "scripts": {
       "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"blue,green\" \"pnpm --filter backend start:dev\" \"pnpm --filter frontend dev\""
     }
     ```
* **Criterio de Verificación:**
  * Al probar el script, el backend escucha en `http://localhost:3000` y el frontend en `http://localhost:5173`.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

# FASE 2: Persistencia, Entidades TypeORM y SQLite WAL

---

### PASO 5: Módulo de Base de Datos y Conexión SQLite WAL
* **Objetivo:** Configurar la conexión TypeORM con `better-sqlite3` asegurando la ejecución inmediata del `PRAGMA journal_mode = WAL`.
* **Acciones:**
  1. Crear `backend/src/database/database.module.ts`.
  2. Configurar TypeORM mediante `ConfigService` apuntando a `DATABASE_PATH`.
  3. Añadir el hook de conexión para ejecutar `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`.
* **Criterio de Verificación:**
  * Al iniciar NestJS, se genera físicamente `backend/data/wilfrido.sqlite` y el log confirma el modo WAL activo.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 6: Creación de Entidades TypeORM Centrales
* **Objetivo:** Implementar las 7 entidades relacionales completas y tipadas según la Sección 8 de la especificación técnica.
* **Archivos a crear en `backend/src/`:**
  1. `users/entities/user.entity.ts`:
     * Campos: `id`, `email`, `identification`, `fullName`, `roleKey`, `permissionsJson` (`simple-json`), `passwordHash`, timestamps.
  2. `workspaces/entities/workspace.entity.ts`:
     * Campos: `id`, `title`, `description`, `type` (PRACTICAS, VINCULACION, EVENTO), `isActive`, `accessCode`, timestamps.
  3. `workspaces/entities/workspace-enrollment.entity.ts`:
     * Relación User $\leftrightarrow$ Workspace con banderas `inductionVideoWatched`, `testPassed`, `testScore`, `status`.
  4. `resources/entities/resource-file.entity.ts`:
     * Archivos asociados al workspace, `isLockedUntilTestPass`, `fileType`.
  5. `tests/entities/test.entity.ts` y `tests/entities/test-attempt.entity.ts`:
     * Banco de preguntas en `questions` (`simple-json`), puntaje mínimo, intentos y respuestas enviadas.
  6. `submissions/entities/document-submission.entity.ts`:
     * Entregas PDF, estados (`submitted`, `observed`, `approved`), notas de feedback.
* **Criterio de Verificación:**
  * TypeORM sincroniza (`synchronize: true` en desarrollo) y crea las 7 tablas en `wilfrido.sqlite` sin errores de clave foránea.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

# FASE 3: Núcleo de Seguridad y Control de Acceso (PBAC)

---

### PASO 7: Filtro Global de Excepciones y Validador DTO
* **Objetivo:** Estandarizar todas las respuestas de error y saneamiento de entradas en NestJS.
* **Acciones:**
  1. Crear `backend/src/common/filters/http-exception.filter.ts` con formato RFC 7807.
  2. Activar globalmente en `backend/src/main.ts`:
     * `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`
     * `app.useGlobalFilters(new HttpExceptionFilter())`
     * `app.setGlobalPrefix('api')`
     * Habilitar CORS con las URLs configuradas en el `.env`.
* **Criterio de Verificación:**
  * Realizar una petición a una ruta inexistente y verificar que devuelva JSON con `statusCode`, `error`, `message`, `timestamp` y `path`.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 8: Módulo de Autenticación JWT y Catálogo de Permisos (PBAC)
* **Objetivo:** Implementar registro, login, emisión de JWT y el sistema de autorización por permisos.
* **Acciones:**
  1. Crear enum `Permission` en `backend/src/auth/enums/permission.enum.ts` con todas las capacidades de la Sección 7.2.
  2. Implementar decorador `@RequirePermissions(...permissions: Permission[])`.
  3. Implementar `PermissionsGuard` (implementa `CanActivate` usando `Reflector`).
  4. Implementar `JwtStrategy` y `JwtAuthGuard` con `@nestjs/passport` y `@nestjs/jwt`.
  5. Endpoints en `backend/src/auth/`:
     * `POST /api/auth/register` (hash de contraseña con `bcrypt`).
     * `POST /api/auth/login` (retorna `accessToken` y perfil de usuario con sus permisos).
     * `GET /api/auth/profile` (retorna usuario autenticado actual).
* **Criterio de Verificación:**
  * Probar registro y login con curl o script de prueba. El token JWT emitido debe contener la lista de permisos en su payload.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 9: Cliente HTTP y Sistema `<Can>` en el Frontend
* **Objetivo:** Conectar el frontend con el backend mediante Axios tipado, gestión de token en memoria/localStorage y control de renderizado condicional.
* **Acciones:**
  1. `frontend/src/shared/lib/api.ts`: Instancia de Axios con interceptor que añade `Authorization: Bearer <token>` y captura errores globales.
  2. `frontend/src/shared/types/auth.types.ts`: Definición de interfaces `User`, `Permission`, `SessionState`.
  3. `frontend/src/modules/auth/context/AuthContext.tsx`: Provider que gestiona sesión activa, login, logout y carga inicial.
  4. `frontend/src/shared/components/Can.tsx`: Componente que evalúa permisos del usuario actual y renderiza o no sus hijos.
  5. Hook `usePermission('permission_name')`.
* **Criterio de Verificación:**
  * Componente de prueba que demuestre que `<Can do="document:review">` se oculta para usuarios sin ese permiso.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

# FASE 4: Módulos de Negocio Core

---

### PASO 10: Módulo de Workspaces (CRUD y Códigos de Acceso)
* **Backend:** Endpoints para crear espacios, listar activos, obtener por código de acceso (`/api/workspaces/join/:code`).
* **Frontend:** Vista de workspaces en `src/modules/admin/` y componente de unirse a un espacio con código.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 11: Módulo de Inducción con Reproductor y Tracking de Video
* **Backend:** Registro de progreso de video en `workspace_enrollments` (`inductionVideoWatched = true`).
* **Frontend:** Reproductor responsivo que detecta cuando el estudiante visualizó el 100% del video y desbloquea el siguiente paso.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 12: Motor de Evaluaciones Dinámicas (Tests en `simple-json`)
* **Backend:** Creador de cuestionarios para el Ingeniero y endpoint de rendición para alumnos con calificación automática inmediata.
* **Frontend:** Interfaz de examen con temporizador, selector de opciones y pantalla de resultado de aprobación/reprobación.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 13: Repositorio de Recursos y Desbloqueo Condicional
* **Backend:** Subida de plantillas (Word, Excel, PDF) y endpoint de descarga protegido (`isLockedUntilTestPass`).
* **Frontend:** Tarjetas de descarga con indicador visual de candado (bloqueado hasta aprobar el test).
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 14: Sistema Documental y Bandeja de Entregas
* **Backend:** Carga de documentos de alumnos con `multer` a carpeta local segura, estados (`submitted`, `observed`, `approved`) y feedback del docente.
* **Frontend:** Zona drag-and-drop de entrega de PDF para alumnos, y bandeja de entrada tipo tabla para el Ingeniero con modal de revisión.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

# FASE 5: Eventos, Certificación QR y Auditor Documental

---

### PASO 15: Portal Ligero de Eventos y Conferencias (QR)
* **Frontend & Backend:** Página pública ligera `/eventos/:code` para asistentes a talleres y charlas, descarga de diapositivas y encuesta rápida de satisfacción.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 16: Generador de Certificados PDF con Verificación QR
* **Backend:** Módulo `certificates/` usando `pdfkit` para estampar nombre del asistente, horas, firma digital del Ingeniero y hash QR único verificable.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

### PASO 17: Agente Auditor Documental Heurístico (Fase 1)
* **Backend:** Módulo `auditor/` desacoplado bajo interfaz `IDocumentAuditor`. Valida que el PDF contenga texto legible, número de páginas adecuado y metadatos no vacíos.
* **CHECKPOINT:** Detenerse y pedir revisión del usuario.

---

## Resumen del Flujo de Trabajo para el Agente:
1. **Lee el paso asignado.**
2. **Implementa únicamente lo especificado en ese paso.**
3. **Ejecuta los comandos de verificación de tipos y compilación.**
4. **Presenta el resumen al usuario y detente.**
5. **No pases al siguiente paso sin el "OK" explícito del usuario.**
