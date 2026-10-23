import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { usePermission } from '@/shared/hooks/usePermission';

export interface M365ProfileFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateStudent: () => void;
  onSimulateIngeniero: () => void;
}

export const M365ProfileFlyout: React.FC<M365ProfileFlyoutProps> = ({
  isOpen,
  onClose,
  onSimulateStudent,
  onSimulateIngeniero,
}) => {
  const { user, logout } = useAuth();
  const canReview = usePermission('document:review');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop invisible para cerrar al hacer clic afuera */}
      <div
        className="fixed inset-0 z-50 bg-transparent"
        onClick={onClose}
      />

      {/* Flyout flotante vidriado */}
      <div className="absolute right-3 top-13 z-50 w-80 glass-dropdown p-4 animate-fadeIn select-none shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
        
        {/* Cabecera del Flyout con Organización */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#C4C4C4]">
            <span className="font-semibold text-white">ISTPET</span>
            <span>•</span>
            <span>Cuenta Institucional</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#C4C4C4] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tarjeta de Identidad de Usuario (Persona Card) */}
        <div className="flex items-start gap-3 py-3.5 border-b border-white/10">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 text-white text-base font-bold flex items-center justify-center backdrop-blur-md shadow-sm">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            {/* Presencia Verde Disponible */}
            <span className="w-3.5 h-3.5 bg-emerald-400 border-2 border-[#1C2451] rounded-full absolute bottom-0 right-0 shadow-xs" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {user ? user.fullName : 'Usuario No Autenticado'}
            </span>
            <span className="text-xs text-[#C4C4C4] truncate">
              {user?.email || 'alumno@instituto.edu.ec'}
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-white/90 bg-white/10 px-2 py-0.5 rounded border border-white/15 font-mono">
                {user?.roleKey || 'INVITADO'}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Simulador PBAC / Conmutador de Roles */}
        <div className="py-3 border-b border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-white" /> Cambiar Perfil (PBAC)
            </span>
            <code className="text-[10px] font-mono text-white/80">
              {user?.roleKey}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSimulateStudent();
                onClose();
              }}
              className={`py-2 px-3 rounded-full text-xs font-semibold border text-center transition-all cursor-pointer ${
                user?.roleKey === 'ESTUDIANTE'
                  ? 'bg-gradient-to-r from-white/25 to-white/10 border-white/45 border-t-white/80 text-white shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.1] hover:border-white/20 text-[#C4C4C4] hover:text-white'
              }`}
            >
              Estudiante
            </button>

            <button
              type="button"
              onClick={() => {
                onSimulateIngeniero();
                onClose();
              }}
              className={`py-2 px-3 rounded-full text-xs font-semibold border text-center transition-all cursor-pointer ${
                user?.roleKey === 'INGENIERO'
                  ? 'bg-gradient-to-r from-white/25 to-white/10 border-white/45 border-t-white/80 text-white shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.1] hover:border-white/20 text-[#C4C4C4] hover:text-white'
              }`}
            >
              Docente / Tutor
            </button>
          </div>

          {/* Estado de Capacidad de Revisión */}
          <div className="mt-1 p-2 bg-white/[0.04] border border-white/10 rounded-lg text-xs flex items-center justify-between">
            <span className="text-[11px] text-[#C4C4C4] font-mono">document:review</span>
            {canReview ? (
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Habilitado
              </span>
            ) : (
              <span className="text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Denegado
              </span>
            )}
          </div>
        </div>

        {/* Enlaces y Acciones de Cuenta */}
        <div className="pt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full py-2 px-2.5 rounded-lg text-xs text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 border border-transparent hover:border-rose-500/20 flex items-center gap-2 transition-all cursor-pointer text-left font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>

      </div>
    </>
  );
};
