import { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileCheck,
  UserCheck,
  AlertCircle,
  Plus,
  FolderOpen,
  Video,
} from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Can } from '@/shared/components/Can';
import { usePermission } from '@/shared/hooks/usePermission';
import { JoinWorkspaceCard } from '@/shared/components/JoinWorkspaceCard';
import { WorkspaceCard } from '@/modules/admin/components/WorkspaceCard';
import { CreateWorkspaceModal } from '@/modules/admin/components/CreateWorkspaceModal';
import { InductionVideoPlayer } from '@/modules/practicas/components/InductionVideoPlayer';
import { workspacesApi } from '@/modules/admin/api/workspaces.api';
import type { Workspace } from '@/shared/types/workspace.types';

export default function App() {
  const { user, setUserDirectlyForDemo, logout } = useAuth();
  const canReview = usePermission('document:review');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [inductionWatched, setInductionWatched] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      setIsLoadingWorkspaces(true);
      const data = await workspacesApi.getAll();
      setWorkspaces(data);
      if (data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(data[0]);
      }
    } catch {
      if (workspaces.length === 0) {
        const defaultWorkspaces: Workspace[] = [
          {
            id: 'ws-demo-1',
            title: 'Prácticas Preprofesionales 2026-I',
            description: 'Coordinación y recepción de bitácoras oficiales para el periodo lectivo 2026.',
            type: 'PRACTICAS',
            isActive: true,
            accessCode: 'PRAC-2026',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'ws-demo-2',
            title: 'Vinculación Comunitaria: Digitalización Pymes',
            description: 'Proyecto de servicio a la comunidad para estudiantes de tercer nivel.',
            type: 'VINCULACION',
            isActive: true,
            accessCode: 'VINC-8821',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setWorkspaces(defaultWorkspaces);
        setSelectedWorkspace(defaultWorkspaces[0]);
      }
    } finally {
      setIsLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const simulateStudent = () => {
    setUserDirectlyForDemo({
      id: 'student-uuid-demo',
      email: 'alumno@instituto.edu.ec',
      identification: '1723456789',
      fullName: 'Carlos Estudiante',
      roleKey: 'ESTUDIANTE',
      permissions: [
        'workspace:read',
        'resource:download',
        'test:take',
        'document:submit',
        'certificate:claim',
      ],
    });
  };

  const simulateIngeniero = () => {
    setUserDirectlyForDemo({
      id: 'ingeniero-uuid-demo',
      email: 'wilfrido@trujillo.com',
      identification: '1712345678',
      fullName: 'Ing. Wilfrido Trujillo',
      roleKey: 'INGENIERO',
      permissions: [
        'workspace:create',
        'workspace:update',
        'workspace:delete',
        'workspace:read',
        'resource:manage',
        'resource:download',
        'test:manage',
        'test:take',
        'document:submit',
        'document:review',
        'document:audit_ia',
        'certificate:manage',
        'certificate:issue',
        'certificate:claim',
      ],
    });
  };

  const handleWorkspaceCreated = (newWs: Workspace) => {
    setWorkspaces((prev) => [newWs, ...prev]);
    setSelectedWorkspace(newWs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              WT
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Ing. Wilfrido Trujillo</h1>
              <p className="text-xs text-slate-400">Gestión Académica & Eventos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> PBAC Activo
            </span>
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col gap-10 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
            Ecosistema de Coordinación y Control
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Flujo Guiado de Inducción y Gestión
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Mecanismo secuencial verificado: Inducción en video con tracking de reproducción al 100%,
            evaluación de directrices y entrega oficial de evidencias.
          </p>
        </div>

        {/* Simulador Interactivo PBAC */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 max-w-5xl mx-auto w-full shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                Simulador de Permisos PBAC
              </h3>
              <p className="text-xs text-slate-400">
                Alterna entre perfiles para comprobar las capacidades activas en tiempo real.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={simulateStudent}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                Simular Alumno
              </button>
              <button
                type="button"
                onClick={simulateIngeniero}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Simular Docente / Ingeniero
              </button>
            </div>
          </div>

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
        </section>

        {/* Sección de Inducción con Reproductor y Tracking (Paso 11) */}
        <section className="max-w-5xl mx-auto w-full flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">
                Módulo de Inducción con Reproductor y Tracking
              </h3>
            </div>
            {selectedWorkspace && (
              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                Espacio activo: <strong className="text-white">{selectedWorkspace.title}</strong>
              </span>
            )}
          </div>

          <InductionVideoPlayer
            workspaceId={selectedWorkspace?.id || 'ws-demo-1'}
            videoTitle={
              selectedWorkspace
                ? `Inducción Oficial: ${selectedWorkspace.title}`
                : 'Inducción Oficial y Normativa del RRA'
            }
            initialWatched={inductionWatched}
            onInductionComplete={() => setInductionWatched(true)}
            onProceedToTest={() => {
              alert('¡Siguiente paso desbloqueado! Listo para el Paso 12: Motor de Evaluaciones Dinámicas.');
            }}
          />
        </section>

        {/* Sección de Workspaces (Paso 10) */}
        <section className="max-w-5xl mx-auto w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Formulario de Unirse a un Espacio por Código */}
            <div className="lg:col-span-1">
              <JoinWorkspaceCard
                onJoinSuccess={(res) => {
                  if (res.workspace) {
                    setWorkspaces((prev) => {
                      if (!prev.some((w) => w.id === res.workspace.id)) {
                        return [res.workspace, ...prev];
                      }
                      return prev;
                    });
                    setSelectedWorkspace(res.workspace);
                  }
                }}
              />
            </div>

            {/* Listado de Espacios y Botón de Crear */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-semibold text-white">
                    Espacios de Trabajo ({workspaces.length})
                  </h3>
                </div>

                <Can do="workspace:create">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Nuevo Espacio
                  </button>
                </Can>
              </div>

              {isLoadingWorkspaces ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
                  Cargando espacios de trabajo...
                </div>
              ) : workspaces.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
                  No hay espacios creados aún.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workspaces.map((ws) => (
                    <WorkspaceCard
                      key={ws.id}
                      workspace={ws}
                      onEnter={(w) => setSelectedWorkspace(w)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pilares Funcionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Prácticas Preprofesionales</h3>
            <p className="text-sm text-slate-400">
              Inducción obligatoria guiada, evaluación de directrices y entrega de bitácoras oficiales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vinculación Comunitaria</h3>
            <p className="text-sm text-slate-400">
              Gestión de proyectos con la sociedad, plantillas de evidencias y validación de horas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Conferencias & Eventos</h3>
            <p className="text-sm text-slate-400">
              Acceso rápido vía QR a diapositivas, encuestas de satisfacción y certificados PDF verificables.
            </p>
          </div>
        </div>
      </main>

      {/* Modal de Creación */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleWorkspaceCreated}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/30 px-6 py-4 text-center text-xs text-slate-500">
        Plataforma Privada y Soberana &copy; {new Date().getFullYear()} Ing. Wilfrido Trujillo. Todos los derechos reservados.
      </footer>
    </div>
  );
}
