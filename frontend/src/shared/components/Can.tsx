import { type ReactNode } from 'react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import type { PermissionType } from '@/shared/types/auth.types';

interface CanProps {
  do: PermissionType | string | (PermissionType | string)[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente declarativo para control de acceso basado en capacidades (PBAC).
 * Renderiza `children` únicamente si el usuario autenticado cuenta con los permisos requeridos.
 */
export function Can({ do: required, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  if (!user || !user.permissions || !Array.isArray(user.permissions)) {
    return fallback ? <>{fallback}</> : null;
  }

  // Superadministrador o comodín
  if (user.permissions.includes('*') || user.roleKey === 'SUPERADMIN') {
    return <>{children}</>;
  }

  const permissionsRequired = Array.isArray(required) ? required : [required];

  // El usuario debe poseer todos los permisos indicados en el array
  const hasPermission = permissionsRequired.every((perm) =>
    user.permissions.includes(perm),
  );

  if (hasPermission) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}
