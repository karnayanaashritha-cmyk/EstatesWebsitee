import React from 'react';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';

interface LocalityGridProps {
  onNavigate: (path: string, params?: any) => void;
}

interface LocalityItem {
  name: string;
  tagline: string;
  avgPrice: string;
  count: number;
  image: string;
  badge?: string;
}

const LOCALITIES_DATA: LocalityItem[] = [
  {
    name: 'Kokapet',
    tagline: 'The Golden Mile & Neopolis SEZ',
    avgPrice: '₹8,500 - ₹12,000 / sqft',
    count: 32,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    badge: 'High Appreciation'
  },
  {
    name: 'Gachibowli',
    tagline: 'Cyberabad IT & Financial Core',
    avgPrice: '₹7,800 - ₹10,500 / sqft',
    count: 48,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    badge: 'Rental Hotspot'
  },
  {
    name: 'Tellapur',
    tagline: 'Luxury Gated Villa Enclaves',
    avgPrice: '₹6,900 - ₹9,200 / sqft',
    count: 24,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    badge: 'Family Favorite'
  },
  {
    name: 'Narsingi',
    tagline: 'Outer Ring Road (ORR) Junction',
    avgPrice: '₹7,500 - ₹9,800 / sqft',
    count: 19,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    badge: 'Expressway Access'
  },
  {
    name: 'Miyapur',
    tagline: 'Metro Terminal & High Connectivity',
    avgPrice: '₹5,200 - ₹6,800 / sqft',
    count: 36,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    badge: 'Metro Belt'
  },
  {
    name: 'Financial District',
    tagline: 'Nanakramguda Commercial Epicenter',
    avgPrice: '₹9,000 - ₹13,500 / sqft',
    count: 15,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    badge: 'Grade-A Towers'
  }
];

export const LocalityGrid: React.FC<LocalityGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>Hyderabad Growth Corridors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Prime Hyderabad Localities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Direct access to homes, gated communities, and upcoming high-rises in Telangana’s premier residential belts.
          </p>
        </div>

        {/* Localities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCALITIES_DATA.map(loc => (
            <div
              key={loc.name}
              onClick={() => onNavigate('/search', { locality: loc.name })}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top Badge */}
                {loc.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm">
                    {loc.badge}
                  </span>
                )}

                {/* Bottom Content inside Image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold tracking-tight">
                      {loc.name}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-rose-200 font-medium mt-0.5">
                    {loc.tagline}
                  </p>
                </div>
              </div>

              {/* Lower info bar */}
              <div className="p-3.5 bg-slate-50 flex items-center justify-between text-xs border-t border-slate-100">
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  <span>{loc.avgPrice}</span>
                </div>
                <span className="font-bold text-slate-800">
                  {loc.count}+ Listings
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
