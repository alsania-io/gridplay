/**
 * useToast Hook
 * 
 * Simple toast notification system for GridPlay.
 * Provides toast notifications with title and description.
 */

"use client";

import React, { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextValue {
  toast: (props: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, duration: 5000, ...toast };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration || 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, removeToast, toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg border
              animate-slide-up
              ${
                t.variant === 'destructive'
                  ? 'bg-error text-white border-error'
                  : t.variant === 'success'
                  ? 'bg-success text-white border-success'
                  : t.variant === 'warning'
                  ? 'bg-warning text-gray-900 border-warning'
                  : t.variant === 'info'
                  ? 'bg-info text-white border-info'
                  : 'bg-surface border-border text-foreground'
              }
            `}
            role="alert"
          >
            {t.title && <p className="font-semibold mb-1">{t.title}</p>}
            {t.description && <p className="text-sm">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
