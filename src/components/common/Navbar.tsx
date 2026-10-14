import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { 
  PlusCircle, 
  User, 
  Database, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  Home, 
  Search, 
  ChevronDown 
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { getSupabaseCredentials } from '../../services/supabase';
import { UserProfile } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string, params?: any) => void;
  onOpenSupabaseModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSupabaseModal,
  onOpenAuthModal
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { isConfigured } = getSupabaseCredentials();

  useEffect(() => {
    return AuthService.subscribe(user => {
      setCurrentUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { label: 'Buy', path: '/search', params: { listingType: 'buy' } },
    { label: 'Rent', path: '/search', params: { listingType: 'rent' } },
    { label: 'Commercial', path: '/search', params: { propertyType: 'commercial' } },
    { label: 'Villas', path: '/search', params: { propertyType: 'villa' } },
    { label: 'Plots', path: '/search', params: { propertyType: 'plot' } },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Name */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl transition flex-shrink-0"
            aria-label="Hyderabad Heights Home"
          >
            <Logo size="md" />
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 font-medium text-sm text-slate-700 flex-shrink-0">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-2 rounded-xl transition whitespace-nowrap font-semibold ${
                currentPath === '/' 
                  ? 'text-rose-600 font-bold bg-rose-50' 
                  : 'hover:text-rose-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path, link.params)}
                className="px-3 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition whitespace-nowrap font-semibold"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls Row */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            {/* Search Control */}
            <button
              onClick={() => onNavigate('/search')}
              className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold transition whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Search all listings"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search</span>
            </button>

            {/* Local DB / Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseModal}
              title={isConfigured ? 'Connected to live Supabase cloud' : 'Running on local emulated database (Click to connect Supabase)'}
              className={`flex items-center gap-2 h-10 px-3.5 rounded-xl text-xs font-semibold border transition whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                isConfigured 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>{isConfigured ? 'Supabase Live' : 'Local DB'}</span>
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            </button>

            {/* Admin Management Button (if admin) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                className="flex items-center gap-1.5 h-10 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition border border-slate-700 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                title="Moderate and manage property listings"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Manage</span>
              </button>
            )}

            {/* List Property Button */}
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin' : '/submit-property')}
              className="flex items-center gap-2 h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{currentUser?.role === 'admin' ? '+ Add Property' : 'List Property'}</span>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                {currentUser?.role === 'admin' ? 'Admin' : 'Free'}
              </span>
            </button>

            {/* Sign In or Account Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  {currentUser.avatar_url ? (
                    <img 
                      src={currentUser.avatar_url} 
                      alt={currentUser.full_name} 
                      className="w-7 h-7 rounded-lg object-cover" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[100px]">
                      {currentUser.full_name}
                    </div>
                    <div className="text-[10px] text-rose-600 font-semibold capitalize mt-0.5">
                      {currentUser.role === 'admin' ? '👑 Admin' : currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/dashboard');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2.5 transition"
                    >
                      <Home className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard & Enquiries</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('/admin');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-700 font-bold hover:bg-rose-50 flex items-center gap-2.5 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <span>Admin Moderation Portal</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 h-10 px-4 border border-slate-300 hover:border-rose-400 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl bg-white hover:bg-rose-50/40 transition whitespace-nowrap flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle (< lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => onNavigate('/search')}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              aria-label="Search listings"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile List Property Button */}
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin' : '/submit-property')}
              className="flex items-center gap-1.5 h-10 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {/* Quick Category Navigation */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/');
              }}
              className="py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/search');
              }}
              className="py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <span>🔍</span>
              <span>All Listings</span>
            </button>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.path, link.params);
                }}
                className="py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-lg hover:bg-slate-50"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            {/* List Property Full Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(currentUser?.role === 'admin' ? '/admin' : '/submit-property');
              }}
              className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{currentUser?.role === 'admin' ? '+ Add Property Listing (Admin)' : 'List Property Free'}</span>
            </button>

            {/* Auth / Account Controls */}
            {currentUser ? (
              <div className="space-y-1 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/dashboard');
                  }}
                  className="w-full py-2.5 px-3 text-left text-xs font-bold text-slate-800 bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Dashboard ({currentUser.full_name})</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/admin');
                    }}
                    className="w-full py-2.5 px-3 text-left text-xs font-bold text-rose-700 bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>Admin Moderation Portal</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 px-3 text-left text-xs font-semibold text-red-600 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Local DB / Supabase Status */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupabaseModal();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 mt-2"
            >
              <Database className="w-4 h-4 text-slate-500" />
              <span>Database: {isConfigured ? 'Supabase Live' : 'Local DB (Click to configure)'}</span>
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
