import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useFocusTrap } from '../../lib/focus-trap';
import { resolveSectionHeading, type SectionHeadingElement } from '../../lib/heading';
import { subtleTextClass } from '../../lib/semantic-colors';
import { focusRingGhost } from '../../lib/focus-ring';

export interface ModalProps {
  /** Controls whether the dialog is rendered. */
  isOpen: boolean;
  /** Called when the dialog should close (Escape, overlay or close button). */
  onClose: () => void;
  /** Optional header title; also used for `aria-labelledby`. */
  title?: React.ReactNode;
  /** Accessible name when no visible `title` is rendered. */
  ariaLabel?: string;
  /** ID of a visible title inside the dialog (compound `Modal.Header` usage). */
  labelledBy?: string;
  /** ID of an element describing the dialog. */
  describedBy?: string;
  /** Semantic element used to render `title`. Defaults to `h2` for plain text, `div` for complex nodes. */
  titleAs?: SectionHeadingElement;
  /** Main dialog content. */
  children: React.ReactNode;
  /** Optional footer slot, typically action buttons. */
  footer?: React.ReactNode;
  /** Accessible name of the header close button. */
  closeLabel?: string;
  /** Maximum width preset of the dialog panel. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional classes applied to the dialog panel. */
  className?: string;
}

export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title content. */
  title?: React.ReactNode;
  /** Semantic element used to render `title`. Defaults to `h2` for plain text, `div` for complex nodes. */
  titleAs?: SectionHeadingElement;
  /** When provided, renders an accessible close button. */
  onClose?: () => void;
  /** ID used to associate the title with `aria-labelledby`. */
  titleId?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
}

/** English default for the close button. */
export const DEFAULT_MODAL_CLOSE_LABEL = 'Close dialog';

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  (
    {
      title,
      titleAs,
      onClose,
      titleId,
      closeLabel = DEFAULT_MODAL_CLOSE_LABEL,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const TitleElement = resolveSectionHeading(title, titleAs);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <TitleElement id={titleId} className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              {title}
            </TitleElement>
          )}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            /* Initial focus target of the trap: matched by attribute rather than
               by its label, which is language dependent. */
            data-autofocus=""
            className={cn(
              'p-1 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0 ml-4',
              'dark:hover:bg-neutral-800',
              subtleTextClass,
              focusRingGhost
            )}
            aria-label={closeLabel}
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
      <div
        ref={ref}
        className={cn('px-6 py-5 overflow-y-auto text-sm text-neutral-600 dark:text-neutral-300', className)}
        {...props}
      >
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
          'flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50/80 border-t border-neutral-100',
          'dark:bg-neutral-800/50 dark:border-neutral-800',
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
  (
    {
      isOpen,
      onClose,
      title,
      ariaLabel,
      labelledBy,
      describedBy,
      titleAs,
      closeLabel,
      children,
      footer,
      maxWidth = 'md',
      className,
    },
    ref
  ) => {
    const titleId = useId();
    const dialogLabelId = labelledBy ?? (title ? titleId : undefined);
    const dialogRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);

    onCloseRef.current = onClose;

    const setDialogRef = (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useFocusTrap(dialogRef, isOpen, () => onCloseRef.current());

    useEffect(() => {
      if (!isOpen) return;

      const portal = portalRef.current;
      const inertSiblings = Array.from(document.body.children).filter((child) => child !== portal);

      inertSiblings.forEach((element) => {
        element.setAttribute('inert', '');
      });
      document.body.style.overflow = 'hidden';

      return () => {
        inertSiblings.forEach((element) => {
          element.removeAttribute('inert');
        });
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen || typeof document === 'undefined') return null;

    const maxWidths = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    };

    return createPortal(
      <div ref={portalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          /*
            The scrim is deepened in dark mode: a 40% slate veil over an
            already dark page no longer separates the dialog from its
            background.
          */
          className="fixed inset-0 bg-neutral-900/40 dark:bg-neutral-950/70 backdrop-blur-[4px] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          ref={setDialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogLabelId}
          aria-label={dialogLabelId ? undefined : ariaLabel}
          aria-describedby={describedBy}
          className={cn(
            'relative w-full bg-white rounded-2xl shadow-xl border border-neutral-100 z-10 overflow-hidden flex flex-col max-h-[90vh]',
            'dark:bg-neutral-900 dark:border-neutral-700',
            maxWidths[maxWidth],
            className
          )}
        >
          {title && (
            <ModalHeader
              title={title}
              titleAs={titleAs}
              titleId={titleId}
              closeLabel={closeLabel}
              onClose={onClose}
            />
          )}
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
