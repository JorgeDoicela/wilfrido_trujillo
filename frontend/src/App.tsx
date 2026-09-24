import { GraduationCap, BookOpen, Calendar, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              WT
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Ing. Wilfrido Trujillo</h1>
              <p className="text-xs text-slate-400">Gestión Académica & Eventos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Plataforma Soberana Activa
            </span>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
            Ecosistema de Gestión y Seguimiento
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Portal Privado de Coordinación
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Plataforma centralizada para Prácticas Preprofesionales, Vinculación con la Sociedad y
            Conferencias Magistrales bajo estándares de la LOPDP y RRA Ecuador.
          </p>
        </div>

        {/* Modules Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Prácticas Preprofesionales</h3>
            <p className="text-sm text-slate-400">
              Inducción obligatoria guiada, evaluación de directrices y entrega de bitácoras oficiales.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Vinculación Comunitaria</h3>
            <p className="text-sm text-slate-400">
              Gestión de proyectos con la sociedad, plantillas de evidencias y validación de horas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group">
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
