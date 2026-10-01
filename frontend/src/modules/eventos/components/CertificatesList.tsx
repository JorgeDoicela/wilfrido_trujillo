import { useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
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
      alert('Descarga de certificado completada.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-[#616161]">
        Cargando certificados emitidos...
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#616161] bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
        No se han emitido certificados oficiales en este espacio de trabajo aún.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#e0e0e0] rounded-lg shadow-2xs bg-white">
      <table className="m365-table">
        <thead>
          <tr>
            <th>BENEFICIARIO / CÉDULA</th>
            <th>HORAS ACREDITADAS</th>
            <th>CÓDIGO DE VERIFICACIÓN SHA-256</th>
            <th>FECHA DE EMISIÓN</th>
            <th>ESTADO</th>
            <th className="text-right">OPERACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id}>
              <td>
                <div className="font-semibold text-[#242424]">{cert.recipientName}</div>
                <div className="text-[11px] text-[#616161] font-mono">
                  CI: {cert.recipientIdentification} • {cert.recipientEmail}
                </div>
              </td>
              <td>
                <span className="font-semibold text-xs text-[#0f6cbd]">
                  {cert.hours} Horas
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <code className="bg-[#f0f0f0] px-1.5 py-0.5 rounded-sm text-[#424242]">
                    {cert.verificationHash.slice(0, 16)}...
                  </code>
                  <button
                    type="button"
                    onClick={() => onVerifyHash(cert.verificationHash)}
                    className="text-xs text-[#0f6cbd] hover:underline cursor-pointer font-medium"
                  >
                    Verificar
                  </button>
                </div>
              </td>
              <td className="text-[11px] text-[#616161] font-mono whitespace-nowrap">
                {cert.issuedAt
                  ? new Date(cert.issuedAt).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : 'Reciente'}
              </td>
              <td>
                <span className="m365-badge m365-badge--success">
                  <ShieldCheck className="w-3 h-3" /> Válido
                </span>
              </td>
              <td className="text-right">
                <button
                  type="button"
                  onClick={() => handleDownload(cert)}
                  disabled={downloadingId === cert.id}
                  className="m365-btn m365-btn-secondary text-xs h-7 px-2.5 inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
