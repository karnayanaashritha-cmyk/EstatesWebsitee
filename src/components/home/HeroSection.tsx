import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PropertySearchBar } from '../common/PropertySearchBar';

interface HeroSectionProps {
  onNavigate: (path: string, params?: any) => void;
  totalListingsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, totalListingsCount = 0 }) => {

  const trendingLocalities = ['Kokapet', 'Gachibowli', 'Tellapur', 'Narsingi', 'Miyapur', 'Financial District', 'Manikonda', 'Kukatpally'];

  return (
    <section className="relative overflow-hidden bg-[#f7f5f1] pt-6 pb-10 sm:pt-8 sm:pb-12 md:pt-12 md:pb-16">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#b69b7a_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-20 w-[34rem] h-[34rem] rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* White Hero Card Container */}
        <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-10 md:p-12 lg:p-14 shadow-2xl shadow-slate-200/50 border border-slate-200 max-w-5xl mx-auto">
          {/* Subtle ambient lighting */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-red-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-slate-100/50 blur-3xl" />

          {/* Brand section */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            {/* Rounded-square golden icon container */}
            <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#DDB86F] p-2 sm:p-3 flex items-center justify-center flex-shrink-0 shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#102D47]" stroke="currentColor">
                <path d="M3 21h18" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 21V11l4-4v14" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 7l5-4 5 4v14" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
                <path d="M13 10h2v3h-2z" fill="currentColor" />
                <path d="M13 15h2v3h-2z" fill="currentColor" />
                <circle cx="16" cy="5" r="1.5" fill="#102D47" stroke="none" />
              </svg>
            </div>

            {/* Brand text */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="text-base xs:text-lg sm:text-xl md:text-2xl font-extrabold tracking-wider leading-none">
                <span className="text-[#102D47]">HYDERABAD </span>
                <span className="text-[#E8193C]">HEIGHTS</span>
              </div>
              <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-slate-500 mt-1 sm:mt-1.5 uppercase leading-none truncate">
                YOUR HOME. YOUR FUTURE.
              </span>
            </div>
          </div>

          {/* Thin subtle horizontal divider */}
          <div className="relative z-10 w-full h-px bg-slate-200 my-4 sm:my-8" />

          {/* Main heading */}
          <h1 className="relative z-10 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#102D47] tracking-tight leading-[1.18] max-w-2xl">
            Find Your Dream Home in Hyderabad
          </h1>

          {/* Subtitle */}
          <p className="relative z-10 mt-2.5 sm:mt-4 text-xs xs:text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed">
            Buy · Rent · Sell — Flats, Villas & Plots
          </p>

          {/* Action buttons */}
          <div className="relative z-10 mt-6 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-4">
            <button
              id="hero-buy-btn"
              type="button"
              onClick={() => onNavigate('/search', { listingType: 'buy' })}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-7 bg-white hover:bg-slate-50 text-[#102D47] font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
            >
              Buy Property
            </button>
            <button
              id="hero-rent-btn"
              type="button"
              onClick={() => onNavigate('/search', { listingType: 'rent' })}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-7 bg-white hover:bg-slate-50 text-[#102D47] font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
            >
              Rent Property
            </button>
            <button
              id="hero-list-btn"
              type="button"
              onClick={() => onNavigate('/submit-property')}
              className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-7 bg-[#E8193C] hover:bg-[#d01535] text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E8193C]"
            >
              List Property
            </button>
          </div>
        </div>

        {/* Modern Property Search Bar (Matches Reference Layout) */}
        <div className="relative max-w-5xl mx-auto mt-6 sm:mt-10 overflow-visible z-30">
          <PropertySearchBar
            onSearch={criteria => {
              onNavigate('/search', {
                localities: criteria.locations,
                locality: criteria.locations[0] || '',
                propertyTypes: criteria.propertyTypes,
                propertyType: criteria.propertyTypes[0] || 'all',
                minPrice: criteria.minPrice,
                maxPrice: criteria.maxPrice,
              });
            }}
          />

          {/* Quick Trending Corridors */}
          <div className="mt-3.5 px-2 sm:px-3 flex items-center gap-1.5 text-xs overflow-x-auto scrollbar-none pb-1">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1 flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-red-600" /> Popular:
            </span>
            {trendingLocalities.map(locality => (
              <button
                key={locality}
                type="button"
                onClick={() => onNavigate('/search', { localities: [locality], locality })}
                className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-red-50 hover:text-red-700 text-slate-700 font-medium transition border border-slate-200/80 shadow-xs whitespace-nowrap flex-shrink-0"
              >
                {locality}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="max-w-5xl mx-auto mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
          <div className="bg-white/70 p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm min-w-0"><div className="text-base sm:text-lg font-extrabold text-slate-900">{totalListingsCount}</div><div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Available listings</div></div>
          <div className="bg-white/70 p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm min-w-0"><div className="text-base sm:text-lg font-extrabold text-rose-700">8 areas</div><div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Popular localities</div></div>
          <div className="bg-white/70 p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm min-w-0"><div className="text-base sm:text-lg font-extrabold text-slate-900">Buy · Rent</div><div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Ways to find home</div></div>
          <div className="bg-white/70 p-2.5 sm:p-3 rounded-2xl border border-stone-200 shadow-sm min-w-0"><div className="text-base sm:text-lg font-extrabold text-emerald-700">Direct</div><div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Owner connections</div></div>
        </div>
      </div>
    </section>
  );
};
