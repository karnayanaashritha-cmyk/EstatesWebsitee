import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Home, 
  IndianRupee, 
  Search, 
  X, 
  ChevronDown, 
  Check, 
  Building2, 
  Compass
} from 'lucide-react';
import { 
  LocationSuggestionType, 
  searchLocationSuggestions 
} from '../../data/locationSuggestions';
import { formatIndianPrice } from '../../utils/formatters';

export interface PropertySearchBarProps {
  initialLocations?: string[];
  initialPropertyTypes?: string[];
  initialMinPrice?: number;
  initialMaxPrice?: number;
  onSearch: (criteria: {
    locations: string[];
    propertyTypes: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  className?: string;
}

export interface PropertyTypeOption {
  id: string;
  label: string;
  shortLabel: string;
  category: 'residential' | 'commercial';
}

export const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = [
  { id: 'apartment', label: 'Flat / Apartment', shortLabel: 'Flat', category: 'residential' },
  { id: 'house', label: 'Independent House', shortLabel: 'House', category: 'residential' },
  { id: 'villa', label: 'Villa', shortLabel: 'Villa', category: 'residential' },
  { id: 'plot', label: 'Plot / Land', shortLabel: 'Plot', category: 'residential' },
  { id: 'commercial', label: 'Commercial Property', shortLabel: 'Commercial', category: 'commercial' },
  { id: 'office', label: 'Office Space', shortLabel: 'Office', category: 'commercial' },
  { id: 'shop', label: 'Shop / Retail Space', shortLabel: 'Shop', category: 'commercial' },
];

const BUDGET_PRESETS = [
  { label: 'Any Budget', min: undefined, max: undefined },
  { label: 'Under ₹50 Lakhs', min: undefined, max: 5000000 },
  { label: '₹50 Lakhs – ₹1 Crore', min: 5000000, max: 10000000 },
  { label: '₹1 Crore – ₹2 Crores', min: 10000000, max: 20000000 },
  { label: '₹2 Crores – ₹5 Crores', min: 20000000, max: 50000000 },
  { label: '₹5 Crores+', min: 50000000, max: undefined },
];

const MIN_BUDGET_OPTIONS = [
  { label: 'No Min', value: undefined },
  { label: '₹25 Lakhs', value: 2500000 },
  { label: '₹50 Lakhs', value: 5000000 },
  { label: '₹75 Lakhs', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹1.5 Crores', value: 15000000 },
  { label: '₹2 Crores', value: 20000000 },
  { label: '₹3 Crores', value: 30000000 },
  { label: '₹5 Crores', value: 50000000 },
];

const MAX_BUDGET_OPTIONS = [
  { label: 'No Max', value: undefined },
  { label: '₹50 Lakhs', value: 5000000 },
  { label: '₹75 Lakhs', value: 7500000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹1.5 Crores', value: 15000000 },
  { label: '₹2 Crores', value: 20000000 },
  { label: '₹3 Crores', value: 30000000 },
  { label: '₹5 Crores', value: 50000000 },
  { label: '₹10 Crores', value: 100000000 },
];

export const PropertySearchBar: React.FC<PropertySearchBarProps> = ({
  initialLocations = [],
  initialPropertyTypes = [],
  initialMinPrice,
  initialMaxPrice,
  onSearch,
  className = '',
}) => {
  // --- Section A: Location State ---
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [locationInput, setLocationInput] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedSuggestionType, setSelectedSuggestionType] = useState<LocationSuggestionType | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // --- Section B: Property Type State ---
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(initialPropertyTypes);
  const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] = useState(false);

  // --- Section C: Budget State ---
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [customMinInput, setCustomMinInput] = useState(initialMinPrice ? String(initialMinPrice) : '');
  const [customMaxInput, setCustomMaxInput] = useState(initialMaxPrice ? String(initialMaxPrice) : '');

  // Refs for outside click handling
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const propertyTypeContainerRef = useRef<HTMLDivElement>(null);
  const budgetContainerRef = useRef<HTMLDivElement>(null);

  // Sync with initial props if changed externally
  const initialLocationsKey = (initialLocations || []).join('||');
  useEffect(() => {
    setLocations(initialLocations || []);
  }, [initialLocationsKey]);

  const initialTypesKey = (initialPropertyTypes || []).join('||');
  useEffect(() => {
    setSelectedPropertyTypes(initialPropertyTypes || []);
  }, [initialTypesKey]);

  useEffect(() => {
    setMinPrice(initialMinPrice);
    setCustomMinInput(initialMinPrice ? String(initialMinPrice) : '');
  }, [initialMinPrice]);

  useEffect(() => {
    setMaxPrice(initialMaxPrice);
    setCustomMaxInput(initialMaxPrice ? String(initialMaxPrice) : '');
  }, [initialMaxPrice]);

  // Click outside listener for all dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (locationContainerRef.current && !locationContainerRef.current.contains(target)) {
        setLocationDropdownOpen(false);
      }
      if (propertyTypeContainerRef.current && !propertyTypeContainerRef.current.contains(target)) {
        setPropertyTypeDropdownOpen(false);
      }
      if (budgetContainerRef.current && !budgetContainerRef.current.contains(target)) {
        setBudgetDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocationDropdownOpen(false);
        setPropertyTypeDropdownOpen(false);
        setBudgetDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter location suggestions based on input and active suggestion type
  const suggestions = searchLocationSuggestions(
    locationInput,
    selectedSuggestionType || undefined,
    locations
  );

  // --- Location Handlers ---
  const handleAddLocation = (locName: string) => {
    const trimmed = locName.trim();
    if (!trimmed) return;

    if (!locations.some(l => l.toLowerCase() === trimmed.toLowerCase())) {
      setLocations(prev => [...prev, trimmed]);
    }
    setLocationInput('');
    setHighlightedIndex(-1);
    locationInputRef.current?.focus();
  };

  const handleRemoveLocation = (locName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocations(prev => prev.filter(l => l.toLowerCase() !== locName.toLowerCase()));
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !locationInput && locations.length > 0) {
      // Remove last chip on backspace if input empty
      e.preventDefault();
      setLocations(prev => prev.slice(0, prev.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!locationDropdownOpen) {
        setLocationDropdownOpen(true);
      }
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (locationDropdownOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleAddLocation(suggestions[highlightedIndex].name);
      } else if (locationInput.trim()) {
        handleAddLocation(locationInput.trim());
      } else {
        // Trigger search on enter if nothing highlighted to add
        handleExecuteSearch();
      }
    }
  };

  const handleSelectSuggestionCategory = (type: LocationSuggestionType) => {
    setSelectedSuggestionType(prev => (prev === type ? null : type));
    locationInputRef.current?.focus();
  };

  // --- Property Type Handlers ---
  const handleTogglePropertyType = (typeId: string) => {
    setSelectedPropertyTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(t => t !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const getPropertyTypeLabel = () => {
    if (selectedPropertyTypes.length === 0) return 'Property Type';
    
    // Find primary label
    const firstOption = PROPERTY_TYPE_OPTIONS.find(opt => opt.id === selectedPropertyTypes[0]);
    const firstLabel = firstOption ? firstOption.shortLabel : selectedPropertyTypes[0];

    if (selectedPropertyTypes.length === 1) {
      return firstLabel;
    }
    // Matching reference screenshot "Flat +1", "Flat +2", etc.
    return `${firstLabel} +${selectedPropertyTypes.length - 1}`;
  };

  // --- Budget Handlers ---
  const getBudgetLabel = () => {
    if (minPrice && maxPrice) {
      return `${formatIndianPrice(minPrice)} – ${formatIndianPrice(maxPrice)}`;
    }
    if (minPrice && !maxPrice) {
      return `${formatIndianPrice(minPrice)}+`;
    }
    if (!minPrice && maxPrice) {
      return `Up to ${formatIndianPrice(maxPrice)}`;
    }
    return 'Budget';
  };

  const handleApplyCustomBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const min = customMinInput ? Number(customMinInput) : undefined;
    const max = customMaxInput ? Number(customMaxInput) : undefined;
    setMinPrice(min);
    setMaxPrice(max);
    setBudgetDropdownOpen(false);
  };

  const handleResetBudget = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCustomMinInput('');
    setCustomMaxInput('');
    setBudgetDropdownOpen(false);
  };

  // --- Search Execution ---
  const handleExecuteSearch = () => {
    // If user has pending typed text in location input, add it first
    let finalLocations = [...locations];
    if (locationInput.trim() && !locations.some(l => l.toLowerCase() === locationInput.trim().toLowerCase())) {
      finalLocations.push(locationInput.trim());
      setLocations(finalLocations);
      setLocationInput('');
    }

    setLocationDropdownOpen(false);
    setPropertyTypeDropdownOpen(false);
    setBudgetDropdownOpen(false);

    onSearch({
      locations: finalLocations,
      propertyTypes: selectedPropertyTypes,
      minPrice,
      maxPrice,
    });
  };

  const hasBudgetFilter = Boolean(minPrice || maxPrice);

  return (
    <div className={`w-full relative z-30 ${className}`}>
      {/* ============================================================== */}
      {/* DESKTOP SEARCH BAR (Pill Container matching Reference Screenshot) */}
      {/* ============================================================== */}
      <div className="hidden md:flex items-center bg-white rounded-full border border-slate-200/90 shadow-xl shadow-slate-900/10 p-1.5 hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400">
        
        {/* SECTION A: LOCATION SELECTOR */}
        <div 
          ref={locationContainerRef} 
          className="flex-1 min-w-[280px] lg:min-w-[340px] relative flex items-center gap-2 pl-4 pr-3 py-1.5 cursor-text"
          onClick={() => {
            locationInputRef.current?.focus();
            setLocationDropdownOpen(true);
          }}
        >
          {/* Red Location-Pin Icon */}
          <div className="flex-shrink-0 text-red-600">
            <MapPin className="w-5 h-5 fill-red-50 text-red-600" />
          </div>

          {/* Location Chips + Text Input */}
          <div className="flex items-center flex-wrap gap-1.5 flex-1 min-w-0 max-h-20 overflow-y-auto scrollbar-none py-0.5">
            {locations.map(loc => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 transition-colors shadow-xs animate-fadeIn select-none"
              >
                <span>{loc}</span>
                <button
                  type="button"
                  onClick={e => handleRemoveLocation(loc, e)}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${loc}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <input
              ref={locationInputRef}
              type="text"
              value={locationInput}
              onChange={e => {
                setLocationInput(e.target.value);
                if (!locationDropdownOpen) setLocationDropdownOpen(true);
              }}
              onFocus={() => setLocationDropdownOpen(true)}
              onKeyDown={handleLocationKeyDown}
              placeholder={locations.length > 0 ? 'Add more...' : 'City, Locality, Project...'}
              className="outline-none bg-transparent text-sm text-slate-800 placeholder-slate-400 flex-1 min-w-[130px] py-1"
              aria-label="Location search input"
              aria-expanded={locationDropdownOpen}
              aria-autocomplete="list"
            />
          </div>

          {/* Clear all locations button if multiple */}
          {locations.length > 0 && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setLocations([]);
                setLocationInput('');
              }}
              className="p-1 text-slate-300 hover:text-slate-600 transition flex-shrink-0"
              title="Clear all selected locations"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* -------------------------------------------------------- */}
          {/* AUTOCOMPLETE DROPDOWN PANEL (Anchored Below Location)    */}
          {/* -------------------------------------------------------- */}
          {locationDropdownOpen && (
            <div 
              className="absolute top-[calc(100%+10px)] left-0 w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-fadeIn text-left cursor-default"
              onClick={e => e.stopPropagation()}
            >
              {/* "You can enter" guidance panel (Matches reference screenshot) */}
              {!locationInput.trim() && (
                <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
                  <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2.5 px-1">
                    You can enter
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {/* Category A: City, Locality */}
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('city')}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        selectedSuggestionType === 'city'
                          ? 'bg-red-50 text-red-900 border border-red-200/80 shadow-xs'
                          : 'hover:bg-white hover:shadow-xs text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800">City, Locality</div>
                        <div className="text-[11px] text-slate-400 truncate">e.g. Hyderabad, Bangalore, Gachibowli</div>
                      </div>
                      {selectedSuggestionType === 'city' && (
                        <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </button>

                    {/* Category B: Area (like South Delhi) */}
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('area')}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        selectedSuggestionType === 'area'
                          ? 'bg-red-50 text-red-900 border border-red-200/80 shadow-xs'
                          : 'hover:bg-white hover:shadow-xs text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800">Area (like South Delhi)</div>
                        <div className="text-[11px] text-slate-400 truncate">e.g. Kokapet, Tellapur, South Delhi</div>
                      </div>
                      {selectedSuggestionType === 'area' && (
                        <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </button>

                    {/* Category C: Project or Builder name */}
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('project')}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        selectedSuggestionType === 'project'
                          ? 'bg-red-50 text-red-900 border border-red-200/80 shadow-xs'
                          : 'hover:bg-white hover:shadow-xs text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800">Project or Builder name</div>
                        <div className="text-[11px] text-slate-400 truncate">e.g. Kokapet Golden Mile, Emerald Greens</div>
                      </div>
                      {selectedSuggestionType === 'project' && (
                        <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Suggestions List (Live filter or Popular options) */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 py-1">
                {suggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddLocation(item.name)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                        isHighlighted ? 'bg-red-50/70 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 text-slate-400">
                          {item.type === 'city' ? (
                            <MapPin className="w-4 h-4 text-red-500" />
                          ) : item.type === 'project' ? (
                            <Building2 className="w-4 h-4 text-indigo-500" />
                          ) : (
                            <Compass className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.subtext}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0 ml-2">
                        {item.type}
                      </span>
                    </button>
                  );
                })}

                {suggestions.length === 0 && locationInput.trim() && (
                  <div className="p-4 text-center">
                    <p className="text-xs text-slate-600">
                      No preset locations matching "{locationInput}".
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddLocation(locationInput.trim())}
                      className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 underline"
                    >
                      Add "{locationInput.trim()}" as a custom search filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* THIN VERTICAL DIVIDER */}
        <div className="w-px h-8 bg-slate-200 flex-shrink-0 mx-1" />

        {/* SECTION B: PROPERTY TYPE DROPDOWN */}
        <div ref={propertyTypeContainerRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setPropertyTypeDropdownOpen(!propertyTypeDropdownOpen);
              setLocationDropdownOpen(false);
              setBudgetDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors select-none ${
              propertyTypeDropdownOpen
                ? 'bg-slate-100 text-slate-900'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
            aria-label="Select property types"
            aria-expanded={propertyTypeDropdownOpen}
          >
            <Home className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="truncate max-w-[130px] font-bold text-slate-800">
              {getPropertyTypeLabel()}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${propertyTypeDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
          </button>

          {/* Property Type Dropdown Popover */}
          {propertyTypeDropdownOpen && (
            <div 
              className="absolute top-[calc(100%+10px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 p-3.5 animate-fadeIn text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Property Types
                </span>
                {selectedPropertyTypes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyTypes([])}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Residential Group */}
              <div className="space-y-1 mb-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                  Residential
                </div>
                {PROPERTY_TYPE_OPTIONS.filter(o => o.category === 'residential').map(option => {
                  const isChecked = selectedPropertyTypes.includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer text-xs font-medium transition ${
                        isChecked ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{option.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePropertyType(option.id)}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                    </label>
                  );
                })}
              </div>

              {/* Commercial Group */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                  Commercial
                </div>
                {PROPERTY_TYPE_OPTIONS.filter(o => o.category === 'commercial').map(option => {
                  const isChecked = selectedPropertyTypes.includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer text-xs font-medium transition ${
                        isChecked ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{option.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePropertyType(option.id)}
                        className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPropertyTypeDropdownOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* THIN VERTICAL DIVIDER */}
        <div className="w-px h-8 bg-slate-200 flex-shrink-0 mx-1" />

        {/* SECTION C: BUDGET SELECTOR */}
        <div ref={budgetContainerRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setBudgetDropdownOpen(!budgetDropdownOpen);
              setLocationDropdownOpen(false);
              setPropertyTypeDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-colors select-none ${
              budgetDropdownOpen || hasBudgetFilter
                ? 'bg-slate-100 text-slate-900'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
            aria-label="Select budget"
            aria-expanded={budgetDropdownOpen}
          >
            <IndianRupee className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className={`truncate max-w-[150px] font-bold ${hasBudgetFilter ? 'text-red-700' : 'text-slate-800'}`}>
              {getBudgetLabel()}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${budgetDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
          </button>

          {/* Budget Dropdown Popover */}
          {budgetDropdownOpen && (
            <div 
              className="absolute top-[calc(100%+10px)] right-0 sm:left-auto w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 p-4 animate-fadeIn text-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Budget Range
                </span>
                {hasBudgetFilter && (
                  <button
                    type="button"
                    onClick={handleResetBudget}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="space-y-1 mb-3">
                {BUDGET_PRESETS.map((preset, idx) => {
                  const isActive = preset.min === minPrice && preset.max === maxPrice;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMinPrice(preset.min);
                        setMaxPrice(preset.max);
                        setCustomMinInput(preset.min ? String(preset.min) : '');
                        setCustomMaxInput(preset.max ? String(preset.max) : '');
                        setBudgetDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                        isActive
                          ? 'bg-red-50 text-red-900 font-bold border border-red-200/70'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {isActive && <Check className="w-4 h-4 text-red-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Min & Max Dropdown Selectors */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Min Budget
                  </label>
                  <select
                    value={minPrice !== undefined ? String(minPrice) : ''}
                    onChange={e => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setMinPrice(val);
                      setCustomMinInput(val ? String(val) : '');
                    }}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 outline-none"
                  >
                    {MIN_BUDGET_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value !== undefined ? String(opt.value) : ''}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Max Budget
                  </label>
                  <select
                    value={maxPrice !== undefined ? String(maxPrice) : ''}
                    onChange={e => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setMaxPrice(val);
                      setCustomMaxInput(val ? String(val) : '');
                    }}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 outline-none"
                  >
                    {MAX_BUDGET_OPTIONS.map(opt => (
                      <option key={opt.label} value={opt.value !== undefined ? String(opt.value) : ''}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Numeric Input Form */}
              <form onSubmit={handleApplyCustomBudget} className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Or Custom INR Amount
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <input
                    type="number"
                    value={customMinInput}
                    onChange={e => setCustomMinInput(e.target.value)}
                    placeholder="Min (e.g. 5000000)"
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-red-500 outline-none"
                  />
                  <input
                    type="number"
                    value={customMaxInput}
                    onChange={e => setCustomMaxInput(e.target.value)}
                    placeholder="Max (e.g. 15000000)"
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Apply Budget
                  </button>
                  {hasBudgetFilter && (
                    <button
                      type="button"
                      onClick={handleResetBudget}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* SECTION D: SEARCH BUTTON */}
        <div className="flex-shrink-0 pl-2">
          <button
            type="button"
            id="desktop-search-button"
            onClick={handleExecuteSearch}
            className="h-11 sm:h-12 px-6 sm:px-7 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm sm:text-base rounded-full shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/35 transition-all duration-150 flex items-center justify-center gap-2 select-none hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE SEARCH CONTAINER (Responsive Card for Phones & Tablets) */}
      {/* ============================================================== */}
      <div className="md:hidden bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/10 p-3.5 space-y-3">
        {/* Mobile Section A: Location Input & Chips */}
        <div 
          ref={locationContainerRef}
          className="relative bg-slate-50 rounded-xl p-2.5 border border-slate-200 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition"
        >
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-1">
                {locations.map(loc => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={locationInput}
                onChange={e => {
                  setLocationInput(e.target.value);
                  if (!locationDropdownOpen) setLocationDropdownOpen(true);
                }}
                onFocus={() => setLocationDropdownOpen(true)}
                onKeyDown={handleLocationKeyDown}
                placeholder={locations.length > 0 ? 'Add more locations...' : 'Enter City, Locality, or Project...'}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none py-1"
              />
            </div>

            {locations.length > 0 && (
              <button
                type="button"
                onClick={() => setLocations([])}
                className="p-1 text-slate-300 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Autocomplete Suggestions Dropdown */}
          {locationDropdownOpen && (
            <div 
              className="absolute top-[calc(100%+8px)] left-0 right-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 max-h-72 overflow-y-auto p-2 text-left animate-fadeIn"
              onClick={e => e.stopPropagation()}
            >
              {!locationInput.trim() && (
                <div className="p-2 border-b border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    You can enter:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('city')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedSuggestionType === 'city' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      City, Locality
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('area')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedSuggestionType === 'area' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Area
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestionCategory('project')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedSuggestionType === 'project' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Project / Builder
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-slate-50">
                {suggestions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleAddLocation(item.name);
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full p-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.subtext}</div>
                    </div>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Middle Row: Property Type & Budget Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Mobile Property Type */}
          <div ref={propertyTypeContainerRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setPropertyTypeDropdownOpen(!propertyTypeDropdownOpen);
                setBudgetDropdownOpen(false);
                setLocationDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Home className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {getPropertyTypeLabel()}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </button>

            {propertyTypeDropdownOpen && (
              <div 
                className="absolute top-[calc(100%+6px)] left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 text-left animate-fadeIn"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Types
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {PROPERTY_TYPE_OPTIONS.map(opt => {
                    const isChecked = selectedPropertyTypes.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer ${
                          isChecked ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePropertyType(opt.id)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                      </label>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setPropertyTypeDropdownOpen(false)}
                  className="mt-2.5 w-full py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Mobile Budget */}
          <div ref={budgetContainerRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setBudgetDropdownOpen(!budgetDropdownOpen);
                setPropertyTypeDropdownOpen(false);
                setLocationDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-left transition"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <IndianRupee className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span className={`text-xs font-bold truncate ${hasBudgetFilter ? 'text-red-700' : 'text-slate-800'}`}>
                  {getBudgetLabel()}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </button>

            {budgetDropdownOpen && (
              <div 
                className="absolute top-[calc(100%+6px)] right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 text-left animate-fadeIn"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Budget Presets
                </div>
                <div className="space-y-1 mb-2">
                  {BUDGET_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMinPrice(p.min);
                        setMaxPrice(p.max);
                        setBudgetDropdownOpen(false);
                      }}
                      className="w-full p-1.5 rounded-lg text-left text-xs hover:bg-slate-50 text-slate-700 block"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {hasBudgetFilter && (
                  <button
                    type="button"
                    onClick={handleResetBudget}
                    className="w-full py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                  >
                    Reset Budget
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Full-Width Red Search Button */}
        <button
          type="button"
          id="mobile-search-button"
          onClick={handleExecuteSearch}
          className="w-full py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/25 transition flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4 text-white stroke-[2.5]" />
          <span>Search Properties</span>
        </button>
      </div>
    </div>
  );
};
