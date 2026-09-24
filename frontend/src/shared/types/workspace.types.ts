export type WorkspaceType = 'PRACTICAS' | 'VINCULACION' | 'EVENTO';

export interface Workspace {
  id: string;
  title: string;
  description: string | null;
  type: WorkspaceType;
  isActive: boolean;
  accessCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceEnrollment {
  id: string;
  userId: string;
  workspaceId: string;
  inductionVideoWatched: boolean;
  testPassed: boolean;
  testScore: number | null;
  status: 'active' | 'completed' | 'dropped';
  workspace?: Workspace;
  createdAt: string;
}

export interface CreateWorkspacePayload {
  title: string;
  description?: string;
  type: WorkspaceType;
  accessCode?: string;
}
