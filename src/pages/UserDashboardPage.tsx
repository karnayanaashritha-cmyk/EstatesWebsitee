import React, { useState, useEffect } from 'react';
import { Property, Enquiry, UserProfile } from '../types';
import { PropertyService } from '../services/propertyService';
import { EnquiryService } from '../services/enquiryService';
import { AuthService } from '../services/authService';
import { formatIndianPrice, formatRelativeDate } from '../utils/formatters';
import { AdminPropertyModal } from '../components/admin/AdminPropertyModal';
import { 
  Building2, 
  MessageSquare, 
  Eye, 
  PlusCircle, 
  Phone, 
  Mail, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck,
  Calendar,
  Layers,
  Edit3
} from 'lucide-react';

interface UserDashboardPageProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenAuthModal: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'enquiries'>('properties');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  useEffect(() => {
    return AuthService.subscribe(user => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.id || 'owner-sample-01';
      const [props, enqs] = await Promise.all([
        PropertyService.getPropertiesByOwner(userId),
        EnquiryService.getEnquiriesForOwner(userId)
      ]);
      setMyProperties(props);
      setEnquiries(enqs);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this property listing?')) {
      await PropertyService.deleteProperty(id);
      loadDashboardData();
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId: string, status: any) => {
    await EnquiryService.updateEnquiryStatus(enquiryId, status);
    loadDashboardData();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sign In to View Dashboard</h2>
          <p className="text-xs text-slate-500">
            Sign in as an owner or agent to manage your Hyderabad listings and view buyer enquiries.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuthModal}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              Sign In or Select Demo Persona
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = myProperties.reduce((sum, p) => sum + (p.views_count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 font-extrabold text-xl flex items-center justify-center">
                {currentUser.full_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentUser.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/submit-property')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Property</span>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Admin Moderation</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">My Listings</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{myProperties.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Views</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{totalViews}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Buyer Enquiries</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{enquiries.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Approval Status</span>
            <div className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>All Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigators */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'properties'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Properties ({myProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Buyer Enquiries ({enquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {myProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map(prop => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <img
                        src={prop.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          prop.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-900'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">
                          {formatIndianPrice(prop.price, prop.listing_type === 'rent')}
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                          {prop.title}
                        </h3>
                        <p className="text-[11px] text-slate-500">{prop.locality}, Hyderabad</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onNavigate(`/property/${prop.slug}`)}
                            className="text-rose-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => {
                              setPropertyToEdit(prop);
                              setModalOpen(true);
                            }}
                            className="text-slate-700 hover:text-rose-600 font-bold flex items-center gap-1 transition"
                            title="Edit details, price or photos"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">You have not posted any properties yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  List your Hyderabad flat, villa, or plot to receive direct enquiries from genuine buyers.
                </p>
                <button
                  onClick={() => onNavigate('/submit-property')}
                  className="px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  List Property Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.length > 0 ? (
              <div className="space-y-3">
                {enquiries.map(enq => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{enq.sender_name}</span>
                        <span className="text-[10px] text-slate-400">• {formatRelativeDate(enq.created_at)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === 'new' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold">
                        Property: <span className="text-slate-800">{enq.property_title || 'Listing #' + enq.property_id}</span>
                      </p>

                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{enq.message}"
                      </p>

                      {enq.preferred_time && (
                        <p className="text-[11px] text-slate-500">
                          Preferred Time: <strong>{enq.preferred_time}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                      <a
                        href={`https://wa.me/${enq.sender_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${enq.sender_name}, thank you for your enquiry on Hyderabad Heights regarding ${enq.property_title || 'my listing'}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${enq.sender_phone}`}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => handleUpdateEnquiryStatus(enq.id, enq.status === 'contacted' ? 'closed' : 'contacted')}
                        className="px-3 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl"
                      >
                        {enq.status === 'contacted' ? 'Mark Closed' : 'Mark Contacted'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No buyer enquiries received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Property Edit / Add Modal */}
      <AdminPropertyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
        onSuccess={() => {
          loadDashboardData();
        }}
        onDelete={() => {
          loadDashboardData();
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
