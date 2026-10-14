import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Legal & Security</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Privacy Policy & Owner Protection
              </h1>
            </div>
          </div>

          <div className="text-xs text-slate-500 pb-4 border-b border-slate-100">
            Last Updated: October 2026 | Compliant with Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDPA), India.
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                1. Owner Contact Privacy Guarantee
              </h2>
              <p>
                At Hyderabad Heights, we consider homeowner privacy of supreme importance. Unlike conventional property portals that indiscriminately broadcast owner mobile numbers to telemarketers, Hyderabad Heights honors the strict privacy toggles configured by each listing author:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>If an owner chooses <strong>"Keep phone private"</strong>, their phone number is never exposed in the source code or DOM. Interested buyers must communicate via the authenticated Hyderabad Heights enquiry messaging gateway.</li>
                <li>If an owner enables <strong>WhatsApp enquiries</strong>, their number is only triggered upon explicit user click to initiate a WhatsApp interaction.</li>
                <li>We do not sell, rent, or trade homeowner phone numbers to third-party mortgage or insurance brokers.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                2. Information We Collect
              </h2>
              <p>
                When you use Hyderabad Heights, we collect information necessary to provide real estate services:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Account Information:</strong> Name, email address, contact phone, and account role (Owner, Agent, Home Buyer).</li>
                <li><strong>Property Information:</strong> Property specifications, location, photographs, and applicable Telangana RERA (TGRERA) registration numbers.</li>
                <li><strong>Enquiry Data:</strong> Messages and contact information voluntarily submitted by prospective buyers.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                3. Database Security & Access Control
              </h2>
              <p>
                All records stored in Supabase PostgreSQL are guarded by Row Level Security (RLS) policies. Only approved and active listings are visible to public visitors. Administrative moderation controls require verified admin authentication roles.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                4. Contacting Our Grievance Officer
              </h2>
              <p>
                If you have inquiries regarding your personal data or wish to delete your property listing and account history, please contact our Hyderabad Grievance Office at <strong className="text-slate-900">privacy@hyderabadheights.in</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
