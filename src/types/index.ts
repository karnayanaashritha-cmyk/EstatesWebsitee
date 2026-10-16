export type PropertyType = 'apartment' | 'villa' | 'house' | 'plot' | 'commercial';
export type ListingType = 'buy' | 'rent' | 'lease';
export type FacingDirection = 'East' | 'West' | 'North' | 'South' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
export type FurnishingStatus = 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished';
export type PossessionStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'inactive';
export type UserRole = 'user' | 'agent' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number; // In INR (e.g. 15000000 = 1.5 Cr, or 35000 = 35k/mo)
  maintenance?: number;
  locality: string;
  city: string; // Hyderabad
  state: string; // Telangana
  pincode?: string;
  address: string;
  landmark?: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  area_sqft: number;
  carpet_area_sqft?: number;
  facing?: FacingDirection;
  furnishing: FurnishingStatus;
  floor_no?: number;
  total_floors?: number;
  possession_status: PossessionStatus;
  age_of_property?: string;
  amenities: string[];
  rera_id?: string;
  is_rera_verified: boolean;
  is_verified: boolean;
  verification_notes?: string;
  status: ListingStatus;
  rejection_reason?: string;
  owner_id?: string;
  contact_name: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  allow_phone: boolean;
  allow_whatsapp: boolean;
  is_sample_data: boolean;
  views_count: number;
  images: PropertyImage[];
  source_type?: 'site_owner' | 'direct_owner' | 'agent' | 'sample';
  source_info?: string;
  photos_source?: string;
  unverified_disclaimer?: string;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  property_id: string;
  property_title?: string;
  property_locality?: string;
  user_id?: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  message: string;
  preferred_time?: string;
  status: 'new' | 'read' | 'contacted' | 'closed';
  created_at: string;
}

export interface PropertyReport {
  id: string;
  property_id: string;
  reporter_email: string;
  reason: string;
  details?: string;
  status: 'open' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface PropertyFilterParams {
  searchQuery?: string;
  locality?: string;
  localities?: string[];
  propertyType?: string;
  propertyTypes?: string[];
  listingType?: ListingType | 'all';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'all';
  furnishing?: string;
  minArea?: number;
  maxArea?: number;
  reraOnly?: boolean;
  verifiedOnly?: boolean;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'area_desc' | 'newest';
}

// Major Hyderabad Localities
export const HYDERABAD_LOCALITIES = [
  'Gachibowli',
  'Kokapet',
  'Narsingi',
  'Financial District',
  'Miyapur',
  'Kukatpally',
  'Tellapur',
  'Manikonda',
  'HITEC City',
  'Madhapur',
  'Banjara Hills',
  'Jubilee Hills',
  'LB Nagar',
  'Uppal',
  'Kondapur',
  'Bachupally',
  'Chandanagar',
  'Kompally',
  'Shamshabad',
  'Attapur',
  'Nallagandla',
  'Begumpet'
] as const;

export const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartments & Flats', icon: 'Building2' },
  { id: 'villa', label: 'Luxury Villas', icon: 'Home' },
  { id: 'house', label: 'Independent Houses', icon: 'Castle' },
  { id: 'plot', label: 'Residential Plots', icon: 'Maximize2' },
  { id: 'commercial', label: 'Commercial Properties', icon: 'Briefcase' }
] as const;

export const AMENITIES_LIST = [
  '24/7 Security & CCTV',
  'Clubhouse',
  'Swimming Pool',
  'Gymnasium',
  'Children Play Area',
  'Power Backup (100%)',
  'Covered Car Parking',
  'Manjeera Water Connection',
  'Piped Gas (Bhagyanagar Gas)',
  'EV Charging Station',
  'Jogging / Walking Track',
  'Landscaped Gardens',
  'Multipurpose Hall',
  'Badminton / Tennis Court',
  'Intercom Facility',
  'Rainwater Harvesting',
  'High-speed Elevators',
  'Solar Water Heating'
] as const;
