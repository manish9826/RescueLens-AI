import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Activity, Zap, ShieldCheck, ArrowRight, 
  AlertTriangle, Sparkles, MapPin, Crosshair, Cpu,
  Car, Flame, HeartPulse, Droplets, Shield, Monitor
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [threshold]);
  
  return [ref, isVisible];
};

const AnimatedSection = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ImageWithFallback = ({ src, alt, className = "w-full h-full" }) => {
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[#030712] flex items-center justify-center ${className}`}>
      {!error ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 text-center border border-slate-800">
          <ShieldAlert className="w-6 h-6 text-slate-600 mb-2" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-300 font-sans overflow-hidden">
      
      {/* ========================================== */}
      {/* CUSTOM CSS FOR BRACKETS & GLOWS              */}
      {/* ========================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        .hud-brackets {
          position: relative;
        }
        .hud-brackets::before, .hud-brackets::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          border-color: rgba(6, 182, 212, 0.8);
          border-style: solid;
        }
        .hud-brackets::before {
          top: -2px; left: -2px;
          border-width: 2px 0 0 2px;
        }
        .hud-brackets::after {
          bottom: -2px; right: -2px;
          border-width: 0 2px 2px 0;
        }
        .hud-brackets-inner::before, .hud-brackets-inner::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          border-color: rgba(6, 182, 212, 0.8);
          border-style: solid;
        }
        .hud-brackets-inner::before {
          top: -2px; right: -2px;
          border-width: 2px 2px 0 0;
        }
        .hud-brackets-inner::after {
          bottom: -2px; left: -2px;
          border-width: 0 0 2px 2px;
        }
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
      `}} />

      {/* ========================================== */}
      {/* HERO SECTION                                 */}
      {/* ========================================== */}
      <section className="relative w-full h-[500px] border-b border-cyan-900/30">
        
        {/* Background Image (Right Aligned) */}
        <div className="absolute inset-0 z-0 flex justify-end">
          <div className="w-full lg:w-3/4 h-full relative">
            <img 
              src="/assets/emergency/hero.jpg" 
              alt="Emergency Response" 
              className="w-full h-full object-cover opacity-80 animate-[slow-zoom_20s_ease-in-out_infinite]"
            />
            {/* Fade from dark to transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent" />
          </div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8">
            
            {/* Left Content */}
            <div className={`space-y-6 max-w-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                AI-Powered Emergency Response<br />
                When <span className="text-cyan-400">Every Second Matters</span>
              </h1>
              
              <p className="text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed">
                RescueLens AI uses Gemini to analyze emergency situations, 
                provide instant guidance and connect you with verified help.
              </p>
              
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Sparkles className="w-4 h-4" /> GEMINI POWERED
                </div>
                <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/50 bg-blue-950/30 text-blue-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <Cpu className="w-4 h-4" /> AI EMERGENCY INTELLIGENCE
                </div>
              </div>
            </div>

            {/* Right HUD Element */}
            <div className={`hidden lg:flex justify-end items-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} animate-[float_6s_ease-in-out_infinite]`}>
              <div className="hud-brackets hud-brackets-inner p-[1px] bg-cyan-500/20 rounded-lg">
                <div className="bg-[#030712]/80 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 w-[320px] shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  
                  <div className="flex items-center gap-3 mb-6 bg-red-950/40 border border-red-500/30 p-3 rounded-md">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span className="text-red-400 font-mono font-bold tracking-widest text-sm">INCIDENT DETECTED</span>
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> SEVERITY:
                      </div>
                      <span className="text-red-400 font-bold">HIGH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> PRIORITY:
                      </div>
                      <span className="text-white font-bold">92/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> CONFIDENCE:
                      </div>
                      <span className="text-white font-bold">96%</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SCENARIOS SECTION                            */}
      {/* ========================================== */}
      <section className="w-full max-w-[1600px] mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Emergency Scenarios</h2>
              <p className="text-slate-400 text-sm">Select a scenario to see how RescueLens AI can help in different emergency situations.</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500 tracking-wider">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Smarter Analysis</span>
            <span className="w-px h-3 bg-slate-700" />
            <span>Faster Response</span>
            <span className="w-px h-3 bg-slate-700" />
            <span>Safer Communities</span>
          </div>
        </div>

        {/* TOP ROW: 2 LARGE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Road Accident */}
          <AnimatedSection delay={100}>
            <Link to="/report" className="group relative rounded-2xl border border-cyan-900 hover:border-cyan-500/50 bg-[#060b14] overflow-hidden h-[380px] flex flex-col transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 z-0 h-[70%]">
              <ImageWithFallback src="/assets/emergency/road-accident.jpg" alt="Road Accident" />
              <div className="absolute inset-x-0 h-1 bg-cyan-400/60 shadow-[0_0_15px_#22d3ee] pointer-events-none hidden group-hover:block animate-[scan-line_2s_linear_infinite]" />
            </div>
            
            {/* Top HUDs */}
            <div className="absolute top-4 inset-x-4 flex justify-between z-20 pointer-events-none">
              <div className="bg-[#030712]/80 backdrop-blur border border-cyan-500/30 px-3 py-1.5 rounded flex items-center gap-2 animate-[float_5s_ease-in-out_infinite]">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest">INCIDENT SCANNER</span>
              </div>
              <div className="bg-[#030712]/90 backdrop-blur border border-slate-700/50 p-3 rounded-lg flex flex-col gap-2 font-mono text-[10px] animate-[float_7s_ease-in-out_infinite]">
                <div className="flex items-center gap-2 text-cyan-400 tracking-widest mb-1"><Cpu className="w-3 h-3" /> AI ANALYSIS</div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> SEVERITY: <span className="text-red-400 ml-auto">HIGH</span></div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PRIORITY: <span className="text-white ml-auto">92/100</span></div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CONFIDENCE: <span className="text-white ml-auto">96%</span></div>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-[#060b14] via-[#060b14] to-transparent flex items-end justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-red-600 border-2 border-[#060b14] flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Road Accident</h3>
                  <p className="text-slate-400 text-sm max-w-sm">Detect collision risks and generate immediate response guidance.</p>
                </div>
              </div>
              <div className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full flex items-center gap-2 transition-transform group-hover:scale-105 shrink-0">
                Run Scenario <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          </AnimatedSection>

          {/* Card 2: Structure Fire */}
          <AnimatedSection delay={200}>
            <Link to="/report" className="group relative rounded-2xl border border-red-900/50 hover:border-red-500/50 bg-[#060b14] overflow-hidden h-[380px] flex flex-col transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]">
            <div className="absolute inset-0 z-0 h-[70%]">
              <ImageWithFallback src="/assets/emergency/structure-fire.jpg" alt="Structure Fire" />
              <div className="absolute inset-x-0 h-1 bg-cyan-400/60 shadow-[0_0_15px_#22d3ee] pointer-events-none hidden group-hover:block animate-[scan-line_2s_linear_infinite]" />
            </div>
            
            {/* Top HUDs */}
            <div className="absolute top-4 inset-x-4 flex justify-between z-20 pointer-events-none">
              <div className="bg-[#030712]/80 backdrop-blur border border-cyan-500/30 px-3 py-1.5 rounded flex items-center gap-2 animate-[float_5s_ease-in-out_infinite]">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest">INCIDENT SCANNER</span>
              </div>
              <div className="bg-[#030712]/90 backdrop-blur border border-slate-700/50 p-3 rounded-lg flex flex-col gap-2 font-mono text-[10px] animate-[float_7s_ease-in-out_infinite]">
                <div className="flex items-center gap-2 text-cyan-400 tracking-widest mb-1"><Cpu className="w-3 h-3" /> AI ANALYSIS</div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> SEVERITY: <span className="text-red-500 ml-auto font-bold">CRITICAL</span></div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PRIORITY: <span className="text-white ml-auto">98/100</span></div>
                <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> CONFIDENCE: <span className="text-white ml-auto">94%</span></div>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-auto p-6 bg-gradient-to-t from-[#060b14] via-[#060b14] to-transparent flex items-end justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-red-600 border-2 border-[#060b14] flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Structure Fire</h3>
                  <p className="text-slate-400 text-sm max-w-sm">Detect fire hazards, assess risk and provide step-by-step emergency guidance.</p>
                </div>
              </div>
              <div className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full flex items-center gap-2 transition-transform group-hover:scale-105 shrink-0">
                Run Scenario <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          </AnimatedSection>

        </div>

        {/* BOTTOM ROW: 6 SMALL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {[
            { title: "Medical Emergency", icon: HeartPulse, color: "bg-red-500", img: "/assets/emergency/medical-emergency.jpg", desc: "Get instant medical guidance and connect with ambulance services." },
            { title: "Flood", icon: Droplets, color: "bg-blue-500", img: "/assets/emergency/flood.jpg", desc: "Stay safe, get evacuation advice and find nearby shelters." },
            { title: "Electrical Hazard", icon: Zap, color: "bg-blue-600", img: "/assets/emergency/electrical-hazard.jpg", desc: "Detect electrical risks and get safety instructions." },
            { title: "Police / Safety", icon: ShieldCheck, color: "bg-blue-500", img: "/assets/emergency/police-safety.jpg", desc: "Get help for security issues and find nearby police stations." },
            { title: "Women & Child Safety", icon: Shield, color: "bg-red-500", img: "/assets/emergency/women-child-safety.jpg", desc: "Access immediate support and trusted resources." },
            { title: "Cyber Emergency", icon: Monitor, color: "bg-blue-600", img: "/assets/emergency/cyber-emergency.jpg", desc: "Get guidance on cyber threats, fraud and online safety." }
          ].map((item, idx) => (
            <AnimatedSection key={idx} delay={100 + (idx * 50)} className="h-full">
              <Link to="/report" className="group relative rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-[#091120] overflow-hidden flex flex-col h-[280px] transition-all duration-300 shadow-md hover:shadow-cyan-900/20">
              
              <div className="h-[120px] relative w-full shrink-0">
                <ImageWithFallback src={item.img} alt={item.title} />
              </div>

              <div className="flex flex-col flex-1 px-4 pb-4 pt-1 items-center text-center">
                {/* Overlapping Icon */}
                <div className={`w-10 h-10 rounded-full ${item.color} border-2 border-[#091120] flex items-center justify-center -mt-6 mb-2 z-10 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                
                <h4 className="text-[15px] font-bold text-white mb-2 leading-tight">{item.title}</h4>
                <p className="text-slate-400 text-xs mb-auto line-clamp-3 leading-relaxed">{item.desc}</p>
                
                <div className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/30 group-hover:border-transparent text-cyan-400 group-hover:text-white text-xs font-bold rounded-full flex items-center justify-center gap-2 transition-all">
                  Run Scenario <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
            </AnimatedSection>
          ))}
          
        </div>

      </section>

      <SafetyDisclaimer />
    </div>
  );
}
