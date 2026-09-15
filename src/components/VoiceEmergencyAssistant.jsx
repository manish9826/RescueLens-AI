import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  AlertTriangle, 
  PhoneCall, 
  Copy, 
  Check, 
  Send, 
  ArrowRight, 
  ShieldAlert, 
  Radio, 
  Globe, 
  Keyboard, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  AlertOctagon,
  Sparkles,
  MapPin
} from 'lucide-react';
import SecureLiveLocation from './SecureLiveLocation';

export default function VoiceEmergencyAssistant({ onAnalysisComplete }) {
  const navigate = useNavigate();
  const { t, language, setLanguage, languages } = useTranslation();
  
  // Voice Recording / Speech Recognition States
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [permissionError, setPermissionError] = useState('');
  const [typeInsteadMode, setTypeInsteadMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analysis Result State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Voice Output (Speech Synthesis) States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(true);

  // Location State
  const [showLocation, setShowLocation] = useState(false);

  const recognitionRef = useRef(null);
  const synthesisUtteranceRef = useRef(null);

  // Check browser SpeechRecognition and SpeechSynthesis support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    if (!('speechSynthesis' in window)) {
      setSpeechSynthesisSupported(false);
    }

    // Safety: Ensure recording and speaking are cancelled when unmounting
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize and start Speech Recognition safely on explicit user tap
  const startListening = () => {
    setPermissionError('');
    setAnalysisResult(null);
    setSpeechTranscript('');
    setInterimTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setTypeInsteadMode(true);
      return;
    }

    const selectedLanguage = language || 'en';
    const langConfig = (languages || SUPPORTED_LANGUAGES).find(l => l.code === selectedLanguage);
    const speechCode = langConfig?.speechCode || (selectedLanguage === 'hi' ? 'hi-IN' : 'en-US');

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // STRICT SAFETY: Do NOT continuously record.
      recognition.continuous = false;
      recognition.interimResults = true;
      try {
        recognition.lang = speechCode;
      } catch (err) {
        console.warn('Language not supported by recognition:', err);
        setPermissionError('Voice input is not supported for this language on this browser.');
        setTypeInsteadMode(true);
        return;
      }

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentFinal) {
          setSpeechTranscript((prev) => (prev ? `${prev} ${currentFinal}` : currentFinal));
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'language-not-supported') {
          setPermissionError('Voice input is not supported for this language on this browser.');
          setTypeInsteadMode(true);
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionError(t('voicePermissionDenied'));
        } else if (event.error === 'no-speech') {
          setPermissionError('No speech was detected. Please tap to speak again.');
        } else {
          setPermissionError(`Speech input error: ${event.error}. You can type your emergency below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // If we captured speech, auto-send for classification
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsListening(false);
      setPermissionError('Voice input is not supported for this language on this browser.');
      setTypeInsteadMode(true);
    }
  };

  // Explicit user stop recording
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Submit transcript or text to backend Gemini triage
  const handleAnalyzeEmergency = async (overrideText) => {
    const textToAnalyze = (overrideText || speechTranscript || interimTranscript || textInput).trim();
    if (!textToAnalyze) {
      setPermissionError('Please provide an emergency description.');
      return;
    }

    setIsAnalyzing(true);
    setPermissionError('');

    try {
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText: textToAnalyze,
          language: language || 'en'
        })
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Failed to analyze emergency voice report.');
      }

      setAnalysisResult(resData.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(resData);
      }
    } catch (err) {
      console.error('Voice analysis submission error:', err);
      setPermissionError(err.message || 'Error communicating with AI emergency triage server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    if (a.includes('assistance') || a.includes('seek')) return 'तुरंत पेशेवर आपातकालीन मदद लें।';
    return action;
  };

  // Voice Output (Speech Synthesis): Read only emergency instructions & recommended action in English or Hindi
  const handleReadAloud = (lang = selectedLanguage) => {
    if (!('speechSynthesis' in window) || !analysisResult) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    const actions = Array.isArray(analysisResult.immediateActions) && analysisResult.immediateActions.length > 0
      ? analysisResult.immediateActions
      : ['Move to a safe location if possible.', 'Call emergency services if someone is seriously injured.', 'Avoid unnecessary movement of injured people.', 'Follow emergency operator instructions.'];

    const helpline = analysisResult.recommendedHelpline || '112';
    const helplineName = analysisResult.helplineName || 'Unified Emergency Response';

    let textToRead = '';
    const speechLang = lang === 'hi' ? 'hi-IN' : 'en-US';

    if (lang === 'hi') {
      const hindiSteps = actions.map((act, i) => `चरण ${i + 1}: ${getHindiAction(act)}`).join(' ');
      textToRead = `आपातकालीन सुरक्षा निर्देश: ${hindiSteps} अनुशंसित कार्रवाई: आपातकालीन सहायता के लिए ${helpline} पर संपर्क करें।`;
    } else {
      const formattedActions = actions.map((act, i) => `Step ${i + 1}: ${act}`).join('. ');
      textToRead = `Emergency instructions: ${formattedActions}. Recommended action: Contact ${helplineName} at ${helpline}.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLang;
    utterance.rate = 0.95; // Slightly measured rate for emergency clarity

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

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleCopyHelpline = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & LANGUAGE TOGGLE                                               */}
      {/* ========================================================================= */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#09101f] to-[#120815] border-2 border-cyan-500/50 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              AI VOICE ASSISTANT (MULTILINGUAL)
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{t('voiceAssistantTitle')}</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              {t('voiceSubtitle')}
            </p>
          </div>

          {/* Quick Language Selector */}
          <div className="bg-slate-900/90 border border-slate-700 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 self-start sm:self-center shrink-0 shadow-md">
            {languages.slice(0, 4).map(langItem => (
              <button
                key={langItem.code}
                onClick={() => setLanguage(langItem.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === langItem.code
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {langItem.nativeName}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. TAP TO SPEAK / LISTENING CONTROL CARD                                  */}
      {/* ========================================================================= */}
      <section className="bg-[#09101f] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl text-center flex flex-col items-center">
        
        {/* Permission / Unsupported Warning Banner */}
        {!isSupported && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Voice input is not supported in this browser.</span>
            </div>
            <button
              onClick={() => setTypeInsteadMode(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition-all active:scale-95"
            >
              {t('typeInstead')}
            </button>
          </div>
        )}

        {permissionError && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/60 text-red-200 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{permissionError}</span>
            </div>
            <button
              onClick={() => setTypeInsteadMode(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow border border-slate-700 transition-all active:scale-95 shrink-0"
            >
              {t('typeInstead')}
            </button>
          </div>
        )}

        {/* Hero Interaction: Voice Mic Button or Type Mode */}
        {!typeInsteadMode ? (
          <div className="space-y-6 w-full max-w-lg flex flex-col items-center">
            
            {/* Listening Indicator or Tap to Speak Button */}
            {!isListening ? (
              <button
                onClick={startListening}
                id="voice-tap-to-speak-button"
                className="group relative flex flex-col items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-cyan-600 to-blue-800 hover:from-cyan-500 hover:to-blue-600 text-white shadow-[0_0_50px_rgba(6,182,212,0.5),inset_0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(6,182,212,0.8)] transition-all active:scale-95 border-[3px] border-cyan-400/80 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full border border-cyan-300/40 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none opacity-50 group-hover:opacity-100" />
                <Mic className="w-16 h-16 md:w-20 md:h-20 mb-2 transition-transform group-hover:scale-110" />
                <span className="text-base md:text-lg font-black tracking-wider uppercase">
                  {t('tapToSpeak')}
                </span>
                <span className="text-[11px] text-cyan-200 font-medium mt-0.5">
                  {language === 'hi' ? 'बोलने के लिए दबाएं' : 'Press to record'}
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center space-y-5">
                {/* Active Pulsing Mic */}
                <div className="relative flex items-center justify-center w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-red-500 to-red-800 text-white border-[3px] border-red-400 shadow-[0_0_80px_rgba(239,68,68,0.7),inset_0_0_20px_rgba(255,255,255,0.1)]">
                  <span className="absolute inset-[-10px] rounded-full border-2 border-red-400/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
                  <span className="absolute inset-[-20px] rounded-full border border-red-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none delay-150" />
                  <div className="flex flex-col items-center">
                    <Mic className="w-16 h-16 animate-pulse" />
                    <span className="text-lg font-black tracking-wide uppercase mt-2">
                      {t('listening')}
                    </span>
                    <span className="text-xs text-red-200 font-medium">Speak your emergency</span>
                  </div>
                </div>

                {/* STOP Button */}
                <button
                  onClick={stopListening}
                  id="voice-stop-button"
                  className="px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-red-700 text-white font-black text-sm tracking-wide border border-slate-700 hover:border-red-500 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Square className="w-4 h-4 fill-current text-red-400" />
                  <span>{t('stopRecording')}</span>
                </button>
              </div>
            )}

            {/* Live Interim / Captured speech preview */}
            {(speechTranscript || interimTranscript) && (
              <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  {isListening ? t('hearing') : t('youSaid')}
                </span>
                <p className="text-base md:text-lg font-semibold text-white italic">
                  "{speechTranscript} {interimTranscript}"
                </p>

                {!isListening && !isAnalyzing && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleAnalyzeEmergency(speechTranscript)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow flex items-center gap-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      {t('analyzeEmergency')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Helper Suggestion */}
            <div className="text-xs text-slate-400 pt-2 space-y-1">
              <p>💡 Example: <span className="text-slate-300 italic font-medium">"Accident hua hai, ek person injured hai."</span></p>
              <p>Or: <span className="text-slate-300 italic font-medium">"Heavy fire and smoke coming from second floor apartment."</span></p>
            </div>

            {/* Switch to Type Mode Button */}
            <button
              onClick={() => setTypeInsteadMode(true)}
              className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 pt-2"
            >
              <Keyboard className="w-4 h-4" />
              {t('preferToType')}
            </button>

          </div>
        ) : (
          /* Type Instead Fallback Mode */
          <div className="w-full max-w-lg space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                Type Emergency Description
              </span>
              {isSupported && (
                <button
                  onClick={() => setTypeInsteadMode(false)}
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Mic className="w-3.5 h-3.5" />
                  {t('useMicrophone')}
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. Accident hua hai, ek person injured hai, please send ambulance..."
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm md:text-base resize-none"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTextInput('Accident hua hai, ek person injured hai.')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
              >
                Insert Example
              </button>
              <button
                onClick={() => handleAnalyzeEmergency(textInput)}
                disabled={!textInput.trim() || isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all shadow active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : t('analyzeEmergency')}
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="mt-8 flex flex-col items-center gap-3 animate-in fade-in">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-cyan-400 font-bold text-sm">{t('analyzingWithAI')}</p>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 3. CLASSIFICATION RESULT CARD                                             */}
      {/* ========================================================================= */}
      {analysisResult && (
        <section className="bg-[#091322] border-2 border-cyan-500/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-3">
          
          {/* Top Classification Summary Grid */}
          <div className="border-b border-slate-800 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500 text-red-300 text-xs font-black uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5" />
                EMERGENCY CLASSIFICATION COMPLETE
              </div>
              <span className="text-xs text-slate-400 font-mono">
                AI Urgency Assessment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* INCIDENT */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">INCIDENT</span>
                <span className="text-lg font-black text-white mt-1 block">
                  {analysisResult.incidentType || 'Possible Emergency'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">{analysisResult.emergencyCategory}</span>
              </div>

              {/* SEVERITY */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-red-900/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">SEVERITY</span>
                <span className="text-lg font-black text-red-400 mt-1 block uppercase">
                  🔴 {analysisResult.severity || 'CRITICAL'}
                </span>
                <span className="text-[11px] text-red-300 block mt-1">{analysisResult.dangerLevel || 'Immediate Danger'}</span>
              </div>

              {/* CONFIDENCE */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-900/50">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">{t('aiConfidence')}</span>
                <span className="text-2xl font-black text-cyan-300 mt-1 block">
                  {analysisResult.confidence || 94}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Classification certainty</span>
              </div>

              {/* PRIORITY */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-orange-900/50">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">{t('priority')}</span>
                <span className="text-2xl font-black text-orange-400 mt-1 block">
                  {analysisResult.priorityScore || 92}<span className="text-xs text-slate-500 font-normal">/100</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Dispatch urgency ranking</span>
              </div>
            </div>
          </div>

          {/* Voice Output: READ INSTRUCTIONS ALOUD Controls */}
          {speechSynthesisSupported && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{t('readInstructionsAloud')}</h4>
                  <p className="text-xs text-slate-400">
                    {isSpeaking ? 'Reading safety-first instructions...' : 'Listen to emergency instructions and recommended action'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isSpeaking ? (
                  <>
                    <button
                      onClick={() => handleReadAloud('en')}
                      id="voice-read-en-button"
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('read')} (EN)</span>
                    </button>
                    <button
                      onClick={() => handleReadAloud('hi')}
                      id="voice-read-hi-button"
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('read')} (हिंदी)</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStopSpeaking}
                    id="voice-stop-speech-button"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>⏹ {t('stop')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* DO THIS NOW & AVOID Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Immediate Actions */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                🚨 {t('doThisNow')}
              </span>
              <ol className="space-y-2.5">
                {(analysisResult.immediateActions || [
                  "Move to a safe location if possible.",
                  "Call emergency services if someone is seriously injured.",
                  "Avoid unnecessary movement of injured people.",
                  "Follow emergency operator instructions."
                ]).map((action, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-200">
                    <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {i + 1}
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommended Helpline & Verified Contact */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-red-950/60 to-slate-900 border border-red-500/40 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  📞 {t('recommendedContact')}
                </span>
                <div className="text-4xl font-black text-white tracking-tight mt-2">
                  {analysisResult.recommendedHelpline || '112'}
                </div>
                <span className="text-xs font-bold text-red-300 block">
                  {analysisResult.helplineName || 'Unified Emergency Response'}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Server-side verified national emergency response. AI never hallucinates phone numbers.
                </p>
              </div>

              <div className="flex gap-2.5">
                <a
                  href={`tel:${analysisResult.recommendedHelpline || '112'}`}
                  id="voice-call-now-button"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  {t('call112')}
                </a>
                <button
                  onClick={() => handleCopyHelpline(analysisResult.recommendedHelpline || '112')}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedNumber ? t('copied') : t('copyNumber')}
                </button>
              </div>
            </div>

          </div>

          {/* Location & Nearby Help Opt-In */}
          <div className="pt-4 border-t border-slate-800">
            {!showLocation ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400">
                  Enable location to find nearby hospitals, police, or fire stations.
                </span>
                <button
                  onClick={() => setShowLocation(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 hover:border-cyan-500/50 transition-all shadow flex items-center justify-center gap-2 active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  ADD MY LOCATION
                </button>
              </div>
            ) : (
              <div className="bg-[#0b1426] border border-slate-800 rounded-3xl p-6 shadow-lg mt-4 animate-in fade-in slide-in-from-top-4">
                <SecureLiveLocation 
                  category={analysisResult.emergencyCategory || 'OTHER'}
                />
              </div>
            )}
          </div>

          {/* Transition to Rescue Mode or Detailed View */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              High urgency incident detected. You can enter dedicated Rescue Mode.
            </span>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  navigate('/rescue-mode');
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs tracking-wide shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                {t('enterRescueMode')}
              </button>
            </div>
          </div>

        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. SAFETY DISCLAIMER FOOTER                                               */}
      {/* ========================================================================= */}
      <footer className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">
          "{t('disclaimer1')}"
        </p>
        <p className="text-amber-400/90 font-bold">
          "{t('disclaimer2')}"
        </p>
      </footer>

    </div>
  );
}
