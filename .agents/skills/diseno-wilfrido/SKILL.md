---
name: diseno-wilfrido
description: Directrices maestras de diseño UI/UX para el proyecto wilfrido_trujillo (cero emojis, uso funcional mínimo de SVG, cero KPIs enormes superiores, jerarquía sobria y adhesión al estándar de diseño institucional).
---

# Directrices Maestras de Diseño UI/UX — Proyecto wilfrido_trujillo

Este documento establece las reglas obligatorias e inviolables para el diseño, composición visual, patrones de interacción y estilizado de la interfaz de usuario en el proyecto `wilfrido_trujillo`.

---

## 1. Reglas Fundamentales de Identidad Visual

1. **Cero Emojis Sin Excepción:**
   * Queda terminantemente prohibido el uso de emojis en cualquier elemento de la interfaz (botones, badges, encabezados, tooltips, modales, alertas o notificaciones).
   * La interfaz transmite autoridad académica, soberanía técnica y rigor institucional; la comunicación visual debe ser puramente tipográfica y vectorial sobria.

2. **Uso Mínimo y Estrictamente Funcional de Íconos SVG:**
   * Los íconos SVG (de `lucide-react`) deben limitarse únicamente a elementos que requieran affordance directo o claridad operativa inmediata (ej. botón de descarga, acción de cerrar, chevron de acordeón, indicador de estado crítico).
   * **Prohibido:** Acompañar cada palabra o título con íconos decorativos redundantes que generen ruido visual o saturen la vista.
   * Dimensiones estándar contenidas: `14px` a `16px` (`w-3.5 h-3.5` o `w-4 h-4`) para botones y tablas; máximo `20px` (`w-5 h-5`) en cabeceras modales.

3. **Cero Bloques de KPIs Enormes Superiores:**
   * Prohibido ocupar la parte superior de las pantallas con bloques masivos de métricas o tarjetas con números gigantescos que desplacen hacia abajo las herramientas operativas.
   * La interfaz prioriza la **densidad de información útil**, los datos tabulares limpios y los flujos de acción inmediata (subida de documentos, revisión, evaluación y emisión de certificados).
   * Si se requieren métricas de resumen, deben integrarse en barras compactas de estado, pestañas de filtro con conteo en línea (`Aprobadas (12)`) o paneles laterales discretos.

4. **Cero Diseños Genéricos o Plantillas Preconstruidas:**
   * Prohibido utilizar plantillas comerciales estándar o layouts genéricos de tipo "Admin Dashboard" copiados de internet.
   * Toda la interfaz debe regirse por la arquitectura de componentes atómicos del proyecto y ajustarse fielmente al estándar formal de diseño institucional que el desarrollador indique.

---

## 2. Sistema de Diseño y Tokens Globales

Todos los componentes deben construirse exclusivamente sobre los tokens y clases del sistema de diseño declarados en `frontend/src/index.css`:

* **Paleta de Superficies y Bordes:**
  * Fondo base: `--bg-base` (`#020617` / `slate-950`).
  * Tarjetas y paneles: `--surface-card` (`#0f172a` / `slate-900/70` con `backdrop-blur`).
  * Bordes estructurados: `--border-subtle` (`#1e293b` / `slate-800`).
  * Bordes activos/hover: `--border-highlight` (`#334155` / `slate-700`).
* **Acentos Semánticos Institucionales:**
  * Azul coordinador: `--accent-blue` (`#2563eb` / `blue-600`) para acciones principales y navegación.
  * Púrpura analítico: `--accent-purple` (`#9333ea` / `purple-600`) para evaluaciones y auditoría heurística RRA.
  * Esmeralda de verificación: `--accent-emerald` (`#10b981` / `emerald-500`) para estados aprobados, válidos y certificados emitidos.
  * Ámbar normativo: `--accent-amber` (`#f59e0b` / `amber-500`) para advertencias y bloqueos condicionales.
  * Rosa de alerta: `--accent-rose` (`#f43f5e` / `rose-500`) para observaciones y errores formales.

---

## 3. Catálogo de Primitivas Atómicas Obligatorias

Queda prohibido utilizar elementos HTML nativos sin estilizar o clases improvisadas ad-hoc. Se debe recurrir siempre a las primitivas de `@/shared/components/ui/`:

| Primitiva | Módulo de Origen | Casos de Uso |
| :--- | :--- | :--- |
| `Button` | `@/shared/components/ui/Button` | Botones de acción (`primary`, `secondary`, `purple`, `ghost`, `danger`) con variantes de tamaño (`sm`, `md`, `lg`) y soporte de spinner con `isLoading`. |
| `Card` | `@/shared/components/ui/Card` | Contenedores estructurados con `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` y `CardFooter`. |
| `Badge` | `@/shared/components/ui/Badge` | Indicadores normativos de estado (`success`, `warning`, `danger`, `info`, `purple`, `neutral`). |
| `Input` / `Textarea` / `Select` | `@/shared/components/ui/Input` | Campos de captura con labels, mensajes de ayuda, validación de error y bordes semánticos. |
| `Modal` | `@/shared/components/ui/Modal` | Ventanas modales accesibles con `role="dialog"`, bloqueo de scroll, backdrop blur y tecla Escape. |

---

## 4. Tipografía y Accesibilidad (WCAG AA)

* **Familia Tipográfica:** `Inter` (Google Fonts), optimizada con `-webkit-font-smoothing: antialiased`.
* **Legibilidad y Contraste:**
  * Textos primarios en `#f8fafc` (`slate-50`).
  * Textos descriptivos secundarios en `#94a3b8` (`slate-400`).
  * Textos terciarios o de apoyo en `#64748b` (`slate-500`).
* **Estados Interactivos Explícitos:** Todo elemento accionable debe definir `hover`, `active`, `focus-visible` (anillo de foco semántico accesible) y estado `disabled` (con opacidad reducida y cursor `not-allowed`).

---

## 5. Protocolo de Adaptación al Estándar Futuro

Cuando el desarrollador comunique la referencia o guía de estilo definitiva:
1. Se actualizarán las variables CSS y tokens en `frontend/src/index.css`.
2. Se ajustarán las primitivas atómicas en `frontend/src/shared/components/ui/`.
3. Todos los componentes de los dominios de negocio heredarán automáticamente los nuevos estilos sin necesidad de reescribir la lógica ni fragmentar el código.
