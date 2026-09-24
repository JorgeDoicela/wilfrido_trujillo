import { api } from '@/shared/lib/api';
import type {
  DocumentSubmission,
  ReviewSubmissionPayload,
} from '@/shared/types/document.types';

export const documentsApi = {
  async upload(formData: FormData): Promise<DocumentSubmission> {
    const response = await api.post<DocumentSubmission>('/submissions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getMySubmissions(workspaceId: string): Promise<DocumentSubmission[]> {
    const response = await api.get<DocumentSubmission[]>(`/submissions/my-submissions/${workspaceId}`);
    return response.data;
  },

  async getWorkspaceSubmissions(workspaceId: string): Promise<DocumentSubmission[]> {
    const response = await api.get<DocumentSubmission[]>(`/submissions/workspace/${workspaceId}`);
    return response.data;
  },

  async review(id: string, payload: ReviewSubmissionPayload): Promise<DocumentSubmission> {
    const response = await api.patch<DocumentSubmission>(`/submissions/${id}/review`, payload);
    return response.data;
  },

  async download(id: string, fallbackFilename?: string): Promise<void> {
    const response = await api.get(`/submissions/${id}/download`, {
      responseType: 'blob',
    });

    let filename = fallbackFilename || `entrega-${id}.pdf`;
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
