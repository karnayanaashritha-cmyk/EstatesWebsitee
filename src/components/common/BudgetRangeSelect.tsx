import React, { useState, useRef, useEffect } from 'react';
import { IndianRupee, ChevronDown, X, Check } from 'lucide-react';
import { formatIndianPrice } from '../../utils/formatters';

interface BudgetRangeSelectProps {
  minPrice?: number;
  maxPrice?: number;
  isRental?: boolean;
  onChange: (min?: number, max?: number) => void;
  className?: string;
  compact?: boolean;
}

export const BudgetRangeSelect: React.FC<BudgetRangeSelectProps> = ({
  minPrice,
  maxPrice,
  isRental = false,
  onChange,
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMin, setCustomMin] = useState<string>(minPrice ? String(minPrice) : '');
  const [customMax, setCustomMax] = useState<string>(maxPrice ? String(maxPrice) : '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomMin(minPrice ? String(minPrice) : '');
    setCustomMax(maxPrice ? String(maxPrice) : '');
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const BUY_PRESETS = [
    { label: 'Any Budget', sub: 'All prices' },
    { label: 'Under ₹75 Lakhs', sub: 'Affordable & 2 BHK', max: 7500000 },
    { label: '₹75L – ₹1.5 Cr', sub: 'Mid-range & 3 BHK', min: 7500000, max: 15000000 },
    { label: '₹1.5 Cr – ₹3 Cr', sub: 'Kokapet & Gachibowli luxury', min: 15000000, max: 30000000 },
    { label: '₹3 Cr – ₹5 Cr', sub: 'Villas & penthouses', min: 30000000, max: 50000000 },
    { label: '₹10 Cr+', sub: 'Ultra luxury villas & plots', min: 100000000 }
  ];

  const RENT_PRESETS = [
    { label: 'Any Rent', sub: 'All rentals' },
    { label: 'Under ₹25,000 / mo', max: 25000 },
    { label: '₹25,000 – ₹45,000 / mo', min: 25000, max: 45000 },
    { label: '₹45,000 – ₹75,000 / mo', min: 45000, max: 75000 },
    { label: '₹75,000 – ₹1.5L / mo', min: 75000, max: 150000 },
    { label: '₹1.5 Lakhs+ / mo', min: 150000 }
  ];

  const presets = isRental ? RENT_PRESETS : BUY_PRESETS;

  const getLabel = () => {
    if (minPrice && maxPrice) {
      return `${formatIndianPrice(minPrice, isRental)} – ${formatIndianPrice(maxPrice, isRental)}`;
    }
    if (minPrice && !maxPrice) {
      return `${formatIndianPrice(minPrice, isRental)}+`;
    }
    if (!minPrice && maxPrice) {
      return `Up to ${formatIndianPrice(maxPrice, isRental)}`;
    }
    return isRental ? 'Rent Budget' : 'Price / Budget';
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(customMin ? Number(customMin) : undefined, customMax ? Number(customMax) : undefined);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined, undefined);
    setCustomMin('');
    setCustomMax('');
  };

  const hasValue = Boolean(minPrice || maxPrice);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 text-left bg-slate-50 hover:bg-white focus:bg-white rounded-xl border transition cursor-pointer select-none ${
          isOpen ? 'border-rose-500 ring-2 ring-rose-200 bg-white' : 'border-slate-200 hover:border-slate-300'
        } ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-sm'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <IndianRupee className={`flex-shrink-0 text-rose-600 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          <span className={`truncate ${hasValue ? 'font-bold text-slate-900' : 'text-slate-500 font-normal'}`}>
            {getLabel()}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {hasValue && (
            <span
              onClick={handleClear}
              title="Clear budget"
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
            Select {isRental ? 'Monthly Rent' : 'Price Budget'}
          </div>

          <div className="space-y-1 mb-3">
            {presets.map((p, idx) => {
              const active = p.min === minPrice && p.max === maxPrice;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(p.min, p.max);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{p.label}</div>
                    {p.sub && <div className="text-[10px] text-slate-400">{p.sub}</div>}
                  </div>
                  {active && <Check className="w-4 h-4 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleApplyCustom} className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Custom INR Amount
            </span>
            <div className="grid grid-cols-2 gap-2 mb-2.5">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Min (₹)</label>
                <input
                  type="number"
                  value={customMin}
                  onChange={e => setCustomMin(e.target.value)}
                  placeholder={isRental ? '20000' : '5000000'}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Max (₹)</label>
                <input
                  type="number"
                  value={customMax}
                  onChange={e => setCustomMax(e.target.value)}
                  placeholder={isRental ? '80000' : '25000000'}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                Apply Budget
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
