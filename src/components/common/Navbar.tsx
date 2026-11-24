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
  const [isScrolled, setIsScrolled] = useState(false);
  const { isConfigured } = getSupabaseCredentials();

  useEffect(() => {
    return AuthService.subscribe(user => {
      setCurrentUser(user);
    });
  }, []);

  // Handle scroll detection for dynamic navbar styling on home page
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus on Escape key for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setUserDropdownOpen(false);
  };

  const isHome = currentPath === '/';

  // Navigation links exactly matching the reference design: Buy, Rent, Sell, Projects, About, Contact
  const navLinks = [
    { label: 'Buy', path: '/search', params: { listingType: 'buy' } },
    { label: 'Rent', path: '/search', params: { listingType: 'rent' } },
    { label: 'Sell', path: '/submit-property' },
    { label: 'Projects', path: '/search', params: { propertyType: 'apartment' } },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Header class configuration
  const headerClasses = isHome
    ? isScrolled
      ? 'fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300'
      : 'absolute top-0 left-0 right-0 z-40 bg-transparent border-b border-transparent transition-all duration-300'
    : 'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-300';

  return (
    <header className={`${headerClasses} select-none`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Brand Name */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl transition flex-shrink-0 cursor-pointer"
            aria-label="Hyderabad Heights Home"
          >
            <Logo size="md" />
          </button>

          {/* Center Navigation Links matching reference */}
          <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-9 font-medium text-[15px] flex-shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path, link.params)}
                className="text-slate-800 hover:text-[#c81e35] transition font-medium whitespace-nowrap cursor-pointer py-1"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls Row */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 flex-shrink-0">
            {/* Search Icon Button */}
            <button
              onClick={() => onNavigate('/search')}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition cursor-pointer ${
                isHome && !isScrolled
                  ? 'text-white hover:text-rose-200 hover:bg-white/10'
                  : 'text-slate-700 hover:text-[#c81e35] hover:bg-slate-100'
              }`}
              title="Search properties"
              aria-label="Search properties"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* List Property Pill Button */}
            <button
              id="nav-list-property-btn"
              onClick={() => onNavigate('/submit-property')}
              className="flex items-center justify-center h-10 px-5 sm:px-6 bg-[#c81e35] hover:bg-[#b0172b] text-white text-sm font-semibold rounded-full shadow-sm hover:shadow transition whitespace-nowrap cursor-pointer"
            >
              <span>List Property</span>
            </button>

            {/* Local DB / Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseModal}
              title={isConfigured ? 'Connected to live Supabase cloud' : 'Running on local emulated database (Click to connect Supabase)'}
              className={`flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[11px] font-semibold border transition whitespace-nowrap cursor-pointer ${
                isHome && !isScrolled
                  ? 'bg-black/30 text-white/90 border-white/20 hover:bg-black/50'
                  : isConfigured 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Database className="w-3 h-3 text-current opacity-80" />
              <span>{isConfigured ? 'Live' : 'Local'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Sign In or Account Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-2.5 rounded-full border border-slate-200 bg-white/90 hover:bg-white transition text-left whitespace-nowrap cursor-pointer"
                >
                  {currentUser.avatar_url ? (
                    <img 
                      src={currentUser.avatar_url} 
                      alt={currentUser.full_name} 
                      className="w-7 h-7 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#c81e35]/10 text-[#c81e35] flex items-center justify-center font-bold text-xs">
                      {currentUser.full_name.charAt(0)}
                    </div>
                  )}
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
                        className="w-full text-left px-4 py-2.5 text-xs text-[#c81e35] font-bold hover:bg-rose-50 flex items-center gap-2.5 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#c81e35]" />
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
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isHome && !isScrolled
                    ? 'text-white/90 hover:text-white border border-white/20 hover:bg-white/10'
                    : 'text-slate-700 hover:text-[#c81e35] border border-slate-300 hover:border-[#c81e35] bg-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle (< lg) */}
          <div className="flex items-center gap-1.5 xs:gap-2 lg:hidden flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => onNavigate('/search')}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white border border-slate-200/90 text-slate-800 shadow-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c81e35] cursor-pointer"
              aria-label="Search listings"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Mobile List Property Button */}
            <button
              onClick={() => onNavigate(currentUser?.role === 'admin' ? '/admin' : '/submit-property')}
              className="flex items-center gap-1 h-9 sm:h-10 px-3 sm:px-3.5 bg-[#c81e35] hover:bg-[#b0172b] text-white text-xs font-bold rounded-full transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c81e35] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white border border-slate-200/90 text-slate-800 shadow-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c81e35] cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 sm:top-20 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-fadeIn">
            {/* Quick Category Navigation */}
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/');
                }}
                className="min-h-[44px] py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 border border-slate-100 transition active:bg-slate-100"
              >
                <span>🏠</span>
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/search');
                }}
                className="min-h-[44px] py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-xl hover:bg-slate-50 flex items-center gap-2 border border-slate-100 transition active:bg-slate-100"
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
                  className="min-h-[44px] py-2.5 px-3 text-left font-semibold text-xs text-slate-700 rounded-xl hover:bg-slate-50 border border-slate-100 transition active:bg-slate-100"
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
                className="w-full min-h-[44px] py-3 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:bg-rose-700"
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
                    className="w-full min-h-[44px] py-2.5 px-3 text-left text-xs font-bold text-slate-800 bg-slate-50 rounded-xl flex items-center gap-2 transition active:bg-slate-100"
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
                      className="w-full min-h-[44px] py-2.5 px-3 text-left text-xs font-bold text-rose-700 bg-rose-50 rounded-xl flex items-center gap-2 transition active:bg-rose-100"
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
                    className="w-full min-h-[44px] py-2.5 px-3 text-left text-xs font-semibold text-red-600 rounded-xl flex items-center gap-2 transition active:bg-red-50"
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
                  className="w-full min-h-[44px] py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition active:bg-slate-100"
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
                className="w-full min-h-[44px] py-2.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 mt-2 transition active:bg-slate-100"
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span>Database: {isConfigured ? 'Supabase Live' : 'Local DB (Click to configure)'}</span>
                <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
