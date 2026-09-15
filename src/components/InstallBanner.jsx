import React, { useState, useEffect } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

export default function InstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    setDismissed(isDismissed);
    
    // Check if device is iOS to show manual install instructions if native prompt isn't supported
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Do not show if installed, dismissed, or not installable (unless iOS which needs manual instructions)
  if (isInstalled || dismissed) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-[#0b1426] border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 relative">
        
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex flex-shrink-0 items-center justify-center text-white shadow-lg">
            {isIOS ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wide">Install RescueLens AI</h3>
            <p className="text-xs text-slate-400 mt-1">
              Get faster access to emergency assistance with our offline-capable progressive web app.
            </p>
          </div>
        </div>

        {isInstallable ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={promptInstall}
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              INSTALL APP
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all active:scale-95 border border-slate-700"
            >
              NOT NOW
            </button>
          </div>
        ) : isIOS ? (
          <div className="mt-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 text-center">
            Tap <strong className="text-white">Share</strong> then <strong className="text-white">Add to Home Screen</strong> to install.
          </div>
        ) : null}

      </div>
    </div>
  );
}
