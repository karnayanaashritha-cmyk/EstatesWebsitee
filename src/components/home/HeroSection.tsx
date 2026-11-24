import React from 'react';

interface HeroSectionProps {
  onNavigate: (path: string, params?: any) => void;
  totalListingsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[780px] xl:min-h-[820px] flex items-center overflow-hidden bg-slate-900 select-none">
      {/* Background Image Layer: High-quality interior penthouse room with balcony view */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-bg.jpg"
          alt="Luxury Hyderabad penthouse interior and terrace skyline"
          className="w-full h-full object-cover object-[76%_center] sm:object-[80%_center] md:object-right"
        />

        {/* Desktop Light Gradient Overlay: Soft translucent scrim on the left (allows the room to be seen clearly while keeping text crisp) */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.64) 36%, rgba(255, 255, 255, 0.28) 58%, rgba(255, 255, 255, 0.04) 76%, rgba(255, 255, 255, 0) 100%)',
          }}
        />

        {/* Mobile Light Gradient Overlay: Light, balanced gradient that preserves the room visible behind content */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 255, 255, 0.60) 45%, rgba(255, 255, 255, 0.22) 78%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 xs:pt-24 sm:pt-28 lg:pt-32 pb-10 xs:pb-12 sm:pb-16 lg:pb-20">
        {/* Responsive Reflow: On mobile, soft translucent card to guarantee pristine legibility without washing out the photo; on desktop, spacious open layout */}
        <div className="max-w-xl lg:max-w-2xl bg-white/60 md:bg-transparent backdrop-blur-2xs md:backdrop-blur-none p-5 xs:p-6 sm:p-8 md:p-0 rounded-3xl md:rounded-none border border-white/40 md:border-0 shadow-lg md:shadow-none shadow-slate-900/5">
          {/* Top Crimson Accent Bar */}
          <div className="w-10 sm:w-12 h-[3.5px] bg-[#c81e35] rounded-full mb-4 sm:mb-6" />

          {/* Main Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.25rem] font-extrabold text-black tracking-tight leading-[1.12] sm:leading-[1.08]">
            Find Your<br />
            Dream House in<br />
            Hyderabad
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-4 text-sm xs:text-base sm:text-lg lg:text-xl text-slate-700 font-medium tracking-normal leading-relaxed">
            Buy · Rent · Sell — Flats, Villas &amp; Plots
          </p>

          {/* Action Buttons Row */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5 xs:gap-3 sm:gap-4">
            <button
              id="hero-buy-btn"
              type="button"
              onClick={() => onNavigate('/search', { listingType: 'buy' })}
              className="h-11 sm:h-12 px-5 xs:px-6 sm:px-7 rounded-full bg-white hover:bg-slate-50 text-[#102D47] font-bold text-xs xs:text-sm sm:text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Buy Property
            </button>
            <button
              id="hero-rent-btn"
              type="button"
              onClick={() => onNavigate('/search', { listingType: 'rent' })}
              className="h-11 sm:h-12 px-5 xs:px-6 sm:px-7 rounded-full bg-white hover:bg-slate-50 text-[#102D47] font-bold text-xs xs:text-sm sm:text-base border border-slate-300 shadow-xs hover:border-slate-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Rent Property
            </button>
            <button
              id="hero-list-btn"
              type="button"
              onClick={() => onNavigate('/submit-property')}
              className="h-11 sm:h-12 px-5 xs:px-6 sm:px-7 rounded-full bg-[#c81e35] hover:bg-[#b0172b] text-white font-bold text-xs xs:text-sm sm:text-base shadow-md shadow-red-700/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 xs:gap-2 cursor-pointer min-h-[44px]"
            >
              <span>List Property</span>
              <span className="text-base sm:text-lg leading-none font-normal">→</span>
            </button>
          </div>

          {/* Stats Row: Compact, balanced 3-column grid */}
          <div className="mt-7 sm:mt-12 lg:mt-16 pt-5 sm:pt-6 border-t border-slate-300/60 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-6 max-w-lg">
            <div className="text-left">
              <div className="text-xl xs:text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-[#102D47] leading-none tracking-tight">
                5K+
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase mt-1 xs:mt-1.5 leading-tight">
                HAPPY FAMILIES
              </div>
            </div>

            <div className="text-left border-l border-slate-300/80 pl-2 xs:pl-3 sm:pl-6">
              <div className="text-xl xs:text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-[#102D47] leading-none tracking-tight">
                500+
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase mt-1 xs:mt-1.5 leading-tight">
                LISTED PROPERTIES
              </div>
            </div>

            <div className="text-left border-l border-slate-300/80 pl-2 xs:pl-3 sm:pl-6">
              <div className="text-xl xs:text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-[#102D47] leading-none tracking-tight">
                10+
              </div>
              <div className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase mt-1 xs:mt-1.5 leading-tight">
                PRIME LOCATIONS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
