import React from 'react';
import { LandingNavbar } from '../components/LandingNavbar';
import { LandingHero } from '../components/LandingHero';
import { LandingQuickAccess } from '../components/LandingQuickAccess';
import { LandingPillars } from '../components/LandingPillars';
import { LandingRraFlow } from '../components/LandingRraFlow';
import { LandingWorkspacesCatalog } from '../components/LandingWorkspacesCatalog';
import { LandingProfileSection } from '../components/LandingProfileSection';
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
    const el = document.getElementById('acceso-rapido');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#242424] flex flex-col font-sans">
      {/* 1. Barra de Navegación Institucional */}
      <LandingNavbar onEnterPortal={onEnterPortal} />

      {/* 2. Hero Section de Impacto */}
      <LandingHero
        onEnterPortal={onEnterPortal}
        onScrollToValidator={scrollToValidator}
      />

      {/* 3. Acceso Rápido y Validador en Vivo */}
      <LandingQuickAccess
        onJoinSpace={onJoinSpace}
        onVerifyCertificate={onVerifyCertificate}
      />

      {/* 4. Pilares de Gestión: Prácticas, Vinculación y Eventos */}
      <LandingPillars />

      {/* 5. Flujo Normativo RRA para Estudiantes en 4 Etapas */}
      <LandingRraFlow />

      {/* 6. Catálogo Interactivo de Periodos y Espacios */}
      <LandingWorkspacesCatalog
        workspaces={workspaces}
        onSelectWorkspace={(ws) => {
          onSelectWorkspace(ws);
          onEnterPortal();
        }}
      />

      {/* 7. Perfil Académico del Ingeniero y Marco LOPDP */}
      <LandingProfileSection />

      {/* 8. Pie de Página Institucional */}
      <LandingFooter />
    </div>
  );
};
