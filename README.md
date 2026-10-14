# Hyderabad Heights — Hyderabad Real Estate Portal

A complete, responsive, functional real estate property listing portal focused exclusively on **Hyderabad, Telangana, India**. 

Built with **React, TypeScript, Tailwind CSS, and Supabase**.

---

## 🌟 Key Features & Implementation Overview

### 1. Hyderabad Heights-Inspired Homepage
- **Compact, Rounded Hero Panel**: Styled with an original Hyderabad Heights brand lockup, Telangana architectural skyline monogram, short tagline ("Hyderabad's Premier Real Estate Portal"), clean crimson divider, prominent Hyderabad home-search headline, and Buy/Rent/Sell summary.
- **Three Large, Easy-to-Tap Buttons**:
  - **Buy Property** (Direct shortcut to residential sales)
  - **Rent Property** (Direct shortcut to verified Hyderabad rentals)
  - **List Property** (100% Free listing flow for homeowners and builders)
- **Fast Search Bar**: Search by keyword, locality dropdown, and property category with instant query dispatch.
- **Trending Hyderabad Localities**: Kokapet (Golden Mile), Gachibowli, Tellapur, Narsingi, Miyapur, Financial District, Manikonda, Kukatpally.
- **Hyderabad Corridors Spotlight**: In-depth price-per-sq.ft insights and listing counts.
- **Telugu Trust & Heritage**: Clear communication of value propositions, TGRERA compliance, and direct owner connections.

### 2. Comprehensive Search & Advanced Filters
- **Property Categories**: Apartments & flats, Luxury villas, Independent houses, Residential plots (HMDA approved), and Commercial spaces.
- **Listing Types**: Buy, Rent, Lease.
- **Filters**: Hyderabad locality, category, BHK (1 to 5+ BHK), budget in ₹ Lakhs & Crores, area in sq.ft, furnishing (Unfurnished, Semi-furnished, Fully-furnished), TGRERA-registered only, and Hyderabad Heights Verified only.
- **Sorting**: Newest first, price low to high, price high to low, area largest first.
- **Responsive Views**: Grid view and List view toggles with mobile filter drawer.

### 3. SEO-Friendly Property Details
- **Clean URLs**: Clean slugs (e.g. `/property/3-bhk-ultra-luxury-high-rise-apartment-kokapet-golden-mile-hyd-001`).
- **Interactive Photo Gallery**: Main high-definition viewport with thumbnail carousel.
- **Key Specifications**: Super built-up area, carpet area, facing direction (East, North, etc.), possession status, age, furnishing, and monthly maintenance.
- **Telangana RERA (TGRERA) Box**: Direct display of registration ID and quick reference link to the official authority portal (`rera.telangana.gov.in`).
- **Owner Contact Options & Privacy Protection**:
  - WhatsApp enquiry action with pre-populated property title and ID.
  - Click-to-call action (only exposed if owner permitted public phone display).
  - Direct inquiry form saving leads directly to the `enquiries` table.
  - Report listing modal for reporting inaccuracies to administrators.

### 4. Submit Property Flow (Owners & Agents)
- **Multi-Step Submission Wizard**:
  - Step 1: Listing purpose (Sell/Rent/Lease), category, title, pricing, and description.
  - Step 2: Hyderabad locality, full address, landmark, pin code, BHK, bathrooms, area, facing, and TGRERA details.
  - Step 3: Multi-image file uploads with cover photo selection, contact display name, phone, WhatsApp number, and permission toggles for contact privacy.
- Validated inputs with success celebration state and immediate database persistence.

### 5. Accounts & Role-Based Dashboards
- **Supabase Authentication**: Email sign-in and sign-up with role selection (Owner, Agent, Home Buyer).
- **1-Click Demo Persona Switcher**: Instant testing for:
  - `👑 Portal Admin` (Praveen Kumar - Full moderation rights)
  - `🏡 Direct Owner` (Suresh Varma - Kokapet listing owner)
  - `🤝 Hyd Agent` (Radhika Reddy - Tellapur villa agent)
  - `🔍 Home Buyer` (Kalyan Sharma - Active home seeker)
- **Owner/Agent Dashboard**:
  - Manage submitted listings, view approval status, toggle active state, and delete listings.
  - Leads management: Review buyer inquiries with direct WhatsApp reply and call actions.
- **Admin Moderation Portal**:
  - Secure role check (`profiles.role === 'admin'`).
  - Moderate pending properties: Approve, Reject with reason, or Toggle "Hyderabad Heights Verified" badge.
  - Manage community reports and portal inquiries.

### 6. Informational Pages
- **About Us**: Focus on Hyderabad's growth corridors, Telugu trust, and consumer safety.
- **Contact Us**: Hyderabad headquarters in HITEC City (Knowledge City), phone lines, email, operating hours, and interactive inquiry form.
- **Privacy Policy**: Explicit homeowner phone number protection and Indian DPDPA compliance.
- **Terms of Service**: Regulatory guidelines, TGRERA disclosures, and platform rules.

---

## 🗄️ Supabase Database Architecture & Security

All SQL migration scripts are located in:
- `supabase/migrations/01_initial_schema.sql`
- `supabase/seed.sql`

### Tables & Policies
- **`profiles`**: User details and role management (`user`, `agent`, `admin`).
- **`properties`**: Property records with `status` (`pending`, `approved`, `rejected`, `inactive`).
  - **RLS Policy**: Public visitors can ONLY query properties with `status = 'approved'`. Owners can view their own properties regardless of status. Admins have complete read/write access.
- **`property_images`**: Multi-image storage linked to properties.
- **`enquiries`**: Lead inquiries from interested buyers.
- **`property_reports`**: Community reports for administrator review.
- **Storage Bucket**: `property-images` with public read access and authenticated upload access.

### Dual-Engine Synchronization
1. **Live Supabase Mode**: Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (or via the in-app Supabase settings modal).
2. **Built-in Local Store**: If Supabase credentials are not yet configured, the application automatically operates against an emulated local storage engine with full CRUD functionality, role switching, enquiry logging, and admin moderation!

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# The portal will be available at: http://localhost:5173/
```

### Production Build
```bash
npm run build
npm run preview
```
"# Estates-Website" 
