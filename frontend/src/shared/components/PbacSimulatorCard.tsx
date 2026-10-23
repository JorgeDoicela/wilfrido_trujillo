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
    <div className="glass-card p-4 md:p-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-3.5 border-b border-white/10 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Control de Acceso y Permisos (PBAC)
            </h3>
          </div>
          <p className="text-xs text-[#C4C4C4] mt-0.5">
            Simulador en tiempo real de directrices y capacidades operativas del sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSimulateStudent}
            className={`ui-btn text-xs px-3 py-1.5 ${
              user?.roleKey === 'ESTUDIANTE'
                ? 'ui-btn-primary'
                : 'ui-btn-secondary'
            }`}
          >
            Perfil Estudiante
          </button>
          <button
            type="button"
            onClick={onSimulateIngeniero}
            className={`ui-btn text-xs px-3 py-1.5 ${
              user?.roleKey === 'INGENIERO'
                ? 'ui-btn-primary'
                : 'ui-btn-secondary'
            }`}
          >
            Perfil Docente Evaluador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Estado de Permisos */}
        <div className="bg-white/[0.04] backdrop-blur-md rounded-xl p-3.5 border border-white/10">
          <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider block mb-1">
            Sesión Activa
          </span>
          <p className="text-xs font-semibold text-white mb-0.5">
            {user ? user.fullName : 'Invitado sin autenticar'}
          </p>
          <p className="text-[11px] text-[#C4C4C4] mb-2.5">
            Rol: <span className="font-semibold text-white font-mono">{user?.roleKey || 'ANÓNIMO'}</span>
          </p>
          <div className="text-xs text-[#F0F0F3] flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono font-semibold text-white">
              document:review
            </span>
            {canReview ? (
              <span className="ui-badge ui-badge-success inline-flex items-center gap-1 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> AUTORIZADO
              </span>
            ) : (
              <span className="ui-badge ui-badge-danger inline-flex items-center gap-1 font-semibold text-[11px]">
                <AlertCircle className="w-3 h-3" /> DENEGADO
              </span>
            )}
          </div>
        </div>

        {/* Zona Protegida con <Can do="document:review"> */}
        <div className="bg-white/[0.04] backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex flex-col justify-center">
          <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider block mb-2">
            Capacidad: <code className="text-white font-mono">document:review</code>
          </span>
          <Can
            do="document:review"
            fallback={
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-left backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-rose-300 mb-0.5 font-semibold text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bandeja de Aprobación Oculta</span>
                </div>
                <p className="text-[11px] text-[#C4C4C4]">
                  Solo el Docente Evaluador puede calificar y emitir dictámenes RRA.
                </p>
              </div>
            }
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-left backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-emerald-300 mb-0.5 font-bold text-xs uppercase">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Bandeja de Calificación Desbloqueada</span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Privilegios activos: Puede revisar bitácoras, calificar y auditar evidencias.
              </p>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};
