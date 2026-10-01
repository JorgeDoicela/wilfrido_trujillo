---
name: diseno-wilfrido
description: Directrices maestras de diseño UI/UX para el proyecto wilfrido_trujillo basadas estrictamente en Microsoft 365 Moderno (Fluent Design System 2 / Fluent UI v9). Define paleta cromática exacta, tipografía Segoe UI, espaciado, componentes Suite Bar, App Rail, Command Bar, Cards, Data Grids, modales, cero emojis y cero KPIs gigantescos.
---

# Directrices Maestras de Diseño UI/UX: Microsoft 365 Moderno (Fluent Design System 2)

Este documento constituye la especificación canónica, obligatoria e inviolable para el diseño, composición visual, patrones de interacción y estilización de la interfaz de usuario en el proyecto `wilfrido_trujillo`. 

Toda inteligencia artificial o desarrollador que genere código en el frontend debe ceñirse al 100% a la experiencia visual y funcional de la suite moderna de **Microsoft 365 (Teams, SharePoint, OneDrive, Outlook Web y Microsoft 365 Admin Center)** basada en **Fluent Design System 2 / Fluent UI v9**.

---

## 1. Principios Fundamentales Inviolables

1. **Pureza Microsoft 365 (Cero Hibridación):**
   * Queda estrictamente prohibido mezclar estilos "SaaS genéricos", estéticas oscuras tipo consola/cyberpunk, tarjetas con bordes redondeados gigantescos (estilo iOS/macOS) o gradientes llamativos de marketing.
   * La interfaz debe ser reconocible de inmediato como una aplicación oficial de Microsoft 365 para entornos corporativos y educativos de alta productividad.

2. **Cero Emojis en Toda la Interfaz:**
   * Prohibido el uso de emojis en cualquier componente visual (botones, badges, títulos, tooltips, modales, alertas o textos).
   * La comunicación visual se basa exclusivamente en tipografía formal, iconografía vectorial funcional e indicadores de estado estandarizados de Microsoft 365.

3. **Iconografía Funcional Mínima (Estilo Fluent System Icons):**
   * Emplear exclusivamente íconos SVG limpios y lineales (`lucide-react`) con grosor de trazo uniforme (`stroke-width="1.75"` o `stroke-width="2"`).
   * Dimensiones estándar rigurosas:
     * `16px` (`w-4 h-4`): Botones, filas de tablas, chips de filtro y badges.
     * `20px` (`w-5 h-5`): Botones de barra de navegación principal, App Rail y Command Bar.
     * `24px` (`w-6 h-6`): Cabeceras principales o ilustraciones de estado vacío.
   * Prohibido colocar íconos decorativos redundantes junto a cada sustantivo. Los íconos solo se usan cuando aportan affordance de acción o jerarquía de estado.

4. **Cero Bloques Superiores de KPIs Enormes:**
   * Prohibido insertar tarjetas de métricas gigantescas que empujen el contenido operativo fuera del primer pliegue visual (viewport).
   * Microsoft 365 es una suite orientada a tareas: el usuario entra a consultar expedientes, auditar PDFs, evaluar cuestionarios o emitir certificados, no a ver estadísticas vacías.
   * La información de resumen se condensa en badges numéricos dentro de pestañas (`Pendientes (4)`), chips en la Command Bar o columnas de tabla compactas.

5. **Navegación Focalizada por Dominio (Cero Apilamiento de Páginas):**
   * Prohibido apilar verticalmente páginas completas en un scroll infinito (anti-patrón de landing page).
   * La navegación mediante la App Rail y el Drawer contextual renderiza únicamente la vista del módulo activo a pantalla completa (`100% height - 48px Suite Bar - 44px Command Bar`).

---

## 2. Paleta Cromática Oficial Fluent 2 / Microsoft 365

Todos los estilos deben utilizar las variables CSS declaradas en `frontend/src/index.css` o los valores exactos de la escala Fluent UI v9:

### 2.1 Colores Primarios de Marca (Microsoft Blue)
* **Brand Primary:** `#0f6cbd` (Azul corporativo principal M365).
* **Brand Hover:** `#115ea3` (Estado hover en botones y enlaces).
* **Brand Pressed / Active:** `#0c3b5e` (Estado activo/click).
* **Brand Selected Background:** `#ebf3fc` (Fondos sutiles de selección en menús y pestañas activas).
* **Brand Foreground On Selected:** `#0f6cbd` (Texto e ícono sobre fondo de selección).

