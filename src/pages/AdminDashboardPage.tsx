import React, { useState, useEffect } from 'react';
import { Property, Enquiry, PropertyReport, UserProfile } from '../types';
import { PropertyService } from '../services/propertyService';
import { EnquiryService } from '../services/enquiryService';
import { AuthService } from '../services/authService';
import { formatIndianPrice, formatRelativeDate } from '../utils/formatters';
import { AdminPropertyModal } from '../components/admin/AdminPropertyModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  MessageSquare, 
  Building2, 
  Filter, 
  ArrowLeft,
  Lock,
  RefreshCw,
  PlusCircle,
  Edit3,
  Tag
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string, params?: any) => void;
  onOpenAuthModal: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onOpenAuthModal
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'enquiries'>('listings');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete property documentation or invalid photos');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    return AuthService.subscribe(user => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [allProps, allEnqs, allReps] = await Promise.all([
        PropertyService.getAllPropertiesForAdmin(),
        EnquiryService.getAllEnquiriesForAdmin(),
        EnquiryService.getAllReportsForAdmin()
      ]);
      setProperties(allProps);
      setEnquiries(allEnqs);
      setReports(allReps);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await PropertyService.updatePropertyStatus(id, 'approved');
    loadAdminData();
  };

  const handleReject = async (id: string) => {
    await PropertyService.updatePropertyStatus(id, 'rejected', rejectionReason);
    setRejectingId(null);
    loadAdminData();
  };

  const handleToggleVerified = async (id: string, currentVerified: boolean) => {
    await PropertyService.updatePropertyStatus(id, 'approved', undefined, !currentVerified);
    loadAdminData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this listing permanently from the database?')) {
      await PropertyService.deleteProperty(id);
      loadAdminData();
    }
  };

  // Secure Role Enforcement
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-red-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Admin Privileges Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You are not authorized to view the moderation console. You must be logged in as an Administrator.
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => AuthService.switchDemoRole('admin')}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              👑 Switch to Admin Account (Praveen Kumar)
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const approvedCount = properties.filter(p => p.status === 'approved').length;
  const verifiedCount = properties.filter(p => p.is_verified).length;

  const filteredProperties = properties.filter(p => {
    if (filterStatus === 'pending') return p.status === 'pending';
    if (filterStatus === 'approved') return p.status === 'approved';
    if (filterStatus === 'rejected') return p.status === 'rejected';
    if (filterStatus === 'verified') return p.is_verified;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Hyderabad Heights Moderation & Security Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative Console
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{currentUser.full_name}</strong> (Master Admin). Enforce TGRERA standards & approval rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setPropertyToEdit(null);
                setAdminModalOpen(true);
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-rose-900/40 transform hover:-translate-y-0.5 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Property for Sale</span>
            </button>
            <button
              onClick={loadAdminData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition active:scale-95"
            >
              View Public Portal
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase truncate block">Total Properties</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{properties.length}</div>
          </div>
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase truncate block">Pending Approval</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase truncate block">Live & Approved</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</div>
          </div>
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase truncate block">Verified Badges</span>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1">{verifiedCount}</div>
          </div>
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm min-w-0 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase truncate block">Reported Listings</span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{reports.length}</div>
          </div>
        </div>

        {/* Tabs - with smooth horizontal scrolling on mobile */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-bold overflow-x-auto scrollbar-none whitespace-nowrap pb-0.5">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'listings' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Properties Moderation ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'reports' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Reported Listings ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-1 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'enquiries' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>All Leads ({enquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: LISTINGS MODERATION */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {/* Quick Action Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">
                    Properties Inventory & Direct Listings
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700">
                    Website Owner Controls
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Quickly create a listing for a nearby property you know is for sale, or reopen existing properties to update details and photos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPropertyToEdit(null);
                  setAdminModalOpen(true);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md self-start sm:self-auto flex-shrink-0 transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Property for Sale</span>
              </button>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              {(['all', 'pending', 'approved', 'rejected', 'verified'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                    filterStatus === s
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* MOBILE CARD LIST VIEW (< md) */}
            <div className="md:hidden space-y-3">
              {filteredProperties.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {prop.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {prop.locality}, Hyderabad • Ref: {prop.id}
                        {prop.images && prop.images.length > 0 && ` • ${prop.images.length} photos`}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${
                      prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="font-extrabold text-base text-slate-900">
                      {formatIndianPrice(prop.price, prop.listing_type === 'rent')}
                      <span className="text-[10px] text-rose-600 font-bold uppercase ml-1.5">({prop.listing_type})</span>
                    </div>

                    {prop.source_type === 'site_owner' && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                        Owner Sourced
                      </span>
                    )}
                  </div>

                  {prop.rera_id && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-mono">
                      TGRERA: {prop.rera_id}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onNavigate(`/property/${prop.slug}`)}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 active:scale-95 transition"
                      title="Preview Public Listing"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setPropertyToEdit(prop);
                        setAdminModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold border border-rose-200 flex items-center gap-1 active:scale-95 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleToggleVerified(prop.id, prop.is_verified)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                        prop.is_verified 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{prop.is_verified ? 'Verified' : 'Verify'}</span>
                    </button>

                    {prop.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold active:scale-95 transition"
                      >
                        Approve
                      </button>
                    )}

                    {prop.status !== 'rejected' && (
                      <button
                        onClick={() => setRejectingId(prop.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg font-bold active:scale-95 transition"
                      >
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition ml-auto"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md+) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Property Title & Locality</th>
                      <th className="p-3.5">Price / Type</th>
                      <th className="p-3.5">TGRERA ID</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Verified</th>
                      <th className="p-3.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map(prop => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            <span className="truncate">{prop.title}</span>
                            {prop.source_type === 'site_owner' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0">
                                Owner Sourced
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {prop.locality}, Hyderabad • Ref: {prop.id}
                            {prop.images && prop.images.length > 0 && ` • ${prop.images.length} photos`}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-extrabold text-slate-900">
                            {formatIndianPrice(prop.price, prop.listing_type === 'rent')}
                          </div>
                          <div className="text-[10px] uppercase text-rose-600 font-bold">{prop.listing_type}</div>
                        </td>
                        <td className="p-3.5">
                          {prop.rera_id ? (
                            <span className="font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              {prop.rera_id}
                            </span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prop.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            prop.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {prop.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleVerified(prop.id, prop.is_verified)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition ${
                              prop.is_verified 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>{prop.is_verified ? 'Verified' : 'Mark Verified'}</span>
                          </button>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Preview Public Page */}
                          <button
                            onClick={() => onNavigate(`/property/${prop.slug}`)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded bg-slate-100"
                            title="Preview Public Listing"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details & Photos */}
                          <button
                            onClick={() => {
                              setPropertyToEdit(prop);
                              setAdminModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded font-bold transition inline-flex items-center gap-1 border border-rose-200"
                            title="Reopen listing to update price, details, or photos"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {prop.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(prop.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                            >
                              Approve
                            </button>
                          )}

                          {prop.status !== 'rejected' && (
                            <button
                              onClick={() => setRejectingId(prop.id)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(prop.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rejection Modal Dialog */}
            {rejectingId && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                onClick={e => {
                  if (e.target === e.currentTarget) setRejectingId(null);
                }}
              >
                <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
                  <h3 className="text-sm font-bold text-slate-900">Specify Rejection Reason</h3>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(rejectingId)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Community Moderation Reports
            </h3>
            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-rose-700">{rep.reason}</span>
                      <span className="text-[10px] text-slate-400">{formatRelativeDate(rep.created_at)}</span>
                    </div>
                    <p className="text-slate-600">{rep.details || 'No additional details provided.'}</p>
                    <p className="text-[11px] text-slate-500">Reported by: {rep.reporter_email} on Property ID: {rep.property_id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No reported properties currently. The portal is clean.</p>
            )}
          </div>
        )}

        {/* TAB 3: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              All Portal Buyer Leads
            </h3>
            <div className="space-y-3">
              {enquiries.map(enq => (
                <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{enq.sender_name} ({enq.sender_phone})</div>
                    <div className="text-slate-500 truncate">{enq.property_title || 'Property #' + enq.property_id}</div>
                    <p className="text-slate-700 mt-1 italic break-words">"{enq.message}"</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap self-start sm:self-auto">{formatRelativeDate(enq.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Add/Edit Property Modal */}
      <AdminPropertyModal
        isOpen={adminModalOpen}
        onClose={() => {
          setAdminModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
        onSuccess={(_savedProp, isEdit) => {
          setActionNotice(isEdit ? 'Property updated successfully!' : 'Property published live on portal!');
          loadAdminData();
        }}
        onDelete={(_id) => {
          setActionNotice('Property deleted permanently.');
          loadAdminData();
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
};
