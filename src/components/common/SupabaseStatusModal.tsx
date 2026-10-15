import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials } from '../../services/supabase';
import { PropertyService } from '../../services/propertyService';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  const [inputUrl, setInputUrl] = useState(url);
  const [inputKey, setInputKey] = useState(anonKey);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Lock background scroll & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(inputUrl, inputKey);
    setMessage('Credentials saved! Reloading application to connect...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClear = () => {
    clearSupabaseCredentials();
    setInputUrl('');
    setInputKey('');
    setMessage('Cleared custom credentials. Switched to offline seeded store.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleResetData = () => {
    PropertyService.resetToSampleData();
    setMessage('Sample Hyderabad properties reset successfully!');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleCopySQL = () => {
    const sql = `-- Hyderabad Heights Supabase Migration
-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('user', 'agent', 'admin')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

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
  facing TEXT,
  furnishing TEXT DEFAULT 'Semi-furnished',
  floor_no INTEGER,
  total_floors INTEGER,
  possession_status TEXT DEFAULT 'Ready to Move',
  amenities TEXT[] DEFAULT '{}',
  rera_id TEXT,
  is_rera_verified BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  allow_phone BOOLEAN DEFAULT TRUE,
  allow_whatsapp BOOLEAN DEFAULT TRUE,
  is_sample_data BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_time TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Supabase Status"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[calc(100vh-2rem)] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Supabase Database & Integration</h2>
              <p className="text-xs text-slate-400">Manage real-time cloud connection, schemas & policies</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {message && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Current Status Banner */}
          <div className={`p-4 rounded-xl border ${
            isConfigured 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start gap-3">
              {isConfigured ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                <div className="font-bold">
                  {isConfigured ? 'Connected to Live Supabase Cloud Project' : 'Running in Local Emulated Store (Zero Setup Needed)'}
                </div>
                <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                  {isConfigured 
                    ? `Live synchronization active with ${url}. Queries, auth sessions, and storage operate against your live database.`
                    : 'The app is fully functional with realistic Hyderabad property data, search filters, submission forms, enquiries, and an admin moderation workflow stored safely in browser storage.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick SQL Copy Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Supabase SQL Migration (Tables, RLS & Storage)
              </span>
              <button
                type="button"
                onClick={handleCopySQL}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied SQL!' : 'Copy SQL Script'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Copy this schema and execute it in your Supabase Dashboard &rarr; SQL Editor. File is also saved in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">supabase/migrations/01_initial_schema.sql</code>.
            </p>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Connect Your Own Supabase Credentials
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL (e.g. https://xyzcompany.supabase.co)
              </label>
              <input
                type="url"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="text"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  Save & Connect Supabase
                </button>
                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetData}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sample Data
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Row Level Security (RLS) policies enforce public approved-only visibility</span>
          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1 text-rose-600 hover:underline font-semibold"
          >
            Supabase Dashboard <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
