import React, { useState, useEffect } from 'react';
import { Property, PropertyFilterParams } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SupabaseStatusModal } from './components/common/SupabaseStatusModal';
import { AuthModal } from './components/common/AuthModal';
import { EnquiryModal } from './components/property/EnquiryModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { SubmitPropertyPage } from './pages/SubmitPropertyPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [routeParams, setRouteParams] = useState<any>({});
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [enquiryModalProperty, setEnquiryModalProperty] = useState<Property | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setRouteParams({});
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params: any = {}) => {
    setCurrentPath(path);
    setRouteParams(params);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiryModal = (property: Property) => {
    setEnquiryModalProperty(property);
  };

  // Route Resolver
  const renderRoute = () => {
    // Property Detail Page: /property/:slug
    if (currentPath.startsWith('/property/')) {
      const identifier = currentPath.replace('/property/', '');
      return (
        <PropertyDetailPage
          identifier={identifier}
          onNavigate={navigate}
          onOpenEnquiryModal={handleOpenEnquiryModal}
        />
      );
    }

    switch (currentPath) {
      case '/search':
        return (
          <SearchPage
            initialFilters={routeParams}
            onNavigate={navigate}
            onOpenEnquiryModal={handleOpenEnquiryModal}
          />
        );

      case '/submit-property':
        return (
          <SubmitPropertyPage
            onNavigate={navigate}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        );

      case '/dashboard':
        return (
          <UserDashboardPage
            onNavigate={navigate}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        );

      case '/admin':
        return (
          <AdminDashboardPage
            onNavigate={navigate}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        );

      case '/about':
        return <AboutPage onNavigate={navigate} />;

      case '/contact':
        return <ContactPage />;

      case '/privacy':
        return <PrivacyPolicyPage />;

      case '/terms':
        return <TermsPage />;

      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onOpenEnquiryModal={handleOpenEnquiryModal}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-rose-100 selection:text-rose-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Page View */}
      <main className="flex-grow">
        {renderRoute()}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={navigate}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Supabase Settings & Migration Modal */}
      <SupabaseStatusModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Property Enquiry Modal */}
      <EnquiryModal
        property={enquiryModalProperty}
        isOpen={Boolean(enquiryModalProperty)}
        onClose={() => setEnquiryModalProperty(null)}
      />
    </div>
  );
}

export default App;
