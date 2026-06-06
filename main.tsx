import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  FileImage, 
  Info,
  Layers,
  HelpCircle,
  Camera
} from 'lucide-react';
import { DitherSettings, DitherShape } from './types';
import { DEFAULT_SHAPES } from './components/SvgPresets';
import { DitherCanvas } from './components/DitherCanvas';
import { DitherControls } from './components/DitherControls';
import { CameraCapture } from './components/CameraCapture';

// Generates beautiful offline high fidelity demo images dynamically using canvas
const generatePresetImage = (type: 'synthwave' | 'cyber' | 'geometric'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'synthwave') {
    // 1. Synthwave landscape
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 480);
    skyGrad.addColorStop(0, '#020617'); // slate 950
    skyGrad.addColorStop(0.35, '#1e1b4b'); // indigo 950
    skyGrad.addColorStop(0.65, '#4c0519'); // rose 950
    skyGrad.addColorStop(0.9, '#f97316'); // orange 500
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 640, 480);

    // Glowing Sun
    const sunGrad = ctx.createLinearGradient(0, 120, 0, 320);
    sunGrad.addColorStop(0, '#fef08a'); // yellow 200
    sunGrad.addColorStop(0.6, '#f43f5e'); // rose 500
    sunGrad.addColorStop(1, '#db2777'); // pink 600
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(320, 220, 90, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal bars cutting sun
    ctx.fillStyle = '#1e1b4b';
    for (let y = 140; y < 320; y += 12) {
      const h = (y - 120) / 12;
      ctx.fillRect(200, y, 240, Math.max(2, h));
    }

    // Grid floor
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1;
    const horizon = 300;
    // Vanishing lines
    for (let x = -200; x <= 840; x += 40) {
      ctx.beginPath();
      ctx.moveTo(320, horizon);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    // Horizontal perspective lines
    for (let y = horizon; y <= 480; y += 14) {
      const ratio = (y - horizon) / (480 - horizon);
      ctx.strokeStyle = `rgba(244, 63, 94, ${ratio * 0.7})`;
      ctx.lineWidth = ratio * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }

    // Vector hills
    ctx.fillStyle = '#0f051d';
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(120, 240);
    ctx.lineTo(240, 290);
    ctx.lineTo(380, 200);
    ctx.lineTo(520, 280);
    ctx.lineTo(640, 220);
    ctx.lineTo(640, 300);
    ctx.lineTo(0, 300);
    ctx.closePath();
    ctx.fill();

  } else if (type === 'cyber') {
    // 2. High-contrast organic Cyberpunk concentric spheres & glowing abstract elements
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, 640, 480);

    // Circular abstract glow (Faux-radial gradient)
    for (let r = 240; r > 0; r -= 4) {
      const alpha = (1.0 - r / 240) * 0.15;
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`; // purple 500
      ctx.beginPath();
      ctx.arc(200, 240, r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let r = 180; r > 0; r -= 4) {
      const alpha = (1.0 - r / 180) * 0.22;
      ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`; // cyan 500
      ctx.beginPath();
      ctx.arc(440, 200, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Geometric grid accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 640; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    for (let y = 0; y < 480; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }

    // Crisp sharp vector circles and squares
    ctx.strokeStyle = '#f472b6'; // pink 400
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(320, 240, 100, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8'; // sky 400
    ctx.lineWidth = 3;
    ctx.strokeRect(220, 140, 200, 200);

    // Some bright high contrast text inside details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DIGITAL DITHER', 320, 248);

    // Diagonal warning decals
    ctx.fillStyle = '#eab308'; // yellow-500
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(160, 10);
    ctx.lineTo(140, 30);
    ctx.lineTo(10, 30);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '900 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('WARNING: GRAPHICS ACTIVE', 20, 24);

  } else {
    // 3. Abstract high frequencies & optical geometry
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 640, 480);

    // Radial stripes (expanding rays)
    ctx.fillStyle = '#000000';
    for (let a = 0; a < 360; a += 15) {
      ctx.beginPath();
      ctx.moveTo(320, 240);
      const r1 = a * Math.PI / 180;
      const r2 = (a + 7) * Math.PI / 180;
      ctx.lineTo(320 + Math.cos(r1) * 800, 240 + Math.sin(r1) * 800);
      ctx.lineTo(320 + Math.cos(r2) * 800, 240 + Math.sin(r2) * 800);
      ctx.closePath();
      ctx.fill();
    }

    // Big central grey bubble
    const grad = ctx.createRadialGradient(320, 240, 20, 320, 240, 160);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#7f7f7f');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(320, 240, 160, 0, Math.PI * 2);
    ctx.fill();

    // High frequency rings
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    for (let i = 20; i < 280; i += 24) {
      ctx.beginPath();
      ctx.arc(320, 240, i, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  return canvas.toDataURL('image/jpeg');
};

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core settings state
  const [settings, setSettings] = useState<DitherSettings>({
    aspectRatio: 'original',
    gridResolution: 55,
    backgroundColor: '#0c0a09', // stone-950
    invert: false,
    scaleLogic: 'linear_up',
    minScale: 0.15,
    maxScale: 1.1,
    rotationLogic: 'constant',
    baseRotation: 0,
    snapTo90: true, // Requested default
    gamma: 1.0,
  });

  // 7 customizable states (from Shadow to Highlight)
  const [shapes, setShapes] = useState<DitherShape[]>(() => {
    // Clone standard shapes
    return JSON.parse(JSON.stringify(DEFAULT_SHAPES));
  });

  // Source files and loading configurations
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'synthwave' | 'cyber' | 'geometric' | 'uploaded'>('synthwave');
  const [presetUrls, setPresetUrls] = useState<{ [key: string]: string }>({});

  // Generate presets on start
  useEffect(() => {
    setPresetUrls({
      synthwave: generatePresetImage('synthwave'),
      cyber: generatePresetImage('cyber'),
      geometric: generatePresetImage('geometric')
    });
  }, []);

  const handleResetDefaultShapes = () => {
    setShapes(JSON.parse(JSON.stringify(DEFAULT_SHAPES)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      setActivePreset('uploaded');
      // Reset so the same file can be re-selected without being ignored
      e.target.value = '';
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSourceFile(file);
      setActivePreset('uploaded');
    }
  };

  const selectPreset = (type: 'synthwave' | 'cyber' | 'geometric') => {
    setSourceFile(null);
    setActivePreset(type);
  };

  const removeUploadedFile = () => {
    setSourceFile(null);
    setActivePreset('synthwave');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#d1d1d1] selection:bg-indigo-600/35 selection:text-white flex flex-col" id="dither-workspace-container">
      
      {/* Immersive UI header line */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0c] shrink-0" id="studio-header">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs tracking-widest font-display">DTHR</div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">DITHER_LAB_07</h1>
            <p className="text-[10px] uppercase opacity-40 font-mono">v1.2 // Production Ready</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsCameraOpen(true)}
            className="px-3 py-1.5 bg-indigo-600/15 border border-indigo-500/30 text-[10px] uppercase tracking-widest hover:bg-indigo-600/30 text-indigo-300 font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Use Camera</span>
          </button>
          <button 
            onClick={triggerUploadClick}
            className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/10 text-slate-300 font-medium transition cursor-pointer"
          >
            Import Media
          </button>
          <button 
            onClick={() => {
              const mainDitherCanvas = document.getElementById('dither-main-display') as HTMLCanvasElement;
              if (mainDitherCanvas) {
                const dataUrl = mainDitherCanvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `dither_studio_${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
              }
            }}
            className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-indigo-500 transition cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            Export Filter
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Viewport Canvas and Media Source Uploader (7 Column spans) */}
          <div className="lg:col-span-7 space-y-6" id="dither-visuals-left-lane">
            
            {/* Aspect, canvas displays, and video render pipeline */}
            {isCameraOpen ? (
              <div className="relative w-full h-[480px] min-h-[460px]">
                <CameraCapture 
                  onCapture={(file) => {
                    setSourceFile(file);
                    setActivePreset('uploaded');
                    setIsCameraOpen(false);
                  }}
                  onClose={() => setIsCameraOpen(false)}
                />
              </div>
            ) : (
              <DitherCanvas
                settings={settings}
                shapes={shapes}
                sourceFile={sourceFile}
                presetImageUrl={activePreset !== 'uploaded' ? presetUrls[activePreset] || null : null}
              />
            )}

            {/* Drag and Drop Upload Hub styled as Immersive UI */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-pointer ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-950/15' 
                  : 'border-white/10 hover:border-white/20 bg-[#0a0a0c]/60 hover:bg-[#0a0a0c]'
              }`}
              onClick={triggerUploadClick}
              id="file-dropzone-panel"
            >
              <input
                id="hidden-media-uploader"
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-350 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-4 h-4" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Drag & drop media or <span className="text-indigo-400 group-hover:underline">browse locally</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono uppercase">
                  Supports JPG, PNG, WEBP, and MP4 video formats
                </p>
              </div>

              <div className="flex gap-2.5 justify-center items-center mt-1" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">Or</span>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-3.5 py-1.5 bg-indigo-600/10 border border-indigo-500/25 text-indigo-400 rounded text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-indigo-600/25 transition cursor-pointer select-none active:scale-95 flex items-center gap-1.5"
                >
                  <Camera className="w-3 h-3" />
                  <span>Snap Live Camera</span>
                </button>
              </div>

              {sourceFile && (
                <div 
                  className="absolute top-3 right-3 bg-black border border-white/10 hover:border-rose-950 rounded p-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1.5 shadow-lg group-hover:translate-x-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUploadedFile();
                  }}
                  title="Remove uploaded media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] hidden sm:inline uppercase tracking-widest">Clear</span>
                </div>
              )}
            </div>

            {/* Quick Presets Gallery Segment */}
            <div className="space-y-3 bg-[#0a0a0c] p-4 rounded-xl border border-white/10" id="preset-gallery-hub">
              <label className="text-[10px] uppercase tracking-widest opacity-50 block font-mono">
                System Presets: Reference Graphics
              </label>
              <div className="grid grid-cols-3 gap-3">
                
                {/* Preset 1 (Synthwave) */}
                <button
                  id="demo-preset-synthwave"
                  onClick={() => selectPreset('synthwave')}
                  className={`relative aspect-video rounded-lg border overflow-hidden p-1 transition-all flex flex-col justify-end text-left group cursor-pointer ${
                    activePreset === 'synthwave'
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.01]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {presetUrls.synthwave ? (
                    <img src={presetUrls.synthwave} alt="Synthwave" className="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:brightness-40 transition" />
                  ) : (
                    <div className="absolute inset-0 bg-indigo-950" />
                  )}
                  <span className="relative text-[9px] font-bold tracking-wider text-white font-mono bg-black/80 px-1.5 py-0.5 rounded shadow uppercase">01 // Synth</span>
                </button>

                {/* Preset 2 (Cyber punk glow) */}
                <button
                  id="demo-preset-cyber"
                  onClick={() => selectPreset('cyber')}
                  className={`relative aspect-video rounded-lg border overflow-hidden p-1 transition-all flex flex-col justify-end text-left group cursor-pointer ${
                    activePreset === 'cyber'
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.01]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {presetUrls.cyber ? (
                    <img src={presetUrls.cyber} alt="Cyberpunk" className="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:brightness-40 transition" />
                  ) : (
                    <div className="absolute inset-0 bg-violet-950" />
                  )}
                  <span className="relative text-[9px] font-bold tracking-wider text-white font-mono bg-black/80 px-1.5 py-0.5 rounded shadow uppercase">02 // Cyber</span>
                </button>

                {/* Preset 3 (Optical Geometrics) */}
                <button
                  id="demo-preset-geometric"
                  onClick={() => selectPreset('geometric')}
                  className={`relative aspect-video rounded-lg border overflow-hidden p-1 transition-all flex flex-col justify-end text-left group cursor-pointer ${
                    activePreset === 'geometric'
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.01]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {presetUrls.geometric ? (
                    <img src={presetUrls.geometric} alt="Geometric" className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:brightness-50 transition" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}
                  <span className="relative text-[9px] font-bold tracking-wider text-white font-mono bg-black/80 px-1.5 py-0.5 rounded shadow uppercase">03 // Optical</span>
                </button>

              </div>
            </div>

            {/* Short Helpful Info Card */}
            <div className="p-4 rounded-xl bg-indigo-950/10 border border-white/5 text-xs text-indigo-350 flex gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 opacity-80" />
              <div className="space-y-1">
                <p className="font-semibold leading-none uppercase text-[11px] tracking-wider text-indigo-300">Pro Tip on Custom SVGs</p>
                <p className="text-[10px] text-indigo-450 uppercase font-mono tracking-tight leading-normal opacity-70">
                  Any vector elements using <code className="bg-black text-[9px] font-mono px-1 py-0.5 rounded">fill="currentColor"</code> inside your uploaded SVGs will react dynamically to your selected color highlight states!
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: Comprehensive Control Dashboard Panel (5 Column spans) */}
          <div className="lg:col-span-5" id="dither-controls-sidebar">
            <DitherControls
              settings={settings}
              setSettings={setSettings}
              shapes={shapes}
              setShapes={setShapes}
              onResetDefaultShapes={handleResetDefaultShapes}
            />
          </div>

        </div>
      </main>

      {/* Immersive Lab Footer */}
      <footer className="h-10 mt-auto border-t border-white/10 bg-[#0a0a0c] flex items-center justify-between px-6 text-[9px] uppercase tracking-[0.2em] font-mono text-slate-400 shrink-0">
        <div className="flex gap-6">
          <span>FPS: 60.0</span>
          <span>GPU_MEM: 1.2GB</span>
          <span>KERNEL: VECC_RAST_07</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-400 font-semibold">STATUS: READY</span>
          <span className="opacity-30">0x000FF922</span>
        </div>
      </footer>
    </div>
  );
}
