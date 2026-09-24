export enum Permission {
  // Espacios de Trabajo (Workspaces)
  WORKSPACE_CREATE = 'workspace:create',
  WORKSPACE_UPDATE = 'workspace:update',
  WORKSPACE_DELETE = 'workspace:delete',
  WORKSPACE_READ = 'workspace:read',

  // Materiales y Recursos
  RESOURCE_MANAGE = 'resource:manage',
  RESOURCE_DOWNLOAD = 'resource:download',

  // Evaluaciones e Inducción
  TEST_MANAGE = 'test:manage',
  TEST_TAKE = 'test:take',

  // Gestión Documental y Auditoría
  DOCUMENT_SUBMIT = 'document:submit',
  DOCUMENT_REVIEW = 'document:review',
  DOCUMENT_AUDIT_IA = 'document:audit_ia',

  // Eventos y Certificación
  CERTIFICATE_MANAGE = 'certificate:manage',
  CERTIFICATE_ISSUE = 'certificate:issue',
  CERTIFICATE_CLAIM = 'certificate:claim',
}
