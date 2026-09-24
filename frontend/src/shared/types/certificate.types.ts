export interface Certificate {
  id: string;
  workspaceId: string;
  recipientName: string;
  recipientEmail: string;
  recipientIdentification: string;
  hours: number;
  verificationHash: string;
  pdfPath: string | null;
  issuedAt: string;
}

export interface IssueCertificatePayload {
  workspaceId: string;
  recipientName: string;
  recipientEmail: string;
  recipientIdentification?: string;
  hours?: number;
}

export interface CertificateVerificationResult {
  isValid: boolean;
  verificationHash: string;
  recipientName: string;
  recipientIdentification: string;
  eventTitle: string;
  hours: number;
  issuedAt: string;
  issuer: string;
  role: string;
  statusMessage: string;
  downloadUrl: string;
}
