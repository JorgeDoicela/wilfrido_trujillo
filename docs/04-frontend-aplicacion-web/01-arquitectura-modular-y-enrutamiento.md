# Arquitectura Modular del Frontend y Enrutamiento

## 1. Arquitectura Modular por Dominios de Negocio (Domain-Driven Modules)

El frontend adopta una **Arquitectura Modular por Dominios de Negocio** en lugar de estructuras fragmentadas. Todo recurso que atañe a un área funcional reside dentro de su respectivo módulo, garantizando alta cohesión local y bajo acoplamiento:

```text
frontend/src/
├── app/                                 # Inicialización de la aplicación y punto de entrada
│   ├── main.tsx                         # Punto de entrada de Vite y montaje del AuthProvider
│   └── App.tsx                          # Orquestador raíz de vistas, navegación y shells
│
├── shared/                              # Núcleo Transversal Compartido (Agnóstico al Negocio)
│   ├── api/                             # Clientes API transversales (workspaces.api.ts)
│   ├── components/                      # Componentes atómicos y shell (FluentShell, Navbar, Can, Modales)
│   ├── context/                         # Estado de sesión y autenticación (AuthContext.tsx)
│   ├── hooks/                           # Hooks de permisos y autenticación (usePermission, useAuth)
│   ├── lib/api.ts                       # Instancia tipada de Axios con interceptores JWT
│   └── types/                           # Tipos globales (auth, workspace, document, test, certificate)
│
└── modules/                             # MÓDULOS DE NEGOCIO AUTÓNOMOS (DOMINIOS AISLADOS)
    ├── auth/                            # Páginas y formularios de acceso
    ├── admin/                           # Administración de espacios de trabajo
    ├── practicas/                       # Prácticas preprofesionales (video, tests, recursos, entregas, auditoría)
    ├── vinculacion/                     # Vinculación comunitaria y bitácoras
    └── eventos/                         # Conferencias, encuestas QR y certificados digitales
```

### Reglas de Oro del Código:
1. **Cero Importaciones Cruzadas entre Módulos:** `modules/practicas` no importa nada de `modules/eventos` ni de `modules/vinculacion`.
2. **Promoción a Shared:** Si dos módulos requieren un componente común, este se ubica en `shared/components/`.
3. **Contrato de API Co-Localizado:** Cada módulo posee su propia subcarpeta `api/` (`workspaces.api.ts`, `documents.api.ts`, `certificates.api.ts`).

---

## 2. Estrategia de Enrutamiento y Navegación

La aplicación implementa un esquema de navegación híbrido basado en estado sincronizado con el hash del navegador (`window.location.hash`). Esto permite el acceso directo a rutas profundas públicas sin requerir configuración compleja de reescritura de URLs en servidores Nginx:

| Ruta de Navegación | Vista Renderizada | Nivel de Acceso | Descripción Funcional |
| :--- | :--- | :--- | :--- |
| `#/` | `HomePage` / Dashboard | Público / Autenticado | Portada profesional del Ing. Wilfrido Trujillo y selector de espacios activos. |
| `#/practicas` | `PracticasOverviewPage` | Estudiante (`test:take`) | Flujo guiado: Video de inducción $\to$ Test diagnóstico $\to$ Descargas $\to$ Entrega. |
| `#/vinculacion` | `VinculacionOverviewPage` | Estudiante (`document:submit`) | Información de proyectos de servicio comunitario y buzón de bitácoras de campo. |
| `#/admin` | `AdminDashboardPage` | Docente (`workspace:create`) | Panel de control integral: métricas, gestión de espacios, revisión documental y certificados. |
| `#/eventos/:code` | `EventLandingPage` | Público (Acceso QR) | Portal ligero para asistentes a talleres: diapositivas y encuesta de satisfacción. |
| `#/certificados/validar/:hash` | `VerifyCertificatePortal` | Público (Validación QR) | Consulta criptográfica pública de validez y autenticidad de un certificado. |

---

## 3. Capa de Comunicación HTTP (`shared/lib/api.ts`)

La comunicación con el backend NestJS se centraliza en una instancia preconfigurada de Axios que gestiona la inyección automática de tokens de autenticación:

```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
