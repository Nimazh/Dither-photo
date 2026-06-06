import React, { useRef } from 'react';
import { 
  Maximize2, 
  RotateCw, 
  Settings, 
  Sliders, 
  Layers, 
  Grid, 
  Palette, 
  Upload, 
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { AspectRatio, DitherSettings, DitherShape, ScaleLogic, RotationLogic } from '../types';
import { PRESET_PALETTES } from './SvgPresets';

interface DitherControlsProps {
  settings: DitherSettings;
  setSettings: React.Dispatch<React.SetStateAction<DitherSettings>>;
  shapes: DitherShape[];
  setShapes: React.Dispatch<React.SetStateAction<DitherShape[]>>;
  onResetDefaultShapes: () => void;
}

export const DitherControls: React.FC<DitherControlsProps> = ({
  settings,
  setSettings,
  shapes,
  setShapes,
  onResetDefaultShapes
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update a single control key
  type SettingsKeys = keyof DitherSettings;
  const updateSetting = <K extends SettingsKeys>(key: K, value: DitherSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Update color of a specific state
  const handleShapeColorChange = (index: number, color: string) => {
    setShapes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], color };
      return next;
    });
  };

  // Handle uploaded SVG replacement
  const handleSvgUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Very basic validation - must contain a tag starting with '<svg'
      if (text.toLowerCase().includes('<svg')) {
        // Strip out any specified fixed fill or stroke if they override currentColor,
        // or just let the reader replace it. For SVG uploads, replace hardcoded fills with currentColor to allow changing colors,
        // or clean up inline widths. But standard loaded SVG can just be updated.
        setShapes((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], svgContent: text };
          return next;
        });
      } else {
        alert('Invalid file format. Please upload a plain text SVG file.');
      }
    };
    reader.readAsText(file);
  };

  // Apply quick preset palette
  const applyPalette = (backgroundColor: string, colors: string[]) => {
    setSettings((prev) => ({ ...prev, backgroundColor }));
    setShapes((prev) => {
      return prev.map((shape, idx) => ({
        ...shape,
        color: colors[idx] || shape.color
      }));
    });
  };

  return (
    <div className="flex flex-col gap-6" id="dither-controls-panel">
      
      {/* SECTION 1: Source & Grid Layout Layout */}
      <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2 font-mono opacity-80 border-b border-white/5 pb-2.5">
          <Grid className="w-3.5 h-3.5 text-indigo-400" />
          <span>01 // GRID & ORIENTATION</span>
        </h2>

        {/* Aspect Ratio Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-wider text-slate-400 block uppercase font-mono">Aspect Ratio Limit</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="aspect-original-button"
              onClick={() => updateSetting('aspectRatio', 'original')}
              className={`py-2 px-3 text-[10px] uppercase tracking-wider font-mono rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                settings.aspectRatio === 'original'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-black border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Original Aspect</span>
            </button>
            <button
              id="aspect-1x1-button"
              onClick={() => updateSetting('aspectRatio', '1x1')}
              className={`py-2 px-3 text-[10px] uppercase tracking-wider font-mono rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                settings.aspectRatio === '1x1'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-black border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="w-3 h-3 font-bold flex items-center justify-center border border-current text-[8px] rounded-[2px] leading-none font-mono">1:1</span>
              <span>1x1 Squarified</span>
            </button>
          </div>
        </div>

        {/* Grid Resolution Controller */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            <label htmlFor="grid-resolution-slider" className="font-semibold">Grid Columns Limit</label>
            <span className="font-mono text-indigo-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {settings.gridResolution} Cells Wide
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateSetting('gridResolution', Math.max(12, settings.gridResolution - 1))}
              className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
              title="Decrease resolution"
            >
              -
            </button>
            <input
              id="grid-resolution-slider"
              type="range"
              min={12}
              max={150}
              step={1}
              value={settings.gridResolution}
              onChange={(e) => updateSetting('gridResolution', parseInt(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
            />
            <button
              onClick={() => updateSetting('gridResolution', Math.min(150, settings.gridResolution + 1))}
              className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
              title="Increase resolution"
            >
              +
            </button>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase tracking-wider px-1">
            <span>12c (Sparse)</span>
            <span>75c</span>
            <span>150c (Detailed)</span>
          </div>
        </div>

        {/* Inversion controller */}
        <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/10">
          <div className="space-y-0.5">
            <label htmlFor="invert-controller-toggle" className="text-xs font-semibold uppercase tracking-wider text-slate-300 block font-mono">Invert Highlight Logic</label>
            <span className="text-[10px] text-slate-500 block">Swap shadow and highlight maps</span>
          </div>
          <button
            id="invert-controller-toggle"
            onClick={() => updateSetting('invert', !settings.invert)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.invert ? 'bg-indigo-600' : 'bg-white/10'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.invert ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* SECTION 2: 7 Highlight States Editor */}
      <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <h2 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2 font-mono opacity-80">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>02 // HIGHLIGHT STATE MAP</span>
          </h2>
          <button
            id="reset-shapes-button"
            onClick={onResetDefaultShapes}
            className="text-[9px] font-mono text-slate-500 hover:text-indigo-400 flex items-center gap-1 bg-black px-2 py-1 rounded border border-white/10 transition uppercase tracking-widest cursor-pointer"
            title="Restore original shapes and paths"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Preset Palette Board */}
        <div className="space-y-2 bg-black p-3 rounded-lg border border-white/5">
          <label className="text-[10px] font-semibold tracking-wider text-slate-400 block flex items-center gap-1.5 leading-none uppercase font-mono">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Fast Gradient Palettes</span>
          </label>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {PRESET_PALETTES.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPalette(preset.backgroundColor, preset.colors)}
                className="p-1.5 rounded bg-[#0a0a0c] border border-white/10 hover:border-white/25 hover:bg-black transition flex items-center justify-between gap-1 text-[9px] font-mono text-left uppercase tracking-wider cursor-pointer"
              >
                <span className="text-slate-300 font-medium truncate max-w-[64px]">{preset.name}</span>
                <div className="flex shrink-0 gap-0.5">
                  {preset.colors.slice(0, 4).map((c, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full border border-black"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Solid Background Colorpicker */}
        <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/10">
          <div className="space-y-0.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block font-mono">Dither Canvas Background</label>
            <span className="text-[10px] text-slate-500 block">Set flat container color</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="bg-color-picker-input"
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSetting('backgroundColor', e.target.value)}
              className="w-7 h-7 rounded border border-white/15 bg-transparent cursor-pointer p-0"
            />
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{settings.backgroundColor}</span>
          </div>
        </div>

        {/* 7 Highlight Slots Selector-Mapping */}
        <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {shapes.map((shape, idx) => (
            <div 
              key={shape.id}
              className="p-2.5 bg-black/55 rounded-lg border border-white/5 flex items-center justify-between gap-3 group relative hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {/* Visual state rank indicator */}
                <div className="w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center text-[9px] font-mono text-slate-400 font-bold shrink-0">
                  {idx + 1}
                </div>

                {/* SVG Visual preview display box */}
                <div 
                  className="w-10 h-10 rounded bg-[#050505] border border-white/10 p-1 flex items-center justify-center text-slate-350 overflow-hidden relative"
                  style={{ color: shape.color }}
                  dangerouslySetInnerHTML={{ __html: shape.svgContent }}
                />

                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-300">
                    {idx === 0 ? 'Darkest (Shadow)' : idx === 6 ? 'Brightest (Highlight)' : `Level 0${idx + 1}`}
                  </span>
                  <button 
                    id={`upload-svg-btn-${idx}`}
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 mt-0.5 uppercase tracking-wider cursor-pointer"
                  >
                    <Upload className="w-2.5 h-2.5" />
                    <span>Upload SVG</span>
                  </button>
                  <input
                    type="file"
                    ref={(el) => { fileInputRefs.current[idx] = el; }}
                    accept=".svg"
                    onChange={(e) => handleSvgUpload(idx, e)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Individual color input */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  id={`shape-color-${idx}`}
                  type="color"
                  value={shape.color}
                  onChange={(e) => handleShapeColorChange(idx, e.target.value)}
                  className="w-6 h-6 rounded border border-white/15 bg-transparent cursor-pointer p-0"
                />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{shape.color}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Custom Sizing & Dynamic Scaling */}
      <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2 font-mono opacity-80 border-b border-white/5 pb-2.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>03 // SIZING MATRIX DISTRIBUTION</span>
        </h2>

        {/* Scale logic selector */}
        <div className="space-y-2">
          <label htmlFor="scale-logic-selector" className="text-[11px] font-semibold tracking-wider text-slate-400 block uppercase font-mono">Sizing Distribution Curve</label>
          <select
            id="scale-logic-selector"
            value={settings.scaleLogic}
            onChange={(e) => updateSetting('scaleLogic', e.target.value as ScaleLogic)}
            className="w-full text-[10px] font-mono uppercase tracking-wider bg-black border border-white/10 rounded-lg p-2.5 text-slate-300 outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="constant">Constant Size (Max Scale)</option>
            <option value="linear_up">Linear (Darkest = Min, Brightest = Max)</option>
            <option value="linear_down">Linear Inverted (Darkest = Max, Brightest = Min)</option>
            <option value="midtone_peak">Midtone Peak (Middle Values = Max Scale)</option>
            <option value="midtone_valley">Midtone Valley (Middle Values = Min Scale)</option>
          </select>
        </div>

        {/* Min / Max size sliders */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400">
              <label htmlFor="min-scale-slider">Min Size</label>
              <span className="font-mono text-slate-350">{settings.minScale.toFixed(2)}x</span>
            </div>
            <input
              id="min-scale-slider"
              type="range"
              min={0.05}
              max={1.5}
              step={0.05}
              value={settings.minScale}
              onChange={(e) => updateSetting('minScale', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400">
              <label htmlFor="max-scale-slider">Max Size</label>
              <span className="font-mono text-slate-350">{settings.maxScale.toFixed(2)}x</span>
            </div>
            <input
              id="max-scale-slider"
              type="range"
              min={0.05}
              max={2.0}
              step={0.05}
              value={settings.maxScale}
              onChange={(e) => updateSetting('maxScale', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Rotation & Snapping */}
      <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
        <h2 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-2 font-mono opacity-80 border-b border-white/5 pb-2.5">
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>04 // ORIENTATION SPECS</span>
        </h2>

        {/* Rotation Logic */}
        <div className="space-y-2">
          <label htmlFor="rotation-logic-selector" className="text-[11px] font-semibold tracking-wider text-slate-400 block uppercase font-mono">Angle Distribution System</label>
          <select
            id="rotation-logic-selector"
            value={settings.rotationLogic}
            onChange={(e) => updateSetting('rotationLogic', e.target.value as RotationLogic)}
            className="w-full text-[10px] font-mono uppercase tracking-wider bg-black border border-white/10 rounded-lg p-2.5 text-slate-300 outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="constant">Uniform Global Angle</option>
            <option value="brightness">Grayscale-based Orientation</option>
            <option value="coordinate">Alternating Coordinate Grid</option>
            <option value="random">Dynamic Stable Randomizer</option>
          </select>
        </div>

        {/* Base Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <label htmlFor="base-rotation-slider">Base Orientation Angle</label>
            <span className="font-mono text-cyan-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              {settings.baseRotation}°
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateSetting('baseRotation', Math.max(0, settings.baseRotation - 5))}
              className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
              title="Decrease rotation"
            >
              -
            </button>
            <input
              id="base-rotation-slider"
              type="range"
              min={0}
              max={360}
              step={5}
              value={settings.baseRotation}
              onChange={(e) => updateSetting('baseRotation', parseInt(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded appearance-none cursor-pointer accent-cyan-400 outline-none"
            />
            <button
              onClick={() => updateSetting('baseRotation', Math.min(360, settings.baseRotation + 5))}
              className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
              title="Increase rotation"
            >
              +
            </button>
          </div>
        </div>

        {/* Snap to 90 Degrees Controller */}
        <div className="flex items-center justify-between p-3 bg-black rounded-lg border border-white/10">
          <div className="space-y-0.5">
            <label htmlFor="snap-to-90-checkbox" className="text-xs font-semibold uppercase tracking-wider text-slate-300 block font-mono">Snap to 90° Increments</label>
            <span className="text-[10px] text-slate-500 block">Force strict orthogonal angles (0/90/180/270)</span>
          </div>
          <button
            id="snap-to-90-checkbox"
            onClick={() => updateSetting('snapTo90', !settings.snapTo90)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.snapTo90 ? 'bg-cyan-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.snapTo90 ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* SECTION 5: Response Curve (Contrast Adjustment) */}
      <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 space-y-4 mb-2 shadow-xl">
        <div className="flex items-center justify-between">
          <label htmlFor="gamma-slider" className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 font-mono opacity-80">
            <Settings className="w-3.5 h-3.5 text-orange-400" />
            <span>05 // CONTRAST RESPONSE CURVE</span>
          </label>
          <span className="text-[10px] font-mono text-orange-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {settings.gamma.toFixed(2)}x
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSetting('gamma', parseFloat((Math.max(0.3, settings.gamma - 0.05)).toFixed(2)))}
            className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
            title="Decrease contrast gamma"
          >
            -
          </button>
          <input
            id="gamma-slider"
            type="range"
            min={0.3}
            max={3.0}
            step={0.05}
            value={settings.gamma}
            onChange={(e) => updateSetting('gamma', parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 outline-none"
          />
          <button
            onClick={() => updateSetting('gamma', parseFloat((Math.min(3.0, settings.gamma + 0.05)).toFixed(2)))}
            className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center text-sm font-mono text-slate-400 hover:bg-white/10 select-none cursor-pointer hover:text-white transition active:scale-95"
            title="Increase contrast gamma"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase tracking-wider px-1">
          <span>High Exposure (0.3)</span>
          <span>1.0 (Linear)</span>
          <span>Rich Shadows (3.0)</span>
        </div>
      </div>

    </div>
  );
};
