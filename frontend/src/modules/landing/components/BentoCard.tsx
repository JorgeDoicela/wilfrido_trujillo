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
      className={`glass-card p-8 md:p-12 flex flex-col justify-between shadow-2xl transition-all hover:border-white/25 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default BentoCard;
