import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`m365-card ${hoverable ? 'm365-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pb-3 border-b border-[#edebe9] mb-3 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-sm font-semibold text-[#242424] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-[#616161] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`space-y-3 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`pt-3 border-t border-[#edebe9] mt-3 flex items-center justify-end gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
