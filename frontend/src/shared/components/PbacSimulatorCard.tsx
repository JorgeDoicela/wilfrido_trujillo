import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Lock, FileCheck } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Can } from '@/shared/components/Can';
import { usePermission } from '@/shared/hooks/usePermission';

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
    <div className="m365-card p-4 md:p-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3.5 border-b border-[#edebe9] mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0f6cbd]" />
            <h3 className="text-sm font-semibold text-[#242424] tracking-tight">
              Control de Acceso y Permisos (PBAC)
            </h3>
          </div>
          <p className="text-xs text-[#616161] mt-0.5">
            Simulador en tiempo real de directrices y capacidades operativas del sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateStudent}
            className={`m365-btn text-xs ${
              user?.roleKey === 'ESTUDIANTE'
                ? 'm365-btn-primary'
                : 'm365-btn-secondary'
            }`}
          >
            Perfil Estudiante
          </button>
          <button
            type="button"
            onClick={onSimulateIngeniero}
            className={`m365-btn text-xs ${
              user?.roleKey === 'INGENIERO'
                ? 'm365-btn-primary'
                : 'm365-btn-secondary'
            }`}
          >
            Perfil Docente Evaluador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Estado de Permisos */}
        <div className="bg-[#fafafa] rounded-lg p-3.5 border border-[#e0e0e0]">
          <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider block mb-1">
            Sesión Activa
          </span>
          <p className="text-xs font-semibold text-[#242424] mb-0.5">
            {user ? user.fullName : 'Invitado sin autenticar'}
          </p>
          <p className="text-[11px] text-[#616161] mb-2.5">
            Rol: <span className="font-semibold text-[#0f6cbd]">{user?.roleKey || 'ANÓNIMO'}</span>
          </p>
          <div className="text-xs text-[#424242] flex items-center justify-between pt-2 border-t border-[#edebe9]">
            <span className="text-[11px] font-mono font-semibold text-[#242424]">
              document:review
            </span>
            {canReview ? (
              <span className="m365-badge m365-badge--success inline-flex items-center gap-1 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> AUTORIZADO
              </span>
            ) : (
              <span className="m365-badge m365-badge--danger inline-flex items-center gap-1 font-semibold text-[11px]">
                <AlertCircle className="w-3 h-3" /> DENEGADO
              </span>
            )}
          </div>
        </div>

        {/* Zona Protegida con <Can do="document:review"> */}
        <div className="bg-[#fafafa] rounded-lg p-3.5 border border-[#e0e0e0] flex flex-col justify-center">
          <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider block mb-2">
            Capacidad: <code className="text-[#0f6cbd] font-mono">document:review</code>
          </span>
          <Can
            do="document:review"
            fallback={
              <div className="p-2.5 rounded-md bg-[#fde7e9] border border-[#f1aeb5] text-left">
                <div className="flex items-center gap-1.5 text-[#a4262c] mb-0.5 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bandeja de Aprobación Oculta</span>
                </div>
                <p className="text-[11px] text-[#616161]">
                  Solo el Docente Evaluador puede calificar y emitir dictámenes RRA.
                </p>
              </div>
            }
          >
            <div className="p-2.5 rounded-md bg-[#dff6dd] border border-[#a3d9a5] text-left">
              <div className="flex items-center gap-1.5 text-[#107c10] mb-0.5 font-bold text-xs uppercase">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Bandeja de Calificación Desbloqueada</span>
              </div>
              <p className="text-[11px] text-[#1e4620]">
                Privilegios activos: Puede revisar bitácoras, calificar y auditar evidencias.
              </p>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};
