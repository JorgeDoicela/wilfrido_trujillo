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
  Filter,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { M365ProfileFlyout } from './M365ProfileFlyout';
import { M365WaffleMenu } from './M365WaffleMenu';
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
          subtitle: 'Validación criptográfica SHA-256 e historial de acreditaciones académicas',
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
          subtitle: 'Control horaria ministerial y convenios interinstitucionales vigentes',
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
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#242424] font-sans antialiased">
      {/* ====================================================================
          1. MICROSOFT 365 SUITE BAR (48px height, Official #0f6cbd Blue)
          ==================================================================== */}
      <header className="h-12 bg-[#0f6cbd] text-white px-3 flex items-center justify-between sticky top-0 z-40 shadow-xs select-none relative">
        
        {/* Brand Left: Waffle Icon (App Launcher) + App Title */}
        <div className="flex items-center gap-2">
          {/* M365 App Launcher Waffle */}
          <button
            type="button"
            onClick={() => {
              setIsWaffleOpen(!isWaffleOpen);
              setIsProfileOpen(false);
            }}
            title="Iniciador de aplicaciones Microsoft 365"
            className="w-9 h-9 rounded-md text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Institutional Title */}
          <div
            onClick={() => {
              window.location.hash = '';
            }}
            title="Ir a la Portada Institucional"
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-[13px] font-bold tracking-tight text-white hidden sm:inline">
              Microsoft 365
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white">
                Gestión Académica
              </span>
              <span className="text-white/40 hidden md:inline">•</span>
              <span className="text-[12px] font-medium text-white/90 hidden md:inline">
                Wilfrido Trujillo
              </span>
            </div>
          </div>
        </div>

        {/* Central Search Bar (Microsoft 365 Capsule Style) */}
        <div className="flex-1 max-w-md mx-4 relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-white/70 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en este sitio (Ctrl+K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-9 pr-14 text-xs bg-white/15 hover:bg-white/25 focus:bg-white text-white focus:text-[#242424] placeholder:text-white/70 focus:placeholder:text-[#616161] rounded-md border border-transparent focus:border-[#0f6cbd] focus:outline-none transition-all"
          />
          <kbd className="absolute right-2 text-[10px] bg-white/20 text-white/90 px-1.5 py-0.5 rounded-sm pointer-events-none hidden lg:inline font-mono">
            Ctrl+K
          </kbd>
        </div>

        {/* Right Actions: Help, Settings, Profile Avatar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Ayuda y normativa"
            className="w-8 h-8 rounded-md text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Configuración de la plataforma"
            className="w-8 h-8 rounded-md text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-white/20 mx-1" />

          {/* User Profile Avatar with Presence */}
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsWaffleOpen(false);
            }}
            title={`Cuenta: ${user?.fullName || 'Usuario'}`}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-white/15 transition-colors cursor-pointer text-left"
          >
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-white text-[#0f6cbd] text-xs font-bold flex items-center justify-center shadow-xs">
                {user?.fullName ? user.fullName[0] : 'U'}
              </div>
              <span className="w-2.5 h-2.5 bg-[#107c10] border-2 border-[#0f6cbd] rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="hidden lg:flex flex-col leading-none">
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                {user?.fullName}
              </span>
              <span className="text-[10px] text-white/75 capitalize">
                {user?.roleKey?.toLowerCase()}
              </span>
            </div>
          </button>
        </div>

        {/* Dropdown Menús Flotantes Oficiales */}
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
          2. BODY CONTAINER: M365 APP RAIL (56px) + SIDEBAR (220px) + WORKSPACE
          ==================================================================== */}
      {/* ====================================================================
          2. UNIFIED SIDEBAR (M365 Fluent Nav + Workspace Contextual)
          ==================================================================== */}
      <div className="flex-1 flex w-full">
        
        {/* Single Unified Sidebar */}
        <aside
          className={`bg-white border-r border-[#e0e0e0] flex flex-col justify-between py-2.5 flex-shrink-0 z-20 select-none transition-all duration-200 ${
            isSidebarOpen ? 'w-64 px-3' : 'w-14 items-center px-1'
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              {/* Lista principal de Módulos */}
              <div className="flex flex-col gap-1">
                <div className="px-2 pt-0.5 pb-1 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                  Módulos
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNavTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#ebf3fc] text-[#0f6cbd] font-semibold'
                          : 'text-[#424242] hover:bg-[#f5f5f5] hover:text-[#242424]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0f6cbd]' : 'text-[#616161]'}`} />
                        <span className="truncate">{item.fullName}</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isActive ? 'text-[#0f6cbd]' : 'text-[#8a8886]'}`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Separador sutil */}
              <div className="h-px bg-[#edebe9]" />

              {/* Sección contextual según el módulo activo */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                {activeNavTab === 'practicas' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider px-2">
                      Espacio Seleccionado
                    </span>
                    <div className="flex flex-col gap-1 pr-0.5">
                      {workspaces
                        .filter((ws) => ws.type === 'PRACTICAS')
                        .map((ws) => {
                          const isSelected = selectedWorkspace?.id === ws.id;
                          return (
                            <button
                              key={ws.id}
                              onClick={() => onSelectWorkspace(ws)}
                              className={`w-full text-left p-2 rounded-md border text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#ebf3fc] border-[#0f6cbd] text-[#0f6cbd] font-semibold'
                                  : 'bg-white border-[#e0e0e0] text-[#242424] hover:bg-[#fafafa]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-medium truncate">
                                <Briefcase className="w-3.5 h-3.5 text-[#0f6cbd] flex-shrink-0" />
                                <span className="truncate">{ws.title}</span>
                              </div>
                              <div className="text-[10px] text-[#616161] font-mono mt-0.5 pl-5">
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
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider px-2 mb-1">
                      Acreditaciones
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs bg-[#ebf3fc] text-[#0f6cbd] font-semibold cursor-pointer"
                    >
                      <span>Todos los Certificados</span>
                      <span className="text-[10px] font-mono">{currentNav.count}</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-[#616161] hover:bg-[#f5f5f5] cursor-pointer"
                    >
                      <span>Acreditados por Horas</span>
                      <span className="text-[10px] font-mono">100%</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'eventos' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider px-2 mb-1">
                      Eventos Activos
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs bg-[#ebf3fc] text-[#0f6cbd] font-semibold cursor-pointer"
                    >
                      <span>Conferencias Activas</span>
                      <span className="text-[10px] font-mono">3</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-[#616161] hover:bg-[#f5f5f5] cursor-pointer"
                    >
                      <span>Portal de Registro QR</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'vinculacion' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider px-2 mb-1">
                      Comunidad
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs bg-[#ebf3fc] text-[#0f6cbd] font-semibold cursor-pointer"
                    >
                      <span>Proyectos Comunitarios</span>
                      <span className="text-[10px] font-mono">24</span>
                    </button>
                  </div>
                )}

                {activeNavTab === 'espacios' && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider px-2 mb-1">
                      Espacios
                    </span>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs bg-[#ebf3fc] text-[#0f6cbd] font-semibold cursor-pointer"
                    >
                      <span>Todos los Espacios</span>
                      <span className="text-[10px] font-mono">{workspaces.length}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Pie de la barra unificada */}
              <div className="pt-2 border-t border-[#edebe9]">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Contraer barra lateral"
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] rounded-md transition-colors cursor-pointer"
                >
                  <span>Contraer barra</span>
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between items-center h-full w-full py-1">
              <div className="flex flex-col items-center gap-1 w-full">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectNavTab(item.id)}
                      title={item.fullName}
                      className={`w-11 h-11 rounded-md flex items-center justify-center relative transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-[#ebf3fc] text-[#0f6cbd]'
                          : 'text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#0f6cbd] rounded-r-md" />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#0f6cbd]' : 'text-[#616161] group-hover:text-[#242424]'}`} />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                title="Expandir barra lateral"
                className="w-10 h-10 rounded-md text-[#616161] hover:text-[#242424] hover:bg-[#f5f5f5] flex items-center justify-center transition-colors cursor-pointer"
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
          
          {/* M365 Command Bar (Barra de herramientas de 44px) */}
          <div className="m365-command-bar select-none">
            <div className="flex items-center gap-1">
              {onOpenCreateWorkspaceModal && (
                <button
                  type="button"
                  onClick={onOpenCreateWorkspaceModal}
                  className="m365-command-btn m365-command-btn--primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRefresh}
                className="m365-command-btn"
                title="Sincronizar datos con el servidor"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0f6cbd]' : ''}`} />
                <span>Sincronizar</span>
              </button>

              <button
                type="button"
                className="m365-command-btn"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar</span>
              </button>
            </div>

            {/* Breadcrumb Right */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#616161]">
              <span>Gestión Académica</span>
              <ChevronRight className="w-3 h-3 text-[#999999]" />
              <span className="font-semibold text-[#242424]">{currentNav.fullName}</span>
            </div>
          </div>

          {/* Canvas Scrollable Content */}
          <main className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col gap-5">
            
            {/* Page Header Institucional M365 */}
            <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                    {meta.category}
                  </span>
                  <span className="text-[#d1d1d1]">•</span>
                  <span className="text-[11px] font-semibold text-[#0f6cbd]">
                    Régimen RRA Activo
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#242424] tracking-tight">
                  {meta.title}
                </h1>
                <p className="text-xs text-[#616161] mt-0.5">
                  {meta.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#107c10]">
                <span className="w-2 h-2 rounded-full bg-[#107c10] animate-pulse" />
                <span>SISTEMA OPERATIVO // WAL ACTIVO</span>
              </div>
            </div>

            {/* Contenido Modular Focalizado (Cero Apilamiento) */}
            <div className="flex flex-col gap-5">
              {children}
            </div>

            {/* Footer Legal M365 */}
            <footer className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#616161] border-t border-[#edebe9]">
              <span>© {new Date().getFullYear()} Wilfrido Trujillo • Plataforma de Gestión Académica</span>
              <span>Microsoft 365 Fluent Design System 2 • RRA Soberano</span>
            </footer>

          </main>
        </div>

      </div>
    </div>
  );
};
