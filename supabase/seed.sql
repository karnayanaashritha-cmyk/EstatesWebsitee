-- ============================================================================
-- Hyderabad Heights - Hyderabad Real Estate Portal: Seed Data
-- ============================================================================

-- Insert sample profiles
INSERT INTO public.profiles (id, full_name, phone, role)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin Hyderabad Heights', '+91 90000 00001', 'admin'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Suresh Varma', '+91 98490 12345', 'user'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Radhika Reddy', '+91 97012 98765', 'agent')
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties
INSERT INTO public.properties (
  id, title, slug, description, property_type, listing_type, price, maintenance,
  locality, address, landmark, bedrooms, bathrooms, balconies, area_sqft, carpet_area_sqft,
  facing, furnishing, floor_no, total_floors, possession_status, age_of_property,
  amenities, rera_id, is_rera_verified, is_verified, verification_notes,
  status, owner_id, contact_name, contact_phone, contact_whatsapp, allow_phone, allow_whatsapp,
  is_sample_data, views_count
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '3 BHK Ultra-Luxury High-Rise Apartment in Kokapet Golden Mile',
  '3-bhk-ultra-luxury-high-rise-apartment-kokapet-golden-mile-hyd-001',
  'Experience panoramic lake and skyline views from the 28th floor in Kokapet’s most coveted Golden Mile corridor. Built by an A-grade Hyderabad developer, this corner apartment features 11-foot clear ceilings, Italian marble flooring in the living area, private elevator access, and a 200 sq.ft sunrise deck.',
  'apartment',
  'buy',
  24500000,
  6500,
  'Kokapet',
  'Tower 3, Golden Mile Boulevard, Near Gandipet Lake Road, Kokapet',
  'Adjacent to Neopolis SEZ & 2 mins from ORR Exit 1',
  3,
  3,
  2,
  2850,
  2240,
  'East',
  'Semi-furnished',
  28,
  42,
  'Ready to Move',
  '1 Year',
  ARRAY['24/7 Security & CCTV', 'Clubhouse', 'Swimming Pool', 'Gymnasium', 'Power Backup (100%)', 'Manjeera Water Connection', 'EV Charging Station'],
  'P02400005841',
  true,
  true,
  'Site verification completed by Hyderabad Heights Field Team.',
  'approved',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Suresh Varma (Direct Owner)',
  '+91 98490 12345',
  '919849012345',
  true,
  true,
  true,
  482
),
(
  '22222222-2222-2222-2222-222222222222',
  '4 BHK Independent Designer Villa with Private Lawn in Tellapur',
  '4-bhk-independent-designer-villa-private-lawn-tellapur-hyd-002',
  'A masterpiece of contemporary architecture situated inside a serene 40-acre gated villa enclave in Tellapur. Boasts a private plunge pool, landscaped front lawn, personal home theater lounge, and double-height living foyer.',
  'villa',
  'buy',
  47500000,
  8000,
  'Tellapur',
  'Villa 42, Emerald Greens Enclave, Osman Nagar Road, Tellapur',
  'Near Manthan International School & 10 mins to Wipro Circle',
  4,
  5,
  3,
  4200,
  3600,
  'East',
  'Fully-furnished',
  1,
  3,
  'Ready to Move',
  'Less than 2 Years',
  ARRAY['24/7 Security & CCTV', 'Clubhouse', 'Swimming Pool', 'Gymnasium', 'Power Backup (100%)', 'Landscaped Gardens'],
  'P02400004910',
  true,
  true,
  'EC 30 years and Telangana RERA registry verified.',
  'approved',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'Radhika Reddy (Authorized Agent)',
  '+91 97012 98765',
  '919701298765',
  true,
  true,
  true,
  615
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample property images
INSERT INTO public.property_images (property_id, image_url, is_primary, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', true, 1),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', false, 2),
  ('22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80', true, 1)
ON CONFLICT (id) DO NOTHING;
