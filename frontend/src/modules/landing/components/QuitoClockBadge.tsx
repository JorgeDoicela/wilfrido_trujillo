import React, { useState, useEffect } from 'react';

export const QuitoClockBadge: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('es-EC', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden sm:flex flex-col items-end text-right font-mono select-none"
      title="Hora oficial de Ecuador continental (UTC-5)"
    >
      <span className="text-xs text-[#242424] font-medium tracking-wider tabular-nums">
        {time || '--:--:--'}
      </span>
      <span className="text-[9px] text-[#616161] font-sans font-semibold uppercase tracking-widest">
        Riobamba · UTC-5
      </span>
    </div>
  );
};