### 2.2 Superficies, Fondos y Contenedores
* **Canvas Background (Fondo general de aplicación):** `#f5f5f5` (Gris neutro limpio estándar de Teams y SharePoint).
* **Card / Container Surface:** `#ffffff` (Blanco puro para paneles, tablas y tarjetas).
* **Subtle Surface (Hover en filas / fondos secundarios):** `#fafafa` o `#f7f9fa`.
* **Border Default:** `#e0e0e0` (Borde sutil de 1px para tarjetas, divisores y barras de herramientas).
* **Border Subtle (Divisores internos de tablas):** `#edebe9`.
* **Border Focus:** `#0f6cbd` (Anillo o borde inferior de enfoque accesible de 2px).

### 2.3 Tipografía y Textos
* **Text Primary (Neutral Foreground 1):** `#242424` (Texto principal de alta legibilidad, títulos y cuerpo).
* **Text Secondary (Neutral Foreground 2):** `#616161` (Subtítulos, metadatos, labels y descripciones).
* **Text Tertiary / Disabled (Neutral Foreground 3):** `#8a8886` / `#adadad` (Textos secundarios atenuados y estados inactivos).
* **Text On Brand:** `#ffffff` (Texto sobre fondos azul de marca o barra de suite).

### 2.4 Estados Semánticos de Retroalimentación y Presencia
* **Success / Presencia Disponible:**
  * Indicador y texto: `#107c10` (Verde Microsoft / Teams Available).
  * Fondo badge/alerta: `#dff6dd` con borde `#107c10/20`.
* **Warning / Advertencia:**
  * Indicador y texto: `#d83b01` (Naranja/Ámbar Fluent).
  * Fondo badge/alerta: `#fff4ce` con borde `#d83b01/20`.
* **Error / Observación Grave:**
  * Indicador y texto: `#a80000` (Rojo formal Microsoft).
  * Fondo badge/alerta: `#fde7e9` con borde `#a80000/20`.
* **Informational / En Proceso:**
  * Indicador y texto: `#0f6cbd` (Azul Fluent).
  * Fondo badge/alerta: `#ebf3fc` con borde `#0f6cbd/20`.
* **Neutral Badge:**
  * Fondo: `#f0f0f0`, Texto: `#424242`, Borde: `#e0e0e0`.

---

## 3. Tipografía Oficial y Escala Jerárquica

La tipografía obligatoria es la pila corporativa de Microsoft:
```css
font-family: 'Segoe UI', 'Segoe UI Variable', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
```

### Escala de Tamaños y Pesos Fluent 2
| Nivel Jerárquico | Tamaño | Altura de Línea | Peso | Color | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Title 1** | `24px` (`text-2xl`) | `32px` | `600` (Semibold) | `#242424` | Encabezado principal del módulo en vista activa. |
| **Title 2** | `20px` (`text-xl`) | `26px` | `600` (Semibold) | `#242424` | Títulos de secciones principales y modales. |
| **Subtitle / Subheading** | `16px` (`text-base`) | `22px` | `600` (Semibold) | `#242424` | Títulos de tarjetas y agrupadores. |
| **Body 1 (Regular)** | `14px` (`text-sm`) | `20px` | `400` (Regular) | `#242424` | Texto corrido, celdas de tabla, campos de texto. |
| **Body 1 (Strong)** | `14px` (`text-sm`) | `20px` | `600` (Semibold) | `#242424` | Enlaces, nombres de usuario, encabezados de tabla. |
| **Caption 1** | `12px` (`text-xs`) | `16px` | `400` (Regular) | `#616161` | Metadatos, marcas temporales, etiquetas de apoyo. |
| **Caption 2 (Micro)** | `10px` (`text-[10px]`) | `14px` | `600` (Semibold) | `#616161` | Etiquetas en botones verticales de la App Rail. |

---

## 4. Arquitectura de Layout: Microsoft 365 Shell

La ventana de la aplicación se divide en 4 zonas fijas estructurales:

```
+-----------------------------------------------------------------------------------+
| Suite Bar (48px fijo, #0f6cbd) - Waffle [:::] | Título App | Buscador | Perfil O365|
+--------+-----------------------+--------------------------------------------------+
| App    | Nav Drawer (220px)    | Command Bar (44px fijo, #ffffff)                 |
| Rail   | Contextual            | [+ Nuevo] [Sincronizar] [Filtro] | Ruta Migajas   |
| (56px) | Menú de segundo nivel +--------------------------------------------------+
|        | por módulo de negocio | Main Content Canvas (Fondo #f5f5f5)              |
|        |                       | Tarjetas #ffffff con borde #e0e0e0               |
|        |                       | Tablas estilo SharePoint Lists                   |
+--------+-----------------------+--------------------------------------------------+
```

