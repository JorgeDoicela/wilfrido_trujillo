import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/30' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-[11px] font-medium text-rose-400">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-slate-500">{helperText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`ui-input resize-none ${error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/30' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-[11px] font-medium text-rose-400">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-slate-500">{helperText}</span>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, className = '', id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`ui-input cursor-pointer ${error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/30' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-[11px] font-medium text-rose-400">{error}</span>}
        {helperText && !error && (
          <span className="text-[11px] text-slate-500">{helperText}</span>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
