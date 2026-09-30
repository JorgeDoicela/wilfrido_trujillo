# Guía de Ejecución Local y Operaciones

## 1. Prerrequisitos del Sistema

Para compilar y ejecutar el proyecto en un entorno local de desarrollo se requiere:

* **Node.js:** Versión 22.0.0 o superior (compatible con módulos ESM y SQLite nativo).
* **Gestor de Paquetes:** `pnpm` versión 10.0.0 o superior.
* **Sistema Operativo:** Compatible con Windows, Linux o macOS.
* **Herramientas de Compilación C++:** Requeridas por `better-sqlite3` si no existen binarios precompilados para la arquitectura (en Windows se instalan vía *Visual Studio Build Tools*).

---

## 2. Instalación Paso a Paso

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/JorgeDoicela/wilfrido_trujillo.git
   cd wilfrido_trujillo
   ```

2. **Instalar Dependencias de todo el Monorepo:**
   ```bash
   pnpm install
   ```

3. **Verificar Variables de Entorno:**
   * Asegurarse de que existan los archivos `backend/.env` y `frontend/.env` (basados en sus respectivos archivos `.env.example`).

---

## 3. Comandos de Operación y Scripts

Los scripts se ejecutan desde la raíz del proyecto orquestando ambos paquetes:

| Comando | Acción Técnica |
| :--- | :--- |
| `pnpm dev` | Inicia simultáneamente el backend en modo observador (`nest start --watch`) y el servidor Vite (`vite`) mediante `concurrently`. |
| `pnpm -r run build` | Compila la totalidad de paquetes del monorepo (`nest build` para backend y `tsc -b && vite build` para frontend). |
| `pnpm -r run lint` | Ejecuta el análisis estático de código mediante `oxlint`. |
| `pnpm --filter backend run test` | Ejecuta la suite de pruebas unitarias del backend utilizando `vitest`. |

---

## 4. Verificación del Servidor y Puertos de Escucha

Al ejecutar `pnpm dev`, los servicios se inicializan en los siguientes puertos locales:

* **Frontend (React 19 + Vite):** [http://localhost:5173/](http://localhost:5173/)
* **Backend (NestJS API REST):** [http://localhost:3000/api](http://localhost:3000/api)

---

## 5. Cuentas de Acceso Preconfiguradas (Seeding)

La primera vez que arranca la aplicación, el sistema inicializa automáticamente la base de datos en `./data/wilfrido.sqlite` y siembra las siguientes cuentas operativas:

### Perfil 1: Ing. Wilfrido Trujillo (Docente / Superadmin)
* **Identificación (Cédula):** `0600000001`
* **Correo Institucional:** `wilfrido.trujillo@unach.edu.ec`
* **Contraseña:** `Admin123*`
* **Capacidades:** Control total sobre espacios, dictamen de revisiones, emisión de certificados y métricas de satisfacción.

### Perfil 2: Estudiante de Ejemplo
* **Identificación (Cédula):** `0600000002`
* **Correo:** `estudiante@unach.edu.ec`
* **Contraseña:** `Estudiante123*`
* **Capacidades:** Inscripción mediante código, visualización de inducción, test diagnóstico, descarga condicional de plantillas y entrega de documentos con pre-auditoría.

---

## 6. Espacios de Trabajo Sembrados Inicialmente

| Código de Acceso | Título del Espacio | Tipo | Funcionalidades Habilitadas |
| :--- | :--- | :--- | :--- |
| `PRAC-2026` | Prácticas Preprofesionales 2026 | `PRACTICAS` | Inducción obligatoria por video, evaluación diagnóstica, descarga de formatos y entregas. |
| `VINC-2026` | Vinculación con la Sociedad 2026 | `VINCULACION` | Seguimiento de bitácoras de servicio comunitario. |
| `CONF-IA` | Conferencia: Inteligencia Artificial y Soberanía | `EVENTO` | Portal público de descarga de diapositivas, encuesta de satisfacción y certificados QR. |
