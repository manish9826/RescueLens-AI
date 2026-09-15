import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Car, 
  Droplets, 
  Home, 
  Zap, 
  HeartPulse, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  GraduationCap, 
  Plane, 
  Loader2, 
  RefreshCw,
  Clock,
  ListChecks,
  PackageCheck
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const PREPAREDNESS_CATEGORIES = [
  {
    id: 'fire',
    title: 'Fire Safety',
    icon: Flame,
    color: 'border-red-500/50 bg-red-950/30 text-red-400',
    checkItems: [
      { text: 'Install smoke alarms on every level of home and inside sleeping areas.', detail: 'Test monthly; replace batteries once a year.' },
      { text: 'Keep multi-class ABC fire extinguisher in kitchen and near heat sources.', detail: 'Know the PASS method: Pull, Aim, Squeeze, Sweep.' },
      { text: 'Plan two exit paths from every room and pick a meeting spot outside.', detail: 'Practice whole-family fire drills twice a year.' },
      { text: 'Never throw water on grease or electrical fires.', detail: 'Smother cooking pan flames with a metal lid and turn off the burner.' }
    ]
  },
  {
    id: 'road',
    title: 'Road Safety',
    icon: Car,
    color: 'border-orange-500/50 bg-orange-950/30 text-orange-400',
    checkItems: [
      { text: 'Carry high-visibility reflective vests and a roadside warning triangle.', detail: 'Place triangle 50m behind broken-down vehicle.' },
      { text: 'Mount seatbelt cutter and tempered glass breaker within reach of driver.', detail: 'Crucial if vehicle enters canal or electrical system shorts.' },
      { text: 'Maintain properly inflated spare tire, working jack, and lug wrench.', detail: 'Inspect spare tire pressure every 3 months.' },
      { text: 'Check weather & route warnings before driving through severe storms.', detail: 'Turn around, don\'t drown: never drive into moving water.' }
    ]
  },
  {
    id: 'flood',
    title: 'Flood Preparedness',
    icon: Droplets,
    color: 'border-blue-500/50 bg-blue-950/30 text-blue-400',
    checkItems: [
      { text: 'Know your local flood zone and identify highest accessible elevation.', detail: 'Plan multiple uphill evacuation paths.' },
      { text: 'Keep waterproof emergency go-bag with drinking water and medications.', detail: '3 liters of water per person per day for at least 72 hours.' },
      { text: 'Shut off electricity at the main circuit breaker before evacuating flooded house.', detail: 'Never walk or wade through water near power outlets.' },
      { text: 'Avoid moving floodwaters: 15 cm of rushing water can knock down an adult.', detail: '60 cm of water can float most SUVs and vehicles.' }
    ]
  },
  {
    id: 'home',
    title: 'Home Emergency',
    icon: Home,
    color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400',
    checkItems: [
      { text: 'Clearly tag main shutoffs for water, electricity, and LPG gas cylinder.', detail: 'Ensure all family members know how to turn off gas valve.' },
      { text: 'Secure tall bookcases, water heaters, and heavy shelving to wall studs.', detail: 'Prevents crush injuries during seismic tremors.' },
      { text: 'Maintain a 3-day reserve of non-perishable canned foods and a manual opener.', detail: 'Rotate food every 6 months.' },
      { text: 'Keep sturdy work gloves, dust masks, and safety goggles in utility closet.', detail: 'Protects during broken glass or post-hazard debris clearing.' }
    ]
  },
  {
    id: 'electrical',
    title: 'Electrical Safety',
    icon: Zap,
    color: 'border-yellow-500/50 bg-yellow-950/30 text-yellow-400',
    checkItems: [
      { text: 'Never touch downed power lines or anything touching them.', detail: 'Assume all downed lines are live; maintain minimum 10m perimeter.' },
      { text: 'Replace frayed power cords and avoid multi-plug socket overloading.', detail: 'Overheating extension cords cause 13% of domestic structure fires.' },
      { text: 'Use GFCI (Ground Fault Circuit Interrupter) outlets in kitchen and bathrooms.', detail: 'Instantly cuts power if moisture enters circuit.' },
      { text: 'Unplug sensitive electronics and appliances before major electrical storms.', detail: 'Prevents lightning surge damage.' }
    ]
  },
  {
    id: 'firstaid',
    title: 'First Aid Basics',
    icon: HeartPulse,
    color: 'border-rose-500/50 bg-rose-950/30 text-rose-400',
    checkItems: [
      { text: 'Control severe external bleeding: Apply firm direct pressure with clean cloth.', detail: 'Do not remove cloth if soaked; add more layers and maintain pressure.' },
      { text: 'Treat thermal burns: Cool with clean running water for 10-20 minutes.', detail: 'Never apply ice, butter, or oil to a burn.' },
      { text: 'Suspected spinal or neck injury: Keep patient completely motionless.', detail: 'Do not move them unless immediate fire/explosion danger exists.' },
      { text: 'Hands-Only CPR: Push hard and fast in center of chest (100-120 bpm).', detail: 'Continue until paramedics arrive or AED is ready.' }
    ]
  }
];

