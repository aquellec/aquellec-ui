import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRingGhost } from '../../lib/focus-ring';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled')
  );
}

export interface ModalProps {
  /** Controls whether the dialog is rendered. */
  isOpen: boolean;
  /** Called when the dialog should close (Escape, overlay or close button). */
  onClose: () => void;
  /** Optional header title; also used for `aria-labelledby`. */
  title?: React.ReactNode;
  /** Main dialog content. */
  children: React.ReactNode;
  /** Optional footer slot, typically action buttons. */
  footer?: React.ReactNode;
  /** Maximum width preset of the dialog panel. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional classes applied to the dialog panel. */
  className?: string;
}

export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title content. */
  title?: React.ReactNode;
  /** When provided, renders an accessible close button. */
  onClose?: () => void;
  /** ID used to associate the title with `aria-labelledby`. */
  titleId?: string;
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ title, onClose, titleId, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between px-6 py-4 border-b border-slate-100', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 id={titleId} className="text-base font-bold text-slate-800">
              {title}
            </h3>
          )}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0 ml-4',
              focusRingGhost
            )}
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export const ModalBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-6 py-5 overflow-y-auto text-sm text-slate-600', className)} {...props}>
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export const ModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/80 border-t border-slate-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, footer, maxWidth = 'md', className }, ref) => {
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    const setDialogRef = (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useEffect(() => {
      if (!isOpen) return;

      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      const dialog = dialogRef.current;
      if (dialog) {
        const closeButton = dialog.querySelector<HTMLElement>('[aria-label="Fermer la fenêtre"]');
        const focusableElements = getFocusableElements(dialog);
        (closeButton ?? focusableElements[0] ?? dialog).focus();
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
          return;
        }

        if (event.key !== 'Tab' || !dialogRef.current) return;

        const focusableElements = getFocusableElements(dialogRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      };

      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        previouslyFocusedRef.current?.focus();
      };
    }, [isOpen, onClose]);

    if (!isOpen || typeof document === 'undefined') return null;

    const maxWidths = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    };

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={setDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-xl border border-slate-100 z-10 overflow-hidden flex flex-col max-h-[90vh]',
            maxWidths[maxWidth],
            className
          )}
        >
          {title && <ModalHeader title={title} titleId={titleId} onClose={onClose} />}
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </div>
      </div>,
      document.body
    );
  }
) as React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

Modal.displayName = 'Modal';
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
