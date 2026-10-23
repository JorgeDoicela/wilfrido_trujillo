import React, { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Users,
  Award,
  Calendar,
  Search,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Briefcase,
  ChevronRight,
  Plus,
  RefreshCw,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { M365ProfileFlyout } from './M365ProfileFlyout';
import { M365WaffleMenu } from './M365WaffleMenu';
import { AmbientBackground } from './AmbientBackground';
import type { Workspace } from '@/shared/types/workspace.types';

export interface FluentShellProps {
  children: React.ReactNode;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
  onSimulateStudent: () => void;
  onSimulateIngeniero: () => void;
  onOpenCreateWorkspaceModal?: () => void;
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
  onOpenCreateWorkspaceModal,
}) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWaffleOpen, setIsWaffleOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navItems = [
    { id: 'practicas', label: 'Prácticas', fullName: 'Prácticas Preprofesionales', icon: FileText, count: 48 },
    { id: 'vinculacion', label: 'Vinculación', fullName: 'Vinculación con la Sociedad', icon: Users, count: 24 },
    { id: 'eventos', label: 'Eventos', fullName: 'Conferencias y Eventos', icon: Calendar, count: 3 },
    { id: 'certificados', label: 'Certificados', fullName: 'Certificados y Registro QR', icon: Award, count: 12 },
    { id: 'espacios', label: 'Espacios', fullName: 'Catálogo de Espacios', icon: Layers, count: workspaces.length },
  ];

  const currentNav = navItems.find((item) => item.id === activeNavTab) || navItems[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getHeaderMeta = () => {
    switch (activeNavTab) {
      case 'certificados':
        return {
          category: 'Acreditación y Validación Digital',
          title: 'Certificados Oficiales con Firma y Código QR',
          subtitle: 'Validación de certificados e historial de acreditaciones académicas',
        };
      case 'eventos':
        return {
          category: 'Conferencias y Seminarios',
          title: 'Registro de Asistencia y Portal QR',
          subtitle: 'Eventos institucionales, diapositivas y constancias de participación',
        };
      case 'vinculacion':
        return {
          category: 'Servicio Comunitario',
          title: 'Proyectos de Vinculación con la Sociedad',
          subtitle: 'Control horario ministerial y convenios interinstitucionales vigentes',
        };
      case 'espacios':
        return {
          category: 'Administración Académica',
          title: 'Catálogo General de Espacios y Periodos',
          subtitle: 'Gestión de cohortes, códigos de acceso y configuración de aulas',
        };
      case 'practicas':
      default:
        return {
          category: 'Expediente Académico • Periodo 2026-I',
          title: selectedWorkspace ? selectedWorkspace.title : 'Prácticas Preprofesionales',
          subtitle: 'Wilfrido Trujillo • Régimen Oficial RRA',
        };
    }
  };

  const meta = getHeaderMeta();

  return (
    <div className="min-h-screen flex flex-col text-[#F0F0F3] font-sans antialiased relative selection:bg-white/20 selection:text-white">
      <AmbientBackground />
      {/* ====================================================================
          1. GLASS SUITE BAR (48px height, Frosted Glass Navy)
          ==================================================================== */}
      <header className="h-12 glass-suite-bar text-white px-3 flex items-center justify-between sticky top-0 z-40 select-none relative">
        
        {/* Brand Left: Waffle Icon (App Launcher) + App Title */}
        <div className="flex items-center gap-2">
          {/* App Launcher */}
          <button
            type="button"
            onClick={() => {
              setIsWaffleOpen(!isWaffleOpen);
              setIsProfileOpen(false);
            }}
            title="Aplicaciones"
            className="w-9 h-9 rounded-lg text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Institutional Title */}
          <div
            onClick={() => {
              window.location.hash = '';
            }}
            title="Ir al inicio"
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-[14px] font-semibold tracking-tight text-white">
              Wilfrido Trujillo
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-[13px] font-normal text-white/80 hidden sm:inline">
              Gestión Académica
            </span>
          </div>
        </div>

        {/* Central Search Bar (Glass Capsule Style) */}
        <div className="flex-1 max-w-md mx-4 relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#C4C4C4] pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en este sitio (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8.5 pl-9 pr-14 text-xs bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder:text-[#C4C4C4] rounded-full border border-white/20 focus:border-white/50 focus:outline-none transition-all backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]"
          />
          <kbd className="absolute right-2.5 text-[10px] bg-white/15 text-white/90 border border-white/20 px-2 py-0.5 rounded-full pointer-events-none hidden lg:inline font-mono">
            Ctrl+K
          </kbd>
        </div>

        {/* Right Actions: Help, Settings, Profile Avatar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Ayuda y normativa"
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Configuración de la plataforma"
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-white/15 mx-1" />

          {/* User Profile Avatar with Presence */}
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsWaffleOpen(false);
            }}
            title={`Cuenta: ${user?.fullName || 'Usuario'}`}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-left"
          >
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold flex items-center justify-center backdrop-blur-md shadow-sm">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1C2451] rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="hidden lg:flex flex-col leading-none">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {user?.fullName}
              </span>
              <span className="text-[10px] text-[#C4C4C4] capitalize">
                {user?.roleKey?.toLowerCase()}
              </span>
            </div>
          </button>
        </div>

        {/* Dropdown Menús Flotantes Vidriados */}
        <M365WaffleMenu
          isOpen={isWaffleOpen}
          onClose={() => setIsWaffleOpen(false)}
          onSelectNavTab={onSelectNavTab}
        />

        <M365ProfileFlyout
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onSimulateStudent={onSimulateStudent}
          onSimulateIngeniero={onSimulateIngeniero}
        />
      </header>

      {/* ====================================================================
          2. BODY CONTAINER: GLASS SIDEBAR + WORKSPACE CANVAS
          ==================================================================== */}
      <div className="flex-1 flex w-full">
        
        {/* Single Unified Sidebar */}
        <aside
          className={`glass-sidebar border-r border-white/10 flex flex-col justify-between py-2.5 flex-shrink-0 z-20 select-none transition-all duration-200 ${
            isSidebarOpen ? 'w-64 px-3' : 'w-14 items-center px-1'
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              {/* Lista principal de Módulos */}
              <div className="flex flex-col gap-1">
                <div className="px-2 pt-0.5 pb-1 text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider">
                  Módulos
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNavTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-white/20 to-white/10 text-white font-semibold border border-white/30 border-t-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-xl'
                          : 'text-[#C4C4C4] hover:bg-white/[0.08] hover:text-white border border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#C4C4C4]'}`} />
                        <span className="truncate">{item.fullName}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'text-[#C4C4C4]'}`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Separador sutil vidriado */}
              <div className="h-px bg-white/10" />

              {/* Sección contextual según el módulo activo */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                {activeNavTab === 'practicas' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider px-2">
                      Espacio Seleccionado
                    </span>
                    <div className="flex flex-col gap-1.5 pr-0.5">
                      {workspaces
                        .filter((ws) => ws.type === 'PRACTICAS')
                        .map((ws) => {
                          const isSelected = selectedWorkspace?.id === ws.id;
                          return (
                            <button
                              key={ws.id}
                              onClick={() => onSelectWorkspace(ws)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white/15 border-white/30 text-white font-semibold shadow-sm backdrop-blur-md'
                                  : 'bg-white/[0.04] border-white/10 text-[#F0F0F3] hover:bg-white/[0.08] hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-medium truncate">
                                <Briefcase className="w-3.5 h-3.5 text-white flex-shrink-0" />
                                <span className="truncate text-white">{ws.title}</span>
                              </div>
                              <div className="text-[10px] text-[#C4C4C4] font-mono mt-0.5 pl-5">
                                {ws.accessCode}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {activeNavTab === 'certificados' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider px-2 mb-1">
                      Acreditaciones
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs bg-white/15 text-white font-semibold border border-white/20 backdrop-blur-md cursor-pointer"
                    >
                      <span>Todos los Certificados</span>
                      <span className="text-[10px] font-mono">{currentNav.count}</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#C4C4C4] hover:bg-white/[0.08] hover:text-white cursor-pointer"
                    >
                      <span>Acreditados por Horas</span>
                      <span className="text-[10px] font-mono">100%</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'eventos' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider px-2 mb-1">
                      Eventos Activos
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs bg-white/15 text-white font-semibold border border-white/20 backdrop-blur-md cursor-pointer"
                    >
                      <span>Conferencias Activas</span>
                      <span className="text-[10px] font-mono">3</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-[#C4C4C4] hover:bg-white/[0.08] hover:text-white cursor-pointer"
                    >
                      <span>Portal de Registro QR</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'vinculacion' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider px-2 mb-1">
                      Comunidad
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs bg-white/15 text-white font-semibold border border-white/20 backdrop-blur-md cursor-pointer"
                    >
                      <span>Proyectos Comunitarios</span>
                      <span className="text-[10px] font-mono">24</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'espacios' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider px-2 mb-1">
                      Espacios
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs bg-white/15 text-white font-semibold border border-white/20 backdrop-blur-md cursor-pointer"
                    >
                      <span>Todos los Espacios</span>
                      <span className="text-[10px] font-mono">{workspaces.length}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pie de la barra unificada */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Contraer barra lateral"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#C4C4C4] hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
                >
                  <span>Contraer barra</span>
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between items-center h-full w-full py-1">
              <div className="flex flex-col items-center gap-1.5 w-full">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNavTab(item.id)}
                      title={item.fullName}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center relative transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30 border-t-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-xl'
                          : 'text-[#C4C4C4] hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-white rounded-r-md" />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#C4C4C4] group-hover:text-white'}`} />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                title="Expandir barra lateral"
                className="w-10 h-10 rounded-lg text-[#C4C4C4] hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>

        {/* ====================================================================
            3. WORKSPACE ÁREA: COMMAND BAR + CANVAS + CONTENT
            ==================================================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Glass Command Bar */}
          <div className="glass-command-bar select-none">
            <div className="flex items-center gap-2">
              {onOpenCreateWorkspaceModal && (
                <button
                  type="button"
                  onClick={onOpenCreateWorkspaceModal}
                  className="glass-command-btn glass-command-btn--primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRefresh}
                className="glass-command-btn"
                title="Sincronizar datos con el servidor"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
                <span>Sincronizar</span>
              </button>
            </div>

            {/* Breadcrumb Right */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#C4C4C4]">
              <span>Gestión Académica</span>
              <ChevronRight className="w-3 h-3 text-[#C4C4C4]" />
              <span className="font-semibold text-white">{currentNav.fullName}</span>
            </div>
          </div>

          {/* Canvas Scrollable Content */}
          <main className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col gap-6 relative z-10">
            
            {/* Page Header Vidriado */}
            <div className="glass-card p-6 md:p-7 shadow-2xl">
              <span className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wider block mb-1">
                {meta.category}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {meta.title}
              </h1>
              {meta.subtitle && (
                <p className="text-xs text-[#C4C4C4] mt-1">{meta.subtitle}</p>
              )}
            </div>

            {/* Contenido Modular */}
            <div className="flex flex-col gap-5">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-auto pt-6 text-xs text-[#C4C4C4] border-t border-white/10">
              <span>© {new Date().getFullYear()} Wilfrido Trujillo</span>
            </footer>

          </main>
        </div>

      </div>
    </div>
  );
};
