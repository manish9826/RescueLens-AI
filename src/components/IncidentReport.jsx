import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Sparkles, 
  AlertCircle, 
  X, 
  FileText, 
  ShieldAlert,
  Loader2,
  Camera,
  Flame,
  Droplets,
  Car,
  Building2,
  CheckCircle2,
  Image as ImageIcon,
  Mic,
  WifiOff
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';
import { usePWA } from '../context/PWAContext';

const SAMPLE_INCIDENTS = [
  {
    id: 'flood',
    title: 'Urban Flash Flood',
    icon: Droplets,
    color: 'border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-500/60',
    description: 'Submerged street with stranded passenger car and elevated water line.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><path d="M0 240 Q 150 200, 300 240 T 600 240 L 600 400 L 0 400 Z" fill="%231E3A8A"/><path d="M0 270 Q 150 250, 300 270 T 600 270 L 600 400 L 0 400 Z" fill="%232563EB" opacity="0.7"/><rect x="220" y="180" width="160" height="70" rx="10" fill="%23DC2626"/><circle cx="260" cy="250" r="20" fill="%23475569"/><circle cx="340" cy="250" r="20" fill="%23475569"/><text x="300" y="100" fill="%2393C5FD" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">URBAN FLOODING SCENE</text><text x="300" y="130" fill="%2360A5FA" font-family="sans-serif" font-size="14" text-anchor="middle">Water Depth ~ 1.2 Meters | Stranded Vehicle</text></svg>'
  },
  {
    id: 'fire',
    title: 'Structure Fire & Smoke',
    icon: Flame,
    color: 'border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-500/60',
    description: 'Commercial building with active roof flames and heavy black smoke plume.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23090D16"/><rect x="150" y="120" width="300" height="280" fill="%231E293B"/><rect x="190" y="160" width="60" height="70" fill="%23F97316" opacity="0.9"/><rect x="350" y="160" width="60" height="70" fill="%23EF4444" opacity="0.9"/><path d="M 120 120 Q 200 40, 300 90 T 480 120 Z" fill="%23DC2626" opacity="0.8"/><path d="M 180 90 Q 250 10, 350 70 Z" fill="%23F59E0B"/><text x="300" y="60" fill="%23FCA5A5" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">STRUCTURAL FIRE SCENE</text><text x="300" y="340" fill="%23FDBA74" font-family="sans-serif" font-size="14" text-anchor="middle">Active Flame Radiation | Structural Damage</text></svg>'
  },
  {
    id: 'crash',
    title: 'Highway Car Crash',
    icon: Car,
    color: 'border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-500/60',
    description: 'Two-vehicle roadway collision with crushed front bumper and blocked lane.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><rect x="0" y="220" width="600" height="180" fill="%23334155"/><line x1="0" y1="310" x2="600" y2="310" stroke="%23F59E0B" stroke-dasharray="20,20" stroke-width="6"/><polygon points="120,240 280,240 320,280 80,280" fill="%23EF4444"/><polygon points="300,240 460,240 440,280 260,280" fill="%2364748B"/><text x="300" y="100" fill="%23FDE68A" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">HIGHWAY COLLISION SCENE</text><text x="300" y="130" fill="%23FBBF24" font-family="sans-serif" font-size="14" text-anchor="middle">Impact Zone | Blocked Lane | Fuel Spill Hazard</text></svg>'
  },
  {
    id: 'collapse',
    title: 'Structural Collapse',
    icon: Building2,
    color: 'border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-500/60',
    description: 'Partial brick building wall collapse with debris scattered across pavement.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230B0F19"/><rect x="100" y="100" width="200" height="300" fill="%23334155"/><path d="M300 100 L500 200 L500 400 L300 400 Z" fill="%231E293B"/><polygon points="250,300 450,350 480,400 200,400" fill="%2364748B"/><text x="300" y="60" fill="%23E9D5FF" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">STRUCTURAL COLLAPSE SCENE</text><text x="300" y="380" fill="%23C084FC" font-family="sans-serif" font-size="14" text-anchor="middle">Masonry Debris | Secondary Risk</text></svg>'
  }
];

const SCANNING_PHASES = [
  "Initializing Gemini 2.5 Flash Vision...",
  "Analyzing visual telemetry & physical hazards...",
  "Calculating priority urgency score...",
  "Generating multi-step response plan..."
];

