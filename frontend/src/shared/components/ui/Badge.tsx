import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const variantClasses = {
    success: 'ui-badge-success',
    warning: 'ui-badge-warning',
    danger: 'ui-badge-danger',
    info: 'ui-badge-info',
    purple: 'bg-purple-500/10 border border-purple-500/30 text-purple-300',
    neutral: 'bg-slate-800 border border-slate-700 text-slate-300',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={`ui-badge ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="inline-flex items-center gap-1.5">{children}</span>
    </span>
  );
}
