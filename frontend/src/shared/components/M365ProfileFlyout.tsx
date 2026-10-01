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

      {/* Flyout flotante estilo Microsoft 365 Account Card */}
      <div className="absolute right-3 top-13 z-50 w-80 bg-white border border-[#e0e0e0] rounded-lg shadow-xl p-4 text-[#242424] animate-fadeIn select-none">
        
        {/* Cabecera del Flyout con Organización */}
        <div className="flex items-center justify-between pb-3 border-b border-[#edebe9]">
          <div className="flex items-center gap-1.5 text-xs text-[#616161]">
            <span className="font-semibold text-[#0f6cbd]">ISTPET</span>
            <span>•</span>
            <span>Cuenta Institucional</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#242424] p-1 rounded-md hover:bg-[#f0f0f0] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tarjeta de Identidad de Usuario (Persona Card) */}
        <div className="flex items-start gap-3 py-3.5 border-b border-[#edebe9]">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#0f6cbd] text-white text-base font-bold flex items-center justify-center shadow-xs">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            {/* Presencia Verde Disponible M365 */}
            <span className="w-3.5 h-3.5 bg-[#107c10] border-2 border-white rounded-full absolute bottom-0 right-0 shadow-2xs" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-[#242424] truncate">
              {user ? user.fullName : 'Usuario No Autenticado'}
            </span>
            <span className="text-xs text-[#616161] truncate">
              {user?.email || 'alumno@instituto.edu.ec'}
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#0f6cbd]">
                {user?.roleKey || 'INVITADO'}
              </span>
              <span className="text-[10px] text-[#107c10] font-medium flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#107c10]" /> Disponible
              </span>
            </div>
          </div>
        </div>

        {/* Simulador PBAC / Conmutador de Roles */}
        <div className="py-3 border-b border-[#edebe9] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-[#0f6cbd]" /> Cambiar Perfil (PBAC)
            </span>
            <code className="text-[10px] font-mono text-[#0f6cbd]">
              {user?.roleKey}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                onSimulateStudent();
                onClose();
              }}
              className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition-all ${
                user?.roleKey === 'ESTUDIANTE'
                  ? 'bg-[#ebf3fc] border-[#0f6cbd] text-[#0f6cbd] font-semibold'
                  : 'bg-white border-[#e0e0e0] text-[#242424] hover:bg-[#f5f5f5]'
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
              className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition-all ${
                user?.roleKey === 'INGENIERO'
                  ? 'bg-[#ebf3fc] border-[#0f6cbd] text-[#0f6cbd] font-semibold'
                  : 'bg-white border-[#e0e0e0] text-[#242424] hover:bg-[#f5f5f5]'
              }`}
            >
              Docente / Tutor
            </button>
          </div>

          {/* Estado de Capacidad de Revisión */}
          <div className="mt-1 p-2 bg-[#fafafa] border border-[#e0e0e0] rounded-md text-xs flex items-center justify-between">
            <span className="text-[11px] text-[#616161] font-mono">document:review</span>
            {canReview ? (
              <span className="text-[#107c10] text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Habilitado
              </span>
            ) : (
              <span className="text-[#a4262c] text-[11px] font-semibold flex items-center gap-1">
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
            className="w-full py-1.5 px-2 rounded-md text-xs text-[#a4262c] hover:bg-[#fde7e9] flex items-center gap-2 transition-colors cursor-pointer text-left font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión de Microsoft 365</span>
          </button>
        </div>

      </div>
    </>
  );
};
