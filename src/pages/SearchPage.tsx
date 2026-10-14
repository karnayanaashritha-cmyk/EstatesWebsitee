import React, { useState, useEffect } from 'react';
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
  const [filters, setFilters] = useState<PropertyFilterParams>({
    searchQuery: '',
    locality: '',
    propertyType: 'all',
    listingType: 'all',
    bedrooms: 'all',
    furnishing: 'all',
    minPrice: 0,
    maxPrice: 0,
    reraOnly: false,
    verifiedOnly: false,
    sortBy: 'newest',
    ...initialFilters
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Sync if initialFilters change from navigation
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await PropertyService.getPublicProperties(filters);
      setProperties(data);
    } catch (err) {
      console.error('Error fetching public properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      locality: '',
      propertyType: 'all',
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
    setFilters(prev => ({
      ...prev,
      locality: prev.locality === loc ? '' : loc
    }));
  };

  const activeFiltersCount = [
    filters.locality && filters.locality !== 'all',
    filters.propertyType && filters.propertyType !== 'all',
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

        {/* Search Bar & Quick Filters Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            {/* Search Input */}
            <div className="sm:col-span-3 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={filters.searchQuery || ''}
                onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search society, project, keyword..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
              />
            </div>

            {/* Searchable Locality Selector */}
            <div className="sm:col-span-3">
              <LocalitySelect
                value={filters.locality || ''}
                onChange={loc => setFilters(prev => ({ ...prev, locality: loc }))}
                placeholder="Search Locality..."
              />
            </div>

            {/* Space Range in Sq.Ft */}
            <div className="sm:col-span-2">
              <AreaRangeSelect
                minArea={filters.minArea}
                maxArea={filters.maxArea}
                onChange={(min, max) => setFilters(prev => ({ ...prev, minArea: min, maxArea: max }))}
              />
            </div>

            {/* Budget / Price Range */}
            <div className="sm:col-span-2">
              <BudgetRangeSelect
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                isRental={filters.listingType === 'rent'}
                onChange={(min, max) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={filters.sortBy || 'newest'}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:border-rose-500 outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Area: Largest</option>
              </select>
            </div>
          </div>

          {/* Listing Type Radio Pills & Popular Localities */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {/* Listing Type Radio Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
              {(['all', 'buy', 'rent', 'lease'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, listingType: type }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    filters.listingType === type
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type === 'buy' ? 'Buy' : type === 'rent' ? 'Rent' : 'Lease'}
                </button>
              ))}
            </div>

            {/* Quick Locality chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 mr-1 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Quick:
              </span>
              {HYDERABAD_LOCALITIES.slice(0, 8).map(loc => (
                <button
                  key={loc}
                  onClick={() => handleLocalitySelect(loc)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition flex-shrink-0 ${
                    filters.locality === loc
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
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
                  onChange={loc => setFilters(prev => ({ ...prev, locality: loc }))}
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
                      checked={!filters.propertyType || filters.propertyType === 'all'}
                      onChange={() => setFilters(prev => ({ ...prev, propertyType: 'all' }))}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>All Categories</span>
                  </label>
                  {PROPERTY_TYPES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="prop_category"
                        checked={filters.propertyType === cat.id}
                        onChange={() => setFilters(prev => ({ ...prev, propertyType: cat.id }))}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
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
                  {filters.locality && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                      📍 {filters.locality}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, locality: '' }))} />
                    </span>
                  )}
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
                  {filters.propertyType && filters.propertyType !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200 capitalize">
                      🏢 {filters.propertyType}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-900" onClick={() => setFilters(p => ({ ...p, propertyType: 'all' }))} />
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


            {/* Results Grid / List */}
            {loading ? (
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
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  We could not find any active listings matching your current filter criteria. Try adjusting your locality, budget, or category.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
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
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white h-full ml-auto p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                  <Filter className="w-5 h-5 text-rose-600" />
                  <span>Filter Properties</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hyderabad Locality
                </label>
                <LocalitySelect
                  value={filters.locality || ''}
                  onChange={loc => setFilters(p => ({ ...p, locality: loc }))}
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
                  value={filters.propertyType || 'all'}
                  onChange={e => setFilters(p => ({ ...p, propertyType: e.target.value }))}
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


            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
