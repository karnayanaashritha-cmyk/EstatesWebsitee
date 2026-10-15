import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { PropertyService } from '../services/propertyService';
import { formatIndianPrice, formatArea } from '../utils/formatters';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Share2, 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Lock,
  ChevronLeft,
  ChevronRight,
  Check,
  Expand,
  X,
  Navigation,
  Edit3,
  Trash2,
  Camera,
  UserCheck,
  ShieldAlert,
  Info
} from 'lucide-react';
import { EnquiryService } from '../services/enquiryService';
import { AuthService } from '../services/authService';
import { ReportModal } from '../components/property/ReportModal';
import { PropertyCard } from '../components/property/PropertyCard';
import { AdminPropertyModal } from '../components/admin/AdminPropertyModal';

interface PropertyDetailPageProps {
  identifier: string; // id or slug
  onNavigate: (path: string, params?: any) => void;
  onOpenEnquiryModal: (property: Property) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  identifier,
  onNavigate,
  onOpenEnquiryModal
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [adminEditModalOpen, setAdminEditModalOpen] = useState(false);

  const handleAdminDelete = async () => {
    if (!property) return;
    if (window.confirm(`Delete "${property.title}" permanently from the portal database?`)) {
      await PropertyService.deleteProperty(property.id);
      onNavigate('/search');
    }
  };

  const images = property?.images && property.images.length > 0 
    ? property.images.map(i => i.image_url) 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  // Keyboard navigation & body scroll lock for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, images.length]);

  // Direct Enquiry Form states on detail page
  const currentUser = AuthService.getCurrentUser();
  const [enqName, setEnqName] = useState(currentUser?.full_name || '');
  const [enqPhone, setEnqPhone] = useState(currentUser?.phone || '');
  const [enqEmail, setEnqEmail] = useState(currentUser?.email || '');
  const [enqMessage, setEnqMessage] = useState('Hi, I am interested in this property. Please contact me with more information.');
  const [enqSubmitting, setEnqSubmitting] = useState(false);
  const [enqSuccess, setEnqSuccess] = useState(false);

