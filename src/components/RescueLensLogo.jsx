import React from 'react';

export default function RescueLensLogo({ size = 'md' }) {
  const isSmall = size === 'sm';
  const iconSizeClass = isSmall ? 'w-8 h-8' : 'w-10 h-10';
  const textSizeClass = isSmall ? 'text-base' : 'text-xl';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Custom Geometric Brand Mark */}
      <div className={`relative flex items-center justify-center ${iconSizeClass} rounded-2xl bg-gradient-to-br from-slate-900 via-[#111827] to-slate-950 border border-slate-700/80 shadow-lg shadow-red-950/20 group-hover:scale-105 transition-all duration-300`}>
        
        {/* SVG Aperture Lens + Rescue Shield Emblem */}
        <svg className="w-3/5 h-3/5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-red-500 stroke-red-500" />
          {/* Camera Aperture / AI Core Lens inside */}
          <circle cx="12" cy="11" r="3" className="text-cyan-400 stroke-cyan-400 fill-cyan-400/20" />
          <line x1="12" y1="5" x2="12" y2="8" className="text-cyan-400 stroke-cyan-400" />
          <line x1="12" y1="14" x2="12" y2="17" className="text-cyan-400 stroke-cyan-400" />
        </svg>

        {/* Pulse Beacon Indicator */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-950" />
      </div>

      {/* Brand Name & Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${textSizeClass} text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors`}>
            Rescue<span className="text-red-600 dark:text-red-500">Lens</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/40 text-[10px] font-mono font-extrabold text-cyan-700 dark:text-cyan-300">
            AI
          </span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">
          Emergency Intelligence
        </span>
      </div>
    </div>
  );
}
