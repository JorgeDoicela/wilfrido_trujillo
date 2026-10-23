import React from 'react';

export const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="w-full max-w-6xl mx-auto mt-6 border-t border-white/10 pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C4C4C4]">
      <span>© {currentYear} Wilfrido Trujillo · Todos los derechos reservados.</span>
      <div className="flex items-center gap-3 text-xs text-[#C4C4C4]/70">
        <span>Prácticas</span>
        <span>·</span>
        <span>Vinculación</span>
        <span>·</span>
        <span>Certificación</span>
      </div>
    </footer>
  );
};

export default LandingFooter;
