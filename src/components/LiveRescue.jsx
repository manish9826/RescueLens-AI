import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertTriangle, ShieldCheck, Upload, RefreshCw } from 'lucide-react';

export default function LiveRescue({ onAnalyze, isLoading, error }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  
  const [capturedImage, setCapturedImage] = useState(null);

  // Sync the stream with the video element reliably
  useEffect(() => {
    if (cameraAllowed && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => {
        console.error("Failed to play video:", e);
      });
    }
  }, [cameraAllowed, stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  };

  const requestCamera = async () => {
    setCameraError(null);
    setIsRequesting(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      setStream(mediaStream);
      setCameraAllowed(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Camera is unavailable on this device.');
      } else {
        setCameraError(err.message || 'An unknown error occurred while accessing the camera.');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure dimensions exist
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
    }
  };

  const retakeFrame = () => {
    setCapturedImage(null);
  };

  const confirmAndAnalyze = () => {
    if (capturedImage && onAnalyze) {
      onAnalyze({ image: capturedImage, mimeType: 'image/jpeg', description: 'Captured from Live Rescue Camera' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onAnalyze) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAnalyze({ image: reader.result, mimeType: file.type, description: 'Uploaded instead of Camera' });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-red-500 tracking-wide flex justify-center items-center gap-2">
          <Camera className="w-8 h-8" />
          LIVE RESCUE ASSISTANT
        </h1>
        <p className="text-slate-400 italic">"Point your camera at the scene and let RescueLens help you understand what to do next."</p>
      </div>

      {(error || cameraError) && (
        <div className="w-full bg-red-950/40 border border-red-500/50 text-red-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500 mt-0.5" />
            <p className="text-sm font-bold">{error || cameraError}</p>
          </div>
          {cameraError && (
            <div className="flex gap-2 shrink-0">
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-600 transition-colors">
                USE UPLOAD INSTEAD
              </button>
              <button onClick={requestCamera} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors">
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input for fallback */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="w-full bg-black border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center">
        {!cameraAllowed && !capturedImage ? (
          <div className="p-8 flex flex-col items-center text-center space-y-5">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-white">Camera access required</h3>
            <p className="text-slate-400 max-w-md font-medium">RescueLens needs access to your camera to analyze the emergency scene. We never record continuously.</p>
            <button
              onClick={requestCamera}
              disabled={isRequesting}
              className="mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-black text-lg py-4 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
            >
              {isRequesting ? 'Starting camera...' : 'ENABLE CAMERA'}
            </button>
          </div>
        ) : capturedImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain absolute inset-0" />
            
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-amber-500/90 text-white text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow">
                Frame Captured
              </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center gap-4 px-4">
              <button
                onClick={retakeFrame}
                disabled={isLoading}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-6 sm:px-10 rounded-full border border-slate-600 transition-all active:scale-95 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> RETAKE
              </button>
              <button
                onClick={confirmAndAnalyze}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white font-black py-4 px-6 sm:px-10 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-500 transition-all active:scale-95 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5" /> ANALYZE
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col bg-slate-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover absolute inset-0 z-0"
              style={{ backgroundColor: 'transparent' }}
            />
            <img src="/assets/emergency/structure-fire.svg" alt="Camera Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen pointer-events-none z-10" />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Professional Camera Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none border-[1px] border-white/10" />
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-red-500/80 m-4 z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-red-500/80 m-4 z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-red-500/80 m-4 z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-red-500/80 m-4 z-10 pointer-events-none" />
            
            {/* Scanning line animation */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_3s_ease-in-out_infinite] z-10 pointer-events-none" />

            <div className="absolute top-4 inset-x-0 z-20 flex justify-between px-6 pointer-events-none">
              <span className="text-white/70 font-black text-sm tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm">LIVE CAMERA</span>
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-slate-700/50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider">CAMERA LIVE</span>
              </div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 z-20 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-center pb-8">
              <button
                onClick={captureFrame}
                className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-12 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400 transition-all active:scale-95 flex items-center gap-3 text-lg"
              >
                <Camera className="w-6 h-6" /> CAPTURE & ANALYZE
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400 font-medium">
        <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
          <ShieldCheck className="w-5 h-5 text-cyan-500" />
          Privacy & Security
        </h4>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-600">
          <li>Camera is only activated after your explicit permission.</li>
          <li>Video is <strong>never</strong> recorded continuously. We only analyze the exact frame you capture.</li>
          <li>We do not automatically dispatch emergency services based on AI alone.</li>
        </ul>
      </div>

    </div>
  );
}
