import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, MapPin, Phone, Mail, ExternalLink, Heart } from 'lucide-react';
import { HYDERABAD_LOCALITIES } from '../../types';

interface FooterProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSupabaseModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" light showTagline />
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Hyderabad’s dedicated real estate portal designed for transparent, seamless property transactions. Discover verified homes, apartments, luxury villas, and plots across Telangana’s fastest-growing corridors.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Level 4, Knowledge City, HITEC City, Hyderabad, Telangana 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>+91 (040) 4892 0000 / +91 91210 55443</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>hello@hyderabadheights.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              Browse Portals
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => onNavigate('/search', { listingType: 'buy' })}
                  className="hover:text-rose-400 transition"
                >
                  Buy Residential Property
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/search', { listingType: 'rent' })}
                  className="hover:text-rose-400 transition"
                >
                  Rent Apartments & Flats
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/search', { propertyType: 'villa' })}
                  className="hover:text-rose-400 transition"
                >
                  Gated Community Villas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/search', { propertyType: 'plot' })}
                  className="hover:text-rose-400 transition"
                >
                  HMDA & RERA Approved Plots
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/search', { propertyType: 'commercial' })}
                  className="hover:text-rose-400 transition"
                >
                  Commercial Offices & Shops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/submit-property')}
                  className="text-rose-400 font-bold hover:underline"
                >
                  Post Free Property Listing &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Hyderabad Localities */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              Top Localities
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              {HYDERABAD_LOCALITIES.slice(0, 7).map(loc => (
                <li key={loc}>
                  <button 
                    onClick={() => onNavigate('/search', { locality: loc })}
                    className="hover:text-rose-400 transition"
                  >
                    Properties in {loc}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => onNavigate('/search')}
                  className="text-rose-400 font-medium hover:underline"
                >
                  View All Localities &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-rose-400 transition">
                  About Hyderabad Heights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-rose-400 transition">
                  Contact Hyderabad Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-rose-400 transition">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-rose-400 transition">
                  Terms of Service & RERA Note
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSupabaseModal}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1"
                >
                  <span>Supabase Schema & Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* RERA and Sample Data Disclaimers */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Telangana RERA (TGRERA) Compliance & Sample Data Disclosure
          </div>
          <p>
            <strong>Regulatory Compliance:</strong> Hyderabad Heights strictly respects the guidelines of the Real Estate (Regulation and Development) Act, 2016 (RERA) and the Telangana State Real Estate Regulatory Authority (TGRERA). Users are strongly advised to independently verify the RERA registration number and approved sanction plans on the official portal (<a href="https://rera.telangana.gov.in" target="_blank" rel="noreferrer" className="text-rose-400 underline">rera.telangana.gov.in</a>) before entering into any financial transaction.
          </p>
          <p>
            <strong>Sample Data Notice:</strong> Sample property records are explicitly tagged as <em>sample data</em> to showcase the platform experience. Hyderabad Heights strictly enforces owner privacy preferences and will never expose private owner contact details without authorization.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Hyderabad Heights Portal. All rights reserved. Built for Hyderabad, Telangana.
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Hyderabad Home Buyers & Sellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
