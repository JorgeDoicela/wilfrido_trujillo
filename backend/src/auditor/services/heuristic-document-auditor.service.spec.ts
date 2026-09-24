import { describe, it, expect, beforeEach } from 'vitest';
import PDFDocument from 'pdfkit';
import { HeuristicDocumentAuditorService } from './heuristic-document-auditor.service.js';

describe('HeuristicDocumentAuditorService', () => {
  let service: HeuristicDocumentAuditorService;

  beforeEach(() => {
    service = new HeuristicDocumentAuditorService();
  });

  it('debe rechazar un archivo que no sea PDF o esté corrupto', async () => {
    const invalidBuffer = Buffer.from('Este no es un archivo PDF.');
    const result = await service.audit(invalidBuffer, 'informe');

    expect(result.isValid).toBe(false);
    expect(result.score).toBe(0);
    expect(result.status).toBe('rejected');
    expect(result.observations[0]).toContain('no es un documento PDF válido');
  });

  it('debe auditar y evaluar positivamente un PDF con estructura académica válida', async () => {
    // Generar un PDF en memoria usando pdfkit
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({
        info: {
          Title: 'Informe Final de Prácticas Preprofesionales',
          Author: 'Estudiante Jorge Doicela',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(16).text('INFORME FINAL DE PRÁCTICAS PREPROFESIONALES');
      doc.moveDown();
      doc.fontSize(12).text('Estudiante: Jorge Doicela - Cédula: 1720000000');
      doc.text('Carrera: Ingeniería de Software - Periodo: 2026-2026');
      doc.moveDown();
      doc.fontSize(14).text('Objetivos del Proyecto:');
      doc.fontSize(11).text('Objetivo general: Implementar la arquitectura soberana para auditoría documental.');
      doc.moveDown();
      doc.fontSize(14).text('Descripción de Actividades:');
      doc.fontSize(11).text('Actividad 1: Desarrollo de servicios desacoplados bajo IDocumentAuditor cumpliendo 160 horas.');
      doc.moveDown();
      doc.fontSize(14).text('Conclusiones y Recomendaciones:');
      doc.fontSize(11).text('Conclusión: Se completaron satisfactoriamente todas las metas planificadas.');
      doc.moveDown();
      doc.fontSize(14).text('Legalización:');
      doc.text('Firma del Docente Tutor y Responsable Académico.');

      // Agregar segunda página para cumplir criterio de informe formal
      doc.addPage();
      doc.text('Anexo 1: Registro fotográfico y evidencias de las actividades desarrolladas.');
      doc.end();
    });

    const result = await service.audit(pdfBuffer, 'informe_final');

    expect(result.isValid).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.status).toBe('passed');
    expect(result.numPages).toBe(2);
    expect(result.characterCount).toBeGreaterThan(100);
    expect(result.metadata?.title).toContain('Informe Final');
  });
});
