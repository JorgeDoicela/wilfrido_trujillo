---
name: auditor-wilfrido
description: Directrices maestras del Agente Auditor Documental (análisis heurístico RRA de PDFs, validación estructural, semáforo de dictamen y arquitectura pluggable bajo IDocumentAuditor para IA/Gemini).
---

# Guía del Agente Auditor Documental — Proyecto wilfrido_trujillo

Esta skill describe la arquitectura, reglas de negocio y extensibilidad del motor de auditoría documental del sistema.

---

## 1. Principio de Inversión de Dependencias (DIP)

El sistema de auditoría no se acopla directamente a una implementación concreta. Tanto los controladores como los servicios de entrega consumen el token inyectable `DOCUMENT_AUDITOR` respaldado por la interfaz `IDocumentAuditor`:

```typescript
export interface IDocumentAuditor {
  audit(fileBuffer: Buffer, documentType?: string): Promise<DocumentAuditResult>;
}

export const DOCUMENT_AUDITOR = 'IDocumentAuditor';
```

---

## 2. Reglas de Validación Heurística (Fase 1)

El servicio `HeuristicDocumentAuditorService` (`backend/src/auditor/services/heuristic-document-auditor.service.ts`) evalúa:

1. **Cabecera Mágica del Archivo:**
   * Verifica los primeros 5 bytes: `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`). Si no coincide, rechazo inmediato (`status: 'rejected'`, puntaje 0).
2. **Páginas Mínimas según Documento:**
   * Para informes finales o de prácticas: mínimo 2 páginas.
3. **Densidad y Reconocimiento OCR:**
   * Mínimo 80 caracteres en total. Si tiene menos, advierte sobre posibles escaneos físicos sin capa OCR (`missingFields.push('texto_ocr_legible')`).
4. **Secciones Normativas RRA:**
   * Datos Informativos (`estudiante`, `cédula`, `carrera`, `universidad`).
   * Objetivos (`objetivo`, `objetivos`, `objetivo general`).
   * Actividades y Horas (`actividad`, `actividades`, `desarrollo`, `horas`).
   * Conclusiones y Recomendaciones (`conclusión`, `conclusiones`, `resultados`).
   * Legalización y Firmas (`firma`, `firmado`, `tutor`, `docente`).
5. **Cálculo del Semáforo:**
   * **Verde (`passed`):** Puntaje $\ge 80$ y sin campos obligatorios faltantes.
   * **Amarillo (`warning`):** Puntaje entre 50 y 79 o advertencias menores subsanables.
   * **Rojo (`rejected`):** Puntaje $< 50$ o documento corrupto/vacío.

---

## 3. Extensibilidad para Fase 2 (Integración con IA Generativa)

Para conectar Gemini API o un modelo local mediante Ollama:
1. Crear `backend/src/auditor/services/ai-document-auditor.service.ts` implementando `IDocumentAuditor`.
2. Extraer el texto del PDF mediante `pdf-parse` y enviarlo como prompt a la API con una rúbrica estructurada en JSON.
3. En `AuditorModule`, configurar un proveedor conmutado condicionalmente:
   ```typescript
   {
     provide: DOCUMENT_AUDITOR,
     useFactory: (config: ConfigService) => {
       const apiKey = config.get<string>('GEMINI_API_KEY');
       return apiKey
         ? new AiDocumentAuditorService(apiKey)
         : new HeuristicDocumentAuditorService();
     },
     inject: [ConfigService],
   }
   ```
4. Los módulos dependientes (`SubmissionsService`, controladores) continuarán operando sin modificar una sola línea de código.
