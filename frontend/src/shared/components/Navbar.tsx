import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Button } from '@/shared/components/ui/Button';

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
    <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold tracking-wider">
            WT
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Ing. Wilfrido Trujillo</h1>
            <p className="text-xs text-slate-400">Gestión Académica & Eventos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> PBAC Activo
          </span>

          {onSimulateStudent && onSimulateIngeniero && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSimulateStudent}
                className="text-xs py-1 px-2.5 h-auto"
              >
                Simular Alumno
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onSimulateIngeniero}
                className="text-xs py-1 px-2.5 h-auto"
              >
                Simular Ingeniero
              </Button>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                {user.fullName} ({user.roleKey})
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-rose-400 hover:text-rose-300 underline transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Sin sesión activa</span>
          )}
        </div>
      </div>
    </header>
  );
};
