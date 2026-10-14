import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await AuthService.loginWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            onClose();
            onSuccess?.();
          }, 600);
        }
      } else {
        if (!fullName || !email || !password) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        const res = await AuthService.signUp(email, password, fullName, phone, role);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMsg('Account created successfully!');
          setTimeout(() => {
            onClose();
            onSuccess?.();
          }, 600);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey: 'admin' | 'agent' | 'owner' | 'buyer') => {
    setLoading(true);
    await AuthService.switchDemoRole(roleKey);
    setSuccessMsg(`Switched to demo ${roleKey.toUpperCase()} account!`);
    setTimeout(() => {
      setLoading(false);
      onClose();
      onSuccess?.();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {mode === 'signin' ? 'Sign In to Hyderabad Heights' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Access Hyderabad property listings, leads & management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Persona Switcher */}
        <div className="bg-rose-50/70 border-b border-rose-100 p-4">
          <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            1-Click Demo Persona Login (Instant Testing)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-100/60 border border-rose-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between transition shadow-sm"
            >
              <span>👑 Portal Admin</span>
              <span className="text-[10px] text-rose-600 font-bold">Review</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-100/60 border border-rose-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between transition shadow-sm"
            >
              <span>🏡 Direct Owner</span>
              <span className="text-[10px] text-slate-500">Varma</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('agent')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-100/60 border border-rose-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between transition shadow-sm"
            >
              <span>🤝 Hyd Agent</span>
              <span className="text-[10px] text-slate-500">Reddy</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-100/60 border border-rose-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between transition shadow-sm"
            >
              <span>🔍 Home Buyer</span>
              <span className="text-[10px] text-slate-500">Search</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Srikant Raju"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">I am a</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['user', 'agent', 'admin'] as UserRole[]).map(r => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`py-1.5 text-xs font-medium rounded-lg border capitalize transition ${
                          role === r 
                            ? 'bg-rose-600 text-white border-rose-600' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r === 'user' ? 'Owner / Buyer' : r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {mode === 'signin' ? (
              <div>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-rose-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
