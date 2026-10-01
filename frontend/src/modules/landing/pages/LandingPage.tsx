import React from 'react';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHero } from '../components/LandingHero';
import { LandingHighlightsCarousel } from '../components/LandingHighlightsCarousel';
import { LandingDetailExplorer } from '../components/LandingDetailExplorer';
import { LandingRraFlow } from '../components/LandingRraFlow';
import { LandingBentoGrid } from '../components/LandingBentoGrid';
import { LandingWorkspacesCatalog } from '../components/LandingWorkspacesCatalog';
import { LandingFooter } from '../components/LandingFooter';
import type { Workspace } from '@/shared/types/workspace.types';

export interface LandingPageProps {
  workspaces: Workspace[];
  onEnterPortal: () => void;
  onSelectWorkspace: (workspace: Workspace) => void;
  onJoinSpace: (code: string) => void;
  onVerifyCertificate: (hash: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  workspaces,
  onEnterPortal,
  onSelectWorkspace,
  onJoinSpace,
  onVerifyCertificate,
}) => {
  const scrollToValidator = () => {
    const el = document.getElementById('servicios');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#242424] flex flex-col font-sans selection:bg-[#cfe4fa] selection:text-[#0f6cbd]">
      {/* 1. Cabecera Flotante con Reloj de Riobamba y CTA M365 */}
      <LandingHeader onEnterPortal={onEnterPortal} />

      {/* 2. Hero Section de Impacto Tipográfico y Micro-Acreditaciones */}
      <LandingHero
        onEnterPortal={onEnterPortal}
        onScrollToValidator={scrollToValidator}
      />

      {/* 3. Carrusel Interactivo de Pilares (Inspirado en Jorge Doicela Carousel pero Fluent 2) */}
      <LandingHighlightsCarousel onEnterPortal={onEnterPortal} />

      {/* 4. Explorador Interactivo por Rol & Perspectiva (Inspirado en Detail Explorer) */}
      <LandingDetailExplorer
        onEnterPortal={onEnterPortal}
        onScrollToValidator={scrollToValidator}
      />

      {/* 5. Flujo Normativo Secuencial RRA (Inducción, Test 7.0, Formatos, Auditoría) */}
      <LandingRraFlow />

      {/* 6. Bento Grid: Validador Criptográfico en Vivo, Enrolamiento, Cita y Canales */}
      <LandingBentoGrid
        onJoinSpace={onJoinSpace}
        onVerifyCertificate={onVerifyCertificate}
      />

      {/* 7. Catálogo Oficial de Espacios Lectivos y Talleres */}
      <LandingWorkspacesCatalog
        workspaces={workspaces}
        onSelectWorkspace={(ws) => {
          onSelectWorkspace(ws);
          onEnterPortal();
        }}
      />

      {/* 8. Pie de Página Institucional M365 */}
      <LandingFooter />
    </div>
  );
};
