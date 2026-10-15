import React, { useState, useEffect, useRef } from 'react';
import { 
  Property, 
  PropertyType, 
  ListingType, 
  FacingDirection, 
  FurnishingStatus, 
  PossessionStatus,
  HYDERABAD_LOCALITIES,
  PROPERTY_TYPES,
  AMENITIES_LIST,
  UserProfile
} from '../../types';
import { PropertyService } from '../../services/propertyService';
import { AuthService } from '../../services/authService';
import { formatIndianPrice } from '../../utils/formatters';
import { 
  X, 
  Upload, 
  Trash2, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Camera, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink, 
  Loader2,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AdminPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
  onSuccess?: (property: Property, isEdit: boolean) => void;
  onDelete?: (propertyId: string) => void;
  onNavigate?: (path: string, params?: any) => void;
}

export const AdminPropertyModal: React.FC<AdminPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
  onSuccess,
  onDelete,
  onNavigate
}) => {
  const isEdit = Boolean(propertyToEdit);
  const currentUser: UserProfile | null = AuthService.getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock background scroll & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [price, setPrice] = useState<number | ''>('');
  const [maintenance, setMaintenance] = useState<number | ''>('');
  const [locality, setLocality] = useState<string>('Kokapet');
  const [customLocality, setCustomLocality] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('500075');
  const [areaSqft, setAreaSqft] = useState<number | ''>(1850);
  const [carpetAreaSqft, setCarpetAreaSqft] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [facing, setFacing] = useState<FacingDirection>('East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-furnished');
  const [floorNo, setFloorNo] = useState<number | ''>(5);
  const [totalFloors, setTotalFloors] = useState<number | ''>(14);
  const [possessionStatus, setPossessionStatus] = useState<PossessionStatus>('Ready to Move');
  const [ageOfProperty, setAgeOfProperty] = useState('Brand New');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Security & CCTV',
    'Covered Car Parking',
    'Power Backup (100%)',
    'Clubhouse',
    'Manjeera Water Connection'
  ]);
  const [reraId, setReraId] = useState('');

  // Photos
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    storageType?: 'supabase' | 'local';
  }>>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Contact & Submitter Transparency (Explicitly identified, non-verified disclosure)
  const [contactName, setContactName] = useState(currentUser?.full_name || 'Website Administrator');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 90000 12345');
  const [contactWhatsapp, setContactWhatsapp] = useState('919000012345');
  const [allowPhone, setAllowPhone] = useState(true);
  const [allowWhatsapp, setAllowWhatsapp] = useState(true);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; property: Property } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load existing property data if editing
  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title || '');
      setListingType(propertyToEdit.listing_type || 'buy');
      setPropertyType(propertyToEdit.property_type || 'apartment');
      setPrice(propertyToEdit.price || '');
      setMaintenance(propertyToEdit.maintenance || '');
      
      if (HYDERABAD_LOCALITIES.includes(propertyToEdit.locality as any)) {
        setLocality(propertyToEdit.locality);
        setCustomLocality('');
      } else {
        setLocality('other');
        setCustomLocality(propertyToEdit.locality || '');
      }

      setAddress(propertyToEdit.address || '');
      setLandmark(propertyToEdit.landmark || '');
      setPincode(propertyToEdit.pincode || '500075');
      setAreaSqft(propertyToEdit.area_sqft || '');
      setCarpetAreaSqft(propertyToEdit.carpet_area_sqft || '');
      setBedrooms(propertyToEdit.bedrooms ?? 3);
      setBathrooms(propertyToEdit.bathrooms ?? 2);
      setBalconies(propertyToEdit.balconies ?? 1);
      setFacing(propertyToEdit.facing || 'East');
      setFurnishing(propertyToEdit.furnishing || 'Semi-furnished');
      setFloorNo(propertyToEdit.floor_no ?? '');
      setTotalFloors(propertyToEdit.total_floors ?? '');
      setPossessionStatus(propertyToEdit.possession_status || 'Ready to Move');
      setAgeOfProperty(propertyToEdit.age_of_property || 'Brand New');
      setDescription(propertyToEdit.description || '');
      setSelectedAmenities(propertyToEdit.amenities || []);
      setReraId(propertyToEdit.rera_id || '');
      setContactName(propertyToEdit.contact_name || currentUser?.full_name || 'Website Administrator');
      setContactPhone(propertyToEdit.contact_phone || '+91 90000 12345');
      setContactWhatsapp(propertyToEdit.contact_whatsapp || '919000012345');
      setAllowPhone(propertyToEdit.allow_phone ?? true);
      setAllowWhatsapp(propertyToEdit.allow_whatsapp ?? true);

      if (propertyToEdit.images && propertyToEdit.images.length > 0) {
        setUploadedImages(
          propertyToEdit.images.map((img, idx) => ({
            id: img.id || `img-${idx}`,
            url: img.image_url,
            isPrimary: img.is_primary || idx === 0
          }))
        );
      } else {
        setUploadedImages([]);
      }
    } else {
      // Defaults for brand new nearby listing
      setTitle('');
      setListingType('buy'); // For Sale as requested
      setPropertyType('apartment');
      setPrice('');
      setMaintenance('');
      setLocality('Kokapet');
      setCustomLocality('');
      setAddress('');
      setLandmark('');
      setPincode('500075');
      setAreaSqft(1850);
      setCarpetAreaSqft('');
      setBedrooms(3);
      setBathrooms(3);
      setBalconies(2);
      setFacing('East');
      setFurnishing('Semi-furnished');
      setFloorNo(5);
      setTotalFloors(14);
      setPossessionStatus('Ready to Move');
      setAgeOfProperty('Brand New');
      setDescription('');
      setSelectedAmenities([
        '24/7 Security & CCTV',
        'Covered Car Parking',
        'Power Backup (100%)',
        'Clubhouse',
        'Manjeera Water Connection'
      ]);
      setReraId('');
      setUploadedImages([]);
      setContactName(currentUser?.full_name || 'Website Administrator');
      setContactPhone(currentUser?.phone || '+91 90000 12345');
      setContactWhatsapp('919000012345');
      setAllowPhone(true);
      setAllowWhatsapp(true);
    }
    setErrorMsg(null);
    setSuccessData(null);
    setShowDeleteConfirm(false);
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const effectiveLocality = locality === 'other' ? customLocality.trim() || 'Hyderabad' : locality;

  // Auto generate Title helper
  const handleGenerateTitle = () => {
    const bhkText = bedrooms > 0 ? `${bedrooms} BHK ` : '';
    const typeLabel = PROPERTY_TYPES.find(p => p.id === propertyType)?.label.replace('Properties', '').trim() || propertyType;
    const generated = `${bhkText}${typeLabel} for Sale in ${effectiveLocality}, Hyderabad`;
    setTitle(generated);
  };

  // Auto generate Description helper
  const handleGenerateDescription = () => {
    const bhkText = bedrooms > 0 ? `${bedrooms} BHK ` : '';
    const desc = `Attractive ${bhkText}${propertyType} for sale located in the prime neighborhood of ${effectiveLocality}, Hyderabad.\n\nFeaturing ${areaSqft || 'spacious'} sq.ft built-up area, ${facing} facing layout, ${furnishing} condition, and ready for ${possessionStatus.toLowerCase()}. The property enjoys excellent connectivity to the IT corridor, ORR, and reputable schools.\n\nInformation and photos gathered directly by website owner for nearby buyers. Direct inquiries welcome.`;
    setDescription(desc);
  };

  // Amenities toggle
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Upload image files
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    setErrorMsg(null);

    const fileList = Array.from(files);
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select valid image files (.jpg, .png, .webp)');
        continue;
      }
      try {
        const result = await PropertyService.uploadPropertyImage(file);
        if (result.url) {
          setUploadedImages(prev => {
            const isFirst = prev.length === 0;
            return [
              ...prev,
              {
                id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                url: result.url,
                isPrimary: isFirst,
                storageType: result.storageType
              }
            ];
          });
        } else if (result.error) {
          setErrorMsg(result.error);
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Failed to upload photo.');
      }
    }

    setIsUploadingPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Photo URL directly
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setUploadedImages(prev => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        url: imageUrlInput.trim(),
        isPrimary: prev.length === 0
      }
    ]);
    setImageUrlInput('');
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setUploadedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  // Set primary photo
  const handleSetPrimary = (index: number) => {
    setUploadedImages(prev =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  // Validation
  const validateForm = (): boolean => {
    setErrorMsg(null);
    if (!title.trim()) {
      setErrorMsg('Please provide a property title.');
      return false;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Please enter a valid price for the property for sale.');
      return false;
    }
    if (!areaSqft || Number(areaSqft) <= 0) {
      setErrorMsg('Please specify the built-up area in square feet.');
      return false;
    }
    if (!effectiveLocality) {
      setErrorMsg('Please select or specify the Hyderabad locality.');
      return false;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter the street / community address of the property.');
      return false;
    }
    if (uploadedImages.length < 2) {
      setErrorMsg('Please upload at least 2 real photos of the property (2-3 real photos recommended).');
      return false;
    }
    return true;
  };

  // Handle Save (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const sanitizedPrice = Number(price);
      const sanitizedArea = Number(areaSqft);
      const activeAdminName = currentUser?.full_name || 'Website Administrator';
      
      const payload = {
        title: title.trim(),
        description: description.trim() || `${bedrooms} BHK ${propertyType} for sale in ${effectiveLocality}, Hyderabad. Built-up area: ${sanitizedArea} sq.ft, ${facing} facing.`,
        property_type: propertyType,
        listing_type: listingType,
        price: sanitizedPrice,
        maintenance: maintenance ? Number(maintenance) : 0,
        locality: effectiveLocality,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: pincode.trim() || '500075',
        address: address.trim(),
        landmark: landmark.trim(),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        area_sqft: sanitizedArea,
        carpet_area_sqft: carpetAreaSqft ? Number(carpetAreaSqft) : undefined,
        facing,
        furnishing,
        floor_no: floorNo !== '' ? Number(floorNo) : undefined,
        total_floors: totalFloors !== '' ? Number(totalFloors) : undefined,
        possession_status: possessionStatus,
        age_of_property: ageOfProperty,
        amenities: selectedAmenities,
        rera_id: reraId.trim() || undefined,
        is_rera_verified: Boolean(reraId.trim()),
        // CRITICAL: Do NOT claim the property is independently verified
        is_verified: false,
        verification_notes: `Information and real photos supplied directly by ${activeAdminName} (Website Owner/Administrator) based on local neighborhood observation and seller disclosure. Not independently verified by third-party inspectors.`,
        source_type: 'site_owner' as const,
        source_info: `Direct listing by Website Owner/Administrator (${activeAdminName})`,
        photos_source: `Real site photos taken and uploaded by Website Administrator (${activeAdminName})`,
        unverified_disclaimer: 'This property has not been independently physically verified. Prospective buyers must independently inspect title deeds, municipality permits, and legal documentation before proceeding.',
        // Administrator additions are immediately approved and active on portal
        status: 'approved' as const,
        owner_id: currentUser?.id || 'user-admin-01',
        contact_name: contactName.trim() || activeAdminName,
        contact_phone: contactPhone.trim(),
        contact_whatsapp: contactWhatsapp.trim(),
        allow_phone: allowPhone,
        allow_whatsapp: allowWhatsapp,
        is_sample_data: false,
        images: uploadedImages.map((img, i) => ({
          id: img.id,
          property_id: propertyToEdit?.id || '',
          image_url: img.url,
          is_primary: img.isPrimary,
          display_order: i + 1
        }))
      };

      let saved: Property;
      if (isEdit && propertyToEdit) {
        const res = await PropertyService.updateProperty(propertyToEdit.id, payload);
        if (!res) throw new Error('Failed to update property in database.');
        saved = res;
        setSuccessData({
          message: 'Property listing updated successfully! Changes saved to database and image storage.',
          property: saved
        });
        onSuccess?.(saved, true);
      } else {
        saved = await PropertyService.createProperty(payload);
        setSuccessData({
          message: 'Nearby property listing created and published live on the website! Saved to database and image storage.',
          property: saved
        });
        onSuccess?.(saved, false);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while saving the property listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!propertyToEdit) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await PropertyService.deleteProperty(propertyToEdit.id);
      onDelete?.(propertyToEdit.id);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete listing.');
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Admin Property Manager"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[11px] font-extrabold tracking-wide uppercase border border-rose-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Website Owner • Property Manager</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {isEdit ? 'Edit Property Listing' : 'Add Nearby Property for Sale'}
            </h2>
            <p className="text-xs text-slate-400">
              Direct administrative workflow — listings save immediately to database and appear live on public portal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Modal State */}
        {successData ? (
          <div className="p-8 sm:p-12 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isEdit ? 'Listing Updated Successfully!' : 'Listing Published Live!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full max-w-md text-left text-xs space-y-1.5">
              <div className="font-bold text-slate-900 truncate">{successData.property.title}</div>
              <div className="text-slate-500 flex items-center justify-between">
                <span>{successData.property.locality}, Hyderabad</span>
                <span className="font-bold text-rose-600">
                  {formatIndianPrice(successData.property.price, false)}
                </span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: Live & Approved • {successData.property.images.length} Real Photos</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate?.(`/property/${successData.property.slug}`);
                }}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2"
              >
                <span>View on Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  if (!isEdit) {
                    // Reset to add another
                    setTitle('');
                    setPrice('');
                    setAddress('');
                    setUploadedImages([]);
                  }
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                {isEdit ? 'Continue Editing' : '+ Add Another Property'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
            {/* Top Error Message */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-xs animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Please check your inputs:</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            )}

            {/* SECTION 1: CORE PROPERTY BASICS */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    1. Property Basics & Category
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  For Sale (Property Listing)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Property Type <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value as PropertyType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Listing Mode
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setListingType('buy')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border transition text-xs ${
                        listingType === 'buy'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      For Sale (Buy)
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingType('rent')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border transition text-xs ${
                        listingType === 'rent'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      For Rent
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      Property Listing Title <span className="text-rose-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateTitle}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate Title</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. 3 BHK Luxury Gated Apartment for Sale in Kokapet"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PRICE & AREA */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <IndianRupee className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Price & Area Dimensions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Total Price (₹ In Rupees) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1000}
                      step={50000}
                      value={price}
                      onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 15000000 for 1.5 Cr"
                      className="w-full p-2.5 pl-8 rounded-xl border border-slate-300 bg-white font-extrabold text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                    />
                    <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                  </div>
                  {price && Number(price) > 0 && (
                    <div className="mt-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                      Formatted: {formatIndianPrice(Number(price), listingType === 'rent')}
                      {areaSqft && Number(areaSqft) > 0 ? ` (₹${Math.round(Number(price) / Number(areaSqft)).toLocaleString('en-IN')}/sq.ft)` : ''}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Built-up Area (Sq. Ft) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={areaSqft}
                    onChange={e => setAreaSqft(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1850"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Carpet Area (Sq. Ft) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={carpetAreaSqft}
                    onChange={e => setCarpetAreaSqft(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1450"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maintenance (₹ / month) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={e => setMaintenance(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 4500"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500"
                  />
                </div>

                {/* Quick Price Buttons */}
                <div className="sm:col-span-3 flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500">Quick Presets:</span>
                  {[
                    { label: '₹60 Lakhs', val: 6000000 },
                    { label: '₹85 Lakhs', val: 8500000 },
                    { label: '₹1.20 Cr', val: 12000000 },
                    { label: '₹1.65 Cr', val: 16500000 },
                    { label: '₹2.50 Cr', val: 25000000 },
                    { label: '₹3.80 Cr', val: 38000000 }
                  ].map(p => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setPrice(p.val)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-[11px] font-semibold text-slate-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: LOCATION DETAILS */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Hyderabad Locality & Nearby Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Locality in Hyderabad <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold focus:border-rose-500"
                  >
                    {HYDERABAD_LOCALITIES.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="other">+ Enter Other Locality</option>
                  </select>
                </div>

                {locality === 'other' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Specify Locality Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customLocality}
                      onChange={e => setCustomLocality(e.target.value)}
                      placeholder="e.g. Tellapur / Puppalguda"
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold focus:border-rose-500"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Landmark / Proximity
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder="e.g. Near ORR Exit 1 / Beside Neopolis"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="500075"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    Address / Community Details <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Tower 4, Flat 502, My Home Bhooja, Silpa Gram Craft Village, Hyderabad"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: PROPERTY SPECIFICATIONS */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <Layers className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  4. Bedrooms, Bathrooms & Specifications
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bedrooms (BHK)</label>
                  <select
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        {n === 0 ? 'Plot / None' : `${n} BHK`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>
                        {n} Bathrooms
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Balconies</label>
                  <select
                    value={balconies}
                    onChange={e => setBalconies(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {[0, 1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>
                        {n} Balconies
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facing Direction</label>
                  <select
                    value={facing}
                    onChange={e => setFacing(e.target.value as FacingDirection)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {(['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'] as const).map(d => (
                      <option key={d} value={d}>
                        {d} Facing
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={e => setFurnishing(e.target.value as FurnishingStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Fully-furnished">Fully-furnished</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Possession Status</label>
                  <select
                    value={possessionStatus}
                    onChange={e => setPossessionStatus(e.target.value as PossessionStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Floor No.</label>
                  <input
                    type="number"
                    value={floorNo}
                    onChange={e => setFloorNo(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Floors</label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={e => setTotalFloors(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 14"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Amenities Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-2 text-xs">
                  Key Amenities (Select all applicable)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map(amenity => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-600' : 'bg-slate-300'}`} />
                        <span>{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 text-xs">
                    Property Description & Neighborhood Highlights
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Draft Description</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail the layout, floor level, ventilation, proximity to schools, hospitals, or metro station..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white focus:border-rose-500 font-medium"
                />
              </div>

              {/* RERA ID (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Telangana RERA (TGRERA) ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={reraId}
                    onChange={e => setReraId(e.target.value)}
                    placeholder="e.g. P02400001234"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Age of Construction
                  </label>
                  <input
                    type="text"
                    value={ageOfProperty}
                    onChange={e => setAgeOfProperty(e.target.value)}
                    placeholder="e.g. Brand New / 2 Years"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: REAL PHOTOS UPLOAD (2-3+ REAL PHOTOS) */}
            <div className="bg-rose-50/40 p-5 rounded-2xl border-2 border-rose-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-rose-600" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                      5. Real Property Photos (2 or 3 Real Photos)
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Upload genuine photos of the property, building facade, or for-sale board.
                    </p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  uploadedImages.length >= 2 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {uploadedImages.length >= 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{uploadedImages.length} of 2-3 Photos Uploaded</span>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="space-y-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-2xl p-6 text-center bg-white cursor-pointer transition flex flex-col items-center justify-center space-y-2 group shadow-sm"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      {isUploadingPhoto ? 'Uploading to Property Image Storage...' : 'Click or Drag & Drop Real Photos Here'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WEBP (Saved directly to Supabase storage & local database)
                    </p>
                  </div>
                </div>

                {/* Paste URL Option */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="Or paste an image web URL here..."
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Uploaded Photos Grid */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-700">
                    Uploaded Photos ({uploadedImages.length}):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className={`relative rounded-xl overflow-hidden border-2 bg-slate-100 group shadow-sm flex flex-col ${
                          img.isPrimary ? 'border-rose-600 ring-2 ring-rose-200' : 'border-slate-200'
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={img.url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {img.isPrimary && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                              <Star className="w-3 h-3 fill-white" />
                              Primary Cover
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-white flex items-center justify-between text-[11px] border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className={`font-bold transition ${
                              img.isPrimary ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {img.isPrimary ? '★ Primary' : 'Set Primary'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 6: TRANSPARENT ATTRIBUTION & NON-VERIFIED DISCLAIMER (CRITICAL MANDATE) */}
            <div className="bg-amber-50/60 p-5 rounded-2xl border-2 border-amber-300 space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    Listing Attribution & Verification Transparency
                  </h4>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    To comply with real estate transparency standards, this listing will explicitly state who supplied the information and photos. It will <strong>NOT</strong> be marked as independently verified.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Information & Photos Provider
                  </span>
                  <div className="font-bold text-slate-900 text-xs">
                    {currentUser?.full_name || 'Website Administrator'} (Site Owner Discovery)
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Sourced from direct neighborhood observation / owner for-sale board.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Verification Standard
                  </span>
                  <div className="font-bold text-rose-700 text-xs flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Unverified Self-Reported Listing</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Buyers must verify GHMC/HMDA/TGRERA titles independently.
                  </p>
                </div>
              </div>

              {/* Contact Information to display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Display Contact Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-200 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Display Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-amber-200 bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {isEdit && propertyToEdit ? (
                <div>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-600">Delete listing permanently?</span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove / Delete Listing</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 font-medium">
                  ✓ Listing will be saved to database & instantly appear on Hyderabad Heights search
                </div>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database & Storage...</span>
                    </>
                  ) : (
                    <>
                      <span>{isEdit ? 'Update Listing Changes' : 'Save & Publish Listing Live'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
