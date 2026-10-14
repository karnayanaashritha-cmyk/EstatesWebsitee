import React, { useState } from 'react';
import { 
  HYDERABAD_LOCALITIES, 
  PROPERTY_TYPES, 
  AMENITIES_LIST, 
  PropertyType, 
  ListingType, 
  FacingDirection, 
  FurnishingStatus, 
  PossessionStatus 
} from '../types';
import { PropertyService } from '../services/propertyService';
import { AuthService } from '../services/authService';
import { LocalitySelect } from '../components/common/LocalitySelect';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Lock,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';


interface SubmitPropertyPageProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenAuthModal: () => void;
}

export const SubmitPropertyPage: React.FC<SubmitPropertyPageProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const currentUser = AuthService.getCurrentUser();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState<string | null>(null);
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Location
  const [locality, setLocality] = useState<string>('Kokapet');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('500075');

  // Specs & Pricing
  const [price, setPrice] = useState<number | ''>('');
  const [maintenance, setMaintenance] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [areaSqft, setAreaSqft] = useState<number | ''>(2100);
  const [carpetAreaSqft, setCarpetAreaSqft] = useState<number | ''>(1750);
  const [facing, setFacing] = useState<FacingDirection>('East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-furnished');
  const [floorNo, setFloorNo] = useState<number | ''>(12);
  const [totalFloors, setTotalFloors] = useState<number | ''>(32);
  const [possessionStatus, setPossessionStatus] = useState<PossessionStatus>('Ready to Move');
  const [ageOfProperty, setAgeOfProperty] = useState('Brand New');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Security & CCTV',
    'Clubhouse',
    'Power Backup (100%)',
    'Covered Car Parking',
    'Manjeera Water Connection'
  ]);

  // RERA
  const [reraId, setReraId] = useState('');
  const [isReraVerified, setIsReraVerified] = useState(false);

  // Contact & Privacy
  const [contactName, setContactName] = useState(currentUser?.full_name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98490 55667');
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.phone ? currentUser.phone.replace(/[^0-9]/g, '') : '919849055667');
  const [allowPhone, setAllowPhone] = useState(true);
  const [allowWhatsapp, setAllowWhatsapp] = useState(true);

  // Images
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; isPrimary: boolean }>>([
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isPrimary: true
    },
    {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      isPrimary: false
    }
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setUploadedImages(prev => [
      ...prev,
      { url: imageUrlInput.trim(), isPrimary: prev.length === 0 }
    ]);
    setImageUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages(prev => [
            ...prev,
            { url: reader.result as string, isPrimary: prev.length === 0 }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setUploadedImages(prev =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setError('Please enter a descriptive property title.');
        return false;
      }
      if (!price || Number(price) <= 0) {
        setError('Please enter a valid price / rent amount.');
        return false;
      }
      if (!areaSqft || Number(areaSqft) <= 0) {
        setError('Please enter the built-up area in square feet.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!address.trim()) {
        setError('Please provide the building or project address.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (uploadedImages.length === 0) {
        setError('Please provide at least one photo for your listing.');
        return false;
      }
      if (!contactName.trim()) {
        setError('Please enter your contact display name.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);
    setError(null);

    try {
      const newProp = await PropertyService.createProperty({
        title,
        description: description || `Splendid ${bedrooms} BHK ${propertyType} in ${locality}, Hyderabad. Featuring ${areaSqft} sq.ft area with ${facing} facing and modern amenities.`,
        property_type: propertyType,
        listing_type: listingType,
        price: Number(price),
        maintenance: maintenance ? Number(maintenance) : 0,
        locality,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode,
        address,
        landmark,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        area_sqft: Number(areaSqft),
        carpet_area_sqft: carpetAreaSqft ? Number(carpetAreaSqft) : undefined,
        facing,
        furnishing,
        floor_no: floorNo ? Number(floorNo) : undefined,
        total_floors: totalFloors ? Number(totalFloors) : undefined,
        possession_status: possessionStatus,
        age_of_property: ageOfProperty,
        amenities: selectedAmenities,
        rera_id: reraId ? reraId.trim() : undefined,
        is_rera_verified: isReraVerified,
        is_verified: false, // New submissions undergo moderation
        status: 'approved', // For testing/demo immediate feedback
        owner_id: currentUser?.id || 'owner-sample-01',
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        allow_phone: allowPhone,
        allow_whatsapp: allowWhatsapp,
        is_sample_data: false,
        images: uploadedImages.map((img, i) => ({
          id: `img-${Date.now()}-${i}`,
          property_id: '',
          image_url: img.url,
          is_primary: img.isPrimary,
          display_order: i + 1
        }))
      });

      setSubmittedPropertyId(newProp.id);
      setSubmittedSlug(newProp.slug);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Owner & Agent Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            List Your Hyderabad Property
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post your flat, villa, plot, or commercial space. Free of charge with owner privacy options.
          </p>
        </div>

        {/* SUBMISSION SUCCESS STATE */}
        {submittedPropertyId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Property Listed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Your property in <strong>{locality}, Hyderabad</strong> has been stored in the database.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1 text-slate-600">
              <div>Reference ID: <strong className="text-slate-900">{submittedPropertyId}</strong></div>
              <div>Status: <span className="text-emerald-700 font-bold">Approved & Active on Portal</span></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate(`/property/${submittedSlug}`)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Public Listing</span>
              </button>

              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Go to Owner Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP WIZARD FORM */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
              <div className={`py-4 px-2 border-r border-slate-200 ${step === 1 ? 'bg-white text-rose-600 border-b-2 border-b-rose-600' : 'text-slate-500'}`}>
                1. Basic Info & Pricing
              </div>
              <div className={`py-4 px-2 border-r border-slate-200 ${step === 2 ? 'bg-white text-rose-600 border-b-2 border-b-rose-600' : 'text-slate-500'}`}>
                2. Location & Specs
              </div>
              <div className={`py-4 px-2 ${step === 3 ? 'bg-white text-rose-600 border-b-2 border-b-rose-600' : 'text-slate-500'}`}>
                3. Photos & Contact
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: Basic Info, Category & Pricing */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Listing Type & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Listing Purpose *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['buy', 'rent', 'lease'] as ListingType[]).map(type => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setListingType(type)}
                            className={`py-2 text-xs font-bold rounded-xl border capitalize transition ${
                              listingType === type
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {type === 'buy' ? 'Sell' : type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Property Category *
                      </label>
                      <select
                        value={propertyType}
                        onChange={e => setPropertyType(e.target.value as PropertyType)}
                        className="w-full p-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500"
                      >
                        {PROPERTY_TYPES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. 3 BHK Luxury Corner Flat with Lake View in Kokapet"
                      className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  {/* Pricing & Maintenance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Expected Price (₹) *'}
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                          placeholder={listingType === 'rent' ? '45000' : '18500000'}
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {listingType === 'buy' ? 'e.g. 15000000 for ₹1.50 Cr' : 'Rent per month'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Monthly Maintenance (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <input
                          type="number"
                          value={maintenance}
                          onChange={e => setMaintenance(e.target.value ? Number(e.target.value) : '')}
                          placeholder="4500"
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Detailed Description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Highlight unique advantages, ventilation, proximity to IT hubs, international schools, metro, Vastu compliance..."
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location, Specs & RERA */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Searchable Locality & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Hyderabad Locality *
                      </label>
                      <LocalitySelect
                        value={locality}
                        onChange={setLocality}
                        placeholder="Search or Select Locality (e.g. Kokapet, Gachibowli, Tellapur)..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        placeholder="500075"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Building / Society / Complete Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. Flat 1402, Tower B, My Home Bhooja, Financial District Road"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Landmark / Proximity
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      placeholder="e.g. 2 mins from ORR Exit 1 & Behind IKEA"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  {/* Bed, Bath, Balconies & Facing */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">BHK Bedrooms</label>
                      <select
                        value={bedrooms}
                        onChange={e => setBedrooms(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} BHK</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
                      <select
                        value={bathrooms}
                        onChange={e => setBathrooms(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold"
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <option key={n} value={n}>{n} Baths</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Balconies</label>
                      <select
                        value={balconies}
                        onChange={e => setBalconies(Number(e.target.value))}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold"
                      >
                        {[0, 1, 2, 3, 4].map(n => (
                          <option key={n} value={n}>{n} Balconies</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Facing</label>
                      <select
                        value={facing}
                        onChange={e => setFacing(e.target.value as FacingDirection)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 font-semibold"
                      >
                        {['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Area (Super Built-up and Carpet Area) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-rose-600" />
                        <span>Space & Usable Area in Sq.Ft *</span>
                      </span>
                      {price && areaSqft ? (
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                          ₹{Math.round(Number(price) / Number(areaSqft)).toLocaleString('en-IN')}/sq.ft
                        </span>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-600 font-semibold mb-1">
                          Super Built-up Area (sq.ft) *
                        </label>
                        <input
                          type="number"
                          required
                          value={areaSqft}
                          onChange={e => {
                            const val = e.target.value ? Number(e.target.value) : '';
                            setAreaSqft(val);
                            if (val && typeof val === 'number') {
                              setCarpetAreaSqft(Math.round(val * 0.78));
                            }
                          }}
                          placeholder="e.g. 2100"
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-600 font-semibold mb-1">
                          Carpet Area (sq.ft)
                        </label>
                        <input
                          type="number"
                          value={carpetAreaSqft}
                          onChange={e => setCarpetAreaSqft(e.target.value ? Number(e.target.value) : '')}
                          placeholder="e.g. 1650"
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 font-bold"
                        />
                      </div>
                    </div>

                    {/* Quick Area Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Presets:</span>
                      {[1200, 1550, 1850, 2100, 2850, 3600, 4200].map(sq => (
                        <button
                          key={sq}
                          type="button"
                          onClick={() => {
                            setAreaSqft(sq);
                            setCarpetAreaSqft(Math.round(sq * 0.78));
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition ${
                            areaSqft === sq
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sq.toLocaleString('en-IN')} sq.ft
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floor and Furnishing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Furnishing Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Unfurnished', 'Semi-furnished', 'Fully-furnished'] as FurnishingStatus[]).map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFurnishing(f)}
                            className={`py-2 text-[11px] font-bold rounded-xl border transition ${
                              furnishing === f
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {f.replace('-furnished', '')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Possession Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Ready to Move', 'Under Construction', 'New Launch'] as PossessionStatus[]).map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPossessionStatus(p)}
                            className={`py-2 text-[11px] font-bold rounded-xl border transition ${
                              possessionStatus === p
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {p === 'Ready to Move' ? 'Ready' : p === 'Under Construction' ? 'Under Const.' : 'Launch'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>


                  {/* TGRERA Registration Section */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Telangana RERA (TGRERA) Registration</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-emerald-900 mb-1">
                          TGRERA Number (e.g. P02400005841)
                        </label>
                        <input
                          type="text"
                          value={reraId}
                          onChange={e => {
                            setReraId(e.target.value);
                            setIsReraVerified(Boolean(e.target.value.trim()));
                          }}
                          placeholder="P0240000XXXX"
                          className="w-full p-2 text-xs rounded-xl border border-emerald-300 bg-white font-mono"
                        />
                      </div>
                      <div className="flex items-center text-xs text-emerald-800 pt-5">
                        <span>Listings with valid TGRERA IDs receive higher search visibility.</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Amenities & Facilities
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AMENITIES_LIST.map(amenity => (
                        <label
                          key={amenity}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs border cursor-pointer transition ${
                            selectedAmenities.includes(amenity)
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded text-rose-600 focus:ring-rose-500"
                          />
                          <span className="truncate">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Photos Upload & Contact Preferences */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Photos Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Property Photos ({uploadedImages.length} attached) *
                    </label>

                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 group bg-slate-100 ${
                            img.isPrimary ? 'border-rose-600 ring-2 ring-rose-200' : 'border-slate-200'
                          }`}
                        >
                          <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                          {img.isPrimary && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!img.isPrimary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(idx)}
                                className="p-1 bg-white rounded text-[10px] font-bold text-slate-900"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-1.5 bg-red-600 rounded text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Controls */}
                    <div className="p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-3">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <label className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer inline-block shadow-sm">
                          Select Photos from Computer
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2 max-w-md mx-auto pt-2">
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={e => setImageUrlInput(e.target.value)}
                          placeholder="Or paste an image URL..."
                          className="flex-1 p-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Owner Contact Information & Privacy Preferences */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Contact Details & Privacy Preferences</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={e => setContactName(e.target.value)}
                          placeholder="Srinivas Varma (Owner)"
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          placeholder="+91 98490 00000"
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                        <input
                          type="tel"
                          value={contactWhatsapp}
                          onChange={e => setContactWhatsapp(e.target.value)}
                          placeholder="919849000000"
                          className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Permissions Switches */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowPhone}
                          onChange={e => setAllowPhone(e.target.checked)}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>Allow interested buyers to view phone number and call directly</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allowWhatsapp}
                          onChange={e => setAllowWhatsapp(e.target.checked)}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span>Allow WhatsApp enquiry button on property page</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigators */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>Next: {step === 1 ? 'Location & Specs' : 'Photos & Contact'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-xl text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{submitting ? 'Publishing Property...' : 'Publish Property Listing'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
