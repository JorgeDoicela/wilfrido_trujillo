import { useState } from 'react';
import { KeyRound, ArrowRight, Search, ShieldCheck, AlertCircle } from 'lucide-react';

export interface LandingQuickAccessProps {
  onJoinSpace: (code: string) => void;
  onVerifyCertificate: (hash: string) => void;
}

export const LandingQuickAccess: React.FC<LandingQuickAccessProps> = ({
  onJoinSpace,
  onVerifyCertificate,
}) => {
  const [spaceCode, setSpaceCode] = useState('');
  const [certHash, setCertHash] = useState('');
  const [spaceError, setSpaceError] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);

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
      setCertError('Ingresa el hash criptográfico o identificador único del certificado.');
      return;
    }
    onVerifyCertificate(cleaned);
  };

  return (
    <section id="acceso-rapido" className="py-12 bg-[#f5f5f5] border-b border-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#242424]">
            Servicios Rápidos de Autoservicio Académico
          </h2>
          <p className="text-xs sm:text-sm text-[#616161] mt-1.5">
            Accede de inmediato a tus periodos académicos o valida la legitimidad de constancias emitidas por la coordinación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Acceso a Espacio Lectivo */}
          <div className="m365-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-md bg-[#ebf3fc] text-[#0f6cbd] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">
                    Ingreso a Espacio Académico por Código
                  </h3>
                  <span className="text-[11px] text-[#616161]">
                    Prácticas Preprofesionales, Vinculación o Conferencias
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#616161] leading-relaxed mb-4">
                Si el Ing. Wilfrido Trujillo te proporcionó un código oficial (ej. <code className="font-mono bg-[#f0f0f0] px-1 py-0.5 rounded text-[#242424]">PRAC-2026</code> o <code className="font-mono bg-[#f0f0f0] px-1 py-0.5 rounded text-[#242424]">CONF-2026</code>), ingrésalo a continuación para acceder al material:
              </p>

              {spaceError && (
                <div className="mb-3 p-2.5 rounded-md bg-[#fde7e9] border border-[#a80000]/20 text-[#a80000] text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{spaceError}</span>
                </div>
              )}

              <form onSubmit={handleSpaceSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. PRAC-2026"
                  value={spaceCode}
                  onChange={(e) => setSpaceCode(e.target.value.toUpperCase())}
                  className="m365-input flex-1 font-mono uppercase text-xs"
                />
                <button
                  type="submit"
                  className="m365-btn m365-btn-primary text-xs px-3.5 gap-1.5 whitespace-nowrap"
                >
                  <span>Ingresar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-[#edebe9] text-[11px] text-[#616161] flex items-center justify-between">
              <span>Registro directo con matrícula</span>
              <span className="font-semibold text-[#0f6cbd]">Acceso Inmediato</span>
            </div>
          </div>

          {/* Tarjeta 2: Validador de Certificados en Vivo */}
          <div className="m365-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-md bg-[#dff6dd] text-[#107c10] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">
                    Validador Público de Certificados Académicos
                  </h3>
                  <span className="text-[11px] text-[#616161]">
                    Consulta criptográfica inmutable con algoritmo SHA-256
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#616161] leading-relaxed mb-4">
                Empleadores, instituciones y evaluadores pueden validar en tiempo real cualquier diploma o constancia emitida por el Ingeniero ingresando el código de verificación:
              </p>

              {certError && (
                <div className="mb-3 p-2.5 rounded-md bg-[#fde7e9] border border-[#a80000]/20 text-[#a80000] text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{certError}</span>
                </div>
              )}

              <form onSubmit={handleCertSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresa el Hash SHA-256 o Código WT-XXXX..."
                  value={certHash}
                  onChange={(e) => setCertHash(e.target.value)}
                  className="m365-input flex-1 font-mono text-xs"
                />
                <button
                  type="submit"
                  className="m365-btn m365-btn-secondary text-xs px-3.5 gap-1.5 whitespace-nowrap bg-[#fafafa]"
                >
                  <Search className="w-3.5 h-3.5 text-[#0f6cbd]" />
                  <span>Verificar</span>
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-[#edebe9] text-[11px] text-[#616161] flex items-center justify-between">
              <span>Acreditado mediante matriz QR</span>
              <span className="font-semibold text-[#107c10]">Verificación Pública 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
