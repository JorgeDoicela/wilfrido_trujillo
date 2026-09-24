import { Injectable, Logger } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import type {
  IDocumentAuditor,
  DocumentAuditResult,
  AuditStatus,
} from '../interfaces/document-auditor.interface.js';

interface SectionRequirement {
  id: string;
  label: string;
  keywords: string[];
  mandatory: boolean;
  penalty: number;
}

@Injectable()
export class HeuristicDocumentAuditorService implements IDocumentAuditor {
  private readonly logger = new Logger(HeuristicDocumentAuditorService.name);

  private readonly academicSections: SectionRequirement[] = [
    {
      id: 'datos_identificacion',
      label: 'Datos Informativos (Estudiante, Carrera o Cédula)',
      keywords: ['estudiante', 'cédula', 'cedula', 'carrera', 'periodo', 'universidad', 'facultad'],
      mandatory: true,
      penalty: 15,
    },
    {
      id: 'objetivos',
      label: 'Objetivos del Proyecto o Práctica',
      keywords: ['objetivo', 'objetivos', 'objetivo general', 'objetivos específicos'],
      mandatory: true,
      penalty: 20,
    },
    {
      id: 'actividades_desarrollo',
      label: 'Descripción de Actividades o Metodología',
      keywords: ['actividad', 'actividades', 'desarrollo', 'metodologia', 'metodología', 'horas'],
      mandatory: true,
      penalty: 20,
    },
    {
      id: 'conclusiones',
      label: 'Conclusiones y/o Recomendaciones',
      keywords: ['conclusión', 'conclusiones', 'recomendación', 'recomendaciones', 'resultados'],
      mandatory: false,
      penalty: 10,
    },
    {
      id: 'firmas_legalizacion',
      label: 'Sección de Firmas o Legalización',
      keywords: ['firma', 'firmado', 'tutor', 'docente', 'aprobado', 'responsable'],
      mandatory: false,
      penalty: 10,
    },
  ];

  async audit(fileBuffer: Buffer, documentType = 'general'): Promise<DocumentAuditResult> {
    const observations: string[] = [];
    const missingFields: string[] = [];
    let score = 100;

    // 1. Verificación de Cabecera Mágica del archivo PDF
    if (!this.isValidPdfHeader(fileBuffer)) {
      return {
        isValid: false,
        score: 0,
        status: 'rejected',
        numPages: 0,
        characterCount: 0,
        missingFields: ['formato_invalido'],
        observations: [
          'El archivo entregado no es un documento PDF válido o su cabecera está corrupta.',
        ],
      };
    }

    try {
      const parserFn = (pdfParse as unknown as { default?: typeof pdfParse }).default ?? pdfParse;
      const pdfData = await parserFn(fileBuffer);

      const numPages = pdfData.numpages || 0;
      const rawText = pdfData.text || '';
      const cleanText = rawText.replace(/\s+/g, ' ').trim();
      const characterCount = cleanText.length;
      const normalizedText = cleanText.toLowerCase();

      // 2. Validación de Páginas
      if (numPages === 0) {
        observations.push('El documento no contiene páginas procesables.');
        score -= 50;
      } else if (documentType.includes('informe') && numPages < 2) {
        observations.push('Longitud insuficiente: Un informe formal debe contener al menos 2 páginas.');
        score -= 20;
      }

      // 3. Validación de Densidad y Legibilidad del Texto
      if (characterCount < 80) {
        observations.push(
          'Texto no detectable o muy escaso. Si el documento fue escaneado, asegúrese de aplicar reconocimiento OCR antes de la entrega.',
        );
        missingFields.push('texto_ocr_legible');
        score -= 40;
      } else {
        const avgCharsPerPage = Math.round(characterCount / (numPages || 1));
        if (avgCharsPerPage < 100) {
          observations.push(
            `Baja densidad de texto detectada (promedio de ${avgCharsPerPage} caracteres por página). Verifique que no contenga páginas en blanco innecesarias.`,
          );
          score -= 10;
        }
      }

      // 4. Verificación de Secciones Académicas
      for (const section of this.academicSections) {
        const hasMatch = section.keywords.some((kw) => normalizedText.includes(kw));
        if (!hasMatch) {
          missingFields.push(section.id);
          observations.push(`Sección no identificada: "${section.label}".`);
          score -= section.penalty;
        }
      }

      // 5. Análisis de Metadatos
      const info = pdfData.info as Record<string, string | undefined> | undefined;
      const metaTitle = info?.Title?.trim();
      const metaAuthor = info?.Author?.trim();
      const metaCreator = info?.Creator?.trim();
      const metaProducer = info?.Producer?.trim();
      const metaCreationDate = info?.CreationDate?.trim();

      if (!metaTitle || metaTitle.toLowerCase().includes('untitled') || metaTitle.toLowerCase().includes('documento')) {
        observations.push('Metadatos: El documento no posee un título formal asignado en las propiedades del archivo.');
        score -= 5;
      }

      if (!metaAuthor) {
        observations.push('Metadatos: No se detectó el nombre del autor en las propiedades internas del PDF.');
        score -= 5;
      }

      // Normalizar puntaje final entre 0 y 100
      const finalScore = Math.max(0, Math.min(100, Math.round(score)));

      // Determinar estado de auditoría (Semáforo)
      let status: AuditStatus = 'passed';
      if (finalScore < 50) {
        status = 'rejected';
      } else if (finalScore < 80 || missingFields.length > 0) {
        status = 'warning';
      }

      if (observations.length === 0) {
        observations.push('El documento cumple con todos los criterios de estructura formal y legibilidad.');
      }

      return {
        isValid: status !== 'rejected',
        score: finalScore,
        status,
        numPages,
        characterCount,
        missingFields,
        observations,
        metadata: {
          title: metaTitle,
          author: metaAuthor,
          creator: metaCreator,
          producer: metaProducer,
          creationDate: metaCreationDate,
        },
        rawAnalysis: {
          documentType,
          avgCharsPerPage: Math.round(characterCount / (numPages || 1)),
        },
      };
    } catch (error) {
      this.logger.error(`Error durante el parseo y análisis heurístico del PDF: ${(error as Error).message}`);
      return {
        isValid: false,
        score: 0,
        status: 'rejected',
        numPages: 0,
        characterCount: 0,
        missingFields: ['error_procesamiento'],
        observations: [
          `No fue posible procesar la estructura interna del documento: ${(error as Error).message}`,
        ],
      };
    }
  }

  private isValidPdfHeader(buffer: Buffer): boolean {
    if (!buffer || buffer.length < 5) return false;
    // Magic bytes: %PDF- (0x25 0x50 0x44 0x46 0x2D)
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    );
  }
}
