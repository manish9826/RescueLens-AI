import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  Bot, 
  RotateCcw,
  Zap,
  Info,
  Building2,
  FileText
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function AnalysisResult({ result, image, onDispatch, onReset, toggleCommanderChat }) {
  if (!result) return null;

  const { data, isLive, warning, usedModel } = result;
  const { 
    incidentType = 'Unidentified Emergency Hazard',
    severity = 'HIGH',
    priorityScore = 85,
    confidence = 90,
    summary = 'Emergency scene analysis complete.',
    risks = [],
    immediateActions = [],
    resources = []
  } = data || {};

  const getSeverityBadgeClass = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-950/90 border-red-500/60 text-red-300 glow-red';
      case 'HIGH':
        return 'bg-orange-950/90 border-orange-500/60 text-orange-300';
      case 'MEDIUM':
        return 'bg-amber-950/90 border-amber-500/60 text-amber-300';
      case 'LOW':
        return 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-red-500 stroke-red-500';
    if (score >= 75) return 'text-orange-500 stroke-orange-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Executive Banner Header */}
      <div className="glass-panel border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-extrabold border shadow-lg ${getSeverityBadgeClass(severity)}`}>
                SEVERITY: {severity}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {isLive ? `Live Gemini (${usedModel || 'gemini-3.6-flash'})` : 'Synthesized Intelligence'}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {incidentType}
            </h1>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              New Scan
            </button>
            
            <button
              onClick={() => onDispatch(data, image)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <ShieldAlert className="w-4 h-4" />
              Dispatch to Command Center
            </button>
          </div>
        </div>

        {warning && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-center gap-2.5 font-mono">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{warning}</span>
          </div>
        )}
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Telemetry Target & Score Ring Meter */}
        <div className="space-y-6">
          
          {/* Target Photo Container */}
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 space-y-3 shadow-2xl">
            <div className="relative">
              <img
                src={image}
                alt="Analyzed emergency scene target"
                className="w-full h-64 object-cover filter contrast-110"
              />
              <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-[10px] font-mono text-cyan-300">
                INPUT TELEMETRY FRAME
              </div>
            </div>
          </div>

          {/* Priority Score SVG Ring Meter & Confidence Percentage */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
            
            {/* Ring Score Gauge */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Priority Urgency</div>
                <div className="text-4xl font-extrabold text-white mt-1 font-mono">
                  {priorityScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Calculated Crisis Urgency</span>
              </div>

              {/* Ring Gauge SVG */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={getScoreColor(priorityScore)}
                    strokeDasharray={`${priorityScore}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Zap className="w-6 h-6 absolute text-amber-400" />
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Detection Confidence</div>
                <div className="text-2xl font-extrabold text-cyan-400 mt-1 font-mono">
                  {confidence}%
                </div>
              </div>
              <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 font-bold">
                HIGH ACCURACY
              </span>
            </div>

          </div>

          {/* Commander Assistant Action Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/40 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
              Ask Emergency Commander AI
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need immediate operational advice on resource allocation or tactical sector priorities for this incident?
            </p>
            <button
              onClick={toggleCommanderChat}
              className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              Launch AI Commander Assistant
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Situation Summary, Risks, Immediate Actions, Required Resources */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Situation Summary */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base border-b border-slate-800/80 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              Executive Situation Summary
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              "{summary}"
            </p>
          </div>

          {/* Section 2: Detected Hazards & Risks */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base border-b border-slate-800/80 pb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Detected Hazards & Visible Physical Risks
            </div>
            <ul className="space-y-3">
              {risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 p-3.5 bg-red-950/30 border border-red-500/30 rounded-2xl shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-xs shrink-0 font-bold mt-0.5">
                    !
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {risk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Immediate Operational Response Checklist */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-slate-800/80 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Immediate Response Action Plan
            </div>
            <ul className="space-y-3">
              {immediateActions.map((action, index) => (
                <li key={index} className="flex items-start gap-3 p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs shrink-0 font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {action}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Required Emergency Response Units */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base border-b border-slate-800/80 pb-3">
              <Truck className="w-5 h-5 text-cyan-400" />
              Required Emergency Response Units
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {resources.map((resource, index) => (
                <div key={index} className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  {resource}
                </div>
              ))}
            </div>
          </div>

          <SafetyDisclaimer />

        </div>

      </div>

    </div>
  );
}
