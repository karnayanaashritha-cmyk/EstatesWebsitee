import React, { useState } from 'react';
import { Property } from '../../types';
import { PropertyCard } from '../property/PropertyCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedListingsProps {
  properties: Property[];
  onNavigate: (path: string, params?: any) => void;
  onOpenEnquiryModal: (property: Property) => void;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({
  properties,
  onNavigate,
  onOpenEnquiryModal
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'rent' | 'villa'>('all');

  const filteredProperties = properties.filter(p => {
    if (activeTab === 'buy') return p.listing_type === 'buy';
    if (activeTab === 'rent') return p.listing_type === 'rent';
    if (activeTab === 'villa') return p.property_type === 'villa';
    return true;
  }).slice(0, 6);

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Hyderabad Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Properties Across Hyderabad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Verified gated communities, luxury villas, and high-rise apartments in Kokapet, Gachibowli, Tellapur, and prime IT corridors.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm self-start md:self-auto max-w-full overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'buy'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'rent'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rentals
            </button>
            <button
              onClick={() => setActiveTab('villa')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'villa'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Villas
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onNavigate={onNavigate}
                onOpenEnquiryModal={onOpenEnquiryModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No properties in this category currently.</p>
          </div>
        )}

        {/* View All Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/search')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-rose-400 font-bold text-sm rounded-xl transition shadow-sm hover:shadow"
          >
            <span>Explore All Hyderabad Properties</span>
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
