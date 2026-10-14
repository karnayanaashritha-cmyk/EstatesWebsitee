-- ============================================================================
-- Hyderabad Heights - Hyderabad Real Estate Portal: Initial Schema Migration
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('user', 'agent', 'admin')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'villa', 'house', 'plot', 'commercial')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('buy', 'rent', 'lease')),
  price NUMERIC NOT NULL,
  maintenance NUMERIC DEFAULT 0,
  locality TEXT NOT NULL,
  city TEXT DEFAULT 'Hyderabad' NOT NULL,
  state TEXT DEFAULT 'Telangana' NOT NULL,
  pincode TEXT,
  address TEXT NOT NULL,
  landmark TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  balconies INTEGER DEFAULT 0,
  area_sqft NUMERIC NOT NULL,
  carpet_area_sqft NUMERIC,
  facing TEXT CHECK (facing IN ('East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West')),
  furnishing TEXT CHECK (furnishing IN ('Unfurnished', 'Semi-furnished', 'Fully-furnished')) DEFAULT 'Semi-furnished',
  floor_no INTEGER,
  total_floors INTEGER,
  possession_status TEXT CHECK (possession_status IN ('Ready to Move', 'Under Construction', 'New Launch')) DEFAULT 'Ready to Move',
  age_of_property TEXT,
  amenities TEXT[] DEFAULT '{}',
  rera_id TEXT,
  is_rera_verified BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')) DEFAULT 'pending',
  rejection_reason TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  allow_phone BOOLEAN DEFAULT TRUE,
  allow_whatsapp BOOLEAN DEFAULT TRUE,
  is_sample_data BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create index for high performance Hyderabad locality search
CREATE INDEX IF NOT EXISTS idx_properties_locality ON public.properties(locality);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

-- 4. Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);

-- 5. Enquiries / Leads Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_time TEXT,
  status TEXT CHECK (status IN ('new', 'read', 'contacted', 'closed')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enquiries_property_id ON public.enquiries(property_id);

-- 6. Property Reports / Moderation Table
CREATE TABLE IF NOT EXISTS public.property_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  reporter_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_reports ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Properties Policies
-- Public can view only approved and active properties
CREATE POLICY "Public can view approved active properties" 
  ON public.properties FOR SELECT 
  USING (
    status = 'approved' 
    OR auth.uid() = owner_id 
    OR public.is_admin()
  );

-- Authenticated users can insert properties (defaults to pending review)
CREATE POLICY "Authenticated users can submit properties" 
  ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Owners can update their own properties, admins can update any
CREATE POLICY "Owners and admins can update properties" 
  ON public.properties FOR UPDATE 
  USING (auth.uid() = owner_id OR public.is_admin());

-- Owners and admins can delete properties
CREATE POLICY "Owners and admins can delete properties" 
  ON public.properties FOR DELETE 
  USING (auth.uid() = owner_id OR public.is_admin());

-- Property Images Policies
CREATE POLICY "Public can view property images" 
  ON public.property_images FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = property_images.property_id 
      AND (properties.status = 'approved' OR properties.owner_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Owners and admins can manage images" 
  ON public.property_images FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = property_images.property_id 
      AND (properties.owner_id = auth.uid() OR public.is_admin())
    )
  );

-- Enquiries Policies
-- Anyone can submit an enquiry
CREATE POLICY "Anyone can submit an enquiry" 
  ON public.enquiries FOR INSERT 
  WITH CHECK (true);

-- Property owner or admin can view enquiries
CREATE POLICY "Owners and admins can view property enquiries" 
  ON public.enquiries FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = enquiries.property_id 
      AND properties.owner_id = auth.uid()
    ) 
    OR public.is_admin()
  );

CREATE POLICY "Owners and admins can update enquiry status" 
  ON public.enquiries FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = enquiries.property_id 
      AND properties.owner_id = auth.uid()
    ) 
    OR public.is_admin()
  );

-- Storage bucket initialization for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket access policy
CREATE POLICY "Public can read property images storage" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
