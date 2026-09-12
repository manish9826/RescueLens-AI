import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

const SAMPLE_INCIDENTS = [
  {
    id: 'flood',
    title: 'Urban Flash Flood',
    icon: Droplets,
    color: 'border-blue-500/40 text-blue-400 bg-blue-950/40',
    description: 'Submerged street with stranded passenger car and elevated water line.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><path d="M0 240 Q 150 200, 300 240 T 600 240 L 600 400 L 0 400 Z" fill="%231E3A8A"/><path d="M0 270 Q 150 250, 300 270 T 600 270 L 600 400 L 0 400 Z" fill="%232563EB" opacity="0.7"/><rect x="220" y="180" width="160" height="70" rx="10" fill="%23DC2626"/><circle cx="260" cy="250" r="20" fill="%23475569"/><circle cx="340" cy="250" r="20" fill="%23475569"/><text x="300" y="100" fill="%2393C5FD" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">URBAN FLOODING SCENE</text><text x="300" y="130" fill="%2360A5FA" font-family="sans-serif" font-size="14" text-anchor="middle">Water Depth ~ 1.2 Meters | Stranded Vehicle</text></svg>'
  },
  {
    id: 'fire',
    title: 'Structure Fire & Smoke',
    icon: Flame,
    color: 'border-red-500/40 text-red-400 bg-red-950/40',
    description: 'Commercial building with active roof flames and heavy black smoke plume.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23090D16"/><rect x="150" y="120" width="300" height="280" fill="%231E293B"/><rect x="190" y="160" width="60" height="70" fill="%23F97316" opacity="0.9"/><rect x="350" y="160" width="60" height="70" fill="%23EF4444" opacity="0.9"/><path d="M 120 120 Q 200 40, 300 90 T 480 120 Z" fill="%23DC2626" opacity="0.8"/><path d="M 180 90 Q 250 10, 350 70 Z" fill="%23F59E0B"/><text x="300" y="60" fill="%23FCA5A5" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">STRUCTURAL FIRE SCENE</text><text x="300" y="340" fill="%23FDBA74" font-family="sans-serif" font-size="14" text-anchor="middle">Active Flame Radiation | Structural Damage</text></svg>'
  },
  {
    id: 'crash',
    title: 'Highway Car Crash',
    icon: Car,
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    description: 'Two-vehicle roadway collision with crushed front bumper and blocked lane.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230F172A"/><rect x="0" y="220" width="600" height="180" fill="%23334155"/><line x1="0" y1="310" x2="600" y2="310" stroke="%23F59E0B" stroke-dasharray="20,20" stroke-width="6"/><polygon points="120,240 280,240 320,280 80,280" fill="%23EF4444"/><polygon points="300,240 460,240 440,280 260,280" fill="%2364748B"/><text x="300" y="100" fill="%23FDE68A" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">HIGHWAY COLLISION SCENE</text><text x="300" y="130" fill="%23FBBF24" font-family="sans-serif" font-size="14" text-anchor="middle">Impact Zone | Blocked Lane | Fuel Spill Hazard</text></svg>'
  },
  {
    id: 'collapse',
    title: 'Structural Wall Collapse',
    icon: Building2,
    color: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    description: 'Partial brick building wall collapse with debris scattered across pavement.',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230B0F19"/><rect x="100" y="100" width="200" height="300" fill="%23334155"/><path d="M300 100 L500 200 L500 400 L300 400 Z" fill="%231E293B"/><polygon points="250,300 450,350 480,400 200,400" fill="%2364748B"/><text x="300" y="60" fill="%23E9D5FF" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">STRUCTURAL COLLAPSE SCENE</text><text x="300" y="380" fill="%23C084FC" font-family="sans-serif" font-size="14" text-anchor="middle">Masonry Debris | Secondary Risk</text></svg>'
  }
];

const SCANNING_PHASES = [
  "Analyzing emergency scene...",
  "Detecting physical hazards & structural risks...",
  "Calculating priority urgency score...",
  "Generating response plan & unit requirements..."
];

