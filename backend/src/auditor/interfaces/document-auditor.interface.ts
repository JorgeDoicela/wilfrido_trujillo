export type AuditStatus = 'passed' | 'warning' | 'rejected';

export interface DocumentAuditResult {
  isValid: boolean;
  score: number;
  status: AuditStatus;
  numPages: number;
  characterCount: number;
  missingFields: string[];
  observations: string[];
  metadata?: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
  };
  rawAnalysis?: Record<string, unknown>;
}

export interface IDocumentAuditor {
  audit(fileBuffer: Buffer, documentType: string): Promise<DocumentAuditResult>;
}

export const DOCUMENT_AUDITOR = 'IDocumentAuditor';