### 4.1 Suite Bar Superior (Microsoft 365 Blue Ribbon)
* **Altura fija:** `48px` (`h-12`).
* **Fondo:** `#0f6cbd`.
* **Componentes obligatorios de izquierda a derecha:**
  1. **App Launcher Waffle (`M365WaffleMenu.tsx`):** Botón cuadrado de `48x48px` con ícono de 9 puntos en matriz 3x3 (`Grip` o SVG). Al pulsar, despliega el panel oficial de aplicaciones Microsoft 365 (OneDrive, Teams, SharePoint, Word, Excel, Auditoría).
  2. **Identidad Institucional:** Texto blanco `font-semibold text-sm` con el nombre de la plataforma y separador vertical tenue.
  3. **Buscador Central Global:** Cápsula horizontal de ancho máximo `460px` con fondo blanco al 15% (`bg-white/15`), borde invisible, texto blanco, placeholder accesible y atajo de teclado visible `Ctrl+K`. Al recibir foco, pasa a fondo blanco puro `#ffffff` con texto `#242424`.
  4. **Iconos de Asistencia y Configuración:** Botones de `36x36px` con hover `bg-white/10` y bordes redondeados completos.
  5. **Persona Avatar con Flyout Oficial (`M365ProfileFlyout.tsx`):** Círculo de `32x32px` con iniciales o fotografía del usuario, provisto del punto indicador de presencia verde `#107c10` (Disponible). Al hacer clic, abre el flyout formal de cuenta donde se muestra la identidad corporativa y se realiza el cambio de perfil PBAC (Estudiante / Docente Evaluador), sin contaminar el lienzo operativo.

### 4.2 Left App Rail (Barra de Aplicaciones Lateral)
* **Ancho fijo:** `56px` (`w-14`).
* **Fondo:** `#ffffff` (blanco puro) con borde divisorio derecho de 1px `#e0e0e0`.
* **Botones de módulo:**
  * Tamaño: `56px` ancho por `52px` alto.
  * Distribución interna: Ícono de `20px` arriba, etiqueta de texto de `10px` abajo con `tracking-normal`.
  * **Estado Inactivo:** Color `#616161`, hover `bg-[#f5f5f5]` y color `#242424`.
  * **Estado Activo:** Fondo `#ebf3fc`, color `#0f6cbd`, y una barra vertical indicadora azul `#0f6cbd` de `3px` de grosor en el extremo izquierdo con esquinas redondeadas.

### 4.3 Secondary Navigation Drawer (Panel Contextual)
* **Ancho fijo:** `220px` (`w-[220px]`).
* **Fondo:** `#ffffff` con borde divisorio derecho `#e0e0e0`.
* **Encabezado:** Nombre del módulo activo en `text-xs font-semibold uppercase tracking-wider text-[#616161]`.
* **Ítems de navegación:**
  * Altura: `36px`, padding horizontal `12px`, `rounded-[4px]`.
  * Tipografía: `14px`, `font-normal`.
  * Activo: Fondo `#ebf3fc`, texto `#0f6cbd`, `font-semibold`.
  * Badges de conteo: Píldora gris `#f0f0f0` con texto `#616161` de `11px font-medium`.

### 4.4 Command Bar Horizontal
* **Altura fija:** `44px` (`h-11`).
* **Fondo:** `#ffffff` con borde divisorio inferior `#e0e0e0`.
* **Contenido:**
  * Botón primario de acción: Botón azul `#0f6cbd` con ícono `+` y texto (ej. `+ Nueva Entrega`, `+ Emitir Certificado`).
  * Botones de herramientas secundarias: Fondo transparente, texto `#242424`, hover `bg-[#f5f5f5]` (ej. `Sincronizar`, `Filtrar`, `Exportar`).
  * Ruta de migajas (Breadcrumbs) al extremo derecho: Texto `12px text-[#616161]` mostrando la ubicación actual.

---

## 5. Especificaciones de Componentes Atómicos y Contenedores

### 5.1 Tarjetas de Superficie (`Card.tsx`)
* **Fondo:** Blanco `#ffffff`.
* **Borde:** `1px solid #e0e0e0`.
* **Radio de curvatura:** `8px` (`rounded-lg`).
* **Sombra:** `0 1px 3px rgba(0,0,0,0.06)` (elevación Fluent Card Level 1).
* **Padding estándar:** `p-5` o `p-6` (`20px` o `24px`).
* Prohibidas las sombras oscuras pronunciadas, bordes de colores llamativos o fondos translúcidos con glassmorphism.

### 5.2 Botones de Acción (`Button.tsx`)
* **Radio de curvatura:** `4px` (`rounded-[4px]`).
* **Tipografía:** `14px font-semibold`.
* **Variantes obligatorias:**
  * **Primary:** Fondo `#0f6cbd`, texto `#ffffff`, hover `#115ea3`, active `#0c3b5e`.
  * **Secondary / Default:** Fondo `#ffffff`, borde `1px solid #d1d1d1`, texto `#242424`, hover `bg-[#f5f5f5]` y borde `#c7c7c7`.
  * **Subtle / Ghost:** Fondo transparente, texto `#242424`, hover `bg-[#f0f0f0]`.
  * **Danger:** Fondo `#ffffff`, borde `1px solid #d13438`, texto `#a80000`, hover `bg-[#fde7e9]`.
