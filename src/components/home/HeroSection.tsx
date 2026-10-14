import React, { useState } from 'react';
import { Home, Key, PlusCircle, Search, ShieldCheck, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { PROPERTY_TYPES } from '../../types';
import { LocalitySelect } from '../common/LocalitySelect';
import { AreaRangeSelect } from '../common/AreaRangeSelect';

interface HeroSectionProps {
  onNavigate: (path: string, params?: any) => void;
  totalListingsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, totalListingsCount = 0 }) => {
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMinArea, setSelectedMinArea] = useState<number | undefined>();
  const [selectedMaxArea, setSelectedMaxArea] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onNavigate('/search', {
      searchQuery,
      locality: selectedLocality,
      propertyType: selectedCategory,
      minArea: selectedMinArea,
      maxArea: selectedMaxArea,
    });
  };

  const trendingLocalities = ['Kokapet', 'Gachibowli', 'Tellapur', 'Narsingi', 'Miyapur', 'Financial District', 'Manikonda', 'Kukatpally'];

  return (
    <section className="relative overflow-hidden bg-[#f7f5f1] pt-12 pb-12 md:pt-16 md:pb-16">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#b69b7a_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-20 w-[34rem] h-[34rem] rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 lg:gap-12 items-center">
          <div className="relative z-10 py-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Hyderabad living, thoughtfully found
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05] max-w-2xl">
              Find a place that feels like <span className="text-rose-700 italic">your next chapter.</span>
            </h1>
            <p className="mt-5 text-base text-slate-600 leading-relaxed max-w-xl">
              Explore considered homes across Hyderabad, from the energy of the IT corridor to quieter neighbourhoods made for settling in.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button id="hero-buy-btn" onClick={() => onNavigate('/search', { listingType: 'buy' })} className="inline-flex items-center gap-2 px-5 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-900/15 transition"><Home className="w-4 h-4" /> Buy a home</button>
              <button id="hero-rent-btn" onClick={() => onNavigate('/search', { listingType: 'rent' })} className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-rose-50 text-slate-800 border border-stone-300 rounded-xl font-bold text-sm transition"><Key className="w-4 h-4 text-rose-700" /> Find a rental</button>
              <button id="hero-list-btn" onClick={() => onNavigate('/submit-property')} className="inline-flex items-center gap-2 px-5 py-3 text-slate-700 hover:text-rose-700 font-bold text-sm transition"><PlusCircle className="w-4 h-4" /> List your property</button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-700" /> Clear listing details</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-700" /> Hyderabad focused</span>
            </div>
          </div>

          <div className="relative min-h-[320px] sm:min-h-[410px] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/15 border border-white">
            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85" alt="A warm, contemporary home" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
            <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 backdrop-blur"><span className="w-2 h-2 rounded-full bg-emerald-500" /> A city to call home</div>
            <div className="absolute bottom-0 p-6 sm:p-8 text-white">
              <p className="text-xs uppercase tracking-[.2em] text-white/75">Made for Hyderabad</p>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Room to grow. Space to belong.</p>
              <p className="mt-2 text-sm text-white/80">Discover homes across the neighbourhoods you love.</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto mt-10 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-stone-200 p-3 sm:p-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            <div className="sm:col-span-3 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input type="text" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Society, project, or title..." className="w-full pl-10 pr-3 py-3 bg-stone-50 hover:bg-white focus:bg-white text-sm rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition" />
            </div>
            <div className="sm:col-span-3"><LocalitySelect value={selectedLocality} onChange={setSelectedLocality} placeholder="Select Locality" /></div>
            <div className="sm:col-span-3"><AreaRangeSelect minArea={selectedMinArea} maxArea={selectedMaxArea} onChange={(min, max) => { setSelectedMinArea(min); setSelectedMaxArea(max); }} /></div>
            <div className="sm:col-span-3 flex gap-2">
              <select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)} className="min-w-0 flex-1 px-3 py-3 bg-stone-50 text-xs sm:text-sm rounded-xl border border-stone-200 focus:border-rose-500 outline-none truncate font-medium text-slate-700">
                <option value="">All Categories</option>{PROPERTY_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
              </select>
              <button type="submit" className="py-3 px-5 bg-slate-900 hover:bg-rose-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5"><Search className="w-4 h-4" /><span>Find</span></button>
            </div>
          </form>
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1"><TrendingUp className="w-3.5 h-3.5 text-rose-600" /> Popular:</span>
            {trendingLocalities.map(locality => <button key={locality} onClick={() => onNavigate('/search', { locality })} className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-100/70 hover:text-rose-700 text-slate-700 font-medium transition">{locality}</button>)}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/70 p-3 rounded-2xl border border-stone-200 shadow-sm"><div className="text-lg font-extrabold text-slate-900">{totalListingsCount}</div><div className="text-[11px] font-semibold text-slate-500">Available listings</div></div>
          <div className="bg-white/70 p-3 rounded-2xl border border-stone-200 shadow-sm"><div className="text-lg font-extrabold text-rose-700">8 areas</div><div className="text-[11px] font-semibold text-slate-500">Popular localities</div></div>
          <div className="bg-white/70 p-3 rounded-2xl border border-stone-200 shadow-sm"><div className="text-lg font-extrabold text-slate-900">Buy · Rent</div><div className="text-[11px] font-semibold text-slate-500">Ways to find home</div></div>
          <div className="bg-white/70 p-3 rounded-2xl border border-stone-200 shadow-sm"><div className="text-lg font-extrabold text-emerald-700">Direct</div><div className="text-[11px] font-semibold text-slate-500">Owner connections</div></div>
        </div>
      </div>
    </section>
  );
};
