import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(
        err.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please enable camera access in your settings.' 
          : 'Could not detect camera. Make sure no other app is using it.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;

    // Create a canvas to snap the current frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, flip horizontally for a natural mirror snap
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `cam_snap_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        onClose();
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="absolute inset-0 bg-black/95 z-40 flex flex-col justify-between p-4 rounded-xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">SYS_CAMERA_INPUT_01</span>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 bg-white/5 border border-white/10 rounded flex items-center justify-center hover:bg-white/10 text-white transition cursor-pointer"
          title="Close Camera"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 my-4 bg-black relative rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-[9px] font-mono tracking-wider uppercase">Activating camera hardware...</span>
          </div>
        )}

        {error ? (
          <div className="p-4 text-center max-w-sm space-y-3 z-10">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-[11px] font-mono uppercase text-rose-400 tracking-wide">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] uppercase font-mono tracking-widest text-slate-300 hover:bg-white/10 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            {/* Retro UI Overlay Crosshairs */}
            <div className="absolute inset-4 pointer-events-none border border-white/5 flex items-center justify-center">
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/30" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/30" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/30" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/30" />
              
              {/* Matrix focus grid circle */}
              <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-500/60 rounded-full" />
              </div>
              <span className="absolute bottom-2 right-2.5 text-[7px] font-mono text-white/20 tracking-widest uppercase">REC</span>
              <span className="absolute top-2 left-2.5 text-[7px] font-mono text-indigo-500/60 tracking-widest uppercase">720P HD</span>
            </div>
          </>
        )}
      </div>

      {/* Control bar */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={toggleCamera}
          disabled={!!error || loading}
          className="flex-1 h-11 max-w-[120px] bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest rounded text-slate-300 hover:bg-white/10 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>FLIP</span>
        </button>
        
        <button
          onClick={handleSnap}
          disabled={!!error || loading}
          className="flex-2 h-11 max-w-[200px] bg-indigo-600 text-white text-[10px] font-mono uppercase tracking-widest font-bold rounded hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <Camera className="w-4 h-4" />
          <span>SNAP FRAME</span>
        </button>
      </div>
    </div>
  );
};