export default function IncidentReport({ onAnalyze, isLoading, error }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const fileInputRef = useRef(null);
  const { isOnline } = usePWA();

  useEffect(() => {
    let interval;
    if (isLoading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % SCANNING_PHASES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const selectPresetSample = (sample) => {
    setDescription(sample.description);

    // Convert SVG preset to PNG data URL via off-screen canvas for Gemini Vision compatibility
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          setSelectedImage(pngUrl);
          setMimeType('image/png');
        } catch {
          setSelectedImage(sample.imageUrl);
          setMimeType('image/svg+xml');
        }
      };
      img.onerror = () => {
        setSelectedImage(sample.imageUrl);
        setMimeType('image/svg+xml');
      };
      img.src = sample.imageUrl;
    } catch {
      setSelectedImage(sample.imageUrl);
      setMimeType('image/svg+xml');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    onAnalyze({
      image: selectedImage,
      mimeType: mimeType,
      description: description,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Header Section */}
      <div className="text-center space-y-3 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs font-mono font-bold shadow-sm backdrop-blur-sm relative z-10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          INCIDENT TELEMETRY INTAKE
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight relative z-10">
          Report Emergency Scene
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed relative z-10">
          Upload an emergency scene photograph. Gemini AI vision will instantly extract visual hazards, calculate a priority score, and generate responder recommendations.
        </p>
      </div>

      <SafetyDisclaimer compact />

      {/* Voice Assistant Switch Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-left shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wide">Prefer Speaking?</span>
            <p className="text-xs text-slate-300">Report hands-free with Voice Emergency Assistant (English / Hindi)</p>
          </div>
        </div>
        <Link
          to="/voice"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-all active:scale-95 text-center shrink-0"
        >
          🎙️ Open Voice Assistant
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative glass-card rounded-[2rem] p-6 sm:p-10 space-y-10 border border-slate-200/50 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Multiphase Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[2rem] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-300">
              <div className="relative w-full max-w-lg h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-[0_0_50px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50 flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Scanning target" 
                  className="w-full h-full object-cover opacity-50 filter contrast-125 saturate-150 mix-blend-luminosity"
                />
                
                {/* Scanner Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Animated Radar Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)] animate-scan" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-80" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-cyan-300 bg-slate-950/90 px-4 py-3 rounded-xl border border-cyan-500/40 shadow-lg backdrop-blur-md">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    GEMINI 2.5 FLASH
                  </span>
                  <span className="font-bold text-right max-w-[60%] truncate animate-pulse">{SCANNING_PHASES[scanStepIndex]}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-cyan-600 dark:text-cyan-400 font-black text-2xl tracking-tight">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  Processing Intelligence
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md font-mono">
                  Running multimodal analysis to extract physical threat vectors and determine dispatch requirements...
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-2xl text-red-900 dark:text-red-200 text-sm flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-base text-red-950 dark:text-red-300 mb-1">Analysis Error</strong>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* File Upload Zone */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold font-mono text-sm border border-cyan-200 dark:border-cyan-700">
                  1
                </div>
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                  Visual Telemetry <span className="text-red-500">*</span>
                </label>
              </div>

              {!selectedImage ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative overflow-hidden border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 ${
                    isDragOver
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-cyan-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-5 relative z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-slate-900 dark:text-slate-100 font-extrabold text-xl sm:text-2xl block tracking-tight">
                        Drag & Drop Scene Photo
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm block font-mono">
                        Supports high-res JPG, PNG, WEBP files
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      className="mt-4 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Camera className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" /> Browse Local Files
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 group shadow-2xl ring-4 ring-slate-100 dark:ring-slate-800/50">
                  <img
                    src={selectedImage}
                    alt="Emergency scene preview"
                    className="w-full h-80 sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />
                  
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-5 right-5 p-3 bg-slate-900/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-md border border-slate-700 transition-all shadow-xl hover:scale-105 hover:rotate-90 duration-300"
                    title="Remove photo"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-5 left-5 bg-slate-950/90 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-slate-700/80 text-xs sm:text-sm font-mono text-cyan-300 flex items-center gap-3 shadow-2xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Visual Data Loaded • Ready for Analysis
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-800/50">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Or select a preset scenario:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_INCIDENTS.map((sample) => {
                  const IconComponent = sample.icon;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => selectPresetSample(sample)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md ${sample.color}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                          <IconComponent className="w-5 h-5 shrink-0" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{sample.title}</span>
                      </div>
                      <span className="text-xs opacity-85 leading-relaxed">{sample.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold font-mono text-sm border border-slate-300 dark:border-slate-700">
                  2
                </div>
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                  Situational Context <span className="text-slate-400 dark:text-slate-500 font-normal lowercase tracking-normal">(Optional)</span>
                </label>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide extra details (e.g. 'Submerged red sedan with trapped driver', 'Heavy toxic black smoke plume blowing south')..."
                className="w-full bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 space-y-3">
              {!isOnline && (
                <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-400 text-sm font-bold">
                  <WifiOff className="w-4 h-4" />
                  Gemini AI Analysis is unavailable while offline.
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedImage || isLoading || !isOnline}
                className={`w-full py-4.5 sm:py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  selectedImage && !isLoading && isOnline
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] transform hover:-translate-y-1'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ShieldAlert className={`w-6 h-6 ${selectedImage && !isLoading && isOnline ? 'animate-pulse' : ''}`} />
                Analyze Scene with Gemini AI
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}
