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
    sm: 'w-7 h-7 xs:w-8 xs:h-8 rounded-lg p-1.5',
    md: 'w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl p-1.5 xs:p-2',
    lg: 'w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-2xl p-2 sm:p-2.5'
  };

  const textSizes = {
    sm: 'text-xs xs:text-sm sm:text-base',
    md: 'text-sm xs:text-base sm:text-lg lg:text-xl',
    lg: 'text-lg xs:text-xl sm:text-2xl lg:text-3xl'
  };

  const taglineSizes = {
    sm: 'text-[7px] xs:text-[8px] sm:text-[9px] tracking-[0.16em]',
    md: 'text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em]',
    lg: 'text-[9px] xs:text-[10px] sm:text-xs tracking-[0.22em]'
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group select-none">
      {/* Red rounded icon container kept as requested */}
      <div className={`relative ${iconSizes[size]} bg-[#c81e35] rounded-xl shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0`}>
        {/* Architectural House Glyph with white stroke lines */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9z" />
          <path d="M9 21v-7.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V21" />
        </svg>
      </div>

      <div className="flex flex-col justify-center select-none min-w-0">
        <div className={`font-extrabold tracking-wide uppercase whitespace-nowrap leading-none ${textSizes[size]}`}>
          <span className={light ? 'text-white' : 'text-[#c81e35]'}>HYDERABAD </span>
          <span className={light ? 'text-white' : 'text-[#c81e35]'}>HEIGHTS</span>
        </div>
        {showTagline && (
          <span className={`font-semibold uppercase mt-1 leading-none truncate ${taglineSizes[size]} ${light ? 'text-slate-300' : 'text-slate-600'}`}>
            YOUR HOME. YOUR FUTURE.
          </span>
        )}
      </div>
    </div>
  );
};

