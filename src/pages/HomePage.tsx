import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { PropertyService } from '../services/propertyService';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedListings } from '../components/home/FeaturedListings';
import { LocalityGrid } from '../components/home/LocalityGrid';
import { HyderabadHighlights } from '../components/home/HyderabadHighlights';
import { PlusCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenEnquiryModal: (property: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenEnquiryModal
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    try {
      const data = await PropertyService.getPublicProperties();
      setProperties(data);
    } catch (err) {
      console.error('Failed to load featured properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hyderabad Heights-inspired Hero Section */}
      <HeroSection
        onNavigate={onNavigate}
        totalListingsCount={properties.length}
      />

      {/* Featured Properties Grid */}
      <FeaturedListings
        properties={properties}
        onNavigate={onNavigate}
        onOpenEnquiryModal={onOpenEnquiryModal}
      />

      {/* Prime Hyderabad Localities Spotlight */}
      <LocalityGrid onNavigate={onNavigate} />

      {/* Trust & Highlights */}
      <HyderabadHighlights />

      {/* Call to Action for Hyderabad Owners & Builders */}
      <section className="py-16 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-100 text-xs font-bold backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Zero Brokerage For Direct Owners</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Are You an Owner or Builder in Hyderabad?
          </h2>

          <p className="text-xs sm:text-sm text-rose-100 max-w-xl mx-auto leading-relaxed">
            List your flat, villa, or commercial property on Hyderabad Heights in under 3 minutes. Connect directly with genuine buyers without unsolicited broker calls.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/submit-property')}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-rose-700 font-extrabold text-sm rounded-2xl shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-rose-600" />
              <span>Post Your Property Listing Free</span>
            </button>

            <button
              onClick={() => onNavigate('/search')}
              className="px-6 py-3.5 bg-rose-800/60 hover:bg-rose-800 text-white font-bold text-sm rounded-2xl border border-white/30 transition backdrop-blur-sm flex items-center gap-1.5"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
