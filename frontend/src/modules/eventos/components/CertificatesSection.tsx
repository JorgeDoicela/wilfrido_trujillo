import React from 'react';
import { Award, Plus } from 'lucide-react';
import { Can } from '@/shared/components/Can';
import { Button } from '@/shared/components/ui/Button';
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
    <section id="certificados-section" className="bg-white border border-[rgba(0,0,0,0.08)] rounded-[4px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#e5e7eb]">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0078d4]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">
              Generador de Certificados PDF con Verificación Criptográfica QR
            </h3>
          </div>
          <p className="text-xs text-[#605e5c] mt-0.5">
            Emisión de certificados oficiales con firma digital del Ing. Wilfrido Trujillo y código QR de validación matemática en cadena.
          </p>
        </div>

        <Can do="certificate:issue">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenIssueModal}
            className="gap-1 text-xs py-1"
          >
            <Plus className="w-3.5 h-3.5" /> Emitir Certificado
          </Button>
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
