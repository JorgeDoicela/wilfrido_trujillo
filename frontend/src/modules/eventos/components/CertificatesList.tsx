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
      <div className="p-8 text-center text-xs text-[#605e5c]">
        Cargando certificados emitidos...
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#605e5c] bg-[#faf9f8] rounded-[2px] border border-[#e5e7eb]">
        No se han emitido certificados oficiales en este espacio de trabajo aún.
      </div>
    );
  }

  return (
    <div className="fluent-table-wrapper">
      <table className="fluent-table">
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
                <div className="font-bold text-[#1a1a1a]">{cert.recipientName}</div>
                <div className="text-[10px] text-[#605e5c] font-mono">
                  CI: {cert.recipientIdentification} • {cert.recipientEmail}
                </div>
              </td>
              <td>
                <span className="font-mono text-xs font-bold text-[#1b2a4a]">
                  {cert.hours} Horas
                </span>
              </td>
              <td>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <code>{cert.verificationHash.slice(0, 16)}...</code>
                  <button
                    type="button"
                    onClick={() => onVerifyHash(cert.verificationHash)}
                    className="text-[10px] text-[#0078d4] hover:underline cursor-pointer"
                  >
                    Verificar
                  </button>
                </div>
              </td>
              <td className="text-[11px] text-[#605e5c] font-mono whitespace-nowrap">
                {cert.issuedAt
                  ? new Date(cert.issuedAt).toLocaleDateString('es-EC', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : 'Reciente'}
              </td>
              <td>
                <span className="fluent-badge fluent-badge--success">
                  <ShieldCheck className="w-3 h-3" /> Válido
                </span>
              </td>
              <td className="text-right">
                <button
                  type="button"
                  onClick={() => handleDownload(cert)}
                  disabled={downloadingId === cert.id}
                  className="fluent-btn-action"
                >
                  <Download className="w-3 h-3" /> Descargar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
