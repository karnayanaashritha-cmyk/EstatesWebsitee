import React from 'react';
import { ShieldCheck, UserCheck, SearchCheck, MapPin, Zap, Award } from 'lucide-react';

export const HyderabadHighlights: React.FC = () => {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'TGRERA Registration Checks',
      description: 'We mandate and cross-reference Telangana RERA project registration numbers to protect Hyderabad buyers from unauthorized developments.'
    },
    {
      icon: UserCheck,
      title: 'Direct Owner Connections',
      description: 'Get in touch directly with verified homeowners and builders via WhatsApp and phone without unsolicited brokerage spam.'
    },
    {
      icon: MapPin,
      title: 'Hyperlocal Hyderabad Focus',
      description: 'Built exclusively for Hyderabad, from Neopolis Kokapet high-rises to Tellapur villa enclaves and Miyapur metro corridors.'
    },
    {
      icon: SearchCheck,
      title: 'Real Documented Verification',
      description: 'We only label properties as "Verified" after field-team physical visits and title documentation checks.'
    },
    {
      icon: Zap,
      title: 'Instant Lead Notifications',
      description: 'Property owners and agents receive real-time enquiry alerts and can manage buyer requests from a dedicated dashboard.'
    },
    {
      icon: Award,
      title: 'Free Listing For Owners',
      description: 'List your flat, villa, or HMDA plot completely free with multiple high-definition photos and custom contact privacy controls.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
            The Hyderabad Heights Distinction
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-white">
            Why Hyderabad Chooses Hyderabad Heights
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            A real estate marketplace created with Telugu warmth and uncompromising standards of buyer protection and transparent listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-rose-500/50 transition-all duration-300 hover:bg-slate-800"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
