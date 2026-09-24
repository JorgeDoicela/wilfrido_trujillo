export type PermissionType =
  // Workspaces
  | 'workspace:create'
  | 'workspace:update'
  | 'workspace:delete'
  | 'workspace:read'
  // Resources
  | 'resource:manage'
  | 'resource:download'
  // Tests
  | 'test:manage'
  | 'test:take'
  // Documentos
  | 'document:submit'
  | 'document:review'
  | 'document:audit_ia'
  // Certificados
  | 'certificate:manage'
  | 'certificate:issue'
  | 'certificate:claim';

export interface User {
  id: string;
  email: string;
  identification: string;
  fullName: string;
  roleKey: string;
  permissions: string[];
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface SessionState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
