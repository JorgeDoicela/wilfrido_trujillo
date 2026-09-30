import React, { useState } from 'react';
import {
  FileText,
  Users,
  Award,
  Calendar,
  Search,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import type { Workspace } from '@/shared/types/workspace.types';

export interface FluentShellProps {
  children: React.ReactNode;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
  onSimulateStudent?: () => void;
  onSimulateIngeniero?: () => void;
}

export const FluentShell: React.FC<FluentShellProps> = ({
  children,
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  activeNavTab,
  onSelectNavTab,
  onSimulateStudent,
  onSimulateIngeniero,
}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'practicas', label: 'Prácticas Preprofesionales', icon: FileText, count: 48 },
    { id: 'vinculacion', label: 'Vinculación Comunitaria', icon: Users, count: 24 },
    { id: 'eventos', label: 'Eventos y Conferencias', icon: Calendar, count: 3 },
    { id: 'certificados', label: 'Certificados y Registro QR', icon: Award, count: 12 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#e8eaf0] text-[#1a1a1a] font-sans antialiased">
      {/* ====================================================================
          1. TOPBAR NAVBAR (48px height per M365 spec - Ref: titulacion-istpet)
          ==================================================================== */}
      <header className="h-12 bg-[#1b2a4a] text-white px-4 flex items-center justify-between sticky top-0 z-50 shadow-xs gap-4 border-b border-white/10 select-none">
        
        {/* Brand Left */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Alternar panel de navegación"
            className="w-8 h-8 rounded-[2px] text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-[2px] bg-[#c59b27] text-[#1b2a4a] font-bold font-mono text-xs flex items-center justify-center shadow-xs">
              WT
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold tracking-wide text-[#c59b27]">
                ING. WILFRIDO TRUJILLO
              </span>
              <span className="text-[10px] text-white/70 font-normal">
                Gestión Académica Soberana
              </span>
            </div>
          </div>
        </div>

        {/* Central Search Bar (M365 Search Style) */}
        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-white/60 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar estudiante, cédula, bitácora o código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[30px] pl-9 pr-3 text-xs bg-white/10 border border-white/20 rounded-[2px] text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-[#c59b27] transition-all"
          />
        </div>

        {/* Right Actions: PBAC Simulator & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick PBAC Switcher */}
          {onSimulateStudent && onSimulateIngeniero && (
            <div className="hidden sm:flex items-center gap-1 bg-black/25 p-0.5 rounded-[2px] border border-white/10 text-xs">
              <button
                type="button"
                onClick={onSimulateStudent}
                className={`py-1 px-2 rounded-[2px] transition-colors ${
                  user?.roleKey === 'ESTUDIANTE'
                    ? 'bg-[#c59b27] text-[#1b2a4a] font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Estudiante
              </button>
              <button
                type="button"
                onClick={onSimulateIngeniero}
                className={`py-1 px-2 rounded-[2px] transition-colors ${
                  user?.roleKey === 'INGENIERO'
                    ? 'bg-[#0078d4] text-white font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Ingeniero
              </button>
            </div>
          )}

          {/* User Profile Badge */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <div className="w-6 h-6 rounded-full bg-[#c59b27] text-[#1b2a4a] text-xs font-bold flex items-center justify-center">
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="hidden lg:flex flex-col leading-none">
                <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-[#c59b27]">
                  {user.roleKey}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Cerrar sesión"
                className="text-white/70 hover:text-white p-1 rounded-[2px] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ====================================================================
          2. BODY LAYOUT: ICON RAIL (48px) + SIDEBAR (220px) + MAIN CONTENT
          ==================================================================== */}
      <div className="flex-1 flex w-full">
        
        {/* Icon Rail Lateral Izquierdo (48px - Ref: titulacion-istpet Section 6) */}
        <aside className="w-12 bg-[#12213a] flex flex-col items-center py-2 gap-1 border-r border-white/5 flex-shrink-0 z-20 select-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNavTab(item.id)}
                title={item.label}
                className={`w-12 h-10 flex items-center justify-center relative transition-colors ${
                  isActive
                    ? 'text-white bg-white/12'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#c59b27] rounded-r-[2px]" />
                )}
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
          
          <div className="flex-1" />

          <div className="w-8 h-8 rounded-[2px] bg-white/5 text-[#c59b27] flex items-center justify-center text-[10px] font-mono border border-white/10 mb-2">
            RRA
          </div>
        </aside>

        {/* Sidebar Secundaria Desplegable (220px - Ref: titulacion-istpet) */}
        {isSidebarOpen && (
          <aside className="w-[220px] bg-white border-r border-[#d1d5db]/60 flex flex-col gap-4 py-4 px-3 flex-shrink-0 shadow-xs z-10">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider px-2">
                COORDINACIÓN RRA
              </span>
              <div className="flex flex-col gap-0.5 mt-1">
                {navItems.map((item) => {
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNavTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] text-xs transition-colors text-left border-l-2 ${
                        isActive
                          ? 'bg-[#c59b27]/12 text-[#1b2a4a] font-bold border-[#c59b27]'
                          : 'text-[#323130] hover:bg-[#faf9f8] border-transparent font-normal'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/5 text-[#605e5c]">
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Espacios Activos / Carreras */}
            <div className="flex flex-col gap-1 pt-3 border-t border-[#e5e7eb]">
              <span className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider px-2">
                ESPACIOS ACTIVOS
              </span>
              <div className="flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto">
                {workspaces.map((ws) => {
                  const isSelected = selectedWorkspace?.id === ws.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => onSelectWorkspace(ws)}
                      className={`w-full text-left p-2 rounded-[2px] border text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#e6f2fb] border-[#0078d4] text-[#0078d4] font-semibold'
                          : 'bg-white border-[#e5e7eb] text-[#323130] hover:bg-[#faf9f8]'
                      }`}
                    >
                      <div className="truncate font-medium">{ws.title}</div>
                      <div className="text-[10px] text-[#605e5c] font-mono mt-0.5">
                        {ws.accessCode} • {ws.type}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estado del Régimen Institucional */}
            <div className="mt-auto p-2.5 bg-[#faf9f8] border border-[#e5e7eb] rounded-[4px] text-xs">
              <div className="text-[10px] font-bold text-[#1b2a4a] uppercase tracking-wider">
                NORMATIVA CES / RRA
              </div>
              <p className="text-[11px] text-[#605e5c] mt-0.5 leading-tight">
                Auditoría heurística y control de horas activo para el ciclo 2026.
              </p>
            </div>
          </aside>
        )}

        {/* ====================================================================
            3. MAIN CONTENT WORKSPACE (Canvas #e8eaf0 con Cards Blancas #ffffff)
            ==================================================================== */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          
          {/* Banner Institucional de Bienvenida (Ref: titulacion-istpet fluent-banner-card) */}
          <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#605e5c] uppercase tracking-wider block mb-0.5">
                EXPEDIENTE ACADÉMICO // CICLO LECTIVO 2026-I
              </span>
              <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                {selectedWorkspace ? selectedWorkspace.title : 'Coordinación de Prácticas Preprofesionales'}
              </h1>
              <p className="text-xs text-[#605e5c] mt-1">
                Responsable Académico: Ing. Wilfrido Trujillo, M.Sc. • Régimen Oficial RRA Vigente
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-[4px]">
              <span className="w-2 h-2 rounded-full bg-[#107c10] animate-pulse" />
              <span className="text-xs font-semibold text-[#1b2a4a]">
                SISTEMA OPERATIVO // WAL ACTIVO
              </span>
            </div>
          </div>

          {/* Renderizado de las Secciones Operativas */}
          <div className="flex flex-col gap-6">
            {children}
          </div>

          {/* Footer Legal Microsoft 365 Style (Ref: titulacion-istpet) */}
          <footer className="mt-auto pt-6 flex items-center justify-between text-xs text-[#605e5c] border-t border-[#d1d5db]/60">
            <span>© {new Date().getFullYear()} Ing. Wilfrido Trujillo • Gestión Académica y Eventos</span>
            <span>Sistema Institucional Soberano • Microsoft Fluent Design 2</span>
          </footer>

        </main>

      </div>
    </div>
  );
};
