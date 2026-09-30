import React from 'react';
import { UserCheck, CheckCircle2, AlertCircle, Lock, FileCheck } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Can } from '@/shared/components/Can';
import { usePermission } from '@/shared/hooks/usePermission';
import { Button } from '@/shared/components/ui/Button';

export interface PbacSimulatorCardProps {
  onSimulateStudent: () => void;
  onSimulateIngeniero: () => void;
}

export const PbacSimulatorCard: React.FC<PbacSimulatorCardProps> = ({
  onSimulateStudent,
  onSimulateIngeniero,
}) => {
  const { user } = useAuth();
  const canReview = usePermission('document:review');

  return (
    <div className="bg-white border border-[#d1d5db]/80 rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#e5e7eb] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#1b2a4a]" />
            <h3 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
              Control de Acceso Basado en Permisos (PBAC)
            </h3>
          </div>
          <p className="text-xs text-[#605e5c] mt-0.5">
            Simulación interactiva de perfiles para auditoría de directrices en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSimulateStudent}
          >
            Simular Estudiante
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onSimulateIngeniero}
          >
            Simular Docente / Ingeniero
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado de Permisos */}
        <div className="bg-[#faf9f8] rounded-[4px] p-3.5 border border-[#e5e7eb]">
          <h4 className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider mb-1.5">
            Usuario Activo en Sesión
          </h4>
          <p className="text-xs font-bold text-[#1a1a1a] mb-1">
            {user ? user.fullName : 'Invitado sin autenticar'}
          </p>
          <p className="text-[11px] text-[#605e5c] mb-2.5">
            Rol asignado: <span className="font-semibold text-[#1b2a4a] bg-black/5 px-1.5 py-0.5 rounded-[2px]">{user?.roleKey || 'ANÓNIMO'}</span>
          </p>
          <div className="text-xs text-[#323130] flex items-center gap-2 pt-2 border-t border-[#e5e7eb]">
            <code className="text-[11px] font-mono bg-white px-1.5 py-0.5 border border-[#d1d5db] rounded-[2px]">
              usePermission('document:review')
            </code>
            {canReview ? (
              <span className="fluent-badge fluent-badge--success inline-flex items-center gap-1 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> AUTORIZADO
              </span>
            ) : (
              <span className="fluent-badge fluent-badge--danger inline-flex items-center gap-1 font-semibold text-[11px]">
                <AlertCircle className="w-3 h-3" /> DENEGADO
              </span>
            )}
          </div>
        </div>

        {/* Zona Protegida con <Can do="document:review"> */}
        <div className="bg-[#faf9f8] rounded-[4px] p-3.5 border border-[#e5e7eb] flex flex-col justify-center">
          <h4 className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider mb-2">
            Capacidad Operativa: <code className="text-[#1b2a4a] font-mono">document:review</code>
          </h4>
          <Can
            do="document:review"
            fallback={
              <div className="p-3 rounded-[4px] bg-[#fdf3f4] border border-[#f1aeb5] text-left">
                <div className="flex items-center gap-1.5 text-[#a80000] mb-0.5 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bandeja de Aprobación Bloqueada</span>
                </div>
                <p className="text-[11px] text-[#605e5c]">
                  Requiere rol de Docente Evaluador para calificar y emitir dictámenes RRA.
                </p>
              </div>
            }
          >
            <div className="p-3 rounded-[4px] bg-[#eef8f0] border border-[#a3d9a5] text-left">
              <div className="flex items-center gap-1.5 text-[#107c10] mb-0.5 font-bold text-xs uppercase">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Bandeja de Calificación Desbloqueada</span>
              </div>
              <p className="text-[11px] text-[#243a28]">
                Privilegios docentes activos: Puede revisar bitácoras, emitir observaciones y auditar evidencias.
              </p>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};
