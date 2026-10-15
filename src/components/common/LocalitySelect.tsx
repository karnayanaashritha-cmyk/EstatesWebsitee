import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { HYDERABAD_LOCALITIES } from '../../types';

interface LocalitySelectProps {
  value: string;
  onChange: (locality: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

// Key Hyderabad priority localities
const POPULAR_LOCALITIES = [
  'Gachibowli',
  'Kokapet',
  'Narsingi',
  'Miyapur',
  'Kukatpally',
  'Tellapur',
  'Manikonda',
  'LB Nagar',
  'Uppal',
  'Financial District'
];

export const LocalitySelect: React.FC<LocalitySelectProps> = ({
  value,
  onChange,
  placeholder = 'All Hyderabad Localities',
  className = '',
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredLocalities = HYDERABAD_LOCALITIES.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSelect = (locality: string) => {
    onChange(locality);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

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
          <MapPin className={`flex-shrink-0 text-rose-600 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          <span className={`truncate ${value ? 'font-bold text-slate-900' : 'text-slate-500 font-normal'}`}>
            {value ? `${value}, Hyderabad` : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <span
              onClick={handleClear}
              title="Clear locality"
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-rose-600' : ''}`} />
        </div>
      </button>

      {/* Searchable Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn max-h-[380px] flex flex-col w-full max-w-[calc(100vw-2rem)] sm:min-w-[280px]">
          {/* Search Input Box */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Type to search (e.g. Kokapet, Gachibowli, Miyapur)..."
                className="w-full pl-9 pr-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick-tap popular Hyderabad localities */}
          {!searchTerm && (
            <div className="p-2.5 border-b border-slate-100 bg-rose-50/40">
              <div className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-600" />
                <span>Popular Hyderabad Corridors</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {POPULAR_LOCALITIES.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition ${
                      value === loc
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-white hover:bg-rose-100 text-slate-700 border border-rose-100'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List of Localities */}
          <div className="overflow-y-auto py-1 divide-y divide-slate-50 flex-1">
            {/* "All Hyderabad" Option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition ${
                !value ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span>All Hyderabad Localities</span>
              </div>
              {!value && <Check className="w-4 h-4 text-rose-600" />}
            </button>

            {filteredLocalities.map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => handleSelect(loc)}
                className={`w-full px-3.5 py-2.5 text-xs flex items-center justify-between text-left transition ${
                  value === loc ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${value === loc ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{loc}</span>
                </div>
                {value === loc && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            ))}

            {filteredLocalities.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No Hyderabad localities matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