  useEffect(() => {
    loadPropertyData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  const loadPropertyData = async () => {
    setLoading(true);
    try {
      const prop = await PropertyService.getPropertyBySlugOrId(identifier);
      setProperty(prop);

      if (prop) {
        // Load similar properties in same locality
        const all = await PropertyService.getPublicProperties({ locality: prop.locality });
        setSimilarProperties(all.filter(p => p.id !== prop.id).slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching property detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPhone = (phoneNum: string) => {
    navigator.clipboard.writeText(phoneNum);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleInlineEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setEnqSubmitting(true);
    try {
      await EnquiryService.submitEnquiry({
        property_id: property.id,
        property_title: property.title,
        property_locality: property.locality,
        user_id: currentUser?.id,
        sender_name: enqName,
        sender_phone: enqPhone,
        sender_email: enqEmail,
        message: enqMessage
      });
      setEnqSuccess(true);
    } catch (err) {
      console.error('Enquiry failed:', err);
    } finally {
      setEnqSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-96 bg-slate-200 rounded-2xl w-full" />
          <div className="h-10 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
          <p className="text-xs text-slate-500">
            This listing may have been rented, sold, or is currently under review by our moderation team.
          </p>
          <button
            onClick={() => onNavigate('/search')}
            className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Browse Other Hyderabad Properties
          </button>
        </div>
      </div>
    );
  }

  const pricePerSqFt = property.area_sqft > 0 && property.listing_type === 'buy'
    ? Math.round(property.price / property.area_sqft)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-4 pb-28 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/search')}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-rose-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hyderabad Listings</span>
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => onNavigate('/search', { locality: property.locality })}
              className="text-rose-600 font-semibold hover:underline"
            >
              {property.locality}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-1.5 bg-white border border-slate-200 rounded-lg transition shadow-sm ${
                isSaved ? 'text-rose-600' : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Site Owner / Admin Quick Control Bar */}
        {currentUser?.role === 'admin' && (
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border border-slate-800 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                👑
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-2">
                  <span>Website Owner Controls</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white uppercase tracking-wider">
                    Site Administrator Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  You can edit property details, location, area, price, or real photos, or remove this listing from the website.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setAdminEditModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details & Photos</span>
              </button>

              <button
                type="button"
                onClick={handleAdminDelete}
                className="px-3.5 py-2 bg-slate-800 hover:bg-red-900/60 text-red-400 hover:text-red-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700 hover:border-red-500/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY SECTION */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          {/* Main Large Image (Clickable for Fullscreen Lightbox) */}
          <div 
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-inner cursor-pointer group"
          >
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center z-10">
              <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                {property.listing_type === 'buy' ? 'For Sale' : property.listing_type === 'rent' ? 'For Rent' : 'Lease'}
              </span>

              {property.source_type === 'site_owner' && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-700 text-white shadow-md flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Website Owner Sourced
                </span>
              )}

              {property.is_sample_data && (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-slate-900 shadow-md">
                  Sample Data
                </span>
              )}

              {property.is_verified ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hyderabad Heights Verified
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/85 text-amber-300 backdrop-blur-sm flex items-center gap-1 shadow-md border border-amber-400/30">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Self-Reported • Unverified
                </span>
              )}
            </div>

            {/* Arrow Navigators */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-slate-900 transition shadow-lg z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-slate-900 transition shadow-lg z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Trigger Pill */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 transition shadow"
              >
                <Expand className="w-3.5 h-3.5" />
                <span>View Fullscreen ({images.length} Photos)</span>
              </button>
            </div>

            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur-sm z-10">
              Photo {activeImageIndex + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                    activeImageIndex === idx ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS GRID: Content (Left) + Contact Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Property Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title, Locality & Pricing Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formatIndianPrice(property.price, property.listing_type === 'rent')}
                  </div>
                  {pricePerSqFt && (
                    <div className="text-xs font-semibold text-slate-500 mt-0.5">
                      ₹{pricePerSqFt.toLocaleString('en-IN')} per sq.ft
                    </div>
                  )}
                </div>

                {property.maintenance ? (
                  <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg self-start">
                    Maintenance: <strong>₹{property.maintenance.toLocaleString('en-IN')}/mo</strong>
                  </div>
                ) : null}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {property.title}
              </h1>

              {/* Clickable Locality & Address */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{property.address}, </span>
                <button
                  onClick={() => onNavigate('/search', { locality: property.locality })}
                  className="font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
                >
                  {property.locality}
                </button>
                <span>, Hyderabad, Telangana {property.pincode ? `- ${property.pincode}` : ''}</span>
              </div>

              {property.landmark && (
                <div className="text-xs text-slate-500 pl-5">
                  <strong>Landmark:</strong> {property.landmark}
                </div>
              )}
            </div>

            {/* KEY PROPERTY OVERVIEW SPECS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  Key Specifications & Overview
                </h2>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  {property.property_type}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-xs">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Configuration</span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1 min-w-0">
                    <Bed className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.property_type}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Super Built-up Area</span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1 min-w-0">
                    <Maximize2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{formatArea(property.area_sqft)}</span>
                  </div>
                </div>

                {property.carpet_area_sqft ? (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                    <span className="text-slate-500 font-semibold block truncate">Carpet Area</span>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1 min-w-0">
                      <Expand className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{formatArea(property.carpet_area_sqft)}</span>
                    </div>
                  </div>
                ) : null}

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Bathrooms</span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1 min-w-0">
                    <Bath className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{property.bathrooms || '1'} Baths</span>
                  </div>
                </div>

                {property.balconies !== undefined ? (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                    <span className="text-slate-500 font-semibold block truncate">Balconies</span>
                    <span className="font-extrabold text-slate-900 text-sm truncate block">{property.balconies} Balcony</span>
                  </div>
                ) : null}

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Facing Direction</span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1 min-w-0">
                    <Compass className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{property.facing || 'East'}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Furnishing</span>
                  <span className="font-extrabold text-slate-900 text-sm truncate block">{property.furnishing}</span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Possession</span>
                  <span className="font-extrabold text-slate-900 text-sm truncate block">{property.possession_status}</span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Floor</span>
                  <span className="font-extrabold text-slate-900 text-sm truncate block">
                    {property.floor_no !== undefined ? `${property.floor_no} of ${property.total_floors || '-'}` : 'Independent'}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl space-y-1 min-w-0">
                  <span className="text-slate-500 font-semibold block truncate">Age of Property</span>
                  <span className="font-extrabold text-slate-900 text-sm truncate block">{property.age_of_property || 'Ready / New'}</span>
                </div>
              </div>
            </div>

            {/* HYDERABAD LOCALITY & CONNECTIVITY CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-rose-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Neighborhood & Connectivity — {property.locality}
                    </h2>
                    <p className="text-xs text-slate-500">Hyderabad, Telangana Location Highlights</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('/search', { locality: property.locality })}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl border border-rose-200 transition"
                  >
                    View All in {property.locality} &rarr;
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title}, ${property.locality}, Hyderabad, Telangana`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Open in Maps</span>
                  </a>
                </div>
              </div>

              {/* Transit & Key Hub highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-semibold block">Expressway Connectivity</span>
                  <span className="font-bold text-slate-800">Outer Ring Road (ORR) Junction nearby</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-semibold block">IT Corridor Proximity</span>
                  <span className="font-bold text-slate-800">Quick commute to Hitec City & Financial District</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-500 font-semibold block">Airport Transit</span>
                  <span className="font-bold text-slate-800">~25-35 mins to RGIA Shamshabad</span>
                </div>
              </div>
            </div>

            {/* TELANGANA RERA (TGRERA) REGISTRATION BOX */}
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Telangana Real Estate Regulatory Authority (TGRERA) Details
                  </h3>
                  <p className="text-xs text-emerald-700">Official project registration & legal status</p>
                </div>
              </div>

              {property.rera_id ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <span className="text-slate-500 font-semibold block">TGRERA Registration Number</span>
                    <span className="text-base font-extrabold text-emerald-900 font-mono">{property.rera_id}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col justify-between">
                    <span className="text-slate-500 font-semibold block">Authority Portal Verification</span>
                    <a
                      href="https://rera.telangana.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>Check on rera.telangana.gov.in</span>
                      &rarr;
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-800">
                  This listing is an individual resale / independent property. Buyers are advised to verify municipality permits with GHMC/HMDA.
                </p>
              )}

              {property.verification_notes && (
                <div className="text-xs text-emerald-900 bg-white/80 p-3 rounded-xl border border-emerald-200">
                  <strong>Verification Note:</strong> {property.verification_notes}
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                About this Property
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Features & Amenities
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {property.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LISTING INFORMATION SOURCE & VERIFICATION TRANSPARENCY CARD */}
            <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-amber-200/80 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Listing Information Source & Verification Transparency
                  </h3>
                  <p className="text-xs text-amber-800">
                    Mandatory disclosure of listing origin, submitter, and verification status
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Information & Photos Supplied By
                  </span>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-rose-600" />
                    <span>
                      {property.source_type === 'site_owner'
                        ? 'Website Owner / Site Administrator'
                        : property.contact_name || 'Website Administrator'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {property.source_info || 
                     'Information and genuine photos submitted directly by the website administrator based on neighborhood observation and seller disclosure.'}
                  </p>
                  {property.photos_source && (
                    <div className="text-[11px] font-semibold text-rose-700 pt-1 border-t border-slate-100 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{property.photos_source}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Independent Verification Status
                  </span>
                  <div className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
                    {property.is_verified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {property.is_verified ? 'Physically Verified by Field Team' : 'Unverified Neighborhood Listing'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {property.is_verified
                      ? property.verification_notes
                      : 'This property has not been independently inspected or verified by third-party authorities. Information is self-reported by the site owner/seller.'}
                  </p>
                </div>
              </div>

              {/* Mandatory Due Diligence Notice */}
              <div className="p-3.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-800" />
                  <span>Buyer Advisory & Due Diligence Required</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Prospective buyers are advised to independently inspect title documents, Encumbrance Certificate (EC), and verify municipal permits with GHMC/HMDA and TGRERA prior to making any financial transactions.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Contact Box & Direct Enquiry */}
          <div className="space-y-6">
            {/* OWNER CONTACT CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card sticky top-24 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                    Listing Contact
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {property.contact_name}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-sm">
                  {property.contact_name.charAt(0)}
                </div>
              </div>

              {/* Direct Actions (Respecting Permissions) */}
              <div className="space-y-2.5">
                {property.allow_whatsapp && property.contact_whatsapp ? (
                  <button
                    onClick={() => {
                      const cleanNumber = property.contact_whatsapp?.replace(/[^0-9]/g, '');
                      const msg = encodeURIComponent(
                        `Hi ${property.contact_name}, I saw your property "${property.title}" in ${property.locality} on Hyderabad Heights (Ref: ${property.id}). I would like to schedule a visit.`
                      );
                      window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                ) : null}

                {property.allow_phone && property.contact_phone ? (
                  <div className="space-y-2">
                    <a
                      href={`tel:${property.contact_phone}`}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Phone className="w-4 h-4 text-rose-400" />
                      <span>Call {property.contact_phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => property.contact_phone && handleCopyPhone(property.contact_phone)}
                      className="w-full py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition text-center"
                    >
                      {copiedPhone ? '✓ Phone Number Copied' : 'Copy Phone Number'}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Owner contact protected. Send direct enquiry below.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEnquiryModal(property)}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <span>Schedule a Site Visit</span>
                </button>
              </div>

              {/* Direct Message Enquiry Form */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Send Direct Lead / Message
                </h4>

                {enqSuccess ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                    <div className="text-xs font-bold text-emerald-900">Enquiry Submitted!</div>
                    <p className="text-[11px] text-emerald-700">
                      The owner has been notified. You will receive a response shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInlineEnquirySubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={enqName}
                      onChange={e => setEnqName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />

                    <input
                      type="tel"
                      required
                      value={enqPhone}
                      onChange={e => setEnqPhone(e.target.value)}
                      placeholder="Your Mobile Number *"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />

                    <input
                      type="email"
                      required
                      value={enqEmail}
                      onChange={e => setEnqEmail(e.target.value)}
                      placeholder="Your Email Address *"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />

                    <textarea
                      rows={2}
                      value={enqMessage}
                      onChange={e => setEnqMessage(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:border-rose-500"
                    />

                    <button
                      type="submit"
                      disabled={enqSubmitting}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{enqSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Report Listing Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Inaccurate Information</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PROPERTIES IN HYDERABAD */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Similar Properties in {property.locality}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map(sim => (
                <PropertyCard
                  key={sim.id}
                  property={sim}
                  onNavigate={onNavigate}
                  onOpenEnquiryModal={onOpenEnquiryModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white z-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm sm:text-base line-clamp-1">{property.title}</span>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                ({activeImageIndex + 1} of {images.length})
              </span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image & Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <img
              src={images[activeImageIndex]}
              alt={`Photo ${activeImageIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition shadow-xl"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition shadow-xl"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10" onClick={e => e.stopPropagation()}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        property={property}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Admin Edit Modal */}
      {property && (
        <AdminPropertyModal
          isOpen={adminEditModalOpen}
          onClose={() => setAdminEditModalOpen(false)}
          propertyToEdit={property}
          onSuccess={(saved) => {
            setProperty(saved);
            setAdminEditModalOpen(false);
          }}
          onDelete={(_id) => {
            setAdminEditModalOpen(false);
            onNavigate('/search');
          }}
          onNavigate={onNavigate}
        />
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 py-2.5 shadow-2xl flex items-center justify-between gap-2 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]">
        <div className="min-w-0 pr-1">
          <div className="text-base xs:text-lg font-extrabold text-slate-900 leading-tight truncate">
            {formatIndianPrice(property.price, property.listing_type === 'rent')}
          </div>
          <div className="text-[10px] text-slate-500 font-medium truncate">
            {property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.property_type} • {property.locality}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {property.allow_whatsapp && property.contact_whatsapp && (
            <button
              type="button"
              onClick={() => {
                const cleanNumber = property.contact_whatsapp?.replace(/[^0-9]/g, '');
                const msg = encodeURIComponent(
                  `Hi ${property.contact_name}, I saw your property "${property.title}" in ${property.locality} on Hyderabad Heights (Ref: ${property.id}). I would like to schedule a visit.`
                );
                window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');
              }}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition active:scale-95 flex items-center justify-center shadow-sm"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </button>
          )}

          {property.allow_phone && property.contact_phone && (
            <a
              href={`tel:${property.contact_phone}`}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition active:scale-95 flex items-center justify-center shadow-sm"
              title="Call Contact"
              aria-label="Call Contact"
            >
              <Phone className="w-4 h-4 text-slate-700" />
            </a>
          )}

          <button
            type="button"
            onClick={() => onOpenEnquiryModal(property)}
            className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            <span>Enquire / Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
