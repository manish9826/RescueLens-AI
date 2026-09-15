import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { 
  AlertOctagon, Phone, PhoneCall, AlertTriangle, Copy, Check, 
  ShieldAlert, ArrowRight, FileText, MessageSquare, Radio, Send, 
  MapPin, Share2, Compass, CheckCircle2, ExternalLink, Volume2, 
  Square, Camera, Upload, Mic, RefreshCw
} from 'lucide-react';
import SecureLiveLocation from './SecureLiveLocation';

export default function RescueMode({ result, image, onAnalyze, isLoading, error, onDispatch, onReset, toggleCommanderChat }) {
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const [helplineInfo, setHelplineInfo] = useState({
    helpline: '112',
    name: 'Unified Emergency Response',
    altNumber: '108',
    directory: []
  });
  
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [instructionsLang, setInstructionsLang] = useState(language || 'en');
  
  // Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Fetch verified emergency numbers from server directory if result is present
  useEffect(() => {
    if (result && result.data && result.data.emergencyCategory) {
      fetch(`/api/helpline?category=${result.data.emergencyCategory}`)
        .then(res => res.json())
        .then(resData => {
          if (resData && resData.helpline) {
            setHelplineInfo({
              helpline: resData.helpline,
              name: resData.name || 'Unified Emergency Response',
              altNumber: resData.altNumber || '108',
              directory: resData.directory || []
            });
          }
        })
        .catch(err => {
          console.warn('Using default server verified emergency numbers:', err);
        });
    }
  }, [result]);

  // Sync the stream with the video element reliably
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Play error:", e));
    }
  }, [cameraActive, stream]);

  useEffect(() => {
    return () => {
      stopCamera();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please use the Upload Image option.');
      } else {
        setCameraError('Camera access denied or unavailable. Please use the Upload Image option.');
      }
    }
  };

  const captureAndAnalyze = () => {
    if (videoRef.current && canvasRef.current && onAnalyze) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      onAnalyze({ image: imageDataUrl, mimeType: 'image/jpeg', description: 'Captured from Rescue Mode Camera' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onAnalyze) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAnalyze({ image: reader.result, mimeType: file.type, description: 'Uploaded in Rescue Mode' });
      };
      reader.readAsDataURL(file);
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
            accuracy: Math.round(pos.coords.accuracy)
          });
          setLocationLoading(false);
        },
        (err) => {
          console.warn('Location error:', err);
          setLocationLoading(false);
          alert("Location access denied.");
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCopy = (num, label) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 3000);
  };

  // Translations
  const getHindiAction = (action) => {
    const a = (action || '').toLowerCase();
    if (a.includes('safe location') || a.includes('move to')) return 'यदि संभव हो तो तुरंत सुरक्षित स्थान पर जाएं।';
    if (a.includes('emergency services') || a.includes('call')) return 'यदि कोई व्यक्ति गंभीर रूप से घायल है तो 112 पर कॉल करें।';
    if (a.includes('unnecessary movement') || a.includes('injured')) return 'घायल व्यक्ति को अनावश्यक रूप से बिल्कुल न हिलाएं।';
    if (a.includes('operator')) return 'आपातकालीन ऑपरेटर द्वारा दिए गए निर्देशों का पालन करें।';
    return action;
  };
  const getHindiAvoid = (hazard) => {
    const h = (hazard || '').toLowerCase();
    if (h.includes('danger') || h.includes('yourself')) return 'खुद को खतरे में न डालें।';
    if (h.includes('move') || h.includes('injured')) return 'घायल व्यक्ति को बेवजह न हिलाएं।';
    if (h.includes('fuel') || h.includes('electrical')) return 'ईंधन या बिजली के तारों के पास न जाएं।';
    return hazard;
  };

  const handleReadInstructionsAloud = (lang = instructionsLang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const data = result?.data;
    if (!data) return;

    const actions = data.immediateActions || [];
    let textToRead = '';
    let speechLang = 'en-US';

    if (lang === 'hi') {
      speechLang = 'hi-IN';
      const hindiSteps = actions.map((act, i) => `चरण ${i + 1}: ${getHindiAction(act)}`).join(' ');
      textToRead = `सुरक्षा निर्देश: ${hindiSteps} सहायता के लिए ${helplineInfo.helpline} पर कॉल करें।`;
    } else {
      speechLang = 'en-US';
      const formattedActions = actions.map((act, i) => `Step ${i + 1}: ${act}`).join('. ');
      textToRead = `Emergency instructions: ${formattedActions}. Contact ${helplineInfo.helpline}.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // ============================================================================
  // VIEW 1: LOADING STATE
  // ============================================================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#090D16] flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">Analyzing Emergency</h2>
          <p className="text-red-400 font-bold animate-pulse">Running Gemini Vision protocols...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: PRE-SCAN / ERROR STATE
  // ============================================================================
  if (!result || error) {
    return (
      <div className="min-h-[85vh] w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-10 p-4">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-600/20 border border-red-500/50 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">🚨 RESCUE MODE</h1>
          <p className="text-xl text-slate-400 font-semibold max-w-lg mx-auto">
            Get emergency guidance in seconds. Point your camera at the scene.
          </p>
        </div>

        {(error || cameraError) && (
          <div className="w-full max-w-md bg-red-950/50 border border-red-500/50 rounded-2xl p-4 text-center text-red-200">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="font-bold">{error || cameraError}</p>
            {error && onReset && (
              <button onClick={onReset} className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-sm">
                Try Again
              </button>
            )}
          </div>
        )}

        {!cameraActive ? (
          <div className="w-full max-w-lg flex flex-col gap-4">
            <button
              onClick={startCamera}
              className="w-full group relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-400 p-6 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] transition-all active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                <Camera className="w-10 h-10 text-white animate-bounce" />
                <span className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase">Scan Emergency</span>
              </div>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-colors"
              >
                <Upload className="w-5 h-5 text-cyan-400" />
                Upload Image
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

              <button 
                onClick={requestLocation}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-colors"
              >
                <MapPin className="w-5 h-5 text-emerald-400" />
                {locationLoading ? 'Locating...' : (userLocation ? 'Location Shared' : 'Share Location')}
              </button>

              <button 
                onClick={() => navigate('/voice')}
                className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-colors"
              >
                <Mic className="w-5 h-5 text-purple-400" />
                Voice Assistant
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-[50vh] object-cover relative z-0" style={{ backgroundColor: 'transparent' }} />
            <img src="/assets/emergency/road-accident.svg" alt="Camera Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen pointer-events-none z-10" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
              <button
                onClick={captureAndAnalyze}
                className="bg-red-600 hover:bg-red-500 text-white font-black px-10 py-4 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400 transition-transform active:scale-95 flex items-center gap-3 text-lg"
              >
                <Camera className="w-6 h-6" /> CAPTURE
              </button>
              <button
                onClick={stopCamera}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-4 rounded-full border border-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // VIEW 3: POST-SCAN (RESULT STATE)
  // ============================================================================
  const data = result.data;
  
  const getSafetyStatus = (severity) => {
    switch ((severity || '').toUpperCase()) {
      case 'CRITICAL': return { title: 'CRITICAL EMERGENCY', color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-950/40' };
      case 'HIGH': return { title: 'HIGH SEVERITY', color: 'text-orange-500', border: 'border-orange-500', bg: 'bg-orange-950/40' };
      case 'MEDIUM': return { title: 'MEDIUM SEVERITY', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-950/40' };
      default: return { title: 'LOW SEVERITY', color: 'text-cyan-500', border: 'border-cyan-500', bg: 'bg-cyan-950/40' };
    }
  };
  const safety = getSafetyStatus(data.severity);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16 pt-4 animate-in fade-in zoom-in-95 duration-300">
      
      {/* HEADER */}
      <div className={`p-8 rounded-3xl border-2 ${safety.border} ${safety.bg} flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl`}>
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 font-bold text-xs uppercase tracking-widest border border-red-500/50">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            INCIDENT DETECTED
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{data.incidentType || 'Emergency'}</h1>
        </div>
        <div className="flex gap-4">
          <div className="text-center p-4 rounded-2xl bg-[#0B1221] border border-slate-800 shadow-inner">
            <span className="block text-xs font-bold text-slate-400 uppercase">SEVERITY</span>
            <span className={`block text-2xl font-black ${safety.color}`}>{data.severity}</span>
          </div>
          <div className="text-center p-4 rounded-2xl bg-[#0B1221] border border-slate-800 shadow-inner">
            <span className="block text-xs font-bold text-slate-400 uppercase">CONFIDENCE</span>
            <span className={`block text-2xl font-black ${data.confidence < 70 ? 'text-amber-500' : 'text-cyan-400'}`}>
              {data.confidence}%
            </span>
          </div>
        </div>
      </div>

      {data.confidence < 70 && (
        <div className="w-full bg-amber-950/50 border border-amber-500 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <p className="text-amber-200 font-bold text-sm">LOW CONFIDENCE ANALYSIS: AI may have misidentified the scene. Please verify the situation with qualified human emergency personnel before taking dangerous actions.</p>
        </div>
      )}

      {/* CALL ACTION */}
      <div className="bg-[#0e1a38] border border-red-500/50 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recommended Emergency Contact</span>
          <h2 className="text-3xl font-bold text-white">{helplineInfo.name}</h2>
          <p className="text-red-400 font-black text-6xl tracking-tight my-2">📞 {helplineInfo.helpline}</p>
        </div>
        <a
          href={`tel:${helplineInfo.helpline}`}
          className="relative z-10 w-full max-w-sm flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-2xl tracking-wider shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] border border-red-400 active:scale-95 transition-all"
        >
          <PhoneCall className="w-8 h-8 animate-bounce" /> CALL NOW
        </a>
      </div>

      {/* DO / AVOID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b1426] border border-cyan-900 rounded-3xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400">🚨</span>
            DO THIS NOW
          </h3>
          <ul className="space-y-4">
            {(data.immediateActions || []).slice(0, 5).map((act, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-cyan-900/50 text-cyan-400 font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <span className="text-slate-200 font-semibold">{act}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#140b12] border border-amber-900 rounded-3xl p-6 shadow-lg">
          <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400">⚠️</span>
            AVOID
          </h3>
          <ul className="space-y-4">
            {(data.doNotDo || []).slice(0, 5).map((act, i) => (
              <li key={i} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <span className="text-amber-500 font-bold text-xl leading-none mt-1">•</span>
                <span className="text-slate-200 font-semibold">{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LOCATION & VOICE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b1426] border border-slate-800 rounded-3xl p-6 shadow-lg">
          <SecureLiveLocation 
            category={data.emergencyCategory || 'OTHER'}
            onLocationUpdate={(loc) => {
              setUserLocation({ lat: loc.latitude.toFixed(5), lng: loc.longitude.toFixed(5), accuracy: loc.accuracy });
            }}
          />
        </div>
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900/50 rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <Mic className="w-12 h-12 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Talk to Rescue Assistant</h3>
          <p className="text-sm text-slate-400 mb-6">Ask questions about the detected emergency and receive real-time concise guidance.</p>
          <button
            onClick={() => navigate('/voice')}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            START VOICE ASSISTANT
          </button>
        </div>
      </div>

      {/* AI SAFETY & CONTROLS */}
      <div className="flex flex-col items-center justify-center space-y-6 pt-8 border-t border-slate-800">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
        >
          <RefreshCw className="w-5 h-5" /> Start New Scan
        </button>
        <p className="text-xs text-slate-500 font-semibold text-center max-w-2xl">
          AI-generated guidance is decision-support only. Verify with qualified emergency personnel. RescueLens AI is not liable for errors in analysis.
        </p>
      </div>

    </div>
  );
}
