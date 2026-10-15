import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, ChevronDown, X, Check } from 'lucide-react';

interface AreaRangeSelectProps {
  minArea?: number;
  maxArea?: number;
  onChange: (min?: number, max?: number) => void;
  className?: string;
  compact?: boolean;
}

interface AreaPreset {
  label: string;
  sub: string;
  min?: number;
  max?: number;
}

const PRESETS: AreaPreset[] = [
  { label: 'Any Area', sub: 'Show all sizes' },
  { label: 'Under 1,200 sq.ft', sub: '1 & 2 BHK flats', max: 1200 },
  { label: '1,200 – 1,800 sq.ft', sub: 'Standard 2 & 3 BHK', min: 1200, max: 1800 },
  { label: '1,800 – 2,800 sq.ft', sub: 'Spacious 3 & 4 BHK', min: 1800, max: 2800 },
  { label: '2,800 – 4,000 sq.ft', sub: 'Luxury high-rises & duplex', min: 2800, max: 4000 },
  { label: '4,000+ sq.ft', sub: 'Independent villas & commercial', min: 4000 }
];

export const AreaRangeSelect: React.FC<AreaRangeSelectProps> = ({
  minArea,
  maxArea,
  onChange,
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMin, setCustomMin] = useState<string>(minArea ? String(minArea) : '');
  const [customMax, setCustomMax] = useState<string>(maxArea ? String(maxArea) : '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomMin(minArea ? String(minArea) : '');
    setCustomMax(maxArea ? String(maxArea) : '');
  }, [minArea, maxArea]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = () => {
    if (minArea && maxArea) {
      return `${minArea.toLocaleString('en-IN')} – ${maxArea.toLocaleString('en-IN')} sq.ft`;
    }
    if (minArea && !maxArea) {
      return `${minArea.toLocaleString('en-IN')}+ sq.ft`;
    }
    if (!minArea && maxArea) {
      return `Up to ${maxArea.toLocaleString('en-IN')} sq.ft`;
    }
    return 'Area Range (sq.ft)';
  };

  const isPresetActive = (p: AreaPreset) => {
    return p.min === minArea && p.max === maxArea;
  };

  const handleSelectPreset = (p: AreaPreset) => {
    onChange(p.min, p.max);
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = customMin ? Number(customMin) : undefined;
    const maxVal = customMax ? Number(customMax) : undefined;
    onChange(minVal, maxVal);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined, undefined);
    setCustomMin('');
    setCustomMax('');
  };

  const hasValue = Boolean(minArea || maxArea);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-left bg-slate-50 hover:bg-white focus:bg-white rounded-xl border transition cursor-pointer select-none ${
          isOpen ? 'border-rose-500 ring-2 ring-rose-200 bg-white' : 'border-slate-200 hover:border-slate-300'
        } ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-sm'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Maximize2 className={`flex-shrink-0 text-rose-600 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          <span className={`truncate ${hasValue ? 'font-bold text-slate-900' : 'text-slate-500 font-normal'}`}>
            {getLabel()}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {hasValue && (
            <span
              onClick={handleClear}
              title="Clear area range"
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
        </div>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn p-3 w-80 max-w-[calc(100vw-2rem)]">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Area Range (sq.ft)
          </div>

          {/* Presets List */}
          <div className="space-y-1 mb-3">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                  isPresetActive(p)
                    ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-[10px] text-slate-400">{p.sub}</div>
                </div>
                {isPresetActive(p) && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            ))}
          </div>

          {/* Custom Min/Max Inputs */}
          <form onSubmit={handleApplyCustom} className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Or Custom Range
            </span>
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Min sq.ft</label>
                <input
                  type="number"
                  value={customMin}
                  onChange={e => setCustomMin(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Max sq.ft</label>
                <input
                  type="number"
                  value={customMax}
                  onChange={e => setCustomMax(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                Apply Range
              </button>
              {hasValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
