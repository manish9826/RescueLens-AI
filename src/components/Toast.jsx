import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'info', message } = toast;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200';
      case 'error':
        return 'bg-red-950/90 border-red-500/40 text-red-200';
      default:
        return 'bg-slate-900/90 border-cyan-500/40 text-cyan-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl text-xs sm:text-sm font-medium ${getToastStyle()}`}>
        {getIcon()}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
