import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Menu,
  KeyRound,
  Lock,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioAPI } from '../services/api';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { validateEmail, validateIndianMobile } from '../utils/formValidation';
import { getSafeImageUrl, compressImageFile } from '../utils/imageHelper';

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
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');

  // Hamburger menu and Change Password states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await portfolioAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data?.success) {
        setPasswordSuccess(res.data.message || 'Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2200);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error updating password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', count: stats.new || 0, icon: Inbox },
    { id: 'services', label: 'Services Manager', icon: Briefcase },
    { id: 'projects', label: 'Projects Manager', icon: Layers },
    { id: 'templates', label: 'Website Templates', icon: Layout },
    { id: 'skills', label: 'Skills & Tech', icon: Code },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'profile', label: 'Profile & Contact', icon: User },
  ];
  const [adminTestimonials, setAdminTestimonials] = useState([]);
  const [editableProfile, setEditableProfile] = useState({});

  // Loading and Modals
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'service', 'project', 'template', 'skill', 'testimonial', 'enquiryDetails'
  const [editingItem, setEditingItem] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [profileErrors, setProfileErrors] = useState({});

  // Image mode & upload states
  const [projectImageMode, setProjectImageMode] = useState('url'); // 'url' | 'file'
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const projectFileInputRef = useRef(null);

  const [templateImageMode, setTemplateImageMode] = useState('url');
  const [uploadingTemplateImg, setUploadingTemplateImg] = useState(false);
  const templateFileInputRef = useRef(null);

  const handleImageFileUpload = async (file, fieldName, setUploading) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, or SVG).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please choose a smaller image.');
      return;
    }

    setUploading(true);
    try {
      // 1. Immediately compress in browser to high-quality lightweight Data URI (~60-120KB)
      // This ensures the photo is saved directly into MongoDB and never lost on server restarts
      const compressedDataUri = await compressImageFile(file, 1280, 800, 0.82);

      setEditingItem((prev) => ({
        ...prev,
        [fieldName]: compressedDataUri,
      }));

      // 2. Also attempt upload to backend (if cloud storage like Cloudinary is configured)
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await portfolioAPI.uploadMedia(formData);
        if (res.data?.success && (res.data.fileUrl || res.data.url)) {
          const publicUrl = res.data.fileUrl || res.data.url;
          if (publicUrl.startsWith('https://res.cloudinary.com') || (publicUrl.startsWith('http') && !publicUrl.includes('/uploads/'))) {
            setEditingItem((prev) => ({
              ...prev,
              [fieldName]: publicUrl,
            }));
          }
        }
      } catch (uploadErr) {
        console.info('Stored via persistent compressed image.');
      }
    } catch (err) {
      console.warn('Image processing fallback to basic FileReader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

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

  // Status Badge Colors (High contrast in both Light & Dark modes)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
      case 'Responded':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
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
        <aside className="hidden md:flex md:w-64 bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-white/[0.08] p-5 flex-col justify-between flex-shrink-0 transition-colors">
          <div>
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]">
                <img
                  src="/vm-logo-ring-transparent.png"
                  alt="Mr. Vikas Maurya"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">Admin Panel</span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block truncate">
                  {user?.email || 'admin@vikasmaurya.dev'}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-2">
            <button
              onClick={() => {
                setPasswordError('');
                setPasswordSuccess('');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] transition"
              title="Change Password"
            >
              <KeyRound className="w-4 h-4 text-cyan-500" />
              <span>Change Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Top Navigation Bar with Quick Actions */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-6 md:mb-8 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              {/* Mobile-only brand emblem */}
              <div className="flex md:hidden items-center">
                <div className="w-8 h-8 flex-shrink-0 drop-shadow-[0_2px_6px_rgba(6,182,212,0.4)]">
                  <img
                    src="/vm-logo-ring-transparent.png"
                    alt="VM"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Active Tab Heading */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white capitalize leading-tight">
                  {activeTab.replace('-', ' ')}
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Live Admin Control Center
                </p>
              </div>
            </div>

            {/* Topbar Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white text-xs font-semibold items-center gap-1.5 transition"
                title="Open Public Portfolio"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">View Website</span>
              </a>

              {/* Mobile-Only Hamburger Menu Button (Right Side) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex md:hidden px-2.5 py-2 rounded-xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 shadow-sm transition items-center gap-1.5 group cursor-pointer"
                title="Open Navigation Menu"
                aria-label="Navigation Menu"
              >
                <Menu className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 sm:inline hidden">
                  Menu
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Total Enquiries</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-cyan-500/25 dark:border-cyan-500/30 shadow-sm">
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 block mb-1">New Enquiries</span>
                  <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{stats.new}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-amber-500/25 dark:border-amber-500/30 shadow-sm">
                  <span className="text-xs text-amber-600 dark:text-amber-400 block mb-1">In Progress</span>
                  <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{stats.inProgress}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-purple-500/25 dark:border-purple-500/30 shadow-sm">
                  <span className="text-xs text-purple-600 dark:text-purple-400 block mb-1">Responded</span>
                  <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{stats.responded}</span>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Closed</span>
                  <span className="text-3xl font-extrabold text-slate-600 dark:text-slate-400">{stats.closed}</span>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Client Enquiries</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No enquiries received yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08]">
                        <tr>
                          <th className="pb-3 font-semibold">Ref</th>
                          <th className="pb-3 font-semibold">Client</th>
                          <th className="pb-3 font-semibold">Service</th>
                          <th className="pb-3 font-semibold">Budget</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                        {enquiries.slice(0, 5).map((enq) => (
                          <tr key={enq._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                            <td className="py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{enq.referenceNumber}</td>
                            <td className="py-3 text-slate-900 dark:text-white font-medium">{enq.fullName}</td>
                            <td className="py-3 text-slate-700 dark:text-slate-300">{enq.serviceRequired}</td>
                            <td className="py-3 text-slate-500 dark:text-slate-400">{enq.budgetRange}</td>
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
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition font-medium"
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {['All', 'New', 'In Progress', 'Responded', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setEnquiryFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        enquiryFilter === st
                          ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search client or ref..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-white/[0.08]">
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
                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
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
                          <tr key={enq._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                            <td className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              {enq.referenceNumber}
                            </td>
                            <td className="p-4">
                              <span className="text-slate-900 dark:text-white font-bold block">{enq.fullName}</span>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{enq.email}</span>
                              {enq.phone && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[10px] block">
                                  {enq.phone}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                              {enq.serviceRequired}
                              {enq.selectedTemplate && (
                                <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                                  Template: {enq.selectedTemplate}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-500 dark:text-slate-400">{enq.budgetRange}</td>
                            <td className="p-4 text-slate-500 dark:text-slate-400">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  handleUpdateEnquiryStatus(enq._id, e.target.value, enq.internalNotes)
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-white dark:bg-slate-900 transition ${getStatusBadge(
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
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEnquiry(enq._id)}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-transparent transition"
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminServices.map((svc) => (
                  <div
                    key={svc._id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                          {svc.category || 'Service'}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ${svc.startingPrice || 0}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{svc.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {svc.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          svc.isPublished
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent'
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
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                          title="Edit Service"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc._id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-transparent transition"
                          title="Delete Service"
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminProjects.map((prj) => (
                  <div
                    key={prj._id}
                    className="rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition hover:shadow-md"
                  >
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                      <img
                        src={getSafeImageUrl(prj.coverImage)}
                        alt={prj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                          {prj.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{prj.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                          {prj.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            prj.isPublished
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent'
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
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(prj._id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-transparent transition"
                            title="Delete Project"
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
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminTemplates.map((tpl) => (
                  <div
                    key={tpl._id}
                    className="rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition hover:shadow-md"
                  >
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                      <img
                        src={getSafeImageUrl(tpl.thumbnail)}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                          {tpl.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{tpl.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                          {tpl.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          ${tpl.startingPrice || 0}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(tpl);
                              setModalType('template');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition"
                            title="Edit Template"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(tpl._id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-transparent transition"
                            title="Delete Template"
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
          {activeTab === 'skills' && (() => {
            const frontendCount = adminSkills.filter((s) => s.category === 'Frontend').length;
            const backendCount = adminSkills.filter((s) => s.category === 'Backend').length;
            const databaseCount = adminSkills.filter((s) => s.category === 'Database').length;
            const aiToolsCount = adminSkills.filter(
              (s) => s.category === 'AI & Tools' || s.category === 'Tools & DevOps'
            ).length;
            const otherCount = adminSkills.filter(
              (s) => !['Frontend', 'Backend', 'Database', 'AI & Tools', 'Tools & DevOps'].includes(s.category)
            ).length;

            const categoryTabs = [
              { id: 'All', label: 'All Skills', count: adminSkills.length },
              { id: 'Frontend', label: '01 FRONTEND', count: frontendCount },
              { id: 'Backend', label: '02 BACKEND', count: backendCount },
              { id: 'Database', label: '03 DATABASE', count: databaseCount },
              { id: 'AI & Tools', label: '04 AI & TOOLS', count: aiToolsCount },
            ];

            if (otherCount > 0) {
              categoryTabs.push({ id: 'Other', label: 'OTHER', count: otherCount });
            }

            const filteredSkills = adminSkills.filter((sk) => {
              if (skillCategoryFilter === 'All') return true;
              if (skillCategoryFilter === 'AI & Tools') {
                return sk.category === 'AI & Tools' || sk.category === 'Tools & DevOps';
              }
              if (skillCategoryFilter === 'Other') {
                return !['Frontend', 'Backend', 'Database', 'AI & Tools', 'Tools & DevOps'].includes(sk.category);
              }
              return sk.category === skillCategoryFilter;
            });

            return (
              <div className="space-y-6">
                {/* Header & Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Skills & Technologies</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                        {adminSkills.length} Total
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Manage skills across the 4 portfolio cards (Frontend, Backend, Database, AI & Tools).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        name: '',
                        category: skillCategoryFilter !== 'All' && skillCategoryFilter !== 'Other' ? skillCategoryFilter : 'Frontend',
                        proficiencyPercentage: 85,
                        levelLabel: 'Proficient',
                        iconName: 'Code',
                        isFeatured: true,
                        displayOrder: adminSkills.length + 1,
                      });
                      setModalType('skill');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categoryTabs.map((tab) => {
                    const isActive = skillCategoryFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSkillCategoryFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                          isActive
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                            : 'bg-white dark:bg-[#0c1322] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Skills Cards Grid */}
                {filteredSkills.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08]">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No skills found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSkills.map((sk) => {
                      const isFrontend = sk.category === 'Frontend';
                      const isBackend = sk.category === 'Backend';
                      const isDatabase = sk.category === 'Database';
                      const isAITools = sk.category === 'AI & Tools' || sk.category === 'Tools & DevOps';

                      const badgeStyle = isFrontend
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                        : isBackend
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : isDatabase
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : isAITools
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';

                      const categoryBadge = isFrontend
                        ? '01 FRONTEND'
                        : isBackend
                        ? '02 BACKEND'
                        : isDatabase
                        ? '03 DATABASE'
                        : isAITools
                        ? '04 AI & TOOLS'
                        : sk.category.toUpperCase();

                      const progressColor = isFrontend
                        ? 'bg-cyan-500'
                        : isBackend
                        ? 'bg-blue-500'
                        : isDatabase
                        ? 'bg-emerald-500'
                        : isAITools
                        ? 'bg-purple-500'
                        : 'bg-amber-500';

                      return (
                        <div
                          key={sk._id}
                          className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none flex flex-col justify-between gap-3 transition hover:border-cyan-500/40 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mb-1.5 ${badgeStyle}`}>
                                {categoryBadge}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                {sk.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingItem({ ...sk });
                                  setModalType('skill');
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
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

                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                              <span>{sk.levelLabel || 'Proficient'}</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {sk.proficiencyPercentage}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                style={{ width: `${sk.proficiencyPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 7: TESTIMONIALS MODERATION */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Moderate client reviews submitted on the public website.
              </span>

              <div className="space-y-4">
                {adminTestimonials.map((t) => (
                  <div
                    key={t._id}
                    className="p-6 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-cyan-500/40"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{t.clientName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {t.clientRole} {t.clientCompany ? `(${t.clientCompany})` : ''}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            t.isApproved
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {t.isApproved ? 'Approved & Visible' : 'Pending Moderation'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">"{t.testimonialText}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleTestimonial(t._id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          t.isApproved
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-transparent'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
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
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:text-rose-300 border border-rose-200 dark:border-transparent transition"
                        title="Delete Review"
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
              {/* Account & Security Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Admin Account Security</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Logged in as <strong className="text-cyan-600 dark:text-cyan-400">{user?.email}</strong> ({user?.role || 'Superadmin'})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setShowPasswordModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition hover:scale-[1.02]"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">General Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={editableProfile.fullName || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, fullName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Professional Title</label>
                      <input
                        type="text"
                        value={editableProfile.headline || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, headline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Supporting Headline</label>
                    <input
                      type="text"
                      value={editableProfile.subHeadline || ''}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, subHeadline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">About Summary</label>
                    <textarea
                      rows={4}
                      value={editableProfile.aboutIntro || ''}
                      onChange={(e) =>
                        setEditableProfile({ ...editableProfile, aboutIntro: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact & WhatsApp Configuration</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                        {profileErrors.email && (
                          <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400">{profileErrors.email}</span>
                        )}
                      </div>
                      <input
                        type="email"
                        value={editableProfile.email || ''}
                        onChange={(e) => {
                          setEditableProfile({ ...editableProfile, email: e.target.value });
                          if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: '' }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border focus:outline-none focus:border-cyan-500 transition text-xs ${
                          profileErrors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                        {profileErrors.phone && (
                          <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400">{profileErrors.phone}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={editableProfile.phone || ''}
                        onChange={(e) => {
                          setEditableProfile({ ...editableProfile, phone: e.target.value });
                          if (profileErrors.phone) setProfileErrors((p) => ({ ...p, phone: '' }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border focus:outline-none focus:border-cyan-500 transition text-xs ${
                          profileErrors.phone ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        WhatsApp Number (int'l digits)
                      </label>
                      <input
                        type="text"
                        value={editableProfile.whatsappNumber || ''}
                        onChange={(e) =>
                          setEditableProfile({ ...editableProfile, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition text-xs"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                    {editingItem.referenceNumber}
                  </span>
                  <button
                    onClick={() => setModalType(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Client Name</span>
                    <span className="text-slate-900 dark:text-white font-semibold text-sm">{editingItem.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Email Address</span>
                    <a
                      href={`mailto:${editingItem.email}`}
                      className="text-cyan-600 dark:text-cyan-400 underline font-semibold"
                    >
                      {editingItem.email}
                    </a>
                  </div>
                  {editingItem.phone && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Phone / WhatsApp</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{editingItem.phone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Service Requested</span>
                    <span className="text-slate-900 dark:text-white font-medium">{editingItem.serviceRequired}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Budget & Target Date</span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {editingItem.budgetRange} • {editingItem.expectedCompletionDate || 'Flexible'}
                    </span>
                  </div>
                  {editingItem.selectedTemplate && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Requested Template</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {editingItem.selectedTemplate}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Project Description</span>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed mt-1">
                      {editingItem.projectDescription}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Internal Notes (Private)</span>
                    <textarea
                      rows={2}
                      value={editingItem.internalNotes || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, internalNotes: e.target.value })
                      }
                      placeholder="Add private note (e.g. called client on Oct 14, agreed on $350)..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs resize-none mt-1 focus:outline-none focus:border-cyan-500 transition"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-slate-200 dark:border-white/[0.08]">
                  <select
                    value={editingItem.status}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      handleUpdateEnquiryStatus(editingItem._id, newSt, editingItem.internalNotes);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border bg-white dark:bg-slate-900 transition ${getStatusBadge(
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
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingItem._id ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Service Title <span className="text-cyan-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="e.g. MERN Stack Custom Development"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Short Description <span className="text-cyan-500">*</span></label>
                    <textarea
                      rows={3}
                      required
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingItem.startingPrice || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            startingPrice: parseFloat(e.target.value) || null,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Category</label>
                      <input
                        type="text"
                        value={editingItem.category || 'Web Development'}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="svcPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="svcPublished" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      Publish publicly on website
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition font-semibold"
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
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20 transition"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: CREATE / EDIT PROJECT */}
          {modalType === 'project' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingItem._id ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Project Title <span className="text-cyan-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const autoSlug = !editingItem._id
                          ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                          : (editingItem.slug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        setEditingItem({ ...editingItem, title: newTitle, slug: autoSlug });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="e.g. EduTrack Portal"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="Full Stack MERN">Full Stack MERN</option>
                      <option value="Frontend Web App">Frontend Web App</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Business Website">Business Website</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Technologies (comma separated)</label>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="React, Tailwind CSS, Node.js, MongoDB"
                    />
                  </div>

                  {/* PROJECT COVER IMAGE: DIRECT FILE UPLOAD ONLY */}
                  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                        Project Photo / Cover Image
                      </label>
                      {editingItem.coverImage && (
                        <button
                          type="button"
                          onClick={() => projectFileInputRef.current?.click()}
                          className="text-cyan-600 dark:text-cyan-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          Change Photo
                        </button>
                      )}
                    </div>

                    <input
                      ref={projectFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileUpload(file, 'coverImage', setUploadingProjectImg);
                        }
                        e.target.value = '';
                      }}
                    />

                    {!editingItem.coverImage ? (
                      <div
                        onClick={() => projectFileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-slate-900/80 rounded-xl p-5 text-center cursor-pointer transition group"
                      >
                        {uploadingProjectImg ? (
                          <div className="flex flex-col items-center justify-center py-2 text-cyan-500">
                            <Loader2 className="w-6 h-6 animate-spin mb-1" />
                            <span className="text-xs font-medium">Uploading & compressing photo...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-2">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                              <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              Click to upload photo from your device
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                              Supports PNG, JPG, JPEG, WEBP, SVG (Auto-compressed)
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> Photo Selected / Uploaded
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, coverImage: '' })}
                            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline text-[11px] font-medium"
                          >
                            <X className="w-3 h-3" /> Remove Photo
                          </button>
                        </div>
                        <div className="relative h-44 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                          <img
                            src={getSafeImageUrl(editingItem.coverImage)}
                            alt="Project Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Image is ready! Click "Save Project" below to save changes.</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Short Description <span className="text-cyan-500">*</span></label>
                    <textarea
                      rows={3}
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Full Case Study / Overview</label>
                    <textarea
                      rows={4}
                      value={editingItem.fullCaseStudy || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, fullCaseStudy: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition resize-none"
                      placeholder="Detailed overview and key architectural decisions..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Live URL</label>
                      <input
                        type="text"
                        value={editingItem.liveUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, liveUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">GitHub URL</label>
                      <input
                        type="text"
                        value={editingItem.githubUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, githubUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="prjPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="prjPublished" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      Publish publicly on website
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingItem.title) {
                        alert('Project title is required');
                        return;
                      }
                      const payload = {
                        ...editingItem,
                        technologies: Array.isArray(editingItem.technologies)
                          ? editingItem.technologies
                          : (editingItem.technologies || '')
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
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
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20 transition"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* MODAL: CREATE / EDIT TEMPLATE */}
          {modalType === 'template' && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingItem._id ? 'Edit Template' : 'Add New Template'}
                  </h3>
                  <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Template Name <span className="text-cyan-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="e.g. ApexCorp Corporate Template"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Category</label>
                      <select
                        value={editingItem.category}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
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
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Starting Price ($)</label>
                      <input
                        type="number"
                        value={editingItem.startingPrice || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            startingPrice: parseFloat(e.target.value) || null,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

                  {/* TEMPLATE THUMBNAIL: URL & DIRECT FILE UPLOAD */}
                  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                        Template Thumbnail Photo
                      </label>
                      <div className="flex items-center bg-slate-200 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setTemplateImageMode('url')}
                          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 font-semibold ${
                            templateImageMode === 'url'
                              ? 'bg-cyan-500 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <LinkIcon className="w-3 h-3" />
                          Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplateImageMode('file')}
                          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 font-semibold ${
                            templateImageMode === 'file'
                              ? 'bg-cyan-500 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    {/* Mode 1: URL input */}
                    {templateImageMode === 'url' ? (
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={editingItem.thumbnail || ''}
                            onChange={(e) =>
                              setEditingItem({ ...editingItem, thumbnail: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:border-cyan-500 focus:outline-none transition"
                            placeholder="Paste photo URL (e.g. https://images.unsplash.com/...)"
                          />
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Paste any web image URL from Unsplash, Imgur, Cloudinary, etc.
                        </p>
                      </div>
                    ) : (
                      /* Mode 2: File Upload input */
                      <div>
                        <input
                          ref={templateFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageFileUpload(file, 'thumbnail', setUploadingTemplateImg);
                            }
                            e.target.value = '';
                          }}
                        />
                        <div
                          onClick={() => templateFileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-white dark:bg-slate-900/80 rounded-xl p-4 text-center cursor-pointer transition group"
                        >
                          {uploadingTemplateImg ? (
                            <div className="flex flex-col items-center justify-center py-2 text-cyan-500">
                              <Loader2 className="w-6 h-6 animate-spin mb-1" />
                              <span className="text-xs font-medium">Uploading photo from device...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-1">
                              <div className="w-9 h-9 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                                <Upload className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                Click to select image from your computer / device
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Supports PNG, JPG, JPEG, WEBP, SVG (Max 5MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Live Image Preview (when image is present) */}
                    {editingItem.thumbnail && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> Photo Selected / Preview
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, thumbnail: '' })}
                            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline text-[11px] font-medium"
                          >
                            <X className="w-3 h-3" /> Remove Photo
                          </button>
                        </div>
                        <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                          <img
                            src={getSafeImageUrl(editingItem.thumbnail)}
                            alt="Template Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Thumbnail is ready! Click "Save Template" below to save changes.</span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Short Description <span className="text-cyan-500">*</span></label>
                    <textarea
                      rows={3}
                      value={editingItem.shortDescription}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, shortDescription: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition resize-none"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="tplPublished"
                      checked={editingItem.isPublished}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, isPublished: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="tplPublished" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                      Publish publicly on website
                    </label>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingItem.name) {
                        alert('Template name is required');
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
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 transition"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* HAMBURGER SLIDE-OVER NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel (Slides in from Right) */}
            <div className="relative w-full max-w-xs bg-white dark:bg-[#0a0f1d] border-l border-slate-200 dark:border-white/[0.08] p-5 shadow-2xl flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]">
                      <img
                        src="/vm-logo-ring-transparent.png"
                        alt="Mr. Vikas Maurya"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        Admin Menu
                      </span>
                      <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block truncate max-w-[150px]">
                        {user?.email || 'admin@vikasmaurya.dev'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                    title="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Navigation Links */}
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Jump To Section
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.count > 0 && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 mt-6 border-t border-slate-200 dark:border-white/[0.08] space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setShowPasswordModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                >
                  <KeyRound className="w-4 h-4 text-cyan-500" />
                  <span>Change Password</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View Live Website</span>
                  </div>
                </a>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CHANGE ADMIN PASSWORD */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Change Admin Password
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Update your login password for {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alerts */}
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                {/* Current Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                    Current Password <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Enter existing password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                    New Password <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Must be at least 8 characters long with letters/numbers.
                  </span>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                    Confirm New Password <span className="text-cyan-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="Re-type new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
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
                      Skill Name <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="e.g. Next.js, Claude AI, TypeScript, Docker"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                      Category <span className="text-cyan-500">*</span>
                    </label>
                    <select
                      value={editingItem.category || 'Frontend'}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="Frontend">Frontend (Card 01)</option>
                      <option value="Backend">Backend (Card 02)</option>
                      <option value="Database">Database (Card 03)</option>
                      <option value="AI & Tools">AI & Tools (Card 04)</option>
                      <option value="Tools & DevOps">Tools & DevOps</option>
                      <option value="Programming Languages">Programming Languages</option>
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Level Label</label>
                      <select
                        value={editingItem.levelLabel || 'Proficient'}
                        onChange={(e) => setEditingItem({ ...editingItem, levelLabel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
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
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Icon Style</label>
                    <select
                      value={editingItem.iconName || 'Code'}
                      onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 transition"
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
                      <option value="Cpu">Cpu (Claude AI / Hardware / C++)</option>
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
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
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
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition"
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
