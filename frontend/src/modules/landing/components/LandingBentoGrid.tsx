import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Search,
  ExternalLink,
  BookOpen,
  Building,
  GraduationCap,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

export interface LandingBentoGridProps {
  onJoinSpace: (code: string) => void;
  onVerifyCertificate: (hash: string) => void;
}

export const LandingBentoGrid: React.FC<LandingBentoGridProps> = ({
  onJoinSpace,
  onVerifyCertificate,
}) => {
  const [spaceCode, setSpaceCode] = useState('');
  const [certHash, setCertHash] = useState('');
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const SAMPLE_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpaceError(null);
    const cleaned = spaceCode.trim().toUpperCase();
    if (!cleaned) {
      setSpaceError('Ingresa un código de acceso válido (ej. PRAC-2026).');
      return;
    }
    onJoinSpace(cleaned);
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCertError(null);
    const cleaned = certHash.trim();
    if (!cleaned) {
      setCertError('Ingresa el hash SHA-256 o código identificador del certificado.');
      return;
    }
    onVerifyCertificate(cleaned);
  };

  const handleCopySample = () => {
    setCertHash(SAMPLE_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Bento Grid */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd] block mb-1">
            Servicios Integrados & Marco Institucional
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Autoservicio Académico, Normativa y Despacho Oficial
          </h2>
          <p className="text-sm text-[#616161] mt-2">
            Valida constancias criptográficas en tiempo real, matricúlate con código de acceso y consulta los canales oficiales de la coordinación.
          </p>
        </div>

        {/* Bento Grid Principal: 2 Columnas de Gran Impacto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Tarjeta 1: Autoservicio en Vivo (Columna Izquierda 7/12) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e0e0e0] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0f6cbd]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd]">
                  Autoservicio Inmediato en Línea
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-2">
                Validador Criptográfico & Acceso con Código
              </h3>
              <p className="text-xs sm:text-sm text-[#616161] mb-6">
                Comprueba la validez de cualquier constancia oficial o ingresa de forma directa a tu espacio lectivo asignado.
              </p>

              {/* Formulario 1: Validador de Certificados SHA-256 */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#fafafa] border border-[#edebe9] mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0f6cbd]" />
                    <span className="text-xs font-bold text-[#242424]">
                      Validar Autenticidad de Certificado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySample}
                    className="text-[10px] text-[#0f6cbd] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Usar hash de prueba para demostración"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-[#107c10]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Cargado' : 'Probar con hash demo'}</span>
                  </button>
                </div>

                <form onSubmit={handleCertSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={certHash}
                      onChange={(e) => setCertHash(e.target.value)}
                      placeholder="Pega el hash SHA-256 (64 caracteres) o ID único"
                      className="w-full h-10 pl-3.5 pr-24 rounded-lg bg-white border border-[#e0e0e0] text-xs font-mono text-[#242424] placeholder:font-sans placeholder:text-[#a19f9d] focus:outline-none focus:border-[#0f6cbd] focus:ring-1 focus:ring-[#0f6cbd] transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-[#0f6cbd] text-white rounded-md text-xs font-semibold hover:bg-[#115ea3] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Search className="w-3 h-3" />
                      <span>Validar</span>
                    </button>
                  </div>

                  {certError && (
                    <div className="flex items-center gap-1.5 text-xs text-[#a4262c] pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{certError}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Formulario 2: Acceso a Espacio con Código */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#fafafa] border border-[#edebe9]">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-[#0f6cbd]" />
                  <span className="text-xs font-bold text-[#242424]">
                    Matrícula Directa a Espacio Lectivo
                  </span>
                </div>

                <form onSubmit={handleSpaceSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={spaceCode}
                      onChange={(e) => setSpaceCode(e.target.value)}
                      placeholder="Ej. PRAC-2026, VINC-2026, CONF-2026"
                      className="w-full h-10 pl-3.5 pr-28 rounded-lg bg-white border border-[#e0e0e0] text-xs font-bold uppercase tracking-wider text-[#242424] placeholder:normal-case placeholder:font-normal placeholder:text-[#a19f9d] focus:outline-none focus:border-[#0f6cbd] focus:ring-1 focus:ring-[#0f6cbd] transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-white border border-[#e0e0e0] text-[#242424] rounded-md text-xs font-semibold hover:bg-[#f0f0f0] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ingresar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {spaceError && (
                    <div className="flex items-center gap-1.5 text-xs text-[#a4262c] pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{spaceError}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-[#edebe9] flex items-center justify-between text-xs text-[#616161]">
              <span>Servicio soberano bajo SQLite WAL</span>
              <span className="font-semibold text-[#107c10]">100% Criptográficamente Seguro</span>
            </div>
          </div>

          {/* Tarjeta 2: Filosofía Docente & Cita Editorial (Columna Derecha 5/12) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e0e0e0] p-6 sm:p-8 shadow-xs flex flex-col justify-between" id="normativa">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0f6cbd]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd]">
                  Filosofía Académica & Deontología
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-4">
                El Compromiso con la Excelencia en Ingeniería
              </h3>

              <div className="my-auto py-4 sm:py-6">
                <blockquote className="text-sm sm:text-[15px] italic text-[#424242] leading-relaxed font-normal border-l-2 border-[#0f6cbd] pl-4 sm:pl-5">
                  &ldquo;La formación en ingeniería demanda una articulación indisoluble entre la destreza técnica, la rigurosidad metodológica y la ética profesional. Cada práctica en territorio y cada informe técnico auditado constituyen la prueba fehaciente del compromiso universitario con el desarrollo productivo y soberano de nuestro país.&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="pt-4 border-t border-[#edebe9]">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#242424]">
                  Ing. Wilfrido Trujillo, M.Sc.
                </span>
                <span className="text-[11px] text-[#616161]">
                  Coordinador de Prácticas Preprofesionales y Vinculación
                </span>
                <span className="text-[10px] text-[#0f6cbd] font-semibold mt-0.5">
                  Facultad de Ingeniería · Universidad Nacional de Chimborazo
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Canales Oficiales y Despacho Institucional (Ancho Completo 12/12) */}
          <div className="lg:col-span-12 bg-white rounded-2xl border border-[#e0e0e0] p-6 sm:p-8 shadow-xs" id="despacho">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0f6cbd] block mb-0.5">
                  Enlaces Institucionales & Atención
                </span>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#242424]">
                  Despacho Docente y Canales Universitarios Oficiales
                </h3>
              </div>
              <span className="text-xs text-[#616161] font-medium bg-[#f5f5f5] px-3 py-1.5 rounded-full border border-[#e0e0e0] self-start sm:self-auto">
                Campus Edison Riquelme · Riobamba
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a
                href="https://unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-[#edebe9] hover:border-[#0f6cbd] hover:bg-[#ebf3fc]/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-[#0f6cbd]" />
                  <div>
                    <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                      Portal Oficial UNACH
                    </span>
                    <span className="text-[10px] text-[#616161]">unach.edu.ec</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#a19f9d] group-hover:text-[#0f6cbd]" />
              </a>

              <a
                href="https://sicoa.unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-[#edebe9] hover:border-[#0f6cbd] hover:bg-[#ebf3fc]/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-[#0f6cbd]" />
                  <div>
                    <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                      Sistema SICOA
                    </span>
                    <span className="text-[10px] text-[#616161]">Matrículas y Calificaciones</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#a19f9d] group-hover:text-[#0f6cbd]" />
              </a>

              <a
                href="https://biblioteca.unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl border border-[#edebe9] hover:border-[#0f6cbd] hover:bg-[#ebf3fc]/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-[#0f6cbd]" />
                  <div>
                    <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                      Biblioteca Central
                    </span>
                    <span className="text-[10px] text-[#616161]">Repositorio de Tesis</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#a19f9d] group-hover:text-[#0f6cbd]" />
              </a>

              <div className="p-3.5 rounded-xl border border-[#edebe9] bg-[#f5f5f5]/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#242424] block">
                    Horario de Atención
                  </span>
                  <span className="text-[10px] text-[#616161]">Lun - Vie: 08h00 a 16h00</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#107c10]" title="Horario Activo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