export default function IncidentReport({ onAnalyze, isLoading, error }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Animate loading text phases
  useEffect(() => {
    let interval;
    if (isLoading) {
      setScanStepIndex(0);
      interval = setInterval(() => {
        setScanStepIndex((prev) => (prev + 1) % SCANNING_PHASES.length);
      }, 1200);
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
    setSelectedImage(sample.imageUrl);
    setMimeType('image/svg+xml');
    setDescription(sample.description);
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
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-bold">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          INCIDENT TELEMETRY INTAKE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Report Emergency Scene
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Upload an emergency scene photograph. Gemini AI vision will extract visual hazards, calculate priority score, and generate responder recommendations.
        </p>
      </div>

      <SafetyDisclaimer compact />

      {/* Main Upload Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-8 border border-slate-800 relative shadow-2xl">
        
        {/* Multiphase Loading Scanner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fadeIn">
            <div className="relative w-full max-w-lg h-72 border border-cyan-500/50 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center">
              <img 
                src={selectedImage} 
                alt="Scanning target" 
                className="w-full h-full object-cover opacity-60 filter contrast-125 saturate-150"
              />
              <div className="radar-line" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-80" />
              
              {/* Radar Corner Targets */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-cyan-400 border-t-2 border-l-2 border-cyan-400 p-1">
                RADAR: 01
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400 border-t-2 border-r-2 border-cyan-400 p-1">
                TELEMETRY
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-cyan-300 bg-slate-950/90 px-4 py-2 rounded-xl border border-cyan-500/40">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  GEMINI 3.6 VISION
                </span>
                <span className="font-bold">{SCANNING_PHASES[scanStepIndex]}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2.5 text-cyan-400 font-extrabold text-xl">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                Processing Multimodal Intelligence
              </div>
              <p className="text-xs text-slate-400 max-w-md font-mono">
                Extracting pixel risk density, structural load threats, and required emergency response units.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-950/80 border border-red-500/40 rounded-2xl text-red-200 text-xs flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="block font-bold text-red-300">Analysis Error</strong>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* File Upload Zone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              1. Emergency Scene Image <span className="text-red-400">*</span>
            </label>

            {!selectedImage ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                    : 'border-slate-700 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-slate-100 font-bold text-lg block">
                      Drag & drop emergency scene photo here
                    </span>
                    <span className="text-slate-400 text-xs mt-1 block font-mono">
                      Supports JPG, PNG, WEBP (or click to browse from device)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 shadow-md"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" /> Browse Photo Files
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 group shadow-2xl">
                <img
                  src={selectedImage}
                  alt="Emergency scene preview"
                  className="w-full h-80 sm:h-96 object-cover filter contrast-105"
                />
                
                {/* Remove Image Button */}
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2.5 bg-slate-950/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-md border border-slate-700 transition-colors shadow-lg"
                  title="Remove photo"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Photo Loaded • Ready for Gemini Analysis
                </div>
              </div>
            )}
          </div>

          {/* Quick Hackathon Preset Samples */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono uppercase">
                Or select a preset emergency scenario for instant testing:
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_INCIDENTS.map((sample) => {
                const IconComponent = sample.icon;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => selectPresetSample(sample)}
                    className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between space-y-2 shadow-md ${sample.color}`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4.5 h-4.5 shrink-0" />
                      <span className="font-bold text-xs truncate">{sample.title}</span>
                    </div>
                    <span className="text-[11px] opacity-80 line-clamp-2 leading-tight">{sample.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              2. Situational Context <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide extra details (e.g. 'Submerged red sedan with trapped driver', 'Heavy toxic black smoke plume blowing south', 'Gas valve rupture')..."
              className="w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors shadow-inner"
            />
          </div>

          {/* Analyze Button */}
          <button
            type="submit"
            disabled={!selectedImage || isLoading}
            className={`w-full py-4.5 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all shadow-2xl ${
              selectedImage && !isLoading
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30 transform hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            Analyze Scene with Gemini AI
          </button>

        </form>

      </div>

    </div>
  );
}
