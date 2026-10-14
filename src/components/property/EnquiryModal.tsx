import React, { useState } from 'react';
import { Property } from '../../types';
import { EnquiryService } from '../../services/enquiryService';
import { AuthService } from '../../services/authService';
import { formatIndianPrice } from '../../utils/formatters';
import { 
  X, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface EnquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  if (!isOpen || !property) return null;

  const currentUser = AuthService.getCurrentUser();

  const [senderName, setSenderName] = useState(currentUser?.full_name || '');
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [preferredTime, setPreferredTime] = useState('This Weekend (Saturday/Sunday)');
  const [message, setMessage] = useState(
    `Hi, I am interested in ${property.title} in ${property.locality}. Please share more details and let me know when we can schedule a site visit.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!senderName || !senderEmail || !senderPhone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await EnquiryService.submitEnquiry({
        property_id: property.id,
        property_title: property.title,
        property_locality: property.locality,
        user_id: currentUser?.id,
        sender_name: senderName,
        sender_email: senderEmail,
        sender_phone: senderPhone,
        message,
        preferred_time: preferredTime
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryImage = property.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Property Enquiry</h2>
            <p className="text-xs text-slate-400">Directly contact owner / authorized representative</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Brief Summary Card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">
              {property.title}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span>{property.locality}, Hyderabad</span>
            </div>
            <div className="text-sm font-extrabold text-rose-600 mt-1">
              {formatIndianPrice(property.price, property.listing_type === 'rent')}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Enquiry Sent Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your interest has been logged and sent to <strong>{property.contact_name}</strong>. The owner/agent has been notified via the Hyderabad Heights portal.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                <span>Enquiry Reference: <strong>ENQ-{Math.floor(100000 + Math.random() * 900000)}</strong></span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
              >
                Close & Continue Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="e.g. Vikram Chandra"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={e => setSenderPhone(e.target.value)}
                      placeholder="+91 98490 00000"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={e => setSenderEmail(e.target.value)}
                      placeholder="vikram@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Visit Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time for Visit / Call</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="This Weekend (Saturday/Sunday)">This Weekend (Saturday/Sunday)</option>
                    <option value="Weekday Morning (9 AM - 12 PM)">Weekday Morning (9 AM - 12 PM)</option>
                    <option value="Weekday Evening (5 PM - 8 PM)">Weekday Evening (5 PM - 8 PM)</option>
                    <option value="Immediate Call Back">Immediate Call Back</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Message</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              {/* Privacy Reassurance */}
              <div className="p-3 bg-rose-50/70 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 border border-rose-100">
                <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Protected:</strong> Your details are only shared with the authorized owner/agent for this specific property enquiry. We do not spam.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Enquiry...' : 'Submit Property Enquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
