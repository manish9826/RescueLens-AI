import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { AlertOctagon, Phone, CheckCircle, XCircle, AlertTriangle, Volume2, Square } from 'lucide-react';
import SecureLiveLocation from './SecureLiveLocation';
import GeneratedIncidentReport from './GeneratedIncidentReport';

export default function AnalysisResult({ result, image, onDispatch, onReset }) {
  const { t, language } = useTranslation();
  const data = result.data;
  const [helpline, setHelpline] = useState('112');
  
  const [location, setLocation] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [instructionsLang, setInstructionsLang] = useState('en');

  const getHindiAction = (action) => {
    const a = (action || '').toLowerCase();
    if (a.includes('safe location') || a.includes('move to')) return 'यदि संभव हो तो तुरंत सुरक्षित स्थान पर जाएं।';
    if (a.includes('emergency services') || a.includes('call') || a.includes('seriously injured')) return 'यदि कोई व्यक्ति गंभीर रूप से घायल है तो 112 आपातकालीन सेवाओं को तुरंत कॉल करें।';
    if (a.includes('unnecessary movement') || a.includes('injured')) return 'घायल व्यक्ति को अनावश्यक रूप से बिल्कुल न हिलाएं।';
    if (a.includes('operator') || a.includes('instructions') || a.includes('follow')) return 'आपातकालीन ऑपरेटर द्वारा दिए गए निर्देशों का ध्यानपूर्वक पालन करें।';
    if (a.includes('evacuate') || a.includes('open ground')) return 'तुरंत खुले और सुरक्षित मैदान में खाली करें।';
    if (a.includes('smoke') || a.includes('low')) return 'धुएं से बचने के लिए नीचे झुककर बाहर निकलें।';
    if (a.includes('flood') || a.includes('higher ground') || a.includes('water')) return 'बाढ़ के पानी से दूर किसी ऊंचे सुरक्षित स्थान पर जाएं।';
    if (a.includes('distance') || a.includes('perimeter')) return 'खतरे के क्षेत्र से सुरक्षित दूरी बनाए रखें।';
    return action;
  };

  const handleReadInstructionsAloud = (lang = 'en') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const actions = Array.isArray(data.immediateActions) && data.immediateActions.length > 0
      ? data.immediateActions
      : ['Move to a safe location if possible.', 'Call emergency services if someone is seriously injured.', 'Avoid unnecessary movement of injured people.', 'Follow emergency operator instructions.'];

    let textToRead = '';
    const speechLang = lang === 'hi' ? 'hi-IN' : 'en-US';

    if (lang === 'hi') {
      const hindiSteps = actions.map((act, i) => `चरण ${i + 1}: ${getHindiAction(act)}`).join(' ');
      textToRead = `आपातकालीन सुरक्षा निर्देश: ${hindiSteps} अनुशंसित कार्रवाई: आपातकालीन सहायता के लिए ${helpline} पर कॉल करें।`;
    } else {
      const formattedActions = actions.map((act, i) => `Step ${i + 1}: ${act}`).join('. ');
      textToRead = `Emergency instructions: ${formattedActions}. Recommended action: Contact Unified Emergency Response at ${helpline}.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLang;
    utterance.rate = 0.95;

    if (speechLang === 'hi-IN') {
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch verified helpline
    fetch(`/api/helpline?category=${data.emergencyCategory || 'OTHER'}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setHelpline(resData.helpline);
        }
      })
      .catch(err => console.error('Failed to fetch helpline:', err));
  }, [data.emergencyCategory]);

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'text-red-400 border-red-500 bg-red-950/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]';
      case 'HIGH': return 'text-orange-400 border-orange-500 bg-orange-950/40 shadow-[0_0_30px_rgba(249,115,22,0.15)]';
      case 'MEDIUM': return 'text-amber-400 border-amber-500 bg-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.15)]';
      case 'LOW': return 'text-cyan-400 border-cyan-500 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]';
      default: return 'text-slate-400 border-slate-600 bg-slate-900/60 shadow-lg';
    }
  };

  const getSafetyStatusLabel = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'Possible Critical Emergency Detected';
      case 'HIGH': return 'High Priority Emergency Detected';
      case 'MEDIUM': return 'Possible Emergency — Verify Situation';
      case 'LOW': return 'Scene Uncertain';
      default: return 'Possible Emergency — Verify Situation';
    }
  };

  const getConfidenceText = (conf, sev) => {
    if (sev === 'LOW' || conf < 60) return "Scene Uncertain: RescueLens could not reliably identify a high-risk emergency.";
    if (sev === 'MEDIUM' || conf < 80) return "Possible Emergency — Verify Situation before taking field action.";
    if (sev === 'HIGH') return "High Priority Emergency Detected based on visible hazards.";
    return "Possible Critical Emergency Detected with immediate safety implications.";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Urgent Alert */}
      <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-xl text-red-200 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        {t('disclaimer2')}
      </div>

      {/* Dedicated Rescue Mode Quick Switch Banner for High/Critical */}
      {(data.severity === 'HIGH' || data.severity === 'CRITICAL') && (
        <div className="bg-gradient-to-r from-red-950/90 via-[#0d172e] to-slate-900 border-2 border-red-500 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-red-950/40">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="text-3xl animate-bounce">🚨</span>
            <div>
              <div className="text-red-400 font-black text-xs uppercase tracking-wider">CRITICAL INCIDENT PROTOCOL</div>
              <div className="text-white font-black text-lg">Dedicated Rescue Mode Active</div>
              <div className="text-slate-300 text-xs">Access immediate action checklist, hazard avoidance, and one-touch emergency call</div>
            </div>
          </div>
          <Link
            to="/rescue-mode"
            id="result-enter-rescue-mode-button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wide shadow-lg shadow-red-600/30 transition-transform active:scale-95 text-center"
          >
            {t('enterRescueMode')}
          </Link>
        </div>
      )}

      {/* Main Alert Card */}
      <div className={`border-[1.5px] rounded-3xl p-6 md:p-8 ${getSeverityColor(data.severity)} transition-all duration-300 relative overflow-hidden group`}>
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-white/10 transition-colors" />
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 tracking-tight">
              <AlertOctagon className="w-10 h-10 flex-shrink-0 animate-pulse" />
              {getSafetyStatusLabel(data.severity)}
            </h2>
            <div className="text-lg font-bold tracking-wide uppercase">INCIDENT: <span className="text-white ml-2">{data.incidentType}</span></div>
            <p className="text-opacity-90 leading-relaxed font-medium">{getConfidenceText(data.confidence, data.severity)}</p>
            <p className="text-sm italic opacity-80 border-l-2 border-current pl-3">{data.summary}</p>
            
            <div className="flex flex-wrap gap-3 pt-3">
              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-white/10">
                Severity <span className="text-white ml-2">{data.severity}</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-white/10">
                Confidence <span className="text-white ml-2">{data.confidence}%</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-white/10">
                Priority <span className="text-white ml-2">{data.priorityScore}/100</span>
              </div>
            </div>
          </div>
          {image && (
            <div className="relative shrink-0">
              <img src={image} alt="Emergency Scene" className="w-full md:w-56 h-56 object-cover rounded-2xl border-2 border-current/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)]" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO THIS NOW */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-500" />
              🚨 {instructionsLang === 'hi' ? 'अभी ये करें (DO THIS NOW)' : 'DO THIS NOW'}
            </h3>
            <div className="bg-slate-800 border border-slate-700 p-1 rounded-xl flex items-center gap-1 self-start sm:self-auto">
              <button
                onClick={() => setInstructionsLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  instructionsLang === 'en' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setInstructionsLang('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  instructionsLang === 'hi' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Voice Output Buttons: English & Hindi */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-slate-300">🔊 निर्देश सुनें (Read Aloud)</span>
            </div>
            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <>
                  <button
                    onClick={() => handleReadInstructionsAloud('en')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow active:scale-95"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleReadInstructionsAloud('hi')}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow active:scale-95"
                  >
                    हिंदी में सुनें
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStopSpeaking}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow active:scale-95 flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop / रोकें</span>
                </button>
              )}
            </div>
          </div>

          <ul className="space-y-3">
            {data.immediateActions?.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-200">
                <span className="font-bold text-green-500 mt-0.5">{i+1}.</span>
                <span>{instructionsLang === 'hi' ? getHindiAction(action) : action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AVOID */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <XCircle className="w-7 h-7 text-red-500" />
            ⚠️ AVOID
          </h3>
          <ul className="space-y-3">
            {data.doNotDo?.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="text-red-500 mt-1">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Helpline Contact */}
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">📞 RECOMMENDED EMERGENCY CONTACT</span>
          <div className="text-5xl md:text-6xl font-black text-white">{helpline}</div>
          <p className="text-sm text-slate-400">Unified Emergency Response</p>
          {data.severity === 'CRITICAL' && (
            <p className="text-red-400 font-semibold animate-pulse text-xs mt-1">Direct official emergency responder line</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a 
            href={`tel:${helpline}`}
            id="result-call-now-button"
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all active:scale-95 text-center cursor-pointer"
          >
            <Phone className="w-5 h-5" /> CALL NOW
          </a>
          <button 
            onClick={() => { navigator.clipboard.writeText(helpline); alert('Number copied!'); }}
            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm flex items-center justify-center transition-colors active:scale-95"
          >
            Copy
          </button>
        </div>
      </div>

      {/* SECURE LIVE LOCATION + NEARBY HELP */}
      <SecureLiveLocation 
        onLocationUpdate={(loc) => setLocation(loc)} 
        defaultLocation={location}
      />

      {/* 📄 OFFICIAL INCIDENT REPORT */}
      <GeneratedIncidentReport 
        data={data}
        image={image}
        location={location}
      />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button onClick={onReset} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          Start New Analysis
        </button>
        <button onClick={() => onDispatch({ ...data, location: location ? `${location.latitude}, ${location.longitude}` : 'Unknown (Not Shared)' }, image)} className="px-6 py-3 rounded-xl font-bold bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-600/20 transition-colors">
          Send to Command Center
        </button>
      </div>

      {/* Safety Disclaimer */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          RescueLens AI provides AI-assisted decision support only. It does not replace emergency responders, medical professionals, police, or official emergency instructions.
        </p>
        <p className="text-amber-400/90 font-bold">
          If someone is in immediate danger, contact the appropriate emergency service directly.
        </p>
      </div>
    </div>
  );
}
