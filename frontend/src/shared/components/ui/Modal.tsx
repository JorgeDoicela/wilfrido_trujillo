import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2451]/65 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthMap[maxWidth]} glass-modal p-6 sm:p-7 flex flex-col gap-4 text-[#F0F0F3] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-white/10 pb-3.5 ${className}`}>
      <div className="flex items-center gap-2 text-white font-semibold text-base">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="text-[#C4C4C4] hover:text-white p-1.5 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const ModalTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-base font-semibold text-white tracking-tight ${className}`}>{children}</h3>;
};

export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`flex flex-col gap-3.5 ${className}`}>{children}</div>;
};

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-end gap-2.5 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
};
