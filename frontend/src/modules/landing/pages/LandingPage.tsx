import React from 'react';
import { LandingHeader } from '../components/LandingHeader';
import { LandingHero } from '../components/LandingHero';
import { LandingHighlightsCarousel } from '../components/LandingHighlightsCarousel';
import { LandingDetailExplorer } from '../components/LandingDetailExplorer';
import { LandingBentoSection } from '../components/LandingBentoSection';
import { LandingFooter } from '../components/LandingFooter';
import type { Workspace } from '@/shared/types/workspace.types';

export interface LandingPageProps {
  workspaces?: Workspace[];
  onEnterPortal: () => void;
  onSelectWorkspace?: (workspace: Workspace) => void;
  onJoinSpace?: (code: string) => void;
  onVerifyCertificate: (hash: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPortal,
  onVerifyCertificate,
}) => {
  return (
    <div className="relative min-h-screen bg-[#f5f5f5] text-[#242424] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-x-hidden font-sans">
      {/* 1. Cabecera Unificada con Logo, Reloj Riobamba y Acceso al Portal */}
      <LandingHeader onEnterPortal={onEnterPortal} />

      {/* 2. Contenido Principal: Idéntica jerarquía y armonía que la landing de referencia */}
      <main
        id="main-content"
        className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-24 sm:gap-32 md:gap-36 justify-center outline-none pt-6 sm:pt-10 pb-12"
      >
        {/* Hero Intro de Impacto Tipográfico */}
        <LandingHero onEnterPortal={onEnterPortal} />

        {/* Carrusel Multitarjeta de Pilares */}
        <LandingHighlightsCarousel onEnterPortal={onEnterPortal} />

        {/* Explorador Interactivo a Fondo */}
        <LandingDetailExplorer />

        {/* Sección Bento de 2 Tarjetas: Canales Oficiales y Filosofía Docente */}
        <LandingBentoSection
          onEnterPortal={onEnterPortal}
          onVerifyCertificate={() => onVerifyCertificate('')}
        />
      </main>

      {/* 3. Footer Institucional */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
