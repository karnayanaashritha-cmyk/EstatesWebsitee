import React, { useState } from 'react';
import { Property } from '../../types';
import { EnquiryService } from '../../services/enquiryService';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  if (!isOpen || !property) return null;

  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Already Sold / Rented');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportReasons = [
    'Already Sold / Rented',
    'Incorrect Price or Maintenance information',
    'Misleading or Stock Photos',
    'Fake RERA Number or Non-compliant listing',
    'Fraudulent Owner / Impersonation',
    'Other Policy Violation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await EnquiryService.submitReport(property.id, email, reason, details);
      setIsSuccess(true);
    } catch {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Report Listing to Admin</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Report Received</h3>
              <p className="text-xs text-slate-600">
                Thank you for helping keep Hyderabad Heights authentic and secure. Our Hyderabad moderation team will investigate this listing immediately.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>
              )}

              <p className="text-xs text-slate-500">
                Reporting: <strong className="text-slate-800">{property.title}</strong>
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Report *</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                >
                  {reportReasons.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Explain why this listing is inaccurate..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report for Moderation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
