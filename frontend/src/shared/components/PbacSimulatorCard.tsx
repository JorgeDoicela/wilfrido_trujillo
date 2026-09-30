import React from 'react';
import { UserCheck, CheckCircle2, AlertCircle, Lock, FileCheck } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Can } from '@/shared/components/Can';
import { usePermission } from '@/shared/hooks/usePermission';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';

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
    <Card className="max-w-5xl mx-auto w-full shadow-xl">
      <CardHeader className="border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              Simulador de Permisos PBAC
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Alterna entre perfiles para comprobar las capacidades activas en tiempo real.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSimulateStudent}
            >
              Simular Alumno
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
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado de Permisos */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Usuario en Sesión
            </h4>
            <p className="text-sm font-medium text-white mb-1">
              {user ? user.fullName : 'Invitado sin autenticar'}
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Rol: <span className="text-blue-400 font-semibold">{user?.roleKey || 'ANÓNIMO'}</span>
            </p>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
              <code>usePermission('document:review')</code>:
              {canReview ? (
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> TRUE
                </span>
              ) : (
                <span className="text-rose-400 font-bold inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> FALSE
                </span>
              )}
            </div>
          </div>

          {/* Zona Protegida con <Can do="document:review"> */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Permiso: <code>document:review</code>
            </h4>
            <Can
              do="document:review"
              fallback={
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                  <Lock className="w-4 h-4 text-rose-400 mx-auto mb-1 opacity-80" />
                  <p className="text-xs font-semibold text-rose-300">Bandeja de Aprobación Oculta</p>
                  <p className="text-[11px] text-slate-400">Requiere permiso de revisión docente.</p>
                </div>
              }
            >
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Bandeja Desbloqueada</span>
                </div>
                <p className="text-xs text-slate-300">
                  Acceso para calificar y emitir observaciones a las bitácoras entregadas.
                </p>
              </div>
            </Can>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
