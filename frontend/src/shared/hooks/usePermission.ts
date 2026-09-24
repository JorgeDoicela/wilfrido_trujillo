import { useAuth } from '@/modules/auth/context/AuthContext';
import type { PermissionType } from '@/shared/types/auth.types';

export function usePermission(permission: PermissionType | string): boolean {
  const { user } = useAuth();

  if (!user || !user.permissions || !Array.isArray(user.permissions)) {
    return false;
  }

  // Si tiene el permiso comodín o rol de superadmin con acceso total
  if (user.permissions.includes('*') || user.roleKey === 'SUPERADMIN') {
    return true;
  }

  return user.permissions.includes(permission);
}
