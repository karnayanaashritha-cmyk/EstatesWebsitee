import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = true,
  light = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-14 sm:h-14'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-xl sm:text-3xl'
  };

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 group select-none">
      <div className={`relative ${iconSizes[size]} rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 p-1.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0`}>
        {/* Custom Hyderabad Skyline & Home Monogram */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor">
          <path d="M3 21h18" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 21V11l4-4v14" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 7l5-4 5 4v14" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
          <path d="M13 10h2v3h-2z" fill="currentColor" />
          <path d="M13 15h2v3h-2z" fill="currentColor" />
          <circle cx="16" cy="5" r="1.5" fill="#f59e0b" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col justify-center select-none min-w-0">
        <div className={`font-extrabold tracking-tight whitespace-nowrap leading-none ${textSizes[size]}`}>
          <span className={light ? 'text-white' : 'text-slate-900'}>Hyderabad</span>
          <span className="text-rose-600"> Heights</span>
        </div>
        {showTagline && (
          <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-0.5 sm:mt-1 leading-none hidden xs:block ${light ? 'text-rose-200' : 'text-slate-400'}`}>
            REAL ESTATE, REFINED
          </span>
        )}
      </div>
    </div>
  );
};