* **Focus Visible:** `outline: 2px solid #000000` con `outline-offset: 2px` (accesibilidad estándar Fluent).

### 5.3 Tablas de Datos Estilo SharePoint Lists / M365 Data Grids
* **Contenedor:** Tarjeta blanca `#ffffff` con borde perimetral `#e0e0e0` y esquinas de `8px`.
* **Cabecera de Tabla (`<thead>`):**
  * Fondo: `#fafafa` con borde inferior `1px solid #e0e0e0`.
  * Tipografía: `12px font-semibold text-[#616161]`, alineación precisa.
* **Filas de Datos (`<tbody> <tr>`):**
  * Fondo base: `#ffffff`.
  * Divisor entre filas: `1px solid #edebe9`.
  * Hover en fila: Fondo `#f7f9fa`.
  * Altura de fila estándar: `48px` a `52px` (alta densidad de información útil sin amontonamiento).
  * Tipografía de celda: `14px text-[#242424]`.

### 5.4 Badges e Indicadores de Estado (`Badge.tsx`)
* **Estructura:** Píldora plana compacta (`rounded-full` o `rounded-[4px]`), padding `px-2.5 py-0.5`.
* **Tipografía:** `11px` o `12px font-medium`.
* **Paleta estricta:**
  * Aprobado / Emitido: Fondo `#dff6dd`, texto `#107c10`, borde `#107c10/20`.
  * En Revisión / En Proceso: Fondo `#ebf3fc`, texto `#0f6cbd`, borde `#0f6cbd/20`.
  * Observado / Bloqueado: Fondo `#fff4ce`, texto `#d83b01`, borde `#d83b01/20`.
  * No Aprobado / Crítico: Fondo `#fde7e9`, texto `#a80000`, borde `#a80000/20`.
  * Neutral: Fondo `#f0f0f0`, texto `#424242`, borde `#e0e0e0`.

### 5.5 Flujo Secuencial (Fluent Stepper)
* Indicadores de etapa mediante círculos concéntricos de `28px`:
  * Completado: Círculo `#107c10` con ícono check blanco.
  * Activo actual: Círculo blanco con borde de `2px solid #0f6cbd` y número en azul.
  * Inactivo pendiente: Círculo blanco con borde de `1px solid #e0e0e0` y número gris `#8a8886`.
* Línea de conexión: Barra continua de `2px` (`#107c10` para completados, `#e0e0e0` para pendientes).

### 5.6 Ventanas Modales (`Modal.tsx`)
* **Backdrop:** Fondo oscuro atenuado con opacidad estándar `rgba(0, 0, 0, 0.4)` (sin desenfoque excesivo).
* **Panel Modal:** Fondo `#ffffff`, radio `8px`, sombra `0 8px 28px rgba(0,0,0,0.2)` (Fluent Dialog elevation).
* **Cabecera:** Título `20px font-semibold text-[#242424]` y botón de cerrar `X` con hover `bg-[#f5f5f5]`.
* **Pie:** Barra inferior `#fafafa` con borde superior `#e0e0e0`, alineando a la derecha el botón secundario (`Cancelar`) y el primario (`Confirmar`).

---

## 6. Lista de Verificación Mandatoria para Desarrolladores e IA

Antes de considerar terminada cualquier vista o componente en el frontend, verificar los siguientes puntos:

1. [ ] ¿El fondo general de la aplicación es `#f5f5f5` y las tarjetas son blanco puro `#ffffff`?
2. [ ] ¿La barra superior utiliza el azul exacto de Microsoft `#0f6cbd` a `48px` de altura con el Waffle oficial y buscador central?
3. [ ] ¿La barra lateral (App Rail) tiene un ancho exacto de `56px` con fondo blanco y botones con indicador vertical de `3px`?
4. [ ] ¿Las tarjetas usan radio de `8px` (`rounded-lg`) y bordes de `1px` `#e0e0e0` sin efectos de neón o bordes de colores?
5. [ ] ¿Se eliminó cualquier emoji de los textos, botones y mensajes del sistema?
6. [ ] ¿Los botones principales usan `#0f6cbd` con hover `#115ea3` y radio de `4px`?
7. [ ] ¿Los íconos son estrictamente funcionales (16px a 20px) sin saturación decorativa?
8. [ ] ¿Las tablas de datos siguen el formato limpio de SharePoint Lists con cabeceras `#fafafa` y hover `#f7f9fa`?
9. [ ] ¿La alternancia de roles (PBAC) se encuentra en el flyout de perfil (`M365ProfileFlyout`), sin cajas flotantes que tapen la pantalla?
10. [ ] ¿La vista responde únicamente al módulo activo sin apilar vistas secundarias debajo?
