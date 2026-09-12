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
  Layers,
  Sparkles
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function LandingPage({ setActiveTab, toggleCommanderChat }) {
  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#111827] to-[#0B0F19] border border-slate-800 p-8 sm:p-14 shadow-2xl">
        
        {/* Background Ambient Glow & Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            NEXT-GEN EMERGENCY INTELLIGENCE PLATFORM
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            See the emergency.<br />
            <span className="bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              Understand the risk. Act faster.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            RescueLens AI leverages Google Gemini multimodal vision intelligence to analyze live crisis photos, detect hidden structural hazards, calculate priority severity scores, and generate instant responder recommendations in seconds.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('report')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-red-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-5 h-5" />
              Report Emergency Now
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('command')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Activity className="w-5 h-5 text-blue-400" />
              Command Dashboard
            </button>
          </div>

          {/* Key Stat Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 mt-8 text-left">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Response Speed</div>
              <div className="text-xl font-bold text-cyan-400 mt-1 flex items-center gap-1">
                <Zap className="w-4 h-4" /> &lt; 3 Seconds
              </div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Core AI Model</div>
              <div className="text-xl font-bold text-amber-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Gemini 2.5
              </div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Output Schema</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">Structured JSON</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-mono">Decision Support</div>
              <div className="text-xl font-bold text-red-400 mt-1">Multi-Agency</div>
            </div>
          </div>

        </div>

      </section>

      {/* Safety Advisory Banner */}
      <SafetyDisclaimer />

      {/* How RescueLens AI Works Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI-Powered Crisis Intelligence Workflow
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From raw incident photo capture to strategic resource allocation in four automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card p-6 rounded-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg font-mono">
              01
            </div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Capture Scene
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload any emergency scene photo (floods, fires, crashes, structural collapses) with optional situational notes.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-6 rounded-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg font-mono">
              02
            </div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Gemini Vision Scan
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Google Gemini multimodal vision extracts visual telemetry, identifying subtle physical hazards, fire radiation, and water levels.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-6 rounded-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-lg font-mono">
              03
            </div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-red-400" />
              Structured Triage
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receives instant structured JSON with severity tier, priority score (0-100), immediate action checklists, and required units.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card p-6 rounded-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
              04
            </div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              Commander AI
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Query the Gemini-powered Emergency Commander Assistant to resolve resource conflicts and determine priority dispatches.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Built for High-Stakes Command Operations</h3>
            <p className="text-xs sm:text-sm text-slate-400">Everything needed to transform chaotic photos into actionable tactical briefings.</p>
          </div>
          <button
            onClick={toggleCommanderChat}
            className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Try Emergency Commander
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-base">Hazard Detection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically flags high-risk hazards such as gas leakage, submerged electric lines, compromised load-bearing walls, and traffic blocks.
            </p>
          </div>

          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-base">Priority Scoring</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic ranking scale (0-100) weighing threat severity, casualty likelihood, and risk propagation speed to rank incident queues.
            </p>
          </div>

          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-base">Live Command Dashboard</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consolidates real-time Gemini analyzed incident telemetry alongside demo crisis streams for complete situational visibility.
            </p>
          </div>
        </div>

      </section>

      {/* CTA Footer Callout */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-blue-950/40 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to test an emergency photo?</h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
          Upload an emergency scene image or choose from preset crisis samples to run immediate Gemini AI intelligence analysis.
        </p>
        <button
          onClick={() => setActiveTab('report')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          Launch Incident Scanner
        </button>
      </div>

    </div>
  );
}
