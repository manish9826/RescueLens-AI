import React from 'react';
import { 
  ShieldAlert, 
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
  Check,
  Radio,
  Layers,
  Building2,
  FileText,
  Sliders,
  Cpu
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function LandingPage({ setActiveTab, toggleCommanderChat }) {
  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Full-Width Edge-to-Edge Hero Section */}
      <section className="w-full relative overflow-hidden bg-slate-50 dark:bg-gradient-to-b dark:from-[#090D16] dark:via-[#0E1526] dark:to-[#090D16] border-b border-slate-200 dark:border-slate-800/80 py-12 lg:py-16 transition-colors">
        
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Column (Information & CTAs) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
                AI-Powered Emergency Intelligence
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                See the Emergency.<br />
                <span className="bg-gradient-to-r from-red-600 via-rose-500 to-cyan-600 dark:from-red-500 dark:via-amber-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  Understand the Risk.
                </span><br />
                Act Faster.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                RescueLens AI uses Gemini multimodal intelligence to analyze emergency scenes, identify risks, assess severity, and generate actionable response plans in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('report')}
                  className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Report Emergency
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('command')}
                  className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Open Command Center
                </button>
              </div>

              {/* 3 Benefits Checkmarks */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Gemini AI Powered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Real-Time Risk Analysis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Actionable Response Plans</span>
                </div>
              </div>

            </div>

            {/* Hero Right Column (Emergency Intelligence Panel & Interactive Telemetry Card) */}
            <div className="lg:col-span-5 relative">
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl relative overflow-hidden">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      LIVE SCENE SCANNER
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 text-[10px] font-mono font-bold border border-cyan-300 dark:border-cyan-500/30">
                    GEMINI 3.6 VISION
                  </span>
                </div>

                {/* Simulated Emergency Image Analysis View */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 h-56 sm:h-64 shadow-inner">
                  <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
                    <rect width="600" height="400" fill="#0f172a" />
                    <path d="M0 240 Q 150 200, 300 240 T 600 240 L 600 400 L 0 400 Z" fill="#1e3a8a" />
                    <path d="M0 270 Q 150 250, 300 270 T 600 270 L 600 400 L 0 400 Z" fill="#2563eb" opacity="0.6" />
                    <rect x="200" y="190" width="180" height="75" rx="12" fill="#dc2626" />
                    <circle cx="245" cy="265" r="22" fill="#334155" />
                    <circle cx="335" cy="265" r="22" fill="#334155" />
                  </svg>

                  {/* Scanning sweep line */}
                  <div className="radar-line" />

                  {/* Floating Overlay Badge 1: INCIDENT DETECTED */}
                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/50 text-[11px] font-mono text-red-300 font-bold flex items-center gap-1.5 shadow-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    INCIDENT DETECTED
                  </div>

                  {/* Floating Overlay Badge 2: CONFIDENCE: 96% */}
                  <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/50 text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    CONFIDENCE: 96%
                  </div>

                  {/* Floating Bottom Bar: Telemetry Stats */}
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono flex items-center justify-between text-slate-200 shadow-xl">
                    <span className="text-red-400 font-bold">SEVERITY: HIGH</span>
                    <span className="text-amber-400 font-bold">PRIORITY: 92/100</span>
                  </div>
                </div>

                {/* Pipeline Progression Indicators: Emergency Scene → AI Analysis → Risk Detection → Response */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono text-[10px]">
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    Scene
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-cyan-700 dark:text-cyan-400">
                    AI Scan
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-amber-700 dark:text-amber-400">
                    Risk Assessment
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-emerald-700 dark:text-emerald-400">
                    Response
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Safety Advisory Banner Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <SafetyDisclaimer />
      </section>

      {/* How It Works Section: From Image to Action */}
      <section className="w-full py-12 lg:py-16 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070A12] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
              STREAMLINED OPERATIONAL PIPELINE
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              From Image to Action
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Four steps from visual incident capture to coordinated emergency resource staging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                01
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Upload Scene</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upload an emergency photo along with optional text notes from the incident location.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                02
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Gemini Analysis</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Gemini multimodal vision inspects visual telemetry and evaluates environmental hazards.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                03
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Risk Assessment</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Identify specific physical hazards, severity tier, and urgent priority score (0-100).
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                04
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Response Plan</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generate structured responder checklists and dispatch specialized emergency units.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Section: 3 Professional Feature Cards */}
      <section className="w-full py-12 lg:py-16 bg-slate-50 dark:bg-gradient-to-b dark:from-[#090D16] dark:to-[#070A12] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              CORE SYSTEM CAPABILITIES
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Advanced Decision Intelligence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Empowering first responders and command centers with immediate visual insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-card p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">AI Vision Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Analyze emergency scene photos using Gemini multimodal AI to detect physical threats, water depth, and structural damage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-sm">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Risk Prioritization</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Convert scene analysis into severity tiers and priority scores to automatically order incident queues in the Command Center.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Response Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate structured, step-by-step action plans and list required response units for rapid resource staging.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="w-full py-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to Test Emergency Telemetry?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            Upload an emergency scene image or select a preset crisis scenario to run immediate Gemini AI decision analysis.
          </p>
          <button
            onClick={() => setActiveTab('report')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Launch Incident Scanner
          </button>
        </div>
      </section>

    </div>
  );
}