export default function BePrepared() {
  const { t, language } = useTranslation();

  // Checked state for items (persisted locally)
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rescuelens_prepared_checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Personalized Checklist context selection
  const [selectedContext, setSelectedContext] = useState('Home');
  const [personalizedData, setPersonalizedData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const toggleCheck = (id) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('rescuelens_prepared_checks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save checks:', e);
      }
      return updated;
    });
  };

  // Generate personalized checklist using Gemini AI with fallback
  const handleGeneratePersonalized = async (contextName) => {
    const ctx = contextName || selectedContext;
    setSelectedContext(ctx);
    setIsGenerating(true);
    setGenerateError('');

    try {
      const res = await fetch('/api/preparedness/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextType: ctx, language })
      });

      const data = await res.json();
      if (data.success && data.checklist) {
        setPersonalizedData(data.checklist);
      } else {
        throw new Error(data.error || 'Failed to generate tailored checklist.');
      }
    } catch (err) {
      console.warn('Personalized generation error:', err);
      setGenerateError('Could not connect to Gemini service. Showing safety guidelines.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load default context on mount
  useEffect(() => {
    handleGeneratePersonalized('Home');
  }, []);

  const CONTEXT_OPTIONS = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'College', label: 'College', icon: GraduationCap },
    { id: 'Office', label: 'Office', icon: Building2 },
    { id: 'Vehicle', label: 'Vehicle', icon: Car },
    { id: 'Travel', label: 'Travel', icon: Plane }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 text-left">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/80 via-[#0B1426] to-[#080D18] border-2 border-cyan-500/40 p-8 shadow-2xl">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <span>🧠 BE PREPARED</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Emergency Preparedness & Life Safety Checklists
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Safety-first guidelines for common hazards, plus Gemini-calibrated checklists for your specific setting.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PERSONALIZED CHECKLIST (Gemini Powered)                                 */}
      {/* ========================================================================= */}
      <section className="bg-[#091122] border-2 border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>PERSONALIZED CHECKLIST</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Tailored Setting Readiness
            </h2>
            <p className="text-xs text-slate-400">
              Select your current environment to generate tailored emergency protocols. No personal information is collected.
            </p>
          </div>

          {/* Setting Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {CONTEXT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedContext === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleGeneratePersonalized(opt.id)}
                  id={`context-btn-${opt.id.toLowerCase()}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-sm text-cyan-300 font-bold">
              Generating tailored preparedness protocol for {selectedContext}...
            </span>
          </div>
        )}

        {/* Personalized Result */}
        {!isGenerating && personalizedData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
              <h3 className="text-lg font-black text-white">{personalizedData.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{personalizedData.summary}</p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-cyan-400" />
                Actionable Checklist Steps:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {personalizedData.checklistItems?.map((step, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-white leading-snug">
                        {idx + 1}. {step.item}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${
                        step.priority === 'HIGH' 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                      }`}>
                        {step.priority}
                      </span>
                    </div>
                    {step.why && (
                      <p className="text-xs text-slate-400 leading-relaxed">{step.why}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Kit & Immediate Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Kit Items */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4" /> Recommended Kit Items
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {personalizedData.kitItems?.map((kit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{kit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate Action */}
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Immediate Crisis Action
                  </span>
                  <p className="text-xs text-slate-200 mt-2 leading-relaxed font-semibold">
                    {personalizedData.emergencyAction}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-400">
                  Unified Helpline: <strong className="text-white font-black">112</strong>
                </div>
              </div>
            </div>

          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 2. CORE EMERGENCY SAFETY CHECKLISTS (6 CATEGORIES)                        */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Core Hazard Safety Checklists
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap checkmarks to record completed safety measures. Status persists locally on this device.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREPAREDNESS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-xl ${cat.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center text-xl shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-3 pt-2">
                    {cat.checkItems.map((ci, i) => {
                      const itemKey = `${cat.id}-${i}`;
                      const isChecked = Boolean(checkedItems[itemKey]);

                      return (
                        <div 
                          key={i}
                          onClick={() => toggleCheck(itemKey)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isChecked
                              ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                              : 'bg-black/30 border-white/10 hover:border-white/20 text-slate-200'
                          }`}
                        >
                          <button 
                            type="button"
                            className="mt-0.5 shrink-0"
                            aria-label={isChecked ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                          <div className="space-y-0.5">
                            <span className={`text-xs font-bold leading-tight block ${isChecked ? 'line-through opacity-80' : ''}`}>
                              {ci.text}
                            </span>
                            <span className="text-[10px] opacity-75 block">
                              {ci.detail}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-[10px] opacity-70 flex items-center justify-between">
                  <span>Life Safety Standard</span>
                  <span>Dial 112 for rescue</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
