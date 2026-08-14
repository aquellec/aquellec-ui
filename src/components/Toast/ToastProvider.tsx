import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import { Toast, type ToastProps } from './Toast';

export type ToastInput = {
  variant?: ToastProps['variant'];
  title: string;
  description?: string;
  /** Auto-dismiss delay in ms. Set to `0` to disable. Defaults to the provider value. */
  duration?: number;
};

export type ToastRecord = ToastInput & {
  id: string;
};

export interface ToastContextValue {
  toasts: ToastRecord[];
  /** Enqueue a toast and return its id. */
  push: (toast: ToastInput) => string;
  /** Remove a toast by id. */
  dismiss: (id: string) => void;
  /** Remove all queued toasts. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of visible toasts. Older toasts are removed first. */
  limit?: number;
  /** Default auto-dismiss delay in ms when `duration` is omitted on a toast. */
  defaultDuration?: number;
  /** Classes applied to the fixed viewport container. */
  viewportClassName?: string;
}

function ToastViewportItem({
  toast,
  defaultDuration,
  onDismiss,
}: {
  toast: ToastRecord;
  defaultDuration: number;
  onDismiss: (id: string) => void;
}) {
  const duration = toast.duration ?? defaultDuration;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss, toast.id]);

  return (
    <Toast
      variant={toast.variant}
      title={toast.title}
      description={toast.description}
      onClose={() => onDismiss(toast.id)}
    />
  );
}

export function ToastProvider({
  children,
  limit = 5,
  defaultDuration = 5000,
  viewportClassName,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = createToastId();
      const record: ToastRecord = { ...toast, id };

      setToasts((current) => [...current, record].slice(-limit));
      return id;
    },
    [limit]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      dismiss,
      dismissAll,
    }),
    [toasts, push, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className={cn(
          'pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col gap-2',
          viewportClassName
        )}
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastViewportItem toast={toast} defaultDuration={defaultDuration} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access the toast queue. Must be used within `ToastProvider`. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }
  return context;
}
