import React from 'react';
import { AmbientBackground } from '@/shared/components/AmbientBackground';
import { LandingHeader } from '../components/LandingHeader';
import { LandingBentoHub } from '../components/LandingBentoHub';
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
  workspaces,
  onEnterPortal,
  onSelectWorkspace,
  onVerifyCertificate,
}) => {
  return (
    <div className="relative min-h-screen text-[#F0F0F3] flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* 0. Fondo de Luz Ambiental y Malla Lumínica */}
      <AmbientBackground />

      {/* 1. Cabecera Vidriada con Logo, Reloj Riobamba y Acceso */}
      <LandingHeader onEnterPortal={onEnterPortal} />

      {/* 2. Tablero Bento de Cristal Puro */}
      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto z-10 flex-grow flex flex-col justify-center outline-none pt-24 sm:pt-28 pb-10"
      >
        <LandingBentoHub
          workspaces={workspaces}
          onEnterPortal={onEnterPortal}
          onSelectWorkspace={onSelectWorkspace}
          onVerifyCertificate={onVerifyCertificate}
        />
      </main>

      {/* 3. Footer Vidriado Institucional */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
