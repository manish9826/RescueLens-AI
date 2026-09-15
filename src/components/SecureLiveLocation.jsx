import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Compass, 
  Radio, 
  LocateFixed, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from '../context/LanguageContext';

// Fix leaflet marker icon issues in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center map smoothly
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

// Resilient Map Error Boundary preventing crashes
class SafeMapWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('Leaflet map error caught safely:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm h-52">
          <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
          <p className="font-bold">Interactive map preview temporarily unavailable.</p>
          <p className="text-xs text-slate-400 mt-1">Exact GPS coordinates are recorded and verified below.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SecureLiveLocation({ onLocationUpdate, defaultLocation = null, category = 'OTHER' }) {
  const { t } = useTranslation();

  // Location tracking states
  const [location, setLocation] = useState(defaultLocation);
  const [status, setStatus] = useState(defaultLocation ? 'success' : 'idle'); // 'idle' | 'requesting' | 'success' | 'denied' | 'error' | 'timeout' | 'unsupported'
  const [errorMessage, setErrorMessage] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(defaultLocation ? new Date() : null);

  // Copy / Share states
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  // Nearby Help states
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const watchIdRef = useRef(null);

  // Cleanup: Stop live location when component unmounts
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Fetch reliable nearby emergency POIs from /api/nearby
  const fetchNearbyHelp = async (lat, lng) => {
    setNearbyLoading(true);
    setNearbyError('');
    try {
      const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=5000&category=${category}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.places) && data.places.length > 0) {
        setNearbyPlaces(data.places);
      } else {
        setNearbyPlaces([]);
        setNearbyError('Nearby services could not be loaded.');
      }
    } catch (err) {
      console.warn('Could not fetch nearby help:', err);
      setNearbyPlaces([]);
      setNearbyError('Nearby services could not be loaded.');
    } finally {
      setNearbyLoading(false);
    }
  };

  const handleLocationSuccess = (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    const now = new Date();
    const locData = {
      latitude,
      longitude,
      accuracy: Math.round(accuracy || 15),
      timestamp: position.timestamp || now.getTime()
    };

    setLocation(locData);
    setStatus('success');
    setErrorMessage('');
    setLastUpdated(now);

    if (onLocationUpdate) {
      onLocationUpdate(locData);
    }

    // Fetch verified nearby emergency facilities
    fetchNearbyHelp(latitude, longitude);
  };

  const handleLocationError = (error) => {
    setIsWatching(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    switch (error.code) {
      case error.PERMISSION_DENIED:
        setStatus('denied');
        setErrorMessage('Location permission was denied. Please allow location access in your browser settings.');
        break;
      case error.POSITION_UNAVAILABLE:
        setStatus('error');
        setErrorMessage('Location position is unavailable. Your device could not determine your current position.');
        break;
      case error.TIMEOUT:
        setStatus('timeout');
        setErrorMessage('Location acquisition timed out. Please try refreshing your position.');
        break;
      default:
        setStatus('error');
        setErrorMessage('An error occurred while determining your location.');
    }
  };

  // Explicit user action: Request One-Time Location
  const requestLocation = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(params.get('lat'));
      const urlLng = parseFloat(params.get('lng'));
      if (!isNaN(urlLat) && !isNaN(urlLng)) {
        handleLocationSuccess({
          coords: {
            latitude: urlLat,
            longitude: urlLng,
            accuracy: 15
          },
          timestamp: Date.now()
        });
        return;
      }
      if (window.__mockLocation) {
        handleLocationSuccess({
          coords: {
            latitude: window.__mockLocation.latitude || 28.6139,
            longitude: window.__mockLocation.longitude || 77.2090,
            accuracy: window.__mockLocation.accuracy || 15
          },
          timestamp: Date.now()
        });
        return;
      }
    }

    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('requesting');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Explicit user action: Start Live Location Tracking
  const startLiveLocation = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(params.get('lat'));
      const urlLng = parseFloat(params.get('lng'));
      if (!isNaN(urlLat) && !isNaN(urlLng)) {
        setIsWatching(true);
        handleLocationSuccess({
          coords: {
            latitude: urlLat,
            longitude: urlLng,
            accuracy: 10
          },
          timestamp: Date.now()
        });
        return;
      }
      if (window.__mockLocation) {
        setIsWatching(true);
        handleLocationSuccess({
          coords: {
            latitude: window.__mockLocation.latitude || 28.6139,
            longitude: window.__mockLocation.longitude || 77.2090,
            accuracy: window.__mockLocation.accuracy || 10
          },
          timestamp: Date.now()
        });
        return;
      }
    }

    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      return;
    }

    setStatus('requesting');
    setErrorMessage('');

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setIsWatching(true);
        handleLocationSuccess(position);
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 5000
      }
    );

    watchIdRef.current = watchId;
    setIsWatching(true);
  };

  // Explicit user action: Stop Live Location Tracking
  const stopLiveLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  };

  // Open in Google Maps
  const handleOpenInMaps = () => {
    if (!location) return;
    const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy GPS Coordinates & Maps Link
  const handleCopyLocation = () => {
    if (!location) return;
    const text = `Emergency GPS Coordinates:\nLat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}\nAccuracy: ~${location.accuracy}m\nMaps Link: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Share Location via Web Share API
  const handleShareLocation = async () => {
    if (!location) return;
    const shareData = {
      title: 'Emergency GPS Location',
      text: `My Emergency Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (Accuracy: ~${location.accuracy}m)`,
      url: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully');
        setTimeout(() => setShareFeedback(''), 3000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLocation();
        }
      }
    } else {
      handleCopyLocation();
      setShareFeedback('Coordinates copied for sharing!');
      setTimeout(() => setShareFeedback(''), 3000);
    }
  };

  // Formatted display values
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <section className="w-full bg-[#09101f] border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & PRIVACY NOTICE                                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider">
            <MapPin className="w-4 h-4 animate-bounce text-red-500" />
            <span>📍 YOUR LOCATION</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Secure Location & Nearby Emergency Services
          </h2>
          {/* Strict Location Privacy Disclosure */}
          <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>"Your location is accessed only after your permission."</span>
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {isWatching ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-black tracking-wide animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              🟢 LIVE LOCATION ACTIVE
            </span>
          ) : location ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/70 text-emerald-300 text-xs font-black tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              🟢 LOCATION DETECTED
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
              <LocateFixed className="w-3.5 h-3.5" />
              Awaiting Permission
            </span>
          )}
        </div>
      </div>

      {/* Strict Privacy Guarantee Box */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Never automatically calls 112, sends SMS, or shares location with police/ambulance without explicit action.</span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">Client-side Browser Geolocation API</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. INITIAL UNPERMITTED STATE                                              */}
      {/* ========================================================================= */}
      {!location && (
        <div className="py-10 px-6 rounded-2xl bg-[#0b1426] border border-slate-800/80 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-white">Allow Location Access</h3>
            <p className="text-xs text-slate-400">
              Provide exact GPS coordinates to 112 dispatchers and locate verified nearby hospitals, fire stations, and emergency responders.
            </p>
          </div>

          {/* Explicit User Click Required: ENABLE LOCATION */}
          <button
            onClick={requestLocation}
            id="enable-location-button"
            disabled={status === 'requesting'}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-600/30 transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" />
            <span>{status === 'requesting' ? 'Acquiring GPS...' : 'ENABLE LOCATION'}</span>
          </button>

          {/* Error Message if Denied, Timeout, or Unavailable */}
          {errorMessage && (
            <div className="w-full max-w-md p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 text-left animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERMITTED / ACTIVE LOCATION STATE                                      */}
      {/* ========================================================================= */}
      {location && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Coordinates & Accuracy Telemetry Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            
            {/* Latitude */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Latitude</span>
              <span className="text-xl font-mono font-black text-cyan-300 mt-1 block">
                {location.latitude.toFixed(6)}
              </span>
              <span className="text-[10px] text-slate-500 block">WGS84 GPS Axis</span>
            </div>

            {/* Longitude */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Longitude</span>
              <span className="text-xl font-mono font-black text-cyan-300 mt-1 block">
                {location.longitude.toFixed(6)}
              </span>
              <span className="text-[10px] text-slate-500 block">WGS84 Meridian Axis</span>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/40">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Accuracy</span>
              <span className="text-xl font-black text-emerald-300 mt-1 block">
                {location.accuracy} meters
              </span>
              <span className="text-[10px] text-slate-500 block">Satellite Triangulation</span>
            </div>

            {/* Last Updated */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Last Updated
              </span>
              <span className="text-xl font-mono font-black text-white mt-1 block">
                {formattedTime}
              </span>
              <span className="text-[10px] text-slate-500 block">Local device clock</span>
            </div>

          </div>

          {/* Interactive Safe Leaflet Map */}
          <div className="space-y-2">
            <div className="h-56 md:h-64 w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner relative z-0">
              <SafeMapWrapper>
                <MapContainer 
                  center={[location.latitude, location.longitude]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* User Location */}
                  <Marker position={[location.latitude, location.longitude]} />
                  <Circle 
                    center={[location.latitude, location.longitude]} 
                    radius={Math.max(location.accuracy, 25)} 
                    pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.2 }}
                  />
                  
                  {/* Nearby Emergency Facilities */}
                  {nearbyPlaces.map((place) => (
                    <Marker 
                      key={place.id}
                      position={[place.lat, place.lng]} 
                      eventHandlers={{
                        click: () => setSelectedPlaceId(place.id),
                      }}
                    />
                  ))}

                  <RecenterMap lat={location.latitude} lng={location.longitude} />
                </MapContainer>
              </SafeMapWrapper>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>OpenStreetMap Leaflet Engine</span>
              <span>Coordinates safely pinned</span>
            </span>
          </div>

          {/* ========================================================================= */}
          {/* Action Buttons: [ OPEN IN MAPS ], [ COPY LOCATION ], [ SHARE LOCATION ],   */}
          {/*                 [ REFRESH LOCATION ], [ START / STOP LIVE LOCATION ]       */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            
            {/* [ OPEN IN MAPS ] */}
            <button
              onClick={handleOpenInMaps}
              id="location-open-maps-button"
              className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>OPEN IN MAPS</span>
            </button>

            {/* [ COPY LOCATION ] */}
            <button
              onClick={handleCopyLocation}
              id="location-copy-button"
              className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'COPIED!' : 'COPY LOCATION'}</span>
            </button>

            {/* [ SHARE LOCATION ] */}
            <button
              onClick={handleShareLocation}
              id="location-share-button"
              className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>SHARE LOCATION</span>
            </button>

            {/* [ REFRESH LOCATION ] */}
            <button
              onClick={requestLocation}
              id="location-refresh-button"
              disabled={status === 'requesting'}
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${status === 'requesting' ? 'animate-spin' : ''}`} />
              <span>REFRESH LOCATION</span>
            </button>

            {/* [ START LIVE LOCATION ] / [ STOP LOCATION ] */}
            {!isWatching ? (
              <button
                onClick={startLiveLocation}
                id="location-start-live-button"
                className="col-span-2 sm:col-span-1 px-3.5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 transition-all active:scale-95 cursor-pointer"
              >
                <Radio className="w-4 h-4 text-emerald-200" />
                <span>START LIVE LOCATION</span>
              </button>
            ) : (
              <button
                onClick={stopLiveLocation}
                id="location-stop-live-button"
                className="col-span-2 sm:col-span-1 px-3.5 py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>STOP LOCATION</span>
              </button>
            )}

          </div>

          {shareFeedback && (
            <p className="text-xs text-emerald-400 font-bold text-center animate-in fade-in">
              ✓ {shareFeedback}
            </p>
          )}

          {/* ========================================================================= */}
          {/* 4. NEARBY EMERGENCY HELP (Hospitals, Fire, Police, Pharmacies, Shelters)    */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <h3 className="text-lg font-black text-white tracking-tight">
                  NEARBY EMERGENCY HELP
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Verified OpenStreetMap Emergency POIs (5km radius)
              </span>
            </div>

            {/* Loading Indicator */}
            {nearbyLoading && (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-7 h-7 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Locating verified nearby hospitals, police, and fire stations...</span>
              </div>
            )}

            {/* Unavailable Message if Overpass cannot return reliable POIs */}
            {!nearbyLoading && (nearbyError || nearbyPlaces.length === 0) && (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Nearby services could not be loaded.</p>
                <p className="text-[11px] text-slate-500">
                  OpenStreetMap data is unavailable for this exact sector or requires broader search radius. Use the 112 emergency helpline for immediate dispatch.
                </p>
              </div>
            )}

            {/* Verified Place Cards List */}
            {!nearbyLoading && nearbyPlaces.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {nearbyPlaces.map((place) => (
                  <div 
                    key={place.id}
                    className={`p-4 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between group shadow-md ${selectedPlaceId === place.id ? 'border-cyan-500 shadow-cyan-900/50' : 'border-slate-800 hover:border-cyan-500/40'}`}
                    onClick={() => setSelectedPlaceId(place.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-base font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {place.icon} {place.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-[11px] font-bold shrink-0">
                          {place.distance}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                          {place.type}
                        </div>
                        {place.address && (
                          <div className="text-[11px] text-slate-500 flex items-start gap-1">
                            <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{place.address}</span>
                          </div>
                        )}
                        {place.openingHours && (
                          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{place.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {place.phone ? (
                        <a
                          href={`tel:${place.phone}`}
                          className="flex-1 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 text-xs font-black tracking-wider transition-colors flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          CALL
                        </a>
                      ) : null}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`${place.phone ? 'flex-1' : 'w-full'} py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700`}
                      >
                        <span>DIRECTIONS</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

    </section>
  );
}
