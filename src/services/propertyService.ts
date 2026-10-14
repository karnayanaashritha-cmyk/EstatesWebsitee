import { Property, PropertyFilterParams, PropertyImage, ListingStatus } from '../types';
import { SAMPLE_PROPERTIES } from '../data/sampleProperties';
import { getSupabaseClient } from './supabase';

const LOCAL_STORAGE_PROPERTIES_KEY = 'manaproperty_properties_store';

export class PropertyService {
  private static getStoredProperties(): Property[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // Initialize with sample properties
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(SAMPLE_PROPERTIES));
    return SAMPLE_PROPERTIES;
  }

  private static saveProperties(properties: Property[]): void {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
  }

  /**
   * Public search: ONLY approved properties are returned to the public
   */
  static async getPublicProperties(filters: PropertyFilterParams = {}): Promise<Property[]> {
    const client = getSupabaseClient();
    
    if (client) {
      try {
        let query = client
          .from('properties')
          .select('*, property_images(*)')
          .eq('status', 'approved');

        if (filters.locality && filters.locality !== 'all') {
          query = query.ilike('locality', `%${filters.locality}%`);
        }

        if (filters.propertyType && filters.propertyType !== 'all') {
          query = query.eq('property_type', filters.propertyType);
        }

        if (filters.listingType && filters.listingType !== 'all') {
          query = query.eq('listing_type', filters.listingType);
        }

        if (filters.minPrice !== undefined && filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }

        if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
          query = query.lte('price', filters.maxPrice);
        }

        if (filters.bedrooms && filters.bedrooms !== 'all') {
          query = query.eq('bedrooms', filters.bedrooms);
        }

        if (filters.furnishing && filters.furnishing !== 'all') {
          query = query.eq('furnishing', filters.furnishing);
        }

        if (filters.minArea !== undefined && filters.minArea > 0) {
          query = query.gte('area_sqft', filters.minArea);
        }

        if (filters.maxArea !== undefined && filters.maxArea > 0) {
          query = query.lte('area_sqft', filters.maxArea);
        }

        if (filters.reraOnly) {
          query = query.not('rera_id', 'is', null);
        }

        if (filters.verifiedOnly) {
          query = query.eq('is_verified', true);
        }

        // Sorting
        if (filters.sortBy === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (filters.sortBy === 'price_desc') {
          query = query.order('price', { ascending: false });
        } else if (filters.sortBy === 'area_desc') {
          query = query.order('area_sqft', { ascending: false });
        } else if (filters.sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data) {
          const properties = data.map((item: any) => ({
            ...item,
            images: item.property_images || []
          }));
          if (!filters.searchQuery?.trim()) return properties;

          const queryText = filters.searchQuery.trim().toLowerCase();
          return properties.filter(property =>
            [property.title, property.locality, property.landmark, property.description]
              .filter(Boolean)
              .some(value => String(value).toLowerCase().includes(queryText))
          );
        }
      } catch (err) {
        console.warn('Supabase query error, falling back to local database store:', err);
      }
    }

    // Local / Fallback Store (Ensures public queries return only approved and active properties)
    let properties = this.getStoredProperties().filter(p => p.status === 'approved');

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      properties = properties.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        (p.landmark && p.landmark.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filters.locality && filters.locality !== 'all') {
      properties = properties.filter(p => p.locality.toLowerCase() === filters.locality?.toLowerCase());
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      properties = properties.filter(p => p.property_type === filters.propertyType);
    }

    if (filters.listingType && filters.listingType !== 'all') {
      properties = properties.filter(p => p.listing_type === filters.listingType);
    }

    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      properties = properties.filter(p => p.price >= (filters.minPrice || 0));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      properties = properties.filter(p => p.price <= (filters.maxPrice || 0));
    }

    if (filters.minArea !== undefined && filters.minArea > 0) {
      properties = properties.filter(p => p.area_sqft >= (filters.minArea || 0));
    }

    if (filters.maxArea !== undefined && filters.maxArea > 0) {
      properties = properties.filter(p => p.area_sqft <= (filters.maxArea || 0));
    }


    if (filters.bedrooms && filters.bedrooms !== 'all') {
      const b = Number(filters.bedrooms);
      if (b >= 5) {
        properties = properties.filter(p => p.bedrooms >= 5);
      } else {
        properties = properties.filter(p => p.bedrooms === b);
      }
    }

    if (filters.furnishing && filters.furnishing !== 'all') {
      properties = properties.filter(p => p.furnishing === filters.furnishing);
    }

    if (filters.reraOnly) {
      properties = properties.filter(p => Boolean(p.rera_id));
    }

    if (filters.verifiedOnly) {
      properties = properties.filter(p => p.is_verified);
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      properties.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      properties.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'area_desc') {
      properties.sort((a, b) => b.area_sqft - a.area_sqft);
    } else if (filters.sortBy === 'newest') {
      properties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return properties;
  }

  /**
   * Get single property by ID or SEO-slug
   */
  static async getPropertyBySlugOrId(identifier: string): Promise<Property | null> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('properties')
          .select('*, property_images(*)')
          .or(`slug.eq.${identifier},id.eq.${identifier}`)
          .single();

        if (!error && data) {
          return {
            ...data,
            images: data.property_images || []
          };
        }
      } catch (err) {
        console.warn('Supabase fetch single property failed:', err);
      }
    }

    const properties = this.getStoredProperties();
    const found = properties.find(p => p.slug === identifier || p.id === identifier);
    if (found) {
      // Increment views count
      found.views_count = (found.views_count || 0) + 1;
      this.saveProperties(properties);
      return found;
    }
    return null;
  }

  /**
   * Get properties submitted by a specific owner / agent
   */
  static async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('properties')
          .select('*, property_images(*)')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            images: item.property_images || []
          }));
        }
      } catch (err) {
        console.warn('Supabase owner properties fetch error:', err);
      }
    }

    return this.getStoredProperties().filter(p => p.owner_id === ownerId);
  }

  /**
   * Admin view: get all properties including pending review, rejected, active
   */
  static async getAllPropertiesForAdmin(): Promise<Property[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('properties')
          .select('*, property_images(*)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            images: item.property_images || []
          }));
        }
      } catch (err) {
        console.warn('Supabase admin properties query error:', err);
      }
    }

    return this.getStoredProperties();
  }

  /**
   * Upload an image file to Supabase Storage bucket 'property-images'.
   * Falls back gracefully to optimized Data URL if Supabase is offline or unconfigured.
   */
  static async uploadPropertyImage(file: File): Promise<{ url: string; storageType: 'supabase' | 'local'; error?: string }> {
    if (!file.type.startsWith('image/')) {
      return { url: '', storageType: 'local', error: 'Selected file is not an image.' };
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await client.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          const { data: publicUrlData } = client.storage
            .from('property-images')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            return { url: publicUrlData.publicUrl, storageType: 'supabase' };
          }
        } else {
          console.warn('Supabase storage upload returned error, falling back to local base64:', uploadError.message);
        }
      } catch (err: unknown) {
        console.warn('Supabase storage upload exception, falling back to local base64:', err);
      }
    }

    // High quality optimized Data URL fallback
    try {
      const dataUrl = await this.fileToOptimizedDataUrl(file);
      return { url: dataUrl, storageType: 'local' };
    } catch {
      return { url: '', storageType: 'local', error: 'Failed to process image file.' };
    }
  }

  /**
   * Helper to convert file to compressed image Data URL
   */
  private static fileToOptimizedDataUrl(file: File, maxDimension = 1400): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Sanitize property object for Supabase properties table columns
   */
  private static sanitizeForDb(prop: Partial<Property>): Record<string, any> {
    const validColumns = [
      'id', 'title', 'slug', 'description', 'property_type', 'listing_type',
      'price', 'maintenance', 'locality', 'city', 'state', 'pincode',
      'address', 'landmark', 'bedrooms', 'bathrooms', 'balconies',
      'area_sqft', 'carpet_area_sqft', 'facing', 'furnishing', 'floor_no',
      'total_floors', 'possession_status', 'age_of_property', 'amenities',
      'rera_id', 'is_rera_verified', 'is_verified', 'verification_notes',
      'status', 'rejection_reason', 'owner_id', 'contact_name',
      'contact_phone', 'contact_whatsapp', 'allow_phone', 'allow_whatsapp',
      'is_sample_data', 'views_count', 'created_at', 'updated_at'
    ];

    const result: Record<string, any> = {};
    for (const key of validColumns) {
      if ((prop as any)[key] !== undefined) {
        result[key] = (prop as any)[key];
      }
    }

    // Merge source_info and unverified_disclaimer into verification_notes if provided
    if (prop.source_info || prop.unverified_disclaimer) {
      const parts = [
        result.verification_notes,
        prop.source_info ? `[Source: ${prop.source_info}]` : '',
        prop.unverified_disclaimer ? `[Disclaimer: ${prop.unverified_disclaimer}]` : ''
      ].filter(Boolean);
      result.verification_notes = parts.join(' - ');
    }

    return result;
  }

  /**
   * Submit / create a new property
   */
  static async createProperty(
    propertyData: Omit<Property, 'id' | 'slug' | 'created_at' | 'updated_at' | 'views_count'>
  ): Promise<Property> {
    const cleanTitle = propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'prop-' + Date.now();
    const uniqueSuffix = id.substring(0, 8);
    const slug = `${cleanTitle}-${uniqueSuffix}`;

    const newProperty: Property = {
      ...propertyData,
      id,
      slug,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        const dbData = this.sanitizeForDb(newProperty);
        const { data, error } = await client
          .from('properties')
          .insert([dbData])
          .select()
          .single();

        if (!error && data) {
          if (newProperty.images && newProperty.images.length > 0) {
            const imagePayload = newProperty.images.map(img => ({
              property_id: data.id,
              image_url: img.image_url,
              is_primary: img.is_primary,
              display_order: img.display_order
            }));
            await client.from('property_images').insert(imagePayload);
          }
        }
      } catch (err) {
        console.warn('Supabase insert failed, stored in local database store:', err);
      }
    }

    // Always update local database store
    const all = this.getStoredProperties();
    all.unshift(newProperty);
    this.saveProperties(all);

    return newProperty;
  }

  /**
   * Update an existing property's details, specs, and photos
   */
  static async updateProperty(
    id: string,
    propertyData: Partial<Property>
  ): Promise<Property | null> {
    const client = getSupabaseClient();
    const updatedTimestamp = new Date().toISOString();

    if (client) {
      try {
        const dbUpdates = this.sanitizeForDb({
          ...propertyData,
          updated_at: updatedTimestamp
        });
        delete dbUpdates.id; // Do not update primary key

        const { error } = await client
          .from('properties')
          .update(dbUpdates)
          .eq('id', id);

        if (!error && propertyData.images) {
          // Replace property images in Supabase
          await client.from('property_images').delete().eq('property_id', id);
          if (propertyData.images.length > 0) {
            const imagePayload = propertyData.images.map((img, idx) => ({
              property_id: id,
              image_url: img.image_url,
              is_primary: img.is_primary ?? (idx === 0),
              display_order: img.display_order ?? (idx + 1)
            }));
            await client.from('property_images').insert(imagePayload);
          }
        }
      } catch (err) {
        console.warn('Supabase update failed, updating local database store:', err);
      }
    }

    const all = this.getStoredProperties();
    const index = all.findIndex(p => p.id === id || p.slug === id);
    if (index !== -1) {
      const existing = all[index];
      const merged: Property = {
        ...existing,
        ...propertyData,
        id: existing.id,
        slug: propertyData.slug || existing.slug,
        images: propertyData.images || existing.images,
        updated_at: updatedTimestamp
      };
      all[index] = merged;
      this.saveProperties(all);
      return merged;
    }

    return null;
  }

  /**
   * Admin Moderation: Approve, Reject, or Toggle Verification
   */
  static async updatePropertyStatus(
    id: string,
    status: ListingStatus,
    rejectionReason?: string,
    isVerified?: boolean
  ): Promise<Property | null> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const updates: any = { status, updated_at: new Date().toISOString() };
        if (rejectionReason !== undefined) updates.rejection_reason = rejectionReason;
        if (isVerified !== undefined) updates.is_verified = isVerified;

        await client.from('properties').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase status update failed:', err);
      }
    }

    const all = this.getStoredProperties();
    const index = all.findIndex(p => p.id === id);
    if (index !== -1) {
      all[index].status = status;
      if (rejectionReason !== undefined) all[index].rejection_reason = rejectionReason;
      if (isVerified !== undefined) all[index].is_verified = isVerified;
      all[index].updated_at = new Date().toISOString();
      this.saveProperties(all);
      return all[index];
    }
    return null;
  }

  /**
   * Delete Property
   */
  static async deleteProperty(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('properties').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const all = this.getStoredProperties().filter(p => p.id !== id);
    this.saveProperties(all);
    return true;
  }

  /**
   * Reset to sample data
   */
  static resetToSampleData(): void {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(SAMPLE_PROPERTIES));
  }
}
