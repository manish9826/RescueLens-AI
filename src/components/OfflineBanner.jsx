import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { 
  WifiOff, 
  X
} from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when going offline again
  React.useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  const OFFLINE_NUMBERS = [
    { num: '112', label: 'Unified', icon: '🚨' },
    { num: '100', label: 'Police', icon: '👮' },
    { num: '101', label: 'Fire', icon: '🚒' },
    { num: '108', label: 'Ambulance', icon: '🚑' },
    { num: '1098', label: 'Childline', icon: '🛟' }
  ];

  if (isOnline || dismissed) return null;

  return (
    <div 
      className="w-full bg-gradient-to-r from-amber-950/95 via-red-950/95 to-slate-950/95 border-b-2 border-amber-500 p-4 text-white shadow-2xl animate-in slide-in-from-top duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black tracking-wide">
              <WifiOff className="w-3.5 h-3.5" />
              <span>📶 OFFLINE MODE</span>
            </span>
            <span className="text-xs text-slate-300 font-bold">
              Gemini AI analysis requires internet. Live AI results are disabled offline.
            </span>
          </div>
          <p className="text-xs text-amber-200/90 font-medium">
            Verified official numbers and offline protocols are served safely from local cache. Never faking AI results.
          </p>
        </div>

        {/* Offline Emergency Numbers Quick Dial */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {OFFLINE_NUMBERS.map((item) => (
            <a
              key={item.num}
              href={`tel:${item.num}`}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-red-600 border border-slate-700 hover:border-red-500 text-white font-black text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <span>{item.icon}</span>
              <span>{item.num}</span>
            </a>
          ))}
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
