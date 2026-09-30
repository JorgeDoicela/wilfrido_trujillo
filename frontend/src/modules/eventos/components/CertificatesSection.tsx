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
    <section id="certificados-section" className="max-w-5xl mx-auto w-full flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Generador de Certificados PDF con Verificación QR
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Emisión de certificados oficiales con firma digital del Ing. Wilfrido Trujillo y código QR de validación criptográfica.
          </p>
        </div>

        <Can do="certificate:issue">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenIssueModal}
            className="gap-1.5 bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" /> Emitir Certificado Digital
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
