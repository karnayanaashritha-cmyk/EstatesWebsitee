import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Property Listing Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry = {
      id: `contact-${Date.now()}`,
      name,
      email,
      phone,
      subject,
      message,
      created_at: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('hyderabadheights_contact_inquiries') || '[]');
      localStorage.setItem('hyderabadheights_contact_inquiries', JSON.stringify([inquiry, ...existing]));
    } catch (error) {
      console.error('Could not save the contact inquiry locally:', error);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Support & Inquiries
          </span>
          <h1 className="text-2xl xs:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Hyderabad Heights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about listing a property, TGRERA verification, or advertising? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Office Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Hyderabad Headquarters
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Office Address:</strong>
                    <span>Level 4, Knowledge City, Inorbit Mall Road, HITEC City, Hyderabad, Telangana 500081</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Phone Support:</strong>
                    <span>+91 (040) 4892 0000 / +91 91210 55443</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Email Inquiries:</strong>
                    <span>hello@hyderabadheights.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Operating Hours:</strong>
                    <span>Monday – Saturday: 9:30 AM to 6:30 PM (IST)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 text-xs text-rose-900 space-y-1.5">
              <span className="font-bold block">Looking for Field Verification?</span>
              <p className="text-slate-600">
                Our local verification agents operate across Gachibowli, Kokapet, Tellapur, and Miyapur. Request a site check via the contact form.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 xs:p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Send us a Message
            </h2>

            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your message has been saved in this demo portal. The form is ready to connect to your support inbox when you deploy the site.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Anand Varma"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98490 00000"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 bg-white"
                    >
                      <option value="Property Listing Inquiry">Property Listing Inquiry</option>
                      <option value="TGRERA Verification Check">TGRERA Verification Check</option>
                      <option value="Agent Partnership">Agent Partnership</option>
                      <option value="Technical or Account Support">Technical or Account Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="How can we assist you with Hyderabad real estate?"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
