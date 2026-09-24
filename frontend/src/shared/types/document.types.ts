export type SubmissionStatus = 'submitted' | 'observed' | 'approved';
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

export interface DocumentSubmission {
  id: string;
  enrollmentId: string;
  documentTitle: string;
  fileUrl: string;
  status: SubmissionStatus;
  feedbackNotes: string | null;
  auditedAt: string | null;
  auditScore?: number | null;
  auditResult?: DocumentAuditResult | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  enrollment?: {
    id: string;
    userId?: string;
    workspaceId?: string;
    user?: {
      id: string;
      fullName: string;
      email: string;
      identification: string;
    };
    workspace?: {
      id: string;
      title: string;
    };
  };
}

export interface CreateSubmissionPayload {
  workspaceId: string;
  documentTitle: string;
  fileUrl?: string;
}

export interface ReviewSubmissionPayload {
  status: SubmissionStatus;
  feedbackNotes?: string;
}
