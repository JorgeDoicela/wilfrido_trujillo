import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';

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
    <header className="h-[var(--topbar-height)] bg-[var(--fluent-navy)] border-b border-[var(--border-strong)] px-4 flex items-center sticky top-0 z-40 text-white shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Identidad Institucional Oficial Fluent */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-[var(--radius-input)] bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold font-mono tracking-wider text-white">
            WT
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-tight">Ing. Wilfrido Trujillo</span>
            <span className="text-white/40 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-white/70 hidden sm:inline">Gestión de Prácticas & Eventos</span>
          </div>
        </div>

        {/* Acciones y Estado PBAC */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-badge)] text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" /> PBAC
          </span>

          {onSimulateStudent && onSimulateIngeniero && (
            <div className="hidden sm:flex items-center gap-1 bg-black/25 p-0.5 rounded-[var(--radius-input)] border border-white/10">
              <button
                type="button"
                onClick={onSimulateStudent}
                className="text-xs py-1 px-2 rounded-[var(--radius-input)] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Estudiante
              </button>
              <button
                type="button"
                onClick={onSimulateIngeniero}
                className="text-xs py-1 px-2 rounded-[var(--radius-input)] bg-[var(--fluent-blue)] text-white font-medium hover:bg-[var(--fluent-blue-hover)] transition-colors"
              >
                Ingeniero
              </button>
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <span className="text-xs text-white/90 font-medium hidden md:inline">
                {user.fullName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--radius-input)] bg-white/10 text-white/80 border border-white/10">
                {user.roleKey}
              </span>
              <button
                type="button"
                onClick={logout}
                title="Cerrar sesión"
                className="text-white/60 hover:text-white p-1 rounded-[var(--radius-input)] transition-colors"
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
