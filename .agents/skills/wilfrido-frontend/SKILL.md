---
name: wilfrido-frontend
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
4. **Diseño Visual Sobrio:**
   * Tema oscuro técnico institucional basado en `slate-900`, `slate-950`, bordes sutiles `slate-800` y acentos sobrios en azul (`blue-600`), púrpura (`purple-600`) y esmeralda (`emerald-500`).
   * Prohibido el uso de emojis en títulos, botones, alertas o textos de interfaz; utilizar íconos vectoriales SVG limpios de `lucide-react`.

---

## 2. Comandos Operativos del Frontend

| Comando | Acción |
| :--- | :--- |
| `pnpm --filter frontend dev` | Inicia el servidor de desarrollo Vite con Hot Module Replacement (HMR). |
| `pnpm --filter frontend build` | Verifica tipos con TypeScript (`tsc -b`) y compila los artefactos estáticos en `dist/`. |
