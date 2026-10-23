---
name: frontend-wilfrido
description: Directrices maestras de desarrollo frontend para el proyecto wilfrido_trujillo (React 19, Vite, Tailwind CSS v4, arquitectura modular por dominios, componentes PBAC y hash routing).
---

# Guía Técnica de Desarrollo Frontend — Proyecto wilfrido_trujillo

Esta skill complementa la skill global `desarrollo-frontend` con los estándares específicos del cliente web de `wilfrido_trujillo`.

---

## 1. Convenciones Mandatorias de Arquitectura

1. **Aislamiento Estricto por Dominios de Negocio:**
   * La aplicación se estructura bajo `src/modules/` en módulos autónomos (`auth`, `admin`, `practicas`, `vinculacion`, `eventos`).
   * Queda estrictamente prohibido que un módulo importe archivos de otro módulo hermano (ej. `practicas` importando de `eventos`).
   * Si dos módulos requieren componentes, hooks o interfaces comunes, deben promoverse a `src/shared/`.
2. **Control de Acceso Declarativo (PBAC en Cliente):**
   * Para renderizado condicional de elementos de UI basado en permisos:
     ```tsx
     import { Can } from '@/shared/components/Can';

     <Can permission="document:review">
       <button onClick={openReviewModal}>Revisar Entrega</button>
     </Can>
     ```
   * Para validación condicional en lógica de componentes o hooks:
     ```tsx
     import { usePermission } from '@/shared/hooks/usePermission';

     const canManageResources = usePermission('resource:manage');
     ```
3. **Consumo de APIs y Tipado Estricto:**
   * Cada módulo define su cliente en `api/` (ej. `documents.api.ts`, `certificates.api.ts`) consumiendo la instancia centralizada `api` de `@/shared/lib/api`.
   * Prohibido el uso de `any` en llamadas a la API. Toda respuesta debe mapearse a tipos definidos en `@/shared/types/`.
4. **Diseño Visual Sobrio, Lenguaje de Dominio e Iconografía Mínima:**
   * **Cero Emojis:** Prohibido terminantemente el uso de emojis en cualquier componente, botón, título, tooltip, modal o notificación.
   * **Cero Palabras Marketeras:** Prohibido el uso de lenguaje publicitario, inflado o rimbombante. Toda comunicación debe ser estrictamente fáctica, técnica y operativa.
   * **Cero Tecnicismos Internos al Usuario:** Prohibido exponer al usuario final hashes criptográficos, "SHA-256", "criptografía", "PBAC", "JWT" u otros detalles de infraestructura. El texto de la interfaz debe expresarse en lenguaje de negocio claro: "Certificado verificado", "Validación QR", "Acreditación oficial".
   * **Cero Palabras Innecesarias ni Redundancia:** Prohibido añadir en el frontend o en los estilos palabras accesorias, etiquetas obvias o micro-rótulos donde no sea estrictamente necesario. Prohibido duplicar información entre títulos, badges, barras de progreso y descripciones dentro de un mismo componente. Máxima economía de palabras.
   * **Glassmorphism Estructural Puro (Cero Cercos a Palabras o Íconos):** El glassmorphism aplica única y exclusivamente a contenedores macro y superficies estructurales completas. Queda terminantemente prohibido poner alrededor de palabras, títulos, subtítulos o íconos SVG cápsulas, píldoras (`rounded-full`), óvalos, bordes perimetrales o fondos que los rodeen. Las palabras e íconos descansan limpios y directos sobre la superficie con tipografía pura.
   * **Iconografía SVG Estrictamente Mínima:** Los íconos vectoriales (`lucide-react`) solo se emplean para acciones que requieran affordance interactivo imprescindible (búsqueda, cerrar, descargar, navegación). Prohibida la saturación decorativa de íconos junto a cada sustantivo o título, y prohibido envolver íconos en discos circulares o anillos.

---

## 2. Comandos Operativos del Frontend

| Comando | Acción |
| :--- | :--- |
| `pnpm --filter frontend dev` | Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR). |
| `pnpm --filter frontend build` | Verifica tipos con TypeScript (`tsc -b`) y compila los artefactos estáticos en `dist/`. |
