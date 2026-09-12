import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SafetyDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-slate-900 border border-amber-300 dark:border-red-500/40 rounded-xl p-3.5 flex items-start gap-3 shadow-sm transition-colors">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="block font-bold text-slate-900 dark:text-white mb-0.5">
            Emergency Protocol Notice
          </strong>
          <span className="text-slate-700 dark:text-slate-300">
            AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel before taking operational action.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-50/90 dark:bg-slate-900 border border-amber-300 dark:border-red-500/40 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm transition-colors">
      <div className="p-2.5 bg-amber-100 dark:bg-red-500/10 rounded-xl border border-amber-200 dark:border-red-500/30 shrink-0">
        <AlertTriangle className="w-6 h-6 text-amber-700 dark:text-red-400" />
      </div>
      <div className="space-y-1">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
          Emergency Protocol Notice
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel before taking operational action.
        </p>
      </div>
    </div>
  );
}
