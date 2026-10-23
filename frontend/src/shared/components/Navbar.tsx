import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';

export interface NavbarProps {
  onSimulateStudent?: () => void;
  onSimulateIngeniero?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSimulateStudent,
  onSimulateIngeniero,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 glass-suite-bar px-4 flex items-center sticky top-0 z-40 text-white select-none">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Identidad Institucional Glassmorphism */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-xs font-bold font-mono tracking-wider text-white shadow-xs backdrop-blur-md">
            WT
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">Wilfrido Trujillo</span>
            <span className="text-white/40 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-[#C4C4C4] hidden sm:inline">Gestión de Prácticas & Eventos</span>
          </div>
        </div>

        {/* Acciones y Estado PBAC */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            <ShieldCheck className="w-3 h-3" /> PBAC
          </span>

          {onSimulateStudent && onSimulateIngeniero && (
            <div className="hidden sm:flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/15 backdrop-blur-md">
              <button
                type="button"
                onClick={onSimulateStudent}
                className="text-xs py-1 px-2.5 rounded-md text-[#C4C4C4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Estudiante
              </button>
              <button
                type="button"
                onClick={onSimulateIngeniero}
                className="text-xs py-1 px-2.5 rounded-md bg-white/20 text-white font-semibold border border-white/25 shadow-xs transition-colors cursor-pointer"
              >
                Ingeniero
              </button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <span className="text-xs text-white font-medium hidden md:inline">
                {user.fullName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/90 border border-white/15">
                {user.roleKey}
              </span>
              <button
                type="button"
                onClick={logout}
                title="Cerrar sesión"
                className="text-[#C4C4C4] hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
