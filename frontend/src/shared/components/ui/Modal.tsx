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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthMap[maxWidth]} bg-white border border-[#e0e0e0] rounded-lg p-5 shadow-2xl flex flex-col gap-4 text-[#242424] ${className}`}
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
    <div className={`flex items-center justify-between border-b border-[#edebe9] pb-3 ${className}`}>
      <div className="flex items-center gap-2 text-[#242424] font-semibold text-sm">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="text-[#616161] hover:text-[#242424] p-1 rounded-md hover:bg-[#f0f0f0] transition-colors cursor-pointer"
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
  return <h3 className={`text-base font-semibold text-[#242424] tracking-tight ${className}`}>{children}</h3>;
};

export const ModalContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`flex flex-col gap-3 ${className}`}>{children}</div>;
};

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-end gap-2 pt-3 border-t border-[#edebe9] ${className}`}>
      {children}
    </div>
  );
};
