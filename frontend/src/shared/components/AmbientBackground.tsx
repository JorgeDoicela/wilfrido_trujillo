import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#0d132e]"
    >
      {/* 1. Canvas Base: Tono nocturno profundo #0a0f26 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1e2a66_0%,_#11173b_50%,_#090d21_100%)]" />

      {/* 2. Malla Lumínica Volumétrica para Refracción de Cristal */}
      {/* Luz Cenital Central: Blanco Hielo y Azul Zafiro (Refracta directamente en las tarjetas Bento) */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[75vw] max-w-[950px] h-[550px] rounded-full bg-gradient-to-b from-white/30 via-[#3d5afe]/35 to-transparent blur-[130px] transform-gpu will-change-transform" />

      {/* Orbe Lateral Izquierdo: Azul Índigo Profundo con destello cian */}
      <div className="absolute top-[20%] -left-[10%] w-[55vw] max-w-[650px] h-[55vw] max-h-[650px] rounded-full bg-gradient-to-tr from-[#304ffe]/45 via-[#2979ff]/30 to-transparent blur-[120px] transform-gpu will-change-transform" />

      {/* Orbe Lateral Derecho: Luz Plata Especular y Violeta Suave */}
      <div className="absolute top-[30%] -right-[8%] w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] rounded-full bg-gradient-to-bl from-white/22 via-[#536dfe]/35 to-transparent blur-[125px] transform-gpu will-change-transform" />

      {/* Orbe Inferior Central: Resplandor de Contención */}
      <div className="absolute -bottom-[15%] left-[25%] w-[65vw] max-w-[750px] h-[400px] rounded-full bg-gradient-to-t from-[#1a237e]/50 via-[#121842]/60 to-transparent blur-[130px] transform-gpu will-change-transform" />

      {/* 3. Velo de Textura Fluida Difusa con Luminancia Acentuada */}
      <svg
        className="absolute inset-0 w-full h-full opacity-55 mix-blend-screen pointer-events-none"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mesh-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.50" />
            <stop offset="45%" stopColor="#3d5afe" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#11173b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mesh-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#82b1ff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#2979ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#090d21" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M-100,220 C280,120 620,420 1080,240 C1280,160 1480,260 1600,300 L1600,900 L-100,900 Z"
          fill="url(#mesh-wave-1)"
          filter="blur(75px)"
        />
        <path
          d="M-100,520 C380,620 780,320 1180,580 C1380,690 1530,520 1600,580 L1600,900 L-100,900 Z"
          fill="url(#mesh-wave-2)"
          filter="blur(85px)"
        />
      </svg>
    </div>
  );
};

export default AmbientBackground;
