import { api } from '@/shared/lib/api';
import type {
  Workspace,
  WorkspaceEnrollment,
  CreateWorkspacePayload,
} from '@/shared/types/workspace.types';

export const workspacesApi = {
  async getAll(): Promise<Workspace[]> {
    const response = await api.get<Workspace[]>('/workspaces');
    return response.data;
  },

  async getMyWorkspaces(): Promise<WorkspaceEnrollment[]> {
    const response = await api.get<WorkspaceEnrollment[]>('/workspaces/my-workspaces');
    return response.data;
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const response = await api.post<Workspace>('/workspaces', payload);
    return response.data;
  },

  async joinByCode(
    code: string,
  ): Promise<{ enrollment: WorkspaceEnrollment; workspace: Workspace; isNew: boolean }> {
    const response = await api.post<{
      enrollment: WorkspaceEnrollment;
      workspace: Workspace;
      isNew: boolean;
    }>(`/workspaces/join/${code.trim().toUpperCase()}`);
    return response.data;
  },

  async completeInduction(workspaceId: string): Promise<WorkspaceEnrollment> {
    const response = await api.post<WorkspaceEnrollment>(
      `/workspaces/${workspaceId}/induction/complete`,
    );
    return response.data;
  },

  async getInductionStatus(workspaceId: string): Promise<WorkspaceEnrollment> {
    const response = await api.get<WorkspaceEnrollment>(
      `/workspaces/${workspaceId}/induction/status`,
    );
    return response.data;
  },
};
