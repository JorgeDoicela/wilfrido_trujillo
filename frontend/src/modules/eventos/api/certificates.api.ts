import { api } from '@/shared/lib/api';
import type {
  Certificate,
  IssueCertificatePayload,
  CertificateVerificationResult,
} from '@/shared/types/certificate.types';

export const certificatesApi = {
  async issue(payload: IssueCertificatePayload): Promise<Certificate> {
    const response = await api.post<Certificate>('/certificates/issue', payload);
    return response.data;
  },

  async getByWorkspace(workspaceId: string): Promise<Certificate[]> {
    const response = await api.get<Certificate[]>(`/certificates/workspace/${workspaceId}`);
    return response.data;
  },

  async verify(hash: string): Promise<CertificateVerificationResult> {
    const response = await api.get<CertificateVerificationResult>(`/certificates/verify/${hash}`);
    return response.data;
  },

  async download(id: string, fallbackFilename?: string): Promise<void> {
    const response = await api.get(`/certificates/${id}/download`, {
      responseType: 'blob',
    });

    let filename = fallbackFilename || `certificado-${id}.pdf`;
    const disposition = response.headers['content-disposition'] as string | undefined;
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
