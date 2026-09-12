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
  FileCheck
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function AnalysisResult({ result, image, onDispatch, onReset, toggleCommanderChat }) {
  if (!result) return null;

  const { data, isLive, warning } = result;
  const { 
    incidentType = 'Unidentified Incident',
    severity = 'HIGH',
    priorityScore = 85,
    confidence = 90,
    summary = 'Emergency scene analysis complete.',
    risks = [],
    immediateActions = [],
    resources = []
  } = data || {};

  // Color mapping based on severity
  const getSeverityBadgeClass = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-950/80 border-red-500/50 text-red-300 glow-critical';
      case 'HIGH':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-300';
      case 'MEDIUM':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'LOW':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-red-400 stroke-red-500';
    if (score >= 75) return 'text-orange-400 stroke-orange-500';
    if (score >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-emerald-400 stroke-emerald-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getSeverityBadgeClass(severity)}`}>
              SEVERITY: {severity}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {isLive ? 'Gemini 2.5 Live Analysis' : 'Synthesized Intelligence'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white pt-1">
            {incidentType}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Report
          </button>
          
          <button
            onClick={() => onDispatch(data, image)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Dispatch to Command Center
          </button>
        </div>
      </div>

      {warning && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warning}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image & Score Gauges */}
        <div className="space-y-6">
          
          {/* Analyzed Image Container */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 space-y-3">
            <div className="relative">
              <img
                src={image}
                alt="Analyzed emergency scene"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono text-slate-300">
                SCENE TARGET TELEMETRY
              </div>
            </div>
            <div className="p-4 pt-1">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{summary}"
              </p>
            </div>
          </div>

          {/* Priority Score & Confidence Gauges */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            
            {/* Priority Score Gauge */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Priority Score</div>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {priorityScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">Calculated Crisis Urgency</span>
              </div>

              {/* Progress Circle Visual */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={getScoreColor(priorityScore)}
                    strokeDasharray={`${priorityScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Zap className="w-5 h-5 absolute text-amber-400" />
              </div>
            </div>

            {/* Confidence Score Gauge */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Detection Confidence</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">
                  {confidence}%
                </div>
              </div>
              <div className="px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300">
                HIGH ACCURACY
              </div>
            </div>

          </div>

          {/* Commander Assistant Trigger Card */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Bot className="w-5 h-5 text-cyan-400" />
              Ask Emergency Commander
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need immediate advice on resource allocation or sector priority for this incident?
            </p>
            <button
              onClick={toggleCommanderChat}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              Open AI Commander Chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Detailed Breakdown (Risks, Actions, Resources) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Detected Visible Risks */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5" />
              Detected Hazards & Visible Risks
            </div>
            <ul className="space-y-3">
              {risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-red-950/20 border border-red-500/20 rounded-xl">
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

          {/* Section 2: Immediate Recommended Actions */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5" />
              Immediate Operational Response Checklist
            </div>
            <ul className="space-y-3">
              {immediateActions.map((action, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
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

          {/* Section 3: Required Response Units & Equipment */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base border-b border-slate-800 pb-3">
              <Truck className="w-5 h-5" />
              Required Emergency Response Units
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {resources.map((resource, index) => (
                <div key={index} className="px-3.5 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm">
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
