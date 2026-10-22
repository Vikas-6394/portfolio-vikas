import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  Layout,
  Code,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  Shield,
  Loader2,
  X,
  Save,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioAPI } from '../services/api';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { validateEmail, validateIndianMobile } from '../utils/formValidation';

export const AdminDashboard = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { profile, refreshPortfolioData } = usePortfolio();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview, enquiries, services, projects, templates, skills, testimonials, profile, settings

  // State collections
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, responded: 0, closed: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('All');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [adminServices, setAdminServices] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminTemplates, setAdminTemplates] = useState([]);
  const [adminSkills, setAdminSkills] = useState([]);
  const [adminTestimonials, setAdminTestimonials] = useState([]);
  const [editableProfile, setEditableProfile] = useState({});

  // Loading and Modals
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'service', 'project', 'template', 'skill', 'testimonial', 'enquiryDetails'
  const [editingItem, setEditingItem] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [profileErrors, setProfileErrors] = useState({});

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        enquiriesRes,
        servicesRes,
        projectsRes,
        templatesRes,
        skillsRes,
        testimonialsRes,
        profileRes,
      ] = await Promise.allSettled([
        portfolioAPI.getEnquiryStats(),
        portfolioAPI.getEnquiries({ limit: 50 }),
        portfolioAPI.getServicesAdmin(),
        portfolioAPI.getProjectsAdmin(),
        portfolioAPI.getTemplatesAdmin(),
        portfolioAPI.getSkills(),
        portfolioAPI.getTestimonialsAdmin(),
        portfolioAPI.getProfile(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.stats);
      }
      if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value.data.success) {
        setEnquiries(enquiriesRes.value.data.enquiries);
      }
      if (servicesRes.status === 'fulfilled' && servicesRes.value.data.success) {
        setAdminServices(servicesRes.value.data.services);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data.success) {
        setAdminProjects(projectsRes.value.data.projects);
      }
      if (templatesRes.status === 'fulfilled' && templatesRes.value.data.success) {
        setAdminTemplates(templatesRes.value.data.templates);
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data.success) {
        setAdminSkills(skillsRes.value.data.skills);
      }
      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value.data.success) {
        setAdminTestimonials(testimonialsRes.value.data.testimonials);
      }
      if (profileRes.status === 'fulfilled' && profileRes.value.data.success) {
        setEditableProfile(profileRes.value.data.profile);
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Responded':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Closed':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = async (id, newStatus, internalNotes) => {
    try {
      const res = await portfolioAPI.updateEnquiryStatus(id, { status: newStatus, internalNotes });
      if (res.data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus, internalNotes } : e))
        );
        if (editingItem && editingItem._id === id) {
          setEditingItem({ ...editingItem, status: newStatus, internalNotes });
        }
      }
    } catch (err) {
      alert('Error updating enquiry: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return;
    try {
      await portfolioAPI.deleteEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      if (editingItem && editingItem._id === id) setEditingItem(null);
    } catch (err) {
      alert('Error deleting enquiry');
    }
  };

  // Toggle Testimonial Approval
  const handleToggleTestimonial = async (id) => {
    try {
      const res = await portfolioAPI.toggleTestimonialApproval(id);
      if (res.data.success) {
        setAdminTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, isApproved: res.data.testimonial.isApproved } : t))
        );
        refreshPortfolioData();
      }
    } catch (err) {
      alert('Error updating testimonial approval');
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await portfolioAPI.deleteService(id);
      setAdminServices((prev) => prev.filter((s) => s._id !== id));
      refreshPortfolioData();
    } catch (err) {
      alert('Error deleting service');
    }
  };

  // Delete Project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await portfolioAPI.deleteProject(id);
      setAdminProjects((prev) => prev.filter((p) => p._id !== id));
      refreshPortfolioData();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Delete this template permanently?')) return;
    try {
      await portfolioAPI.deleteTemplate(id);
      setAdminTemplates((prev) => prev.filter((t) => t._id !== id));
      refreshPortfolioData();
    } catch (err) {
      alert('Error deleting template');
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const errors = {};
    if (editableProfile.email) {
      const emailCheck = validateEmail(editableProfile.email);
      if (!emailCheck.isValid) {
        errors.email = emailCheck.error;
      }
    }
    if (editableProfile.phone) {
      const phoneCheck = validateIndianMobile(editableProfile.phone, false);
      if (!phoneCheck.isValid) {
        errors.phone = phoneCheck.error;
      }
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    try {
      const res = await portfolioAPI.updateProfile(editableProfile);
      if (res.data.success) {
        setSaveSuccess('Profile updated successfully!');
        refreshPortfolioData();
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      alert('Error saving profile');
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Mr. Vikas Maurya Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-white/[0.08] p-5 flex flex-col justify-between flex-shrink-0 transition-colors">
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-cyan-500/20">
                VM
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">Admin Panel</span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block truncate">
                  {user?.email || 'admin@vikasmaurya.dev'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
                { id: 'enquiries', label: `Enquiries (${stats.new || 0} New)`, icon: Inbox },
                { id: 'services', label: 'Services Manager', icon: Briefcase },
                { id: 'projects', label: 'Projects Manager', icon: Layers },
                { id: 'templates', label: 'Website Templates', icon: Layout },
                { id: 'skills', label: 'Skills & Tech', icon: Code },
                { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
                { id: 'profile', label: 'Profile & Contact', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-2">
            <button
              onClick={() => {
                loadDashboardData();
                refreshPortfolioData();
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage and update your public portfolio website content in real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>View Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-[#0c1322] border border-white/[0.08]">
                  <span className="text-xs text-slate-400 block mb-1">Total Enquiries</span>
                  <span className="text-3xl font-extrabold text-white">{stats.total}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#0c1322] border border-cyan-500/30">
                  <span className="text-xs text-cyan-400 block mb-1">New Enquiries</span>
                  <span className="text-3xl font-extrabold text-cyan-400">{stats.new}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#0c1322] border border-amber-500/30">
                  <span className="text-xs text-amber-400 block mb-1">In Progress</span>
                  <span className="text-3xl font-extrabold text-amber-400">{stats.inProgress}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#0c1322] border border-purple-500/30">
                  <span className="text-xs text-purple-400 block mb-1">Responded</span>
                  <span className="text-3xl font-extrabold text-purple-400">{stats.responded}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#0c1322] border border-white/[0.08]">
                  <span className="text-xs text-slate-400 block mb-1">Closed</span>
                  <span className="text-3xl font-extrabold text-slate-400">{stats.closed}</span>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Recent Client Enquiries</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-cyan-400 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No enquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 border-b border-white/[0.08]">
                        <tr>
                          <th className="pb-3 font-semibold">Ref</th>
                          <th className="pb-3 font-semibold">Client</th>
                          <th className="pb-3 font-semibold">Service</th>
                          <th className="pb-3 font-semibold">Budget</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {enquiries.slice(0, 5).map((enq) => (
                          <tr key={enq._id} className="hover:bg-white/[0.02]">
                            <td className="py-3 font-mono text-cyan-400">{enq.referenceNumber}</td>
                            <td className="py-3 text-white font-medium">{enq.fullName}</td>
                            <td className="py-3 text-slate-300">{enq.serviceRequired}</td>
                            <td className="py-3 text-slate-400">{enq.budgetRange}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                                  enq.status
                                )}`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setEditingItem(enq);
                                  setModalType('enquiryDetails');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES INBOX */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1322] border border-white/[0.08]">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {['All', 'New', 'In Progress', 'Responded', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setEnquiryFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        enquiryFilter === st
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search client or ref..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-[#0c1322] border border-white/[0.08] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-white/[0.08]">
                      <tr>
                        <th className="p-4 font-semibold">Ref Code</th>
                        <th className="p-4 font-semibold">Client Name & Email</th>
                        <th className="p-4 font-semibold">Service</th>
                        <th className="p-4 font-semibold">Budget</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {enquiries
                        .filter((e) => {
                          const matchesFilter =
                            enquiryFilter === 'All' || e.status === enquiryFilter;
                          const matchesSearch =
                            e.fullName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                            e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                            e.referenceNumber.toLowerCase().includes(enquirySearch.toLowerCase());
                          return matchesFilter && matchesSearch;
                        })
                        .map((enq) => (
                          <tr key={enq._id} className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono font-bold text-cyan-400">
                              {enq.referenceNumber}
                            </td>
                            <td className="p-4">
                              <span className="text-white font-bold block">{enq.fullName}</span>
                              <span className="text-slate-400 text-[11px] block">{enq.email}</span>
                              {enq.phone && (
                                <span className="text-emerald-400 text-[10px] block">
                                  {enq.phone}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-300 font-medium">
                              {enq.serviceRequired}
                              {enq.selectedTemplate && (
                                <span className="block text-[10px] text-purple-400">
                                  Template: {enq.selectedTemplate}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-400">{enq.budgetRange}</td>
                            <td className="p-4 text-slate-500">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  handleUpdateEnquiryStatus(enq._id, e.target.value, enq.internalNotes)
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-slate-900 ${getStatusBadge(
                                  enq.status
                                )}`}
                              >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Responded">Responded</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingItem(enq);
                                    setModalType('enquiryDetails');
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEnquiry(enq._id)}
                                  className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                                  title="Delete Enquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {adminServices.length} Total Services Active
                </span>
                <button
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      shortDescription: '',
                      startingPrice: 149,
                      features: ['Custom Design', 'Responsive Layout', 'Contact Form'],
                      isPublished: true,
                    });
                    setModalType('service');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminServices.map((svc) => (
                  <div
                    key={svc._id}
                    className="p-5 rounded-2xl bg-[#0c1322] border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                          {svc.category || 'Service'}
                        </span>
                        <span className="text-sm font-extrabold text-white">
                          ${svc.startingPrice || 0}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{svc.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {svc.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          svc.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {svc.isPublished ? 'Published' : 'Draft'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(svc);
                            setModalType('service');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc._id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {adminProjects.length} Portfolio Projects
                </span>
                <button
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      category: 'Full Stack MERN',
                      shortDescription: '',
                      technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
                      liveUrl: '',
                      githubUrl: '',
                      isPublished: true,
                    });
                    setModalType('project');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminProjects.map((prj) => (
                  <div
                    key={prj._id}
                    className="rounded-2xl bg-[#0c1322] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-900">
                      <img
                        src={prj.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'}
                        alt={prj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                          {prj.category}
                        </span>
                        <h3 className="text-base font-bold text-white mb-2">{prj.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {prj.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            prj.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {prj.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(prj);
                              setModalType('project');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(prj._id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TEMPLATES MANAGER */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {adminTemplates.length} Ready-Made Templates
                </span>
                <button
                  onClick={() => {
                    setEditingItem({
                      name: '',
                      category: 'Business Website',
                      shortDescription: '',
                      startingPrice: 49,
                      availabilityStatus: 'Available Now',
                      keyFeatures: ['Responsive Design', 'Interactive UI'],
                      technologies: ['React', 'Tailwind CSS'],
                      isPublished: true,
                    });
                    setModalType('template');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminTemplates.map((tpl) => (
                  <div
                    key={tpl._id}
                    className="rounded-2xl bg-[#0c1322] border border-white/[0.08] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-900">
                      <img
                        src={tpl.thumbnail || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80'}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                          {tpl.category}
                        </span>
                        <h3 className="text-base font-bold text-white mb-2">{tpl.name}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {tpl.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-sm font-extrabold text-white">
                          ${tpl.startingPrice || 0}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(tpl);
                              setModalType('template');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(tpl._id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS MANAGER */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {adminSkills.length} Technical Skills
                </span>
                <button
                  onClick={() => {
                    setEditingItem({
                      name: '',
                      category: 'Frontend',
                      proficiencyPercentage: 85,
                      levelLabel: 'Proficient',
                      iconName: 'Code',
                      isFeatured: true,
                      displayOrder: adminSkills.length + 1,
                    });
                    setModalType('skill');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {adminSkills.map((sk) => (
                  <div
                    key={sk._id}
                    className="p-4 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-between transition hover:border-purple-500/40"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sk.name}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {sk.category} ({sk.proficiencyPercentage}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem({ ...sk });
                          setModalType('skill');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:text-slate-500 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                        title="Edit Skill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete ${sk.name}?`)) {
                            await portfolioAPI.deleteSkill(sk._id);
                            setAdminSkills((p) => p.filter((s) => s._id !== sk._id));
                            refreshPortfolioData();
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTIMONIALS MODERATION */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <span className="text-xs text-slate-400">
                Moderate client reviews submitted on the public website.
              </span>

              <div className="space-y-4">
                {adminTestimonials.map((t) => (
                  <div
                    key={t._id}
                    className="p-6 rounded-2xl bg-[#0c1322] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{t.clientName}</span>
                        <span className="text-xs text-slate-400">
                          {t.clientRole} {t.clientCompany ? `(${t.clientCompany})` : ''}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.isApproved
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {t.isApproved ? 'Approved & Visible' : 'Pending Moderation'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{t.testimonialText}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTestimonial(t._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          t.isApproved
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {t.isApproved ? 'Unapprove' : 'Approve & Publish'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete review?')) {
                            await portfolioAPI.deleteTestimonial(t._id);
                            setAdminTestimonials((p) => p.filter((x) => x._id !== t._id));
                            refreshPortfolioData();
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: PROFILE & CONTACT */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-6">
              {saveSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/[0.08] space-y-4">
                  <h3 className="text-base font-bold text-white">General Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editableProfile.fullName || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, fullName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Professional Title</label>
                      <input
                        type="text"
                        value={editableProfile.headline || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, headline: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Supporting Headline</label>
                    <input
                      type="text"
                      value={editableProfile.subHeadline || ''}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, subHeadline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">About Summary</label>
                    <textarea
                      rows={4}
                      value={editableProfile.aboutIntro || ''}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, aboutIntro: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0c1322] border border-white/[0.08] space-y-4">
                  <h3 className="text-base font-bold text-white">Contact & WhatsApp Configuration</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs text-slate-300">Email</label>
                        {profileErrors.email && (
                          <span className="text-[10px] font-semibold text-rose-400">{profileErrors.email}</span>
                        )}
                      </div>
                      <input
                        type="email"
                        value={editableProfile.email || ''}
                        onChange={(e) => {
                          setEditableProfile({ ...editableProfile, email: e.target.value });
                          if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: '' }));
                        }}
                        className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-white text-xs ${
                          profileErrors.email ? 'border-rose-500' : 'border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs text-slate-300">Phone</label>
                        {profileErrors.phone && (
                          <span className="text-[10px] font-semibold text-rose-400">{profileErrors.phone}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editableProfile.phone || ''}
                        onChange={(e) => {
                          setEditableProfile({ ...editableProfile, phone: e.target.value });
                          if (profileErrors.phone) setProfileErrors((p) => ({ ...p, phone: '' }));
                        }}
                        className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-white text-xs ${
                          profileErrors.phone ? 'border-rose-500' : 'border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        WhatsApp Number (int'l digits)
                      </label>
                      <input
                        type="text"
                        value={editableProfile.whatsappNumber || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            </div>
          )}

          {/* MODAL: ENQUIRY DETAILS */}
          {modalType === 'enquiryDetails' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-white/10 p-6 shadow-2xl text-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {editingItem.referenceNumber}
                  </span>
                  <button
                    onClick={() => setModalType(null)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Client Name</span>
                    <span className="text-white font-semibold text-sm">{editingItem.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address</span>
                    <a
                      href={`mailto:${editingItem.email}`}
                      className="text-cyan-400 underline font-medium"
                    >
                      {editingItem.email}
                    </a>
                  </div>
                  {editingItem.phone && (
                    <div>
                      <span className="text-slate-400 block">Phone / WhatsApp</span>
                      <span className="text-emerald-400 font-medium">{editingItem.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">Service Requested</span>
                    <span className="text-white">{editingItem.serviceRequired}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Budget & Target Date</span>
                    <span className="text-white">
                      {editingItem.budgetRange} • {editingItem.expectedCompletionDate || 'Flexible'}
                    </span>
                  </div>
                  {editingItem.selectedTemplate && (
                    <div>
                      <span className="text-slate-400 block">Requested Template</span>
                      <span className="text-purple-400 font-bold">
                        {editingItem.selectedTemplate}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">Project Description</span>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed mt-1">
                      {editingItem.projectDescription}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Internal Notes (Private)</span>
                    <textarea
                      rows={2}
                      value={editingItem.internalNotes || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, internalNotes: e.target.value })
                      }
                      placeholder="Add private note (e.g. called client on Oct 14, agreed on $350)..."
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white resize-none mt-1"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <select
                    value={editingItem.status}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      handleUpdateEnquiryStatus(editingItem._id, newSt, editingItem.internalNotes);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border bg-slate-900 ${getStatusBadge(
                      editingItem.status
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Responded">Responded</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleUpdateEnquiryStatus(
                          editingItem._id,
                          editingItem.status,
                          editingItem.internalNotes
                        );
                        setModalType(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: CREATE / EDIT SERVICE */}
          {modalType === 'service' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-white/10 p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-bold text-white text-base">
                    {editingItem._id ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="e.g. MERN Stack Custom Development"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Short Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingItem.startingPrice || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            startingPrice: parseFloat(e.target.value) || null,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingItem.category || 'Web Development'}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="svcPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                    />
                    <label htmlFor="svcPublished" className="text-slate-300">
                      Publish publicly on website
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingItem.title || !editingItem.shortDescription) {
                        alert('Title and description required');
                        return;
                      }
                      if (editingItem._id) {
                        await portfolioAPI.updateService(editingItem._id, editingItem);
                      } else {
                        await portfolioAPI.createService(editingItem);
                      }
                      setModalType(null);
                      loadDashboardData();
                      refreshPortfolioData();
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: CREATE / EDIT PROJECT */}
          {modalType === 'project' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-white/10 p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-bold text-white text-base">
                    {editingItem._id ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          const autoSlug = !editingItem._id
                            ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                            : (editingItem.slug || '');
                          setEditingItem({ ...editingItem, title: newTitle, slug: autoSlug });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        placeholder="e.g. Clotes Shop"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Slug (URL path)</label>
                      <input
                        type="text"
                        value={editingItem.slug || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        placeholder="e.g. clotes-shop-ecommerce"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Full Stack MERN">Full Stack MERN</option>
                      <option value="Frontend Web App">Frontend Web App</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Business Website">Business Website</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editingItem.technologies)
                          ? editingItem.technologies.join(', ')
                          : (editingItem.technologies || '')
                      }
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, technologies: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="React, Tailwind CSS, Node.js, MongoDB"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={editingItem.coverImage || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, coverImage: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Short Description *</label>
                    <textarea
                      rows={3}
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Full Case Study / Overview</label>
                    <textarea
                      rows={4}
                      value={editingItem.fullCaseStudy || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, fullCaseStudy: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
                      placeholder="Detailed overview and key architectural decisions..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Live URL</label>
                      <input
                        type="text"
                        value={editingItem.liveUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, liveUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={editingItem.githubUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, githubUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="prjPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                    />
                    <label htmlFor="prjPublished" className="text-slate-300">
                      Publish publicly
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingItem.title || !editingItem.shortDescription) {
                        alert('Title and description required');
                        return;
                      }

                      const payload = {
                        ...editingItem,
                        technologies:
                          typeof editingItem.technologies === 'string'
                            ? editingItem.technologies
                                .split(/[\n,]/)
                                .map((s) => s.trim())
                                .filter(Boolean)
                            : (editingItem.technologies || ['React', 'Node.js', 'MongoDB']),
                      };

                      try {
                        if (editingItem._id) {
                          await portfolioAPI.updateProject(editingItem._id, payload);
                        } else {
                          await portfolioAPI.createProject(payload);
                        }
                        setModalType(null);
                        await loadDashboardData();
                        refreshPortfolioData();
                      } catch (err) {
                        alert('Error saving project: ' + (err.response?.data?.message || err.message));
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: CREATE / EDIT TEMPLATE */}
          {modalType === 'template' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-[#0c1322] border border-white/10 p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <h3 className="font-bold text-white text-base">
                    {editingItem._id ? 'Edit Template' : 'Add New Template'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Template Name *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="e.g. ApexCorp Corporate Template"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Category</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      >
                        <option value="Personal Portfolio">Personal Portfolio</option>
                        <option value="Business Website">Business Website</option>
                        <option value="Coaching Institute">Coaching Institute</option>
                        <option value="Education Website">Education Website</option>
                        <option value="E-commerce Store">E-commerce Store</option>
                        <option value="Restaurant Website">Restaurant Website</option>
                        <option value="Travel and Tourism Website">Travel & Tourism</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="Real Estate Website">Real Estate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingItem.startingPrice || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            startingPrice: parseFloat(e.target.value) || null,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Thumbnail URL</label>
                    <input
                      type="text"
                      value={editingItem.thumbnail || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, thumbnail: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Short Description *</label>
                    <textarea
                      rows={3}
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white resize-none"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="tplPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                    />
                    <label htmlFor="tplPublished" className="text-slate-300">
                      Publish publicly
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingItem.name || !editingItem.shortDescription) {
                        alert('Name and description required');
                        return;
                      }
                      if (editingItem._id) {
                        await portfolioAPI.updateTemplate(editingItem._id, editingItem);
                      } else {
                        await portfolioAPI.createTemplate(editingItem);
                      }
                      setModalType(null);
                      loadDashboardData();
                      refreshPortfolioData();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: CREATE / EDIT SKILL */}
          {modalType === 'skill' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingItem._id ? 'Edit Technical Skill' : 'Add New Skill'}
                  </h3>
                  <button
                    onClick={() => setModalType(null)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Skill Name <span className="text-purple-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition"
                      placeholder="e.g. Next.js, Docker, TypeScript"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Category <span className="text-purple-500">*</span>
                    </label>
                    <select
                      value={editingItem.category || 'Frontend'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Programming Languages">Programming Languages</option>
                      <option value="Tools & DevOps">Tools & DevOps</option>
                      <option value="Security & Fundamentals">Security & Fundamentals</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                        Proficiency ({editingItem.proficiencyPercentage || 85}%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editingItem.proficiencyPercentage ?? 85}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            proficiencyPercentage: Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 0)),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Level Label</label>
                      <select
                        value={editingItem.levelLabel || 'Proficient'}
                        onChange={(e) => setEditingItem({ ...editingItem, levelLabel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 transition"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Proficient">Proficient</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={editingItem.proficiencyPercentage || 85}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          proficiencyPercentage: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Icon Style</label>
                    <select
                      value={editingItem.iconName || 'Code'}
                      onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="Code">Code (General / Web)</option>
                      <option value="Atom">Atom (React / Frontend Frameworks)</option>
                      <option value="FileCode">FileCode (JavaScript / TS / HTML)</option>
                      <option value="Palette">Palette (UI / CSS / Styling)</option>
                      <option value="Wind">Wind (Tailwind CSS)</option>
                      <option value="Server">Server (Node.js / Express / Backend)</option>
                      <option value="Database">Database (MongoDB / SQL / DB)</option>
                      <option value="Terminal">Terminal (CLI / Shell / Bash)</option>
                      <option value="GitBranch">GitBranch (Git / Version Control)</option>
                      <option value="GitPullRequest">GitPullRequest (GitHub / CI/CD)</option>
                      <option value="ShieldCheck">ShieldCheck (Security / Auth)</option>
                      <option value="Binary">Binary (DSA / Algorithms)</option>
                      <option value="Coffee">Coffee (Java / Programming)</option>
                      <option value="Cpu">Cpu (C++ / Systems / OS)</option>
                      <option value="Network">Network (APIs / Networking)</option>
                      <option value="Smartphone">Smartphone (Mobile / Responsive)</option>
                      <option value="Layers">Layers (Full Stack / Architecture)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="skillFeatured"
                      checked={editingItem.isFeatured !== false}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="skillFeatured" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      Feature on Portfolio Website
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingItem.name?.trim()) {
                        alert('Skill name is required');
                        return;
                      }
                      try {
                        const payload = {
                          ...editingItem,
                          name: editingItem.name.trim(),
                          proficiencyPercentage: parseInt(editingItem.proficiencyPercentage, 10) || 85,
                        };
                        if (editingItem._id) {
                          const res = await portfolioAPI.updateSkill(editingItem._id, payload);
                          if (res.data?.success) {
                            setAdminSkills((p) =>
                              p.map((s) => (s._id === editingItem._id ? res.data.skill : s))
                            );
                          }
                        } else {
                          const res = await portfolioAPI.createSkill(payload);
                          if (res.data?.success) {
                            setAdminSkills((p) => [...p, res.data.skill]);
                          }
                        }
                        setModalType(null);
                        await loadDashboardData();
                        await refreshPortfolioData();
                      } catch (err) {
                        alert(err.response?.data?.message || 'Error saving skill');
                      }
                    }}
                    className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition"
                  >
                    {editingItem._id ? 'Update Skill' : 'Save Skill'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};
