export type ResourceFileType = 'pdf' | 'word' | 'excel' | 'document';

export interface ResourceFile {
  id: string;
  workspaceId: string;
  title: string;
  fileUrl: string;
  fileType: ResourceFileType | string;
  isLockedUntilTestPass: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourcePayload {
  workspaceId: string;
  title: string;
  fileType?: string;
  fileUrl?: string;
  isLockedUntilTestPass?: boolean;
}
