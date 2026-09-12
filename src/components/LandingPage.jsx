import React from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Activity, 
  Zap, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  AlertTriangle, 
  FileSearch, 
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Building2,
  Radio,
  FileCheck
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function LandingPage({ setActiveTab, toggleCommanderChat }) {
  return (
    <div className="space-y-16 py-4">
      
      {/* Impressive Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0B0F19] to-[#070A12] border border-slate-800 p-8 sm:p-16 shadow-2xl">
        
        {/* Background Ambient Glow & Cyber Grid */}
        <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Trust & Feature Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-lg shadow-cyan-950/50">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Gemini AI Powered
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold shadow-lg shadow-red-950/50">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              Real-Time Risk Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold shadow-lg shadow-blue-950/50">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Emergency Intelligence
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            See the Emergency.<br />
            <span className="bg-gradient-to-r from-red-500 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              Understand the Risk. Act Faster.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            RescueLens AI leverages Google Gemini multimodal vision intelligence to instantly analyze crisis scene photos, identify structural hazards, rank severity priorities (0-100), and recommend targeted responder dispatches in seconds.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('report')}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-5 h-5" />
              Report Emergency
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('command')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg"
            >
              <Activity className="w-5 h-5 text-blue-400" />
              Command Center
            </button>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 mt-8 text-left">
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Analysis Speed</div>
              <div className="text-xl font-extrabold text-cyan-400 mt-1 flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-cyan-400" /> &lt; 3 Seconds
              </div>
            </div>
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">AI Model Engine</div>
              <div className="text-xl font-extrabold text-amber-400 mt-1 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400" /> Gemini 3.6
              </div>
            </div>
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Output Format</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1 font-mono">Structured JSON</div>
            </div>
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">Target Domain</div>
              <div className="text-xl font-extrabold text-red-400 mt-1 font-mono">First Response</div>
            </div>
          </div>

        </div>

      </section>

      {/* Safety Advisory Banner */}
      <SafetyDisclaimer />

      {/* Visual Analysis Workflow: IMAGE → GEMINI AI → RISK ANALYSIS → RESPONSE */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            END-TO-END SITUATIONAL TELEMETRY
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            AI-Driven Crisis Intelligence Pipeline
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Transforming unstructured emergency scene photos into operational decision-support intelligence.
          </p>
        </div>

        {/* 4-Step Interactive Visual Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1: IMAGE */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 hover:border-cyan-500/40 relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg font-mono shadow-lg">
              01
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Input Telemetry</div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Image Capture
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              First responder or citizen uploads emergency scene photo with optional situational notes.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Photo Upload
            </div>
          </div>

          {/* Step 2: GEMINI AI */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-cyan-500/30 bg-cyan-950/20 relative group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 flex items-center justify-center font-bold text-lg font-mono shadow-lg shadow-cyan-950/50">
              02
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Core Engine</div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                Gemini Vision
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Multimodal model processes visual pixels, recognizing fire radiation, flood depth, structural cracks, and casualties.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Multimodal Scan
            </div>
          </div>

          {/* Step 3: RISK ANALYSIS */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-amber-500/30 bg-amber-950/10 relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-lg font-mono shadow-lg">
              03
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">Risk Evaluation</div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-amber-400" />
                Hazard Score
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates priority score (0-100), severity rank (`CRITICAL`, `HIGH`), and flags hidden physical hazards.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-amber-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Priority Ranking
            </div>
          </div>

          {/* Step 4: RESPONSE */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-emerald-500/30 bg-emerald-950/10 relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg font-mono shadow-lg">
              04
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Operational Output</div>
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Response Dispatch
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates immediate action checklist, unit resource requirements, and feeds Command Center timeline.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Unit Staging
            </div>
          </div>

        </div>
      </section>

      {/* High-Impact Feature Showcase Grid */}
      <section className="glass-panel border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">COMMAND CENTER CAPABILITIES</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Built for Mission-Critical Operations</h3>
          </div>
          
          <button
            onClick={toggleCommanderChat}
            className="px-5 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Launch Emergency Commander AI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Hazard Detection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated recognition of electrical transformer submergence, toxic cloud plumes, structural load failures, and stranded vehicles.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Priority Score Index</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic ranking scale (0-100) weighing threat severity, life safety impact, and hazard propagation speed to order dispatch queues.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Commander Assistant</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive Gemini decision support chat answering strategic questions such as resource allocation priority and safety perimeter sizing.
            </p>
          </div>
        </div>

      </section>

      {/* Bottom Hero Callout */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
        <h3 className="text-3xl font-extrabold text-white">Test an Emergency Scene Now</h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Upload any crisis image or pick from preset emergency scenarios to generate real-time Gemini AI decision intelligence.
        </p>
        <button
          onClick={() => setActiveTab('report')}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <ShieldAlert className="w-5 h-5" />
          Launch Emergency Scanner
        </button>
      </div>

    </div>
  );
}
