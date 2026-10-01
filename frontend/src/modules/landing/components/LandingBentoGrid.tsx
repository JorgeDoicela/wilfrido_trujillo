import React, { useState } from 'react';
import {
  ExternalLink,
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
    <section id="servicios" className="py-14 sm:py-20 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Bento Grid Sobria */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-1">
            Autoservicio & Marco Oficial
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#242424]">
            Validación de Certificados y Canales Universitarios
          </h2>
          <p className="text-sm text-[#616161] mt-1.5">
            Comprobación de constancias oficiales, matrícula con código de espacio y directorio institucional.
          </p>
        </div>

        {/* Bento Grid Principal: 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Tarjeta 1: Autoservicio en Línea (Columna Izquierda 7/12) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#e0e0e0] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-1">
                Servicios en Línea
              </span>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-2">
                Validación de Certificados y Matrícula Directa
              </h3>
              <p className="text-xs sm:text-sm text-[#616161] mb-6">
                Ingresa el código único del certificado para verificar su autenticidad o accede a tu espacio lectivo con el código asignado.
              </p>

              {/* Formulario 1: Validador SHA-256 */}
              <div className="p-4 rounded-lg border border-[#e0e0e0] mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#242424]">
                    Validar Autenticidad de Certificado
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySample}
                    className="text-xs text-[#0f6cbd] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHash ? 'Cargado' : 'Probar hash demo'}</span>
                  </button>
                </div>

                <form onSubmit={handleCertSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={certHash}
                      onChange={(e) => setCertHash(e.target.value)}
                      placeholder="Pega el hash SHA-256 o identificador único"
                      className="w-full h-9 pl-3 pr-24 rounded bg-white border border-[#d1d1d1] text-xs font-mono text-[#242424] placeholder:font-sans placeholder:text-[#8a8886] focus:outline-none focus:border-[#0f6cbd] focus:ring-1 focus:ring-[#0f6cbd]"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-[#0f6cbd] text-white rounded text-xs font-semibold hover:bg-[#115ea3] transition-colors cursor-pointer"
                    >
                      Validar
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

              {/* Formulario 2: Matrícula Directa con Código */}
              <div className="p-4 rounded-lg border border-[#e0e0e0]">
                <span className="text-xs font-bold text-[#242424] block mb-2">
                  Matrícula Directa con Código de Espacio
                </span>

                <form onSubmit={handleSpaceSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={spaceCode}
                      onChange={(e) => setSpaceCode(e.target.value)}
                      placeholder="Ej. PRAC-2026, VINC-2026, CONF-2026"
                      className="w-full h-9 pl-3 pr-24 rounded bg-white border border-[#d1d1d1] text-xs font-semibold uppercase tracking-wider text-[#242424] placeholder:normal-case placeholder:font-normal placeholder:text-[#8a8886] focus:outline-none focus:border-[#0f6cbd] focus:ring-1 focus:ring-[#0f6cbd]"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-white border border-[#d1d1d1] text-[#242424] rounded text-xs font-semibold hover:bg-[#f5f5f5] transition-colors flex items-center gap-1 cursor-pointer"
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

            <div className="pt-4 mt-6 border-t border-[#edebe9] flex items-center justify-between text-xs text-[#616161]">
              <span>Plataforma con firma y registro unificado</span>
              <span className="font-semibold text-[#242424]">Registro Criptográfico SHA-256</span>
            </div>
          </div>

          {/* Tarjeta 2: Filosofía Docente & Cita (Columna Derecha 5/12) */}
          <div className="lg:col-span-5 bg-white rounded-lg border border-[#e0e0e0] p-6 sm:p-8 flex flex-col justify-between" id="normativa">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-1">
                Marco Formativo & Deontología
              </span>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] mb-4">
                Compromiso Académico en Ingeniería
              </h3>

              <div className="my-auto py-3">
                <blockquote className="text-sm italic text-[#424242] leading-relaxed font-normal border-l-2 border-[#0f6cbd] pl-4">
                  &ldquo;La formación en ingeniería demanda una articulación indisoluble entre la destreza técnica, la rigurosidad metodológica y la ética profesional. Cada práctica en territorio y cada informe técnico auditado constituyen la prueba fehaciente del compromiso universitario con el desarrollo productivo y soberano de nuestro país.&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="pt-4 border-t border-[#edebe9]">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#242424]">
                  Ing. Wilfrido Trujillo, M.Sc.
                </span>
                <span className="text-xs text-[#616161]">
                  Coordinador de Prácticas Preprofesionales y Vinculación
                </span>
                <span className="text-xs text-[#0f6cbd] font-semibold mt-0.5">
                  Facultad de Ingeniería · Universidad Nacional de Chimborazo
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Canales Oficiales y Despacho (12/12) */}
          <div className="lg:col-span-12 bg-white rounded-lg border border-[#e0e0e0] p-6 sm:p-8" id="despacho">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#616161] block mb-0.5">
                  Directorio Universitario
                </span>
                <h3 className="text-lg font-bold tracking-tight text-[#242424]">
                  Despacho Docente y Enlaces Institucionales
                </h3>
              </div>
              <span className="text-xs text-[#616161]">
                Campus Edison Riquelme · Riobamba
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a
                href="https://unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded border border-[#e0e0e0] hover:border-[#0f6cbd] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                    Portal Oficial UNACH
                  </span>
                  <span className="text-xs text-[#616161]">unach.edu.ec</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#8a8886] group-hover:text-[#0f6cbd]" />
              </a>

              <a
                href="https://sicoa.unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded border border-[#e0e0e0] hover:border-[#0f6cbd] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                    Sistema SICOA
                  </span>
                  <span className="text-xs text-[#616161]">Matrículas y Calificaciones</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#8a8886] group-hover:text-[#0f6cbd]" />
              </a>

              <a
                href="https://biblioteca.unach.edu.ec"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded border border-[#e0e0e0] hover:border-[#0f6cbd] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-[#242424] block group-hover:text-[#0f6cbd]">
                    Biblioteca Central
                  </span>
                  <span className="text-xs text-[#616161]">Repositorio Institucional</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#8a8886] group-hover:text-[#0f6cbd]" />
              </a>

              <div className="p-3 rounded border border-[#e0e0e0]">
                <span className="text-xs font-semibold text-[#242424] block">
                  Horario de Atención
                </span>
                <span className="text-xs text-[#616161]">Lunes a Viernes: 08h00 a 16h00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
