import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '919121055443',
  defaultMessage = 'Hi! I am visiting the Hyderabad Heights website and would like to enquire about properties in Hyderabad.'
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  return (
    <aside 
      aria-label="Contact on WhatsApp"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center pointer-events-auto select-none"
    >
      {/* WhatsApp Link with Tooltip and Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us directly on WhatsApp"
        className="group relative flex items-center justify-center"
      >
        {/* Subtle animated ambient ring */}
        <span 
          aria-hidden="true" 
          className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping duration-1000 group-hover:opacity-40" 
        />

        {/* Hover Pill / Tooltip for Desktop */}
        <div 
          className="hidden md:flex items-center gap-1.5 absolute right-full mr-3.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-semibold rounded-xl shadow-lg border border-slate-700/60 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap"
        >
          <span>Chat on WhatsApp</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          {/* Subtle caret triangle */}
          <span 
            aria-hidden="true" 
            className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900/90 rotate-45 border-r border-t border-slate-700/60" 
          />
        </div>

        {/* Floating Button Circle */}
        <div 
          className="relative w-13 h-13 sm:w-14 sm:h-14 w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa52] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl shadow-[#25D366]/35 hover:shadow-[#25D366]/50 transition-all duration-300 transform group-hover:scale-110 active:scale-95"
        >
          {/* Official WhatsApp SVG Vector Icon */}
          <svg 
            viewBox="0 0 32 32" 
            className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm" 
            aria-hidden="true"
          >
            <path d="M16.01 3C8.835 3 3 8.835 3 16.01c0 2.457.683 4.847 1.983 6.924L3 30.125l7.394-1.936a12.96 12.96 0 005.616 1.28h.006c7.172 0 13.006-5.835 13.006-13.01 0-3.475-1.353-6.741-3.811-9.2A12.923 12.923 0 0016.01 3zm0 2.222c2.88 0 5.589 1.121 7.625 3.158A10.708 10.708 0 0126.8 16.01c0 5.945-4.838 10.784-10.785 10.784a10.75 10.75 0 01-5.187-1.332l-.372-.221-4.385 1.15 1.17-4.275-.243-.387a10.71 10.71 0 01-1.644-5.719c0-5.945 4.84-10.788 10.785-10.788zm-4.333 5.485c-.244 0-.638.09-.972.455-.335.365-1.277 1.248-1.277 3.044 0 1.795 1.308 3.53 1.49 3.774.183.243 2.52 4.023 6.228 5.474 3.082 1.206 3.71.966 4.379.905.67-.061 2.158-.881 2.463-1.734.304-.852.304-1.581.213-1.734-.091-.152-.335-.243-.7-.426-.365-.183-2.159-1.065-2.493-1.187-.335-.122-.578-.183-.822.183-.243.365-.943 1.187-1.156 1.43-.213.244-.426.274-.79.092-.366-.183-1.543-.569-2.94-1.814-1.087-.97-1.821-2.167-2.034-2.532-.213-.365-.023-.562.16-.744.164-.164.365-.426.547-.639.183-.213.244-.365.366-.608.122-.244.06-.457-.03-.639-.092-.183-.823-1.982-1.127-2.713-.296-.712-.596-.615-.82-.627l-.7-.012z" />
          </svg>

          {/* Quick Online Status Badge */}
          <span 
            className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" 
            title="Online"
            aria-hidden="true"
          />
        </div>
      </a>
    </aside>
  );
};
