import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-ink-900 text-ivory-50 p-4 rounded-xl shadow-float border border-ink-700 flex items-start space-x-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sage-400 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-champagne-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-champagne-300 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h5 className="text-xs font-semibold text-ivory-50">{toast.title}</h5>
            {toast.message && <p className="text-[11px] text-stone-300 mt-0.5">{toast.message}</p>}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-xs font-bold text-champagne-400 hover:text-champagne-300 underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

