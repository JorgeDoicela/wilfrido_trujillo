import React from 'react';

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#e0e0e0] rounded-2xl md:rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-xs transition-colors hover:border-[#c7c7c7] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default BentoCard;
