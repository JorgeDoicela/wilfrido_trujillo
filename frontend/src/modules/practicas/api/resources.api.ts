import { api } from '@/shared/lib/api';
import type { ResourceFile, CreateResourcePayload } from '@/shared/types/resource.types';

export const resourcesApi = {
  async getByWorkspace(workspaceId: string): Promise<ResourceFile[]> {
    const response = await api.get<ResourceFile[]>(`/resources/workspace/${workspaceId}`);
    return response.data;
  },

  async upload(formData: FormData): Promise<ResourceFile> {
    const response = await api.post<ResourceFile>('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async create(payload: CreateResourcePayload): Promise<ResourceFile> {
    const response = await api.post<ResourceFile>('/resources', payload);
    return response.data;
  },

  async download(resourceId: string, fallbackFilename?: string): Promise<void> {
    const response = await api.get(`/resources/${resourceId}/download`, {
      responseType: 'blob',
    });

    // Extraer nombre de Content-Disposition si existe
    let filename = fallbackFilename || `plantilla-${resourceId}.pdf`;
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

  async delete(resourceId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/resources/${resourceId}`);
    return response.data;
  },
};
