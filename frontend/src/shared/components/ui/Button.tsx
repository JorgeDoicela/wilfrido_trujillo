import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'purple' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'px-3.5 py-1.5 text-xs font-semibold',
      md: 'px-5 py-2 text-xs font-semibold',
      lg: 'px-7 py-2.5 text-sm font-semibold',
    };

    const variantClasses = {
      primary: 'ui-btn-primary',
      secondary: 'ui-btn-secondary',
      purple: 'ui-btn-purple',
      ghost: 'ui-btn-ghost',
      danger: 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border border-rose-500/40 border-t-rose-400/70 shadow-sm backdrop-blur-md',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`ui-btn ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Cargando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
