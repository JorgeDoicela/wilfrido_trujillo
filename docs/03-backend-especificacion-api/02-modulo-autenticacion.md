# Módulo de Autenticación y Cuentas (`/api/auth`)

## 1. Descripción del Módulo

El módulo `AuthModule` gestiona el ciclo de vida de identidades, registro de participantes, emisión de tokens firmados mediante JSON Web Tokens (JWT) y extracción de permisos atómicos.

### Seeding Automático al Inicializar (`onApplicationBootstrap`):
Al iniciar la aplicación, si no existen los usuarios maestros, el servicio `AuthService` siembra automáticamente en la base de datos:
1. **Ing. Wilfrido Trujillo (Docente / Superadmin):**
   * Correo: `wilfrido.trujillo@unach.edu.ec`
   * Cédula: `0600000001`
   * Contraseña: `Admin123*`
   * Permisos: Acceso total (`Object.values(Permission)`).
2. **Estudiante de Ejemplo:**
   * Correo: `estudiante@unach.edu.ec`
   * Cédula: `0600000002`
   * Contraseña: `Estudiante123*`
   * Permisos: Permisos operativos estudiantiles (`workspace:read`, `resource:download`, `test:take`, `document:submit`, `certificate:claim`).

---

## 2. Catálogo de Endpoints

### 2.1 Registro de Usuario
* **Método y Ruta:** `POST /api/auth/register`
* **Acceso:** Público (abierto).
* **Descripción:** Registra una nueva cuenta de usuario en el sistema.

#### Payload de Entrada (`RegisterDto`):
```json
{
  "email": "estudiante.nuevo@unach.edu.ec",
  "identification": "0605123456",
  "fullName": "Carlos Andrés Mendoza",
  "password": "PasswordSeguro2026*",
  "roleKey": "ESTUDIANTE"
}
```

#### Respuestas:
* `201 Created`: Cuenta creada exitosamente. Devuelve el token y los datos de perfil:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "c1f7a2d8-4b9e-4e3a-9c12-34567890abcd",
      "email": "estudiante.nuevo@unach.edu.ec",
      "identification": "0605123456",
      "fullName": "Carlos Andrés Mendoza",
      "roleKey": "ESTUDIANTE",
      "permissions": [
        "workspace:read",
        "resource:download",
        "test:take",
        "document:submit",
        "certificate:claim"
      ]
    }
  }
  ```
* `409 Conflict`: Ya existe un usuario registrado con ese correo o número de identificación.

---

### 2.2 Inicio de Sesión
* **Método y Ruta:** `POST /api/auth/login`
* **Acceso:** Público.
* **Descripción:** Valida credenciales mediante correo electrónico o número de cédula y emite un token JWT con vigencia de 7 días.

#### Payload de Entrada (`LoginDto`):
```json
{
  "identificationOrEmail": "0600000001",
  "password": "Admin123*"
}
```

#### Respuestas:
* `200 OK`: Credenciales válidas. Devuelve el `accessToken` y la carga útil del usuario.
* `401 Unauthorized`: Credenciales inválidas o contraseña incorrecta.

---

### 2.3 Perfil del Usuario Autenticado
* **Método y Ruta:** `GET /api/auth/profile`
* **Acceso:** Protegido (`JwtAuthGuard`). Requiere encabezado `Authorization: Bearer <token>`.
* **Descripción:** Devuelve la identidad y permisos vigentes del usuario en sesión.

#### Respuestas:
* `200 OK`:
  ```json
  {
    "id": "e9a8b7c6-1d2e-3f4a-5b6c-7d8e9f0a1b2c",
    "email": "wilfrido.trujillo@unach.edu.ec",
    "identification": "0600000001",
    "fullName": "Ing. Wilfrido Trujillo",
    "roleKey": "INGENIERO",
    "permissions": [
      "workspace:create",
      "workspace:update",
      "workspace:delete",
      "workspace:read",
      "resource:manage",
      "resource:download",
      "test:manage",
      "test:take",
      "document:submit",
      "document:review",
      "certificate:manage",
      "certificate:claim"
    ],
    "createdAt": "2026-09-23T23:28:04.000Z"
  }
  ```
* `401 Unauthorized`: Token ausente o caducado.
