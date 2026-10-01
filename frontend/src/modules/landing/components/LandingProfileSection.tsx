import { Award, Briefcase, GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';

export const LandingProfileSection: React.FC = () => {
  return (
    <section id="perfil" className="py-16 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Columna Izquierda: Perfil y Cátedras */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold text-[#0f6cbd] uppercase tracking-wider">
                Liderazgo Académico & Docencia Superior
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1">
                Ing. Wilfrido Trujillo
              </h2>
              <p className="text-sm font-semibold text-[#0f6cbd] mt-0.5">
                Coordinador de Carrera • Prácticas Preprofesionales • Vinculación con la Sociedad
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
              Docente e investigador con amplia trayectoria en la educación superior de tercer nivel en Ecuador. Su gestión se fundamenta en la rigurosidad normativa, la digitalización soberana de procesos y la vinculación real entre la academia y el sector productivo ecuatoriano.
            </p>

            {/* Áreas de Especialidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-white rounded-lg border border-[#e0e0e0]">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#242424]">
                  <GraduationCap className="w-4 h-4 text-[#0f6cbd]" />
                  <span>Cátedras de Ingeniería</span>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">
                  Ingeniería de Software, Redes de Datos, Metodologías Ágiles y Dirección de Proyectos Tecnológicos.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#e0e0e0]">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#242424]">
                  <Briefcase className="w-4 h-4 text-[#0f6cbd]" />
                  <span>Vinculación Empresarial</span>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">
                  Convenios interinstitucionales con entidades públicas y privadas para pasantías formativas.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#e0e0e0]">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#242424]">
                  <Award className="w-4 h-4 text-[#0f6cbd]" />
                  <span>Conferencias & Talleres</span>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">
                  Ponente magistral en congresos sobre IA en educación, auditoría documental y normativa CES.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-[#e0e0e0]">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#242424]">
                  <BookOpen className="w-4 h-4 text-[#0f6cbd]" />
                  <span>Régimen Académico (RRA)</span>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">
                  Especialista en la aplicación práctica de reglamentos del Consejo de Educación Superior (CES).
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Marco de Privacidad y Soberanía Tecnológica */}
          <div className="lg:col-span-5">
            <div className="m365-card p-6 bg-white border border-[#e0e0e0] flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#edebe9]">
                <div className="w-8 h-8 rounded-md bg-[#dff6dd] text-[#107c10] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#242424]">
                    Marco Legal y Soberanía Tecnológica
                  </h3>
                  <span className="text-[10px] text-[#616161]">
                    LOPDP Ecuador & Autonomía Pedagógica
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-[#616161]">
                <p>
                  Esta plataforma opera como una <strong className="text-[#242424]">herramienta pedagógica privada y soberana</strong> diseñada a medida para el Ing. Wilfrido Trujillo, independiente de infraestructuras burocráticas externas.
                </p>
                <div className="p-3 bg-[#fafafa] rounded-md border border-[#edebe9] space-y-1.5 text-[11px]">
                  <strong className="text-[#242424] block">Garantías de Protección de Datos:</strong>
                  <ul className="space-y-1 text-[#616161] list-disc list-inside">
                    <li>Cero exposición de bases de datos o registros institucionales sensibles.</li>
                    <li>Procesamiento exclusivo de datos para seguimiento de expedientes y certificados.</li>
                    <li>Registro inmutable de visualización de inducción, evaluaciones y fechas de consignación.</li>
                  </ul>
                </div>
                <p className="text-[11px] text-[#8a8886]">
                  La información consignada es utilizada con fines de auditoría docente para garantizar un proceso transparente y verificable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
