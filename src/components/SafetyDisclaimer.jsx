import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SafetyDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm transition-colors">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Safety Advisory:</strong> AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-50 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-amber-900/20 dark:to-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3 text-amber-900 dark:text-amber-200 shadow-sm transition-colors">
      <div className="p-2 bg-amber-100 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="text-xs sm:text-sm leading-relaxed">
        <strong className="font-bold text-amber-950 dark:text-amber-300">Emergency Protocol Notice: </strong>
        AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel before taking operational action.
      </div>
    </div>
  );
}
