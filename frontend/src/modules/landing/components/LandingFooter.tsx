import React from 'react';

export const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="w-full max-w-5xl mt-16 border-t border-[#e0e0e0] pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#616161]">
      <span>© {currentYear} Ing. Wilfrido Trujillo · Todos los derechos reservados.</span>
      <div className="flex items-center gap-3 text-xs text-[#8a8886]">
        <span>UNACH</span>
        <span>·</span>
        <span>Facultad de Ingeniería</span>
        <span>·</span>
        <span>Régimen Académico CES</span>
      </div>
    </footer>
  );
};

export default LandingFooter;
