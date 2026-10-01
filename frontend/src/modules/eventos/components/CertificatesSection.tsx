import React from 'react';
import { Award, Plus } from 'lucide-react';
import { Can } from '@/shared/components/Can';
import { CertificatesList } from './CertificatesList';
import type { Certificate } from '@/shared/types/certificate.types';

export interface CertificatesSectionProps {
  certificates: Certificate[];
  isLoading: boolean;
  onOpenIssueModal: () => void;
  onVerifyHash: (hash: string) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  isLoading,
  onOpenIssueModal,
  onVerifyHash,
}) => {
  return (
    <section id="certificados-section" className="m365-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#edebe9]">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0f6cbd]" />
            <h3 className="text-sm font-semibold text-[#242424]">
              Emisión de Certificados PDF con Verificación Criptográfica QR
            </h3>
          </div>
          <p className="text-xs text-[#616161] mt-0.5">
            Certificados oficiales con firma de Wilfrido Trujillo y código QR de validación en línea.
          </p>
        </div>

        <Can do="certificate:issue">
          <button
            type="button"
            onClick={onOpenIssueModal}
            className="m365-btn m365-btn-primary text-xs h-7.5 px-2.5"
          >
            <Plus className="w-3.5 h-3.5" /> Emitir Certificado
          </button>
        </Can>
      </div>

      <CertificatesList
        certificates={certificates}
        isLoading={isLoading}
        onVerifyHash={onVerifyHash}
      />
    </section>
  );
};
