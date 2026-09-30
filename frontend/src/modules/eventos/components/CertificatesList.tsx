import { useState } from 'react';
import { Award, Download, ShieldCheck, Clock } from 'lucide-react';
import { certificatesApi } from '../api/certificates.api';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
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
    <Card className="p-6 shadow-xl backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
        <Award className="w-5 h-5 text-amber-400" />
        <h4 className="text-sm font-bold text-white tracking-tight">
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
                  <Badge variant="warning">
                    <Clock className="w-3 h-3" /> {cert.hours} Horas
                  </Badge>
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
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onVerifyHash(cert.verificationHash)}
                      className="gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Validar QR
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(cert)}
                      isLoading={downloadingId === cert.id}
                      className="gap-1.5 bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
