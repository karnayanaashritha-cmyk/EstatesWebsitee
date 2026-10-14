import { Enquiry, PropertyReport } from '../types';
import { getSupabaseClient } from './supabase';
import { PropertyService } from './propertyService';

const LOCAL_ENQUIRIES_KEY = 'manaproperty_enquiries_store';
const LOCAL_REPORTS_KEY = 'manaproperty_reports_store';

const SAMPLE_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-001',
    property_id: 'prop-hyd-001',
    property_title: '3 BHK Ultra-Luxury High-Rise Apartment in Kokapet Golden Mile',
    property_locality: 'Kokapet',
    sender_name: 'Pooja Agarwal',
    sender_email: 'pooja.agarwal@gmail.com',
    sender_phone: '+91 98200 44556',
    message: 'Hello, I am interested in visiting this 3 BHK flat in Kokapet this Saturday morning around 11 AM. Is the developer maintenance fee negotiable?',
    preferred_time: 'Saturday Morning 11:00 AM',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'enq-002',
    property_id: 'prop-hyd-002',
    property_title: '4 BHK Independent Designer Villa with Private Lawn in Tellapur',
    property_locality: 'Tellapur',
    sender_name: 'Dr. Murali Mohan',
    sender_email: 'murali.ortho@apollo.com',
    sender_phone: '+91 97000 88990',
    message: 'Hi, I would like to inspect the villa and review the original GHMC and TGRERA sanction blueprints. Kindly connect on WhatsApp.',
    preferred_time: 'Any weekday post 6 PM',
    status: 'contacted',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export class EnquiryService {
  private static getStoredEnquiries(): Enquiry[] {
    try {
      const stored = localStorage.getItem(LOCAL_ENQUIRIES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(SAMPLE_ENQUIRIES));
    return SAMPLE_ENQUIRIES;
  }

  private static saveEnquiries(enquiries: Enquiry[]): void {
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(enquiries));
  }

  private static getStoredReports(): PropertyReport[] {
    try {
      const stored = localStorage.getItem(LOCAL_REPORTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [];
  }

  private static saveReports(reports: PropertyReport[]): void {
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
  }

  static async submitEnquiry(
    data: Omit<Enquiry, 'id' | 'status' | 'created_at'>
  ): Promise<Enquiry> {
    const id = 'enq-' + Math.floor(1000 + Math.random() * 9000);
    const newEnquiry: Enquiry = {
      ...data,
      id,
      status: 'new',
      created_at: new Date().toISOString()
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('enquiries').insert([
          {
            property_id: data.property_id,
            user_id: data.user_id || null,
            sender_name: data.sender_name,
            sender_email: data.sender_email,
            sender_phone: data.sender_phone,
            message: data.message,
            preferred_time: data.preferred_time || null,
            status: 'new'
          }
        ]);
      } catch (err) {
        console.warn('Supabase enquiry insert failed:', err);
      }
    }

    const all = this.getStoredEnquiries();
    all.unshift(newEnquiry);
    this.saveEnquiries(all);

    return newEnquiry;
  }

  static async getEnquiriesForOwner(ownerId: string): Promise<Enquiry[]> {
    const properties = await PropertyService.getPropertiesByOwner(ownerId);
    const propertyIds = new Set(properties.map(p => p.id));

    const client = getSupabaseClient();
    if (client && propertyIds.size > 0) {
      try {
        const { data, error } = await client
          .from('enquiries')
          .select('*')
          .in('property_id', Array.from(propertyIds))
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase get owner enquiries error:', err);
      }
    }

    const all = this.getStoredEnquiries();
    return all.filter(e => propertyIds.has(e.property_id));
  }

  static async getAllEnquiriesForAdmin(): Promise<Enquiry[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('enquiries')
          .select('*, properties(title, locality)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            property_title: item.properties?.title,
            property_locality: item.properties?.locality
          }));
        }
      } catch (err) {
        console.warn('Supabase admin enquiries error:', err);
      }
    }

    return this.getStoredEnquiries();
  }

  static async updateEnquiryStatus(
    enquiryId: string,
    status: 'new' | 'read' | 'contacted' | 'closed'
  ): Promise<boolean> {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('enquiries').update({ status }).eq('id', enquiryId);
      } catch (err) {
        console.warn('Supabase enquiry status update error:', err);
      }
    }

    const all = this.getStoredEnquiries();
    const target = all.find(e => e.id === enquiryId);
    if (target) {
      target.status = status;
      this.saveEnquiries(all);
      return true;
    }
    return false;
  }

  static async submitReport(
    propertyId: string,
    reporterEmail: string,
    reason: string,
    details?: string
  ): Promise<PropertyReport> {
    const id = 'rep-' + Math.floor(1000 + Math.random() * 9000);
    const newReport: PropertyReport = {
      id,
      property_id: propertyId,
      reporter_email: reporterEmail,
      reason,
      details,
      status: 'open',
      created_at: new Date().toISOString()
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('property_reports').insert([
          {
            property_id: propertyId,
            reporter_email: reporterEmail,
            reason,
            details,
            status: 'open'
          }
        ]);
      } catch (err) {
        console.warn('Supabase report insert error:', err);
      }
    }

    const all = this.getStoredReports();
    all.unshift(newReport);
    this.saveReports(all);

    return newReport;
  }

  static async getAllReportsForAdmin(): Promise<PropertyReport[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('property_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase reports error:', err);
      }
    }

    return this.getStoredReports();
  }
}
