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
} from 'lucide-react';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Can } from '@/shared/components/Can';
import { usePermission } from '@/shared/hooks/usePermission';

export default function App() {
  const { user, setUserDirectlyForDemo, logout } = useAuth();
  const canReview = usePermission('document:review');

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4">
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
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col gap-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
            Ecosistema de Coordinación y Control
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Plataforma Académica Soberana
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Arquitectura desacoplada basada en permisos (PBAC). Comprueba dinámicamente las
            capacidades de los usuarios sin atarse a nombres fijos de roles.
          </p>
        </div>

        {/* Simulador Interactivo PBAC */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto w-full shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                Simulador de Permisos PBAC en Tiempo Real
              </h3>
              <p className="text-xs text-slate-400">
                Cambia de rol para verificar cómo el componente <code>&lt;Can&gt;</code> y el hook <code>usePermission</code> protegen la UI.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={simulateStudent}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                Simular Alumno (Sin Review)
              </button>
              <button
                type="button"
                onClick={simulateIngeniero}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Simular Docente / Ingeniero (Con Review)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado de Permisos */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Estado Actual del Usuario
              </h4>
              <p className="text-sm font-medium text-white mb-1">
                {user ? user.fullName : 'Ninguno (Invitado)'}
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Rol: <span className="text-blue-400 font-semibold">{user?.roleKey || 'ANÓNIMO'}</span>
              </p>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                Evaluación <code>usePermission('document:review')</code>:
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
              <div className="mt-3">
                <span className="text-xs text-slate-500 block mb-1">Permisos activos:</span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {user?.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((p) => (
                      <span
                        key={p}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          p === 'document:review'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">Sin permisos</span>
                  )}
                </div>
              </div>
            </div>

            {/* Zona Protegida con <Can do="document:review"> */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-center">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Zona Protegida: <code>&lt;Can do="document:review"&gt;</code>
              </h4>

              <Can
                do="document:review"
                fallback={
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                    <Lock className="w-6 h-6 text-rose-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-semibold text-rose-300">Acceso Restringido</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      El panel de aprobación y calificación de documentos solo es visible para usuarios con la capacidad <code>document:review</code>.
                    </p>
                  </div>
                }
              >
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <FileCheck className="w-5 h-5" />
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      Bandeja de Aprobación Oficial Desbloqueada
                    </h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Tienes capacidad técnica de revisor. Puedes aprobar, observar o calificar bitácoras y convenios entregados por los alumnos.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                    >
                      Aprobar Bitácora
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
                    >
                      Emitir Observaciones
                    </button>
                  </div>
                </div>
              </Can>
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/30 px-6 py-4 text-center text-xs text-slate-500">
        Plataforma Privada y Soberana &copy; {new Date().getFullYear()} Ing. Wilfrido Trujillo. Todos los derechos reservados.
      </footer>
    </div>
  );
}
