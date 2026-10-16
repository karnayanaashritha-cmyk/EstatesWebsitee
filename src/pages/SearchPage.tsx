import React, { useState, useEffect, useRef } from 'react';
import { Property, PropertyFilterParams, HYDERABAD_LOCALITIES, PROPERTY_TYPES } from '../types';
import { PropertyService } from '../services/propertyService';
import { PropertyCard } from '../components/property/PropertyCard';
import { LocalitySelect } from '../components/common/LocalitySelect';
import { AreaRangeSelect } from '../components/common/AreaRangeSelect';
import { BudgetRangeSelect } from '../components/common/BudgetRangeSelect';
import { formatIndianPrice } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  MapPin, 
  SlidersHorizontal,
  Home,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { PropertySearchBar } from '../components/common/PropertySearchBar';
import { filtersToQueryParams, queryParamsToFilters } from '../utils/searchParams';


interface SearchPageProps {
  initialFilters?: PropertyFilterParams;
  onNavigate: (path: string, params?: any) => void;
  onOpenEnquiryModal: (property: Property) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialFilters = {},
  onNavigate,
  onOpenEnquiryModal
}) => {
  const [filters, setFilters] = useState<PropertyFilterParams>(() => {
    const urlParams = typeof window !== 'undefined' && window.location.search
      ? queryParamsToFilters(window.location.search)
      : {};

    const initial: PropertyFilterParams = {
      searchQuery: '',
      locality: '',
      localities: [],
      propertyType: 'all',
      propertyTypes: [],
      listingType: 'all',
      bedrooms: 'all',
      furnishing: 'all',
      minPrice: 0,
      maxPrice: 0,
      reraOnly: false,
      verifiedOnly: false,
      sortBy: 'newest',
      ...urlParams,
      ...initialFilters
    };

    // Ensure localities array is populated if locality string provided
    if (initial.locality && (!initial.localities || initial.localities.length === 0)) {
      initial.localities = [initial.locality];
    }
    // Ensure propertyTypes array is populated if propertyType provided
    if (initial.propertyType && initial.propertyType !== 'all' && (!initial.propertyTypes || initial.propertyTypes.length === 0)) {
      initial.propertyTypes = [initial.propertyType];
    }

    return initial;
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const currentRequestId = useRef(0);

  useEffect(() => {
    // Sync if initialFilters change from navigation
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters,
        localities: initialFilters.localities || (initialFilters.locality ? [initialFilters.locality] : prev.localities),
        propertyTypes: initialFilters.propertyTypes || (initialFilters.propertyType && initialFilters.propertyType !== 'all' ? [initialFilters.propertyType] : prev.propertyTypes)
      }));
    }
  }, [initialFilters]);

  // Synchronize URL query parameters for bookmarking & shareability
  useEffect(() => {
    const queryString = filtersToQueryParams(filters);
    const newPath = queryString ? `/search?${queryString}` : '/search';
    if (window.location.pathname === '/search' && window.location.search.replace(/^\?/, '') !== queryString) {
      window.history.replaceState({}, '', newPath);
    }
  }, [filters]);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  // Lock background scroll & handle Escape when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileFilterOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileFilterOpen]);

  const loadProperties = async () => {
    const reqId = ++currentRequestId.current;
    setLoading(true);
    setError(null);
    try {
      const data = await PropertyService.getPublicProperties(filters);
      if (reqId === currentRequestId.current) {
        setProperties(data);
      }
    } catch (err: any) {
      if (reqId === currentRequestId.current) {
        console.error('Error fetching public properties:', err);
        setError(err.message || 'Unable to connect to the database. Please try again.');
        setProperties([]);
      }
    } finally {
      if (reqId === currentRequestId.current) {
        setLoading(false);
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      locality: '',
      localities: [],
      propertyType: 'all',
      propertyTypes: [],
      listingType: 'all',
      bedrooms: 'all',
      furnishing: 'all',
      minPrice: 0,
      maxPrice: 0,
      minArea: 0,
      maxArea: 0,
      reraOnly: false,
      verifiedOnly: false,
      sortBy: 'newest'
    });
  };

  const handleLocalitySelect = (loc: string) => {
    setFilters(prev => {
      const currentLocs = prev.localities || (prev.locality ? [prev.locality] : []);
      const exists = currentLocs.some(l => l.toLowerCase() === loc.toLowerCase());
      const nextLocs = exists 
        ? currentLocs.filter(l => l.toLowerCase() !== loc.toLowerCase()) 
        : [...currentLocs, loc];
      return {
        ...prev,
        localities: nextLocs,
        locality: nextLocs[0] || ''
      };
    });
  };

  const activeFiltersCount = [
    (filters.localities && filters.localities.length > 0) || (filters.locality && filters.locality !== 'all'),
    (filters.propertyTypes && filters.propertyTypes.length > 0) || (filters.propertyType && filters.propertyType !== 'all'),
    filters.listingType && filters.listingType !== 'all',
    filters.bedrooms && filters.bedrooms !== 'all',
    filters.furnishing && filters.furnishing !== 'all',
    filters.minPrice && filters.minPrice > 0,
    filters.maxPrice && filters.maxPrice > 0,
    filters.minArea && filters.minArea > 0,
    filters.maxArea && filters.maxArea > 0,
    filters.reraOnly,
    filters.verifiedOnly,
    filters.searchQuery
  ].filter(Boolean).length;


  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Page Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <button onClick={() => onNavigate('/')} className="hover:text-rose-600">Home</button>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Hyderabad Properties</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Properties for Sale, Rent & Lease in Hyderabad
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing approved, active properties across top Hyderabad localities
            </p>
          </div>

          {/* View Mode & Mobile Filter Trigger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modern Property Search Bar (Matches Reference Design) */}
        <div className="mb-6 space-y-3">
          <PropertySearchBar
            initialLocations={filters.localities && filters.localities.length > 0 ? filters.localities : (filters.locality ? [filters.locality] : [])}
            initialPropertyTypes={filters.propertyTypes && filters.propertyTypes.length > 0 ? filters.propertyTypes : (filters.propertyType && filters.propertyType !== 'all' ? [filters.propertyType] : [])}
            initialMinPrice={filters.minPrice}
            initialMaxPrice={filters.maxPrice}
            onSearch={criteria => {
              setFilters(prev => ({
                ...prev,
                localities: criteria.locations,
                locality: criteria.locations[0] || '',
                propertyTypes: criteria.propertyTypes,
                propertyType: criteria.propertyTypes[0] || 'all',
                minPrice: criteria.minPrice || 0,
                maxPrice: criteria.maxPrice || 0,
              }));
            }}
          />

          {/* Quick Filters Toolbar: Listing Type + Quick Locality Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
            {/* Listing Type Radio Pills */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl self-start max-w-full overflow-x-auto scrollbar-none">
              {(['all', 'buy', 'rent', 'lease'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, listingType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition whitespace-nowrap flex-shrink-0 ${
                    filters.listingType === type
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'all' ? 'All Listings' : type === 'buy' ? 'Buy' : type === 'rent' ? 'Rent' : 'Lease'}
                </button>
              ))}
            </div>

            {/* Quick Locality chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs scrollbar-none">
              <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 mr-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Quick:
              </span>
              {HYDERABAD_LOCALITIES.slice(0, 8).map(loc => {
                const isSelected = (filters.localities && filters.localities.includes(loc)) || filters.locality === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => handleLocalitySelect(loc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition flex-shrink-0 ${
                      isSelected
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {loc}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Results Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Filter className="w-4 h-4 text-rose-600" />
                  <span>Refine Filters</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs text-rose-600 font-bold hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Hyderabad Locality Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hyderabad Locality
                </label>
                <LocalitySelect
                  value={filters.locality || ''}
                  onChange={loc => setFilters(prev => ({ ...prev, locality: loc, localities: loc ? [loc] : [] }))}
                  placeholder="Select or Search Area..."
                />
              </div>

              {/* Area / Usable Space Range in sq.ft */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Space Range (sq.ft)
                </label>
                <AreaRangeSelect
                  minArea={filters.minArea}
                  maxArea={filters.maxArea}
                  onChange={(min, max) => setFilters(prev => ({ ...prev, minArea: min, maxArea: max }))}
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Budget (₹ INR)
                </label>
                <BudgetRangeSelect
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  isRental={filters.listingType === 'rent'}
                  onChange={(min, max) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
                />
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Property Category
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="prop_category"
                      checked={(!filters.propertyTypes || filters.propertyTypes.length === 0) && (!filters.propertyType || filters.propertyType === 'all')}
                      onChange={() => setFilters(prev => ({ ...prev, propertyType: 'all', propertyTypes: [] }))}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>All Categories</span>
                  </label>
                  {PROPERTY_TYPES.map(cat => {
                    const isChecked = (filters.propertyTypes && filters.propertyTypes.includes(cat.id)) || filters.propertyType === cat.id;
                    return (
                      <label key={cat.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="prop_category"
                          checked={isChecked}
                          onChange={() => setFilters(prev => ({ ...prev, propertyType: cat.id, propertyTypes: [cat.id] }))}
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>{cat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['all', 1, 2, 3, 4, 5] as const).map(b => (
                    <button
                      key={b}
                      onClick={() => setFilters(prev => ({ ...prev, bedrooms: b as any }))}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        filters.bedrooms === b
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b === 'all' ? 'Any' : `${b}${b === 5 ? '+' : ''} BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Furnishing
                </label>
                <select
                  value={filters.furnishing || 'all'}
                  onChange={e => setFilters(prev => ({ ...prev, furnishing: e.target.value }))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 outline-none"
                >
                  <option value="all">Any Furnishing</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-furnished">Semi-furnished</option>
                  <option value="Fully-furnished">Fully-furnished</option>
                </select>
              </div>

              {/* Verified and TGRERA Checkboxes */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters.reraOnly)}
                    onChange={e => setFilters(prev => ({ ...prev, reraOnly: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    TGRERA Registered Only
                  </span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters.verifiedOnly)}
                    onChange={e => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Hyderabad Heights Verified Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* RESULTS AREA */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results count & active filter badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">
                Found {properties.length} {properties.length === 1 ? 'property' : 'properties'} matching your criteria
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Multi-location badges */}
                  {filters.localities && filters.localities.length > 0 ? (
                    filters.localities.map(loc => (
                      <span key={loc} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200 animate-fadeIn">
                        📍 {loc}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-900" 
                          onClick={() => setFilters(p => {
                            const remaining = (p.localities || []).filter(l => l !== loc);
                            return {
                              ...p,
                              localities: remaining,
                              locality: remaining[0] || ''
                            };
                          })} 
                        />
                      </span>
                    ))
                  ) : filters.locality && filters.locality !== 'all' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200 animate-fadeIn">
                      📍 {filters.locality}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-900" onClick={() => setFilters(p => ({ ...p, locality: '', localities: [] }))} />
                    </span>
                  ) : null}

                  {/* Multi-Property Type badges */}
                  {filters.propertyTypes && filters.propertyTypes.length > 0 ? (
                    filters.propertyTypes.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200 capitalize animate-fadeIn">
                        🏢 {t}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-900" 
                          onClick={() => setFilters(p => {
                            const remaining = (p.propertyTypes || []).filter(item => item !== t);
                            return {
                              ...p,
                              propertyTypes: remaining,
                              propertyType: remaining[0] || 'all'
                            };
                          })} 
                        />
                      </span>
                    ))
                  ) : filters.propertyType && filters.propertyType !== 'all' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold border border-red-200 capitalize animate-fadeIn">
                      🏢 {filters.propertyType}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-900" onClick={() => setFilters(p => ({ ...p, propertyType: 'all', propertyTypes: [] }))} />
                    </span>
                  ) : null}
                  {(filters.minArea || filters.maxArea) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                      📐 {filters.minArea || 0} – {filters.maxArea || '∞'} sq.ft
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, minArea: 0, maxArea: 0 }))} />
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                      💰 {filters.minPrice ? formatIndianPrice(filters.minPrice, filters.listingType === 'rent') : '₹0'} – {filters.maxPrice ? formatIndianPrice(filters.maxPrice, filters.listingType === 'rent') : 'Max'}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, minPrice: 0, maxPrice: 0 }))} />
                    </span>
                  )}
                  {filters.bedrooms && filters.bedrooms !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                      🛏️ {filters.bedrooms} BHK
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, bedrooms: 'all' }))} />
                    </span>
                  )}
                  {filters.listingType && filters.listingType !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200 capitalize">
                      🏷️ {filters.listingType}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, listingType: 'all' }))} />
                    </span>
                  )}
                  {filters.reraOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      🛡️ TGRERA
                      <X className="w-3 h-3 cursor-pointer hover:text-emerald-950" onClick={() => setFilters(p => ({ ...p, reraOnly: false }))} />
                    </span>
                  )}
                  {filters.verifiedOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      ✓ Verified
                      <X className="w-3 h-3 cursor-pointer hover:text-emerald-950" onClick={() => setFilters(p => ({ ...p, verifiedOnly: false }))} />
                    </span>
                  )}
                  <button
                    onClick={handleResetFilters}
                    className="text-rose-600 font-bold hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>


            {/* Results Grid / List / Error / Empty States */}
            {error ? (
              /* Database Failure / Error State */
              <div className="bg-white rounded-2xl p-10 text-center border border-red-200 shadow-sm space-y-4">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Search Request Failed
                </h3>
                <p className="text-xs sm:text-sm text-red-600 max-w-md mx-auto">
                  {error}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => { setError(null); loadProperties(); }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    Retry Search
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 space-y-3">
                    <div className="bg-slate-200 h-44 rounded-xl w-full" />
                    <div className="bg-slate-200 h-5 rounded w-1/3" />
                    <div className="bg-slate-200 h-4 rounded w-3/4" />
                    <div className="bg-slate-200 h-8 rounded w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {properties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onNavigate={onNavigate}
                    onOpenEnquiryModal={onOpenEnquiryModal}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  {filters.localities && filters.localities.length > 0
                    ? `We could not find any active listings in ${filters.localities.join(', ')} matching your current filter criteria.`
                    : 'We could not find any active listings matching your current filter criteria.'} Try adjusting your locality, budget, or category.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {mobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={e => {
            if (e.target === e.currentTarget) setMobileFilterOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Filter Properties"
        >
          <div className="w-full max-w-sm bg-white h-full ml-auto flex flex-col shadow-2xl">
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 flex-shrink-0 bg-white">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                <Filter className="w-5 h-5 text-rose-600" />
                <span>Filter Properties</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition"
                aria-label="Close filters"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hyderabad Locality
                </label>
                <LocalitySelect
                  value={filters.locality || (filters.localities && filters.localities.length === 1 ? filters.localities[0] : '')}
                  onChange={loc => setFilters(p => ({
                    ...p,
                    locality: loc,
                    localities: loc ? [loc] : []
                  }))}
                  placeholder="Select or Search Area..."
                />
              </div>

              {/* Space Range (sq.ft) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Space Range (sq.ft)
                </label>
                <AreaRangeSelect
                  minArea={filters.minArea}
                  maxArea={filters.maxArea}
                  onChange={(min, max) => setFilters(p => ({ ...p, minArea: min, maxArea: max }))}
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Budget (₹ INR)
                </label>
                <BudgetRangeSelect
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  isRental={filters.listingType === 'rent'}
                  onChange={(min, max) => setFilters(p => ({ ...p, minPrice: min, maxPrice: max }))}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={filters.propertyType || (filters.propertyTypes && filters.propertyTypes.length === 1 ? filters.propertyTypes[0] : 'all')}
                  onChange={e => {
                    const val = e.target.value;
                    setFilters(p => ({
                      ...p,
                      propertyType: val,
                      propertyTypes: val === 'all' ? [] : [val]
                    }));
                  }}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="all">All Categories</option>
                  {PROPERTY_TYPES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bedrooms</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 1, 2, 3, 4, 5] as const).map(b => (
                    <button
                      key={b}
                      onClick={() => setFilters(p => ({ ...p, bedrooms: b as any }))}
                      className={`py-2 text-xs font-bold rounded-lg border transition ${
                        filters.bedrooms === b
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b === 'all' ? 'Any' : `${b} BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified and TGRERA Checkboxes */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters.reraOnly)}
                    onChange={e => setFilters(prev => ({ ...prev, reraOnly: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>TGRERA Registered Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters.verifiedOnly)}
                    onChange={e => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Hyderabad Heights Verified Only</span>
                </label>
              </div>
            </div>

            {/* Sticky Actions Footer with safe-area padding */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex gap-2 flex-shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition"
              >
                Apply Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
