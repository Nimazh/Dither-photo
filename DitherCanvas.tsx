import { DitherShape } from '../types';

export const DEFAULT_SHAPES: DitherShape[] = [
  {
    id: 'state_1',
    name: 'Level 1 (Shadow)',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="12" fill="currentColor" />
</svg>`,
    color: '#312e81', // indigo-900
    enabled: true
  },
  {
    id: 'state_2',
    name: 'Level 2',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="24" fill="currentColor" />
</svg>`,
    color: '#4338ca', // indigo-700
    enabled: true
  },
  {
    id: 'state_3',
    name: 'Level 3',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="42" y="15" width="16" height="70" rx="6" fill="currentColor" />
  <rect x="15" y="42" width="70" height="16" rx="6" fill="currentColor" />
</svg>`,
    color: '#06b6d4', // cyan-500
    enabled: true
  },
  {
    id: 'state_4',
    name: 'Level 4 (Midtone)',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="22" y="22" width="56" height="56" rx="10" fill="none" stroke="currentColor" stroke-width="16" />
</svg>`,
    color: '#10b981', // emerald-500
    enabled: true
  },
  {
    id: 'state_5',
    name: 'Level 5',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,15 15,80 85,80" fill="currentColor" />
</svg>`,
    color: '#84cc16', // lime-500
    enabled: true
  },
  {
    id: 'state_6',
    name: 'Level 6',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 8 L62 38 L95 38 L68 57 L78 88 L50 70 L22 88 L32 57 L5 38 L38 38 Z" fill="currentColor" />
</svg>`,
    color: '#eab308', // yellow-500
    enabled: true
  },
  {
    id: 'state_7',
    name: 'Level 7 (Highlight)',
    svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="90" height="90" rx="12" fill="currentColor" />
</svg>`,
    color: '#f97316', // orange-500
    enabled: true
  }
];

export const PRESET_PALETTES = [
  {
    name: 'Retro Amber',
    backgroundColor: '#0c0a09', // stone-950
    colors: ['#291500', '#5c3100', '#8f4f00', '#c26d00', '#e68400', '#ffa629', '#ffcc80']
  },
  {
    name: 'Classic Green Screen',
    backgroundColor: '#022c22', // emerald-950
    colors: ['#044e33', '#057a55', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#ecfdf5']
  },
  {
    name: 'Cyberpunk Neon',
    backgroundColor: '#100b1a', // custom dark violet
    colors: ['#3b0764', '#701a75', '#d946ef', '#ec4899', '#f43f5e', '#38bdf8', '#06b6d4']
  },
  {
    name: 'Monochrome',
    backgroundColor: '#000000',
    colors: ['#1e1e1e', '#404040', '#6b6b6b', '#949494', '#bdbdbd', '#e5e5e5', '#ffffff']
  },
  {
    name: 'Vintage Newspaper',
    backgroundColor: '#fbf8f3', // eggshell
    colors: ['#171717', '#262626', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4']
  },
  {
    name: 'Ocean Sunset',
    backgroundColor: '#0a192f',
    colors: ['#1e3a8a', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  }
];
