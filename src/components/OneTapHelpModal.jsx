import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  PhoneCall, 
  MapPin, 
  Share2, 
  Check, 
  X, 
  Car, 
  HeartPulse, 
  Flame, 
  ShieldAlert, 
  AlertOctagon, 
  Compass, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function OneTapHelpModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  
  // Selected emergency type: null | 'Accident' | 'Medical' | 'Fire' | 'Crime' | 'Other'
  const [selectedType, setSelectedType] = useState(null);

  // Location state
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'requesting' | 'success' | 'denied' | 'error'
  const [locationError, setLocationError] = useState('');
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedType(null);
      setLocation(null);
      setLocationStatus('idle');
      setLocationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Emergency Categories configuration (100% offline, zero Gemini dependency)
  const EMERGENCY_TYPES = [
    {
      id: 'Accident',
      label: 'Accident',
      icon: Car,
      color: 'border-orange-500 bg-orange-950/40 text-orange-400 hover:border-orange-400',
      helpline: '112',
      helplineName: 'Unified Emergency Response'
    },
    {
      id: 'Medical',
      label: 'Medical',
      icon: HeartPulse,
      color: 'border-red-500 bg-red-950/40 text-red-400 hover:border-red-400',
      helpline: '108',
      altHelpline: '112',
      helplineName: 'Ambulance & Trauma Care'
    },
    {
      id: 'Fire',
      label: 'Fire',
      icon: Flame,
      color: 'border-amber-500 bg-amber-950/40 text-amber-400 hover:border-amber-400',
      helpline: '101',
      altHelpline: '112',
      helplineName: 'Fire Brigade & Hazard Rescue'
    },
    {
      id: 'Crime',
      label: 'Crime',
      icon: ShieldAlert,
      color: 'border-blue-500 bg-blue-950/40 text-blue-400 hover:border-blue-400',
      helpline: '100',
      altHelpline: '112',
      helplineName: 'Police Control Room'
    },
    {
      id: 'Other',
      label: 'Other',
      icon: AlertOctagon,
      color: 'border-purple-500 bg-purple-950/40 text-purple-400 hover:border-purple-400',
      helpline: '112',
      helplineName: 'Unified Emergency Services'
    }
  ];

  // Request browser location safely only after user clicks [ ENABLE LOCATION ]
  const handleEnableLocation = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(params.get('lat'));
      const urlLng = parseFloat(params.get('lng'));
      if (!isNaN(urlLat) && !isNaN(urlLng)) {
        setLocation({
          latitude: urlLat,
          longitude: urlLng,
          accuracy: 15
        });
        setLocationStatus('success');
        return;
      }
      if (window.__mockLocation) {
        setLocation({
          latitude: window.__mockLocation.latitude || 28.6139,
          longitude: window.__mockLocation.longitude || 77.2090,
          accuracy: window.__mockLocation.accuracy || 15
        });
        setLocationStatus('success');
        return;
      }
    }

    if (!('geolocation' in navigator)) {
      setLocationStatus('error');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('requesting');
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy)
        });
        setLocationStatus('success');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setLocationError('Location permission was denied in browser settings.');
        } else {
          setLocationStatus('error');
          setLocationError('Location unavailable on this device.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Safe manual Share Location
  const handleShareLocation = async () => {
    if (!location) {
      handleEnableLocation();
      return;
    }

    const shareUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const text = `🚨 EMERGENCY ASSISTANCE NEEDED!\nIncident Type: ${selectedType || 'Emergency'}\nGPS Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\nMaps Link: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 Emergency Location',
          text: text,
          url: shareUrl
        });
        setShareFeedback('Shared successfully');
        setTimeout(() => setShareFeedback(''), 3000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(text);
          setCopiedLocation(true);
          setTimeout(() => setCopiedLocation(false), 3000);
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 3000);
    }
  };

  const activeCategory = EMERGENCY_TYPES.find(t => t.id === selectedType) || EMERGENCY_TYPES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl bg-[#090e1a] border-2 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.35)] overflow-hidden flex flex-col relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Close */}
        <div className="p-6 bg-gradient-to-r from-red-950 via-[#101726] to-[#090e1a] border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-xl animate-pulse">
              🆘
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>I NEED HELP</span>
              </h2>
              <span className="text-xs text-red-300 font-semibold">Immediate Emergency Protocol • Zero AI Dependency</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Strict Privacy Guarantee */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Nothing happens automatically. Calls and location sharing require your direct tap.</span>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: SELECT EMERGENCY TYPE                                             */}
          {/* ========================================================================= */}
          {!selectedType ? (
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Select Emergency Type:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMERGENCY_TYPES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedType(item.id)}
                      id={`help-type-${item.id.toLowerCase()}`}
                      className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center gap-3.5 shadow-md ${item.color}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-lg shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-base font-black text-white block">{item.label}</span>
                        <span className="text-[11px] text-slate-300 opacity-80">{item.helplineName}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            
            /* ========================================================================= */
            /* STEP 2: 🚨 EMERGENCY VIEW                                                 */
            /* ========================================================================= */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Emergency Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/30 to-rose-900/30 border-2 border-red-500 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-bounce">🚨</span>
                  <div>
                    <span className="text-red-400 text-xs font-black uppercase tracking-wider block">URGENT PROTOCOL</span>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      🚨 EMERGENCY: {selectedType.toUpperCase()}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Change Type
                </button>
              </div>

              {/* Recommended Helpline Box */}
              <div className="p-5 rounded-2xl bg-[#0e172a] border border-red-500/40 text-center space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Recommended Emergency Helpline
                </span>
                <div className="text-6xl font-black text-white tracking-tight">
                  📞 112
                </div>
                <span className="text-xs text-red-300 font-semibold block">
                  {activeCategory.helpline !== '112' ? `${activeCategory.helplineName} (Dial ${activeCategory.helpline} or 112)` : 'Unified Emergency Response'}
                </span>
              </div>

              {/* Location Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>📍 Current Location</span>
                  </div>
                  {location && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-black">
                      🟢 GPS LOCKED
                    </span>
                  )}
                </div>

                {!location ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">
                      Coordinates are not accessed until you explicitly tap the button below.
                    </p>
                    <button
                      onClick={handleEnableLocation}
                      id="quick-enable-location-button"
                      disabled={locationStatus === 'requesting'}
                      className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>{locationStatus === 'requesting' ? 'Acquiring GPS...' : 'ENABLE LOCATION'}</span>
                    </button>
                    {locationError && (
                      <p className="text-xs text-red-400 font-medium">{locationError}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Lat: {location.latitude.toFixed(6)}</span>
                      <span>Lng: {location.longitude.toFixed(6)}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Accuracy: ~{location.accuracy} meters
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: [ CALL 112 ] and [ SHARE LOCATION ] */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* [ CALL 112 ] */}
                <a
                  href={`tel:${activeCategory.helpline || '112'}`}
                  id="quick-call-112-button"
                  className="py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/30 active:scale-95 transition-all text-center cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                  <span>CALL {activeCategory.helpline || '112'}</span>
                </a>

                {/* [ SHARE LOCATION ] */}
                <button
                  onClick={handleShareLocation}
                  id="quick-share-location-button"
                  className="py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedLocation ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5 text-cyan-400" />}
                  <span>{copiedLocation ? 'COPIED TO CLIPBOARD!' : 'SHARE LOCATION'}</span>
                </button>
              </div>

              {shareFeedback && (
                <p className="text-xs text-emerald-400 font-bold text-center">
                  ✓ {shareFeedback}
                </p>
              )}

            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}
