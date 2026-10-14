import React from 'react';
import { Logo } from '../components/common/Logo';
import { ShieldCheck, MapPin, Building, Users, Award, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            About Hyderabad Heights
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hyderabad’s Premier Real Estate Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hyderabad Heights is built around a simple idea: finding a home should feel clear, local, and personal. We bring Hyderabad homes and neighbourhoods together in one considered marketplace.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">TGRERA Compliance First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We prioritize consumer safety by validating Telangana RERA registration details across upcoming and newly launched gated communities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Direct Owner Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Homeowners enjoy complete control over their contact preferences, preventing unwanted spam while connecting with verified home seekers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deep Local Hyderabad Focus</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From high-rises in Kokapet's Golden Mile to tranquil villas in Tellapur and bustling metro hubs in Miyapur and Kukatpally, we know Hyderabad best.
            </p>
          </div>
        </div>

        {/* Our Story & Values */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Our Commitment to Hyderabad Real Estate
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Hyderabad has evolved into India's fastest growing tech and infrastructure hub. As the city expands along the Outer Ring Road (ORR) and the upcoming Regional Ring Road (RRR), finding genuine, legally sound real estate has become paramount for families, NRIs, and investors alike.
            </p>
            <p>
              Hyderabad Heights addresses the common frustrations of generic nationwide portals: inaccurate pricing, misleading photos, non-existent listings, and endless broker cold-calls. Every listing on Hyderabad Heights goes through an administrative review cycle to ensure high photographic quality and verified specifications.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/search')}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Browse Hyderabad Properties
            </button>
            <button
              onClick={() => onNavigate('/submit-property')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              List Your Property Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
