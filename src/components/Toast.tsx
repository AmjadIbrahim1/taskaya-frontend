// src/components/Toast.tsx - FIXED
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { toast } from '@/lib/toast';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'from-green-500 to-emerald-500',
  error: 'from-red-500 to-rose-500',
  warning: 'from-amber-500 to-orange-500',
  info: 'from-blue-500 to-cyan-500',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className="pointer-events-auto animate-in slide-in-from-top-2 fade-in duration-300 min-w-[320px] max-w-md"
          >
            <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${styles[t.type]}`} />
              <div className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${styles[t.type]} flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="flex-1 text-sm font-bold text-foreground pt-2">
                  {t.message}
                </p>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}