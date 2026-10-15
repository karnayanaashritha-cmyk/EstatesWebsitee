import React, { useState } from 'react';
import { Property } from '../../types';
import { formatIndianPrice, formatArea } from '../../utils/formatters';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Eye, 
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onNavigate: (path: string, params?: any) => void;
  onOpenEnquiryModal: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onNavigate,
  onOpenEnquiryModal
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const primaryImage = property.images?.find(img => img.is_primary)?.image_url || 
                       property.images?.[0]?.image_url || 
                       'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const pricePerSqFt = property.area_sqft > 0 && property.listing_type === 'buy'
    ? Math.round(property.price / property.area_sqft)
    : null;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.allow_whatsapp || !property.contact_whatsapp) return;
    const cleanNumber = property.contact_whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello! I found your listing "${property.title}" in ${property.locality} on Hyderabad Heights (Ref: ${property.id}). I would like to know more details and schedule a visit.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.allow_phone || !property.contact_phone) return;
    window.location.href = `tel:${property.contact_phone}`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/property/${property.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCardClick = () => {
    onNavigate(`/property/${property.slug}`);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-300 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {/* Listing Type Tag */}
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-sm">
            {property.listing_type === 'buy' ? 'For Sale' : property.listing_type === 'rent' ? 'For Rent' : 'Commercial Lease'}
          </span>

          {/* Owner Sourced / Admin Neighborhood Listing tag */}
          {property.source_type === 'site_owner' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-700 text-white shadow-sm">
              Owner Sourced
            </span>
          )}

          {/* Sample Data Badge (Clearly labeled as mandated) */}
          {property.is_sample_data && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 backdrop-blur-sm shadow-sm">
              Sample Data
            </span>
          )}

          {/* Verified Badge ONLY when physically verified */}
          {property.is_verified ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-amber-300 backdrop-blur-sm shadow-sm">
              Unverified
            </span>
          )}
        </div>

        {/* Action icons (Bookmark & Share) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            title={isSaved ? 'Remove from saved' : 'Save property'}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 backdrop-blur-sm transition shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            title={copiedLink ? 'Link copied!' : 'Share property'}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 backdrop-blur-sm transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Image Info: Locality and Views */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('/search', { locality: property.locality });
            }}
            className="flex items-center gap-1 text-xs font-semibold drop-shadow-md hover:text-rose-300 transition text-white"
            title={`View all listings in ${property.locality}`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="hover:underline">{property.locality}, Hyderabad</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-200 drop-shadow-md">
            <Eye className="w-3.5 h-3.5" />
            <span>{property.views_count} views</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-1 sm:gap-2 mb-1.5">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatIndianPrice(property.price, property.listing_type === 'rent')}
            </div>
            {pricePerSqFt && (
              <div className="text-xs font-semibold text-slate-500">
                ₹{pricePerSqFt.toLocaleString('en-IN')}/sqft
              </div>
            )}
          </div>

          {/* Property Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-snug">
            {property.title}
          </h3>

          {/* Key Specs Row */}
          <div className="grid grid-cols-3 gap-1 xs:gap-2 py-3 my-2 border-y border-slate-100 text-xs text-slate-600">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <Bed className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="truncate"><strong className="font-semibold text-slate-800">{property.bedrooms}</strong> BHK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <Compass className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="truncate">{property.facing || 'East'} Facing</span>
              </div>
            )}

            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Bath className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span className="truncate"><strong className="font-semibold text-slate-800">{property.bathrooms || 1}</strong> Baths</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Maximize2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span className="truncate font-semibold text-slate-800">{property.area_sqft} <span className="font-normal text-slate-500">sqft</span></span>
            </div>
          </div>

          {/* TGRERA Badge if registered */}
          {property.rera_id && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">TGRERA: {property.rera_id}</span>
            </div>
          )}
        </div>

        {/* Contact and Enquiry Actions */}
        <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2">
          {/* Owner Privacy Respect: Show WhatsApp only if allowed */}
          {property.allow_whatsapp && property.contact_whatsapp ? (
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 min-w-[85px] py-2 px-2 xs:px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1 sm:gap-1.5 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>
          ) : null}

          {/* Call button only if allowed */}
          {property.allow_phone && property.contact_phone ? (
            <button
              type="button"
              onClick={handleCall}
              className="py-2 px-2.5 xs:px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 active:scale-95 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>Call</span>
            </button>
          ) : null}

          {/* Always provide direct Enquiry action */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onOpenEnquiryModal(property);
            }}
            className="flex-1 min-w-[75px] py-2 px-2.5 xs:px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-sm active:scale-95"
          >
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </article>
  );
};
