# Arquitectura Modular del Frontend y Enrutamiento

## 1. Arquitectura Modular por Dominios de Negocio (Domain-Driven Modules)

El cliente frontend implementa una **Arquitectura Modular por Dominios de Negocio** en lugar de capas fragmentadas. Todo recurso que atañe a un área funcional reside dentro de su respectivo módulo, garantizando alta cohesión local, bajo acoplamiento y mantenimiento ágil:

```text
frontend/src/
├── app/                                 # Inicialización de la aplicación y punto de entrada
│   ├── main.tsx                         # Punto de entrada de Vite y montaje del AuthProvider
│   └── App.tsx                          # Orquestador raíz de vistas, navegación y shells
│
├── shared/                              # Núcleo Transversal Compartido (Agnóstico al Negocio)
│   ├── api/                             # Clientes API transversales (workspaces.api.ts)
│   ├── components/                      # Componentes atómicos y shell (FluentShell, Navbar, Can, Modales, AmbientBackground)
│   ├── context/                         # Estado de sesión y autenticación (AuthContext.tsx)
│   ├── hooks/                           # Hooks de permisos y autenticación (usePermission, useAuth)
│   ├── lib/api.ts                       # Instancia tipada de Axios con interceptores JWT y control 401
│   └── types/                           # Tipos globales (auth, workspace, document, test, certificate)
│
└── modules/                             # MÓDULOS DE NEGOCIO AUTÓNOMOS (DOMINIOS AISLADOS)
    ├── landing/                         # Portada principal y Tablero Bento de Cristal Puro
    │   ├── components/                  # LandingBentoHub, LandingHeader, LandingFooter, BentoCard
    │   ├── hooks/                       # useLandingHeaderScroll
    │   └── pages/                       # LandingPage.tsx
    ├── auth/                            # Formularios de acceso institucional
    ├── admin/                           # Administración de espacios de trabajo y métricas docentes
    ├── practicas/                       # Prácticas preprofesionales (video, tests, recursos, entregas, auditoría)
    ├── vinculacion/                     # Vinculación comunitaria y bitácoras de servicio
    └── eventos/                         # Conferencias, encuestas QR y certificados digitales
```

### Reglas de Oro del Código:
1. **Cero Importaciones Cruzadas entre Módulos de Negocio:** `modules/practicas` no importa dependencias de `modules/eventos` ni de `modules/vinculacion`.
2. **Promoción a Shared:** Si dos módulos requieren un componente común, este se promociona a `shared/components/`.
3. **Contratos de API Co-Localizados:** Cada módulo posee su propia subcarpeta `api/` (`workspaces.api.ts`, `documents.api.ts`, `certificates.api.ts`).

---

## 2. Estrategia de Enrutamiento y Navegación

La aplicación implementa un esquema de navegación sincronizado con el hash del navegador (`window.location.hash`). Esto permite el acceso directo a rutas profundas públicas (como certificados QR o portales de conferencias) sin requerir reescritura compleja de URLs en servidores web estáticos o Nginx:

| Ruta de Navegación | Vista Renderizada | Nivel de Acceso | Descripción Funcional |
| :--- | :--- | :--- | :--- |
| `#/` | `LandingPage` / Bento Hub | Público | Portada institucional interactiva con tablero Bento de 4 tarjetas de cristal. |
| `#/practicas` | `PracticasOverviewPage` | Estudiante (`test:take`) | Flujo secuencial: Video de inducción $\to$ Test diagnóstico $\to$ Descargas $\to$ Entrega. |
| `#/vinculacion` | `VinculacionOverviewPage` | Estudiante (`document:submit`) | Información de proyectos de servicio comunitario y buzón de bitácoras de campo. |
| `#/admin` | `AdminDashboardPage` | Docente (`workspace:create`) | Panel de control integral: métricas, gestión de espacios, revisión documental y certificados. |
| `#/eventos/:code` | `EventLandingPage` | Público (Acceso QR) | Portal ligero para asistentes a talleres: diapositivas y encuesta de satisfacción. |
| `#/certificados/validar/:hash` | `VerifyCertificatePortal` | Público (Validación QR) | Consulta pública de validez y autenticidad formal de un certificado emitido. |

---

## 3. Capa de Comunicación HTTP y Manejo de Sesión (`shared/lib/api.ts`)

La comunicación con el backend NestJS se centraliza en una instancia preconfigurada de Axios. El almacenamiento local del token utiliza la clave canónica **`wt_auth_token`**:

```typescript
import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Inyección automática del Bearer Token desde localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wt_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Manejo unificado de respuestas y depuración de credenciales caducadas
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('wt_auth_token');
    }
    return Promise.reject(error);
  },
);
```

---

## 4. Guardias de Petición para Usuarios no Autenticados (Prevención de Cascada 401)

En la carga inicial de la aplicación (`LandingPage`), el usuario no cuenta necesariamente con una sesión activa. Para evitar que la consola del navegador y el backend se saturen con errores en cascada `401 Unauthorized` por llamadas preventivas a endpoints protegidos, el componente orquestador `App.tsx` evalúa la presencia de credenciales antes de despachar solicitudes de red:

```typescript
const fetchWorkspaces = async () => {
  const token = localStorage.getItem('wt_auth_token');
  if (!token) return; // Se previene la ejecución sin credenciales activas
  try {
    setIsLoadingWorkspaces(true);
    const data = await workspacesApi.getAll();
    if (data && data.length > 0) {
      setWorkspaces(data);
      setSelectedWorkspace(data[0]);
    }
  } catch {
    // Si falla la red, se preservan los espacios de demostración locales
  } finally {
    setIsLoadingWorkspaces(false);
  }
};
```

Esta misma política se extiende a las consultas de evaluaciones, recursos, entregas y certificados, garantizando que un visitante anónimo disfrute de una navegación fluida y sin advertencias en consola.

---

## 5. Integración de Autenticación Real para Modos de Demostración

Para alternar entre perfiles en los entornos de demostración (`simulateStudent` y `simulateIngeniero`), el sistema ejecuta llamadas HTTP reales contra `POST /api/auth/login` utilizando las credenciales sembradas oficialmente en la base de datos:

* **Perfil Docente Evaluador:** Cédula `0600000001` con contraseña `Admin123*`.
* **Perfil Estudiante:** Cédula `0600000002` con contraseña `Estudiante123*`.

Al obtener una respuesta satisfactoria, el token firmado emitido por el backend se almacena en `localStorage` bajo `wt_auth_token` y se actualizan los espacios de trabajo directamente desde la base de datos SQLite.
