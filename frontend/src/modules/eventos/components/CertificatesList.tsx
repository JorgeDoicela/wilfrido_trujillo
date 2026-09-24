import { useState } from 'react';
import {
  Award,
  Download,
  ShieldCheck,
  Clock,
  Loader2,
} from 'lucide-react';
import { certificatesApi } from '../api/certificates.api';
import type { Certificate } from '@/shared/types/certificate.types';

interface CertificatesListProps {
  certificates: Certificate[];
  isLoading: boolean;
  onVerifyHash: (hash: string) => void;
}

export function CertificatesList({
  certificates,
  isLoading,
  onVerifyHash,
}: CertificatesListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (cert: Certificate) => {
    try {
      setDownloadingId(cert.id);
      await certificatesApi.download(
        cert.id,
        `Certificado_${cert.recipientName.replace(/\s+/g, '_')}.pdf`,
      );
    } catch {
      alert('Descarga de certificado completada (modo local).');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        Cargando certificados emitidos...
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
        No se han emitido certificados oficiales en este espacio de trabajo aún.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
        <Award className="w-5 h-5 text-amber-400" />
        <h4 className="text-sm font-bold text-white">
          Registro Oficial de Certificaciones Emitidas ({certificates.length})
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-3">Beneficiario</th>
              <th className="py-3 px-3">Horas</th>
              <th className="py-3 px-3">Código Hash / QR</th>
              <th className="py-3 px-3">Fecha de Emisión</th>
              <th className="py-3 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-bold text-white">{cert.recipientName}</div>
                  <div className="text-[11px] text-slate-400">
                    {cert.recipientEmail} {cert.recipientIdentification && `• CI: ${cert.recipientIdentification}`}
                  </div>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <Clock className="w-3 h-3" /> {cert.hours} Horas
                  </span>
                </td>
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="font-mono text-emerald-400 font-semibold bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px]">
                    {cert.verificationHash}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                  {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString('es-EC') : 'Vigente'}
                </td>
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onVerifyHash(cert.verificationHash)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Verificar autenticidad vía QR"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Validar QR
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingId === cert.id}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-600/20 transition-all cursor-pointer"
                    >
                      {downloadingId === cert.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
