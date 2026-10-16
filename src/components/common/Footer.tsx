import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenSupabaseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 sm:py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* Column 1: Brand */}
          <div className="space-y-2.5">
            <Logo size="sm" light showTagline />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Find verified properties to buy, rent, and sell across Hyderabad.
            </p>
          </div>

          {/* Column 2: Explore & Popular Localities */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Explore
              </h3>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-400">
                <li>
                  <button 
                    onClick={() => onNavigate('/search', { listingType: 'buy' })}
                    className="hover:text-white transition"
                  >
                    Buy Properties
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('/search', { listingType: 'rent' })}
                    className="hover:text-white transition"
                  >
                    Rent Properties
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('/submit-property')}
                    className="text-rose-400 font-semibold hover:text-rose-300 transition"
                  >
                    List Your Property &rarr;
                  </button>
                </li>
              </ul>
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Popular Localities
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                <button 
                  onClick={() => onNavigate('/search', { locality: 'Gachibowli' })} 
                  className="hover:text-white transition"
                >
                  Gachibowli
                </button>
                <span className="text-slate-600">·</span>
                <button 
                  onClick={() => onNavigate('/search', { locality: 'Kokapet' })} 
                  className="hover:text-white transition"
                >
                  Kokapet
                </button>
                <span className="text-slate-600">·</span>
                <button 
                  onClick={() => onNavigate('/search', { locality: 'Kondapur' })} 
                  className="hover:text-white transition"
                >
                  Kondapur
                </button>
                <span className="text-slate-600">·</span>
                <button 
                  onClick={() => onNavigate('/search', { locality: 'Miyapur' })} 
                  className="hover:text-white transition"
                >
                  Miyapur
                </button>
                <span className="text-slate-600">·</span>
                <button 
                  onClick={() => onNavigate('/search')} 
                  className="text-rose-400 font-medium hover:underline whitespace-nowrap"
                >
                  View All Locations
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Legal */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Contact & Legal
              </h3>
              <div className="space-y-1.5 text-xs text-slate-400">
                <a 
                  href="mailto:hello@hyderabadheights.in" 
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span>hello@hyderabadheights.in</span>
                </a>
                <a 
                  href="tel:+919121055443" 
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span>+91 91210 55443</span>
                </a>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <button 
                onClick={() => onNavigate('/privacy')} 
                className="hover:text-white transition whitespace-nowrap"
              >
                Privacy Policy
              </button>
              <span className="text-slate-600">·</span>
              <button 
                onClick={() => onNavigate('/terms')} 
                className="hover:text-white transition whitespace-nowrap"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>

        {/* Thin Divider and Copyright */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <div>
            &copy; 2026 Hyderabad Heights. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span>
              TGRERA Compliance: Verify on{' '}
              <a 
                href="https://rera.telangana.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-400 hover:text-rose-400 underline"
              >
                rera.telangana.gov.in
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
