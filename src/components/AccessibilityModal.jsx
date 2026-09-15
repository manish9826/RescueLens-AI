import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Volume2, 
  Eye, 
  Type, 
  Maximize2, 
  ZapOff, 
  Radio, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityModal() {
  const { settings, toggleSetting, resetSettings, modalOpen, closeModal } = useAccessibility();
  const modalRef = useRef(null);

  // Close on Escape key & trap focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  const OPTIONS = [
    {
      key: 'largeText',
      title: 'Large Text',
      desc: 'Enlarges interface typography and indicators for enhanced readability.',
      icon: Type,
      active: settings.largeText
    },
    {
      key: 'highContrast',
      title: 'High Contrast',
      desc: 'Maximizes color contrast with stark black, white, and high-visibility yellow borders.',
      icon: Eye,
      active: settings.highContrast
    },
    {
      key: 'voiceInstructions',
      title: 'Voice Instructions',
      desc: 'Automatically speaks emergency instructions and UI status updates aloud.',
      icon: Volume2,
      active: settings.voiceInstructions
    },
    {
      key: 'reducedMotion',
      title: 'Reduced Motion',
      desc: 'Halts animations, radar scans, pulses, and transitions for users sensitive to motion.',
      icon: ZapOff,
      active: settings.reducedMotion
    },
    {
      key: 'screenReaderFriendly',
      title: 'Screen Reader Friendly',
      desc: 'Enables polite ARIA live regions, explicit landmarks, and verbose labels.',
      icon: Radio,
      active: settings.screenReaderFriendly
    },
    {
      key: 'largeButtons',
      title: 'Large Emergency Buttons',
      desc: 'Enlarges touch targets and action buttons for easy one-tap tapping during stress.',
      icon: Maximize2,
      active: settings.largeButtons
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      ref={modalRef}
      onClick={closeModal}
    >
      <div 
        className="w-full max-w-xl rounded-3xl bg-[#090E1A] border-2 border-cyan-500/60 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-950 via-[#0B1528] to-[#090E1A] border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center text-xl text-cyan-400">
              ♿
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-xl font-black text-white tracking-tight">
                ACCESSIBILITY MODE
              </h2>
              <span className="text-xs text-cyan-300 font-semibold">
                Universal design controls for motor, visual, and cognitive safety
              </span>
            </div>
          </div>

          <button
            onClick={closeModal}
            aria-label="Close Accessibility Controls"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.key}
                onClick={() => toggleSetting(opt.key)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  opt.active
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
                role="switch"
                aria-checked={opt.active}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSetting(opt.key);
                  }
                }}
                id={`a11y-toggle-${opt.key}`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    opt.active ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{opt.title}</span>
                      {opt.active && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-900/80 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-700">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>

                {/* Switch Graphic */}
                <div className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 flex items-center ${
                  opt.active ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                }`}>
                  <div className={`w-5 h-5 rounded-full shadow-md transition-all ${
                    opt.active ? 'bg-slate-950' : 'bg-slate-400'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={closeModal}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-lg shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
