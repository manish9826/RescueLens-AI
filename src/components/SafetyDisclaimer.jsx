import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SafetyDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-amber-200/90">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Safety Advisory:</strong> AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-amber-950/50 border border-amber-500/30 rounded-xl p-4 flex items-start sm:items-center gap-3 text-amber-200 shadow-lg">
      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0 mt-0.5 sm:mt-0">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      </div>
      <div className="text-xs sm:text-sm">
        <span className="font-semibold text-amber-300">Emergency Protocol Notice: </span>
        AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel before taking operational action.
      </div>
    </div>
  );
}
