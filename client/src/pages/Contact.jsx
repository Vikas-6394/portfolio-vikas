import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ShieldCheck,
  Calendar,
  DollarSign,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioAPI } from '../services/api';
import confetti from 'canvas-confetti';
import {
  validateEnquiryForm,
  validateFullName,
  validateEmail,
  validateIndianMobile,
  validateProjectDescription,
  validateServiceRequired,
  validatePrivacyConsent,
  normalizeIndianPhone,
} from '../utils/formValidation';
import { OtpVerificationModal } from '../components/common/OtpVerificationModal';

export const Contact = () => {
  const { profile } = usePortfolio();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const prefillService = queryParams.get('service') || 'Personal Portfolio Websites';
  const prefillTemplate = queryParams.get('template') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceRequired: prefillService,
    budgetRange: '$150 - $500',
    expectedCompletionDate: 'Within 2-3 weeks',
    projectDescription: '',
    selectedTemplate: prefillTemplate,
    privacyConsent: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ type: '', message: '', ref: '' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (prefillService) {
      setFormData((prev) => ({ ...prev, serviceRequired: prefillService }));
    }
    if (prefillTemplate) {
      setFormData((prev) => ({ ...prev, selectedTemplate: prefillTemplate }));
    }
  }, [prefillService, prefillTemplate]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return validateFullName(value).error;
      case 'email':
        return validateEmail(value).error;
      case 'phone':
        return validateIndianMobile(value, true).error;
      case 'serviceRequired':
        return validateServiceRequired(value).error;
      case 'projectDescription':
        return validateProjectDescription(value).error;
      case 'privacyConsent':
        return validatePrivacyConsent(value).error;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // For phone: restrict to 10 numeric digits
    if (name === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Real-time error removal as user corrects input
    if (touched[name]) {
      const fieldError = validateField(name, val);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[name] = fieldError;
        } else {
          delete next[name];
        }
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, val);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[name] = fieldError;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  // OTP verification toggle (set to true to re-enable OTP verification in the future)
  const ENABLE_OTP_VERIFICATION = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult({ type: '', message: '', ref: '' });

    // Validate all fields
    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        serviceRequired: true,
        projectDescription: true,
        privacyConsent: true,
      });
      return;
    }

    // If OTP verification is enabled and contact is not yet verified
    if (ENABLE_OTP_VERIFICATION && !isVerified) {
      setShowOtpModal(true);
      return;
    }

    // Direct submission without OTP verification
    executeSubmission(verificationToken);
  };

  const handleOtpVerified = (token) => {
    setShowOtpModal(false);
    if (token) {
      setVerificationToken(token);
      setIsVerified(true);
    }
    executeSubmission(token);
  };

  const executeSubmission = async (token = '') => {
    setLoading(true);
    setResult({ type: '', message: '', ref: '' });

    const submissionPayload = {
      ...formData,
      phone: normalizeIndianPhone(formData.phone),
      verificationToken: token || verificationToken,
    };

    try {
      const res = await portfolioAPI.submitEnquiry(submissionPayload);
      if (res.data.success) {
        setResult({
          type: 'success',
          message: res.data.message,
          ref: res.data.referenceNumber,
        });

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) { }
      }
    } catch (err) {
      setResult({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Failed to send message. Please verify your details or message Mr. Vikas Maurya directly via WhatsApp.',
      });
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${profile?.whatsappNumber || '916394195771'}?text=${encodeURIComponent(
    `Hello Mr. Vikas Maurya, I would like to enquire about your website development services.`
  )}`;

  return (
    <>
      <Helmet>
        <title>Contact Mr. Vikas Maurya | Hire Web Developer</title>
        <meta
          name="description"
          content="Get in touch with Mr. Vikas Maurya for website design, MERN stack web development, responsive portfolios, and business portals. Quick response within 24 hours."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
            Start a Conversation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Let's Discuss Your <span className="text-gradient">Next Project</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Have an idea for a business website, coaching portal, or full-stack application? Fill out the project details below and I will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
          {/* Direct Contact Cards */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Direct Contacts</h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${profile?.email || 'vikasmaurya195771@gmail.com'}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Email Address</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                      {profile?.email || 'vikasmaurya195771@gmail.com'}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${profile?.phone || '+916394195771'}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.04] text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Phone / Mobile</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                      {profile?.phone || '+91 6394195771'}
                    </span>
                  </div>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Direct WhatsApp</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
                      Instant Chat Available
                    </span>
                  </div>
                </a>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/[0.06] space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <span>Response Time: Typically within 2 to 4 hours</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>100% Privacy Protected & Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-2xl">
              {result.type === 'success' ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Enquiry Received!</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">{result.message}</p>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-cyan-500/30 inline-block font-mono text-cyan-600 dark:text-cyan-400 text-sm">
                    Reference Code: <strong>{result.ref}</strong>
                  </div>
                  <p className="text-xs text-slate-500">
                    A confirmation has been recorded and an email notification has been dispatched.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setResult({ type: '', message: '', ref: '' })
                      }
                      className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-semibold transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {result.type === 'error' && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500 dark:text-rose-400" />
                      <span>{result.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Full Name <span className="text-cyan-500">*</span>
                        </label>
                        {touched.fullName && !errors.fullName && formData.fullName && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}

                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${touched.fullName && errors.fullName
                          ? 'border border-rose-500 ring-1 ring-rose-500/20'
                          : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                          }`}
                      />
                      {touched.fullName && errors.fullName && (
                        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Email Address <span className="text-cyan-500">*</span>
                        </label>
                        {touched.email && !errors.email && formData.email && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Valid Email
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}

                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${touched.email && errors.email
                          ? 'border border-rose-500 ring-1 ring-rose-500/20'
                          : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                          }`}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Mobile Number (Exactly 10 Digits) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Mobile Number <span className="text-cyan-500">*</span>
                        </label>
                        {touched.phone && !errors.phone && formData.phone.length === 10 && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Valid 10-Digit
                          </span>
                        )}
                      </div>
                      <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700/80 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/20">
                        <span className="inline-flex items-center px-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border-r border-slate-300 dark:border-slate-700/80 select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          inputMode="numeric"
                          maxLength={10}
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${touched.phone && errors.phone ? 'border-l border-rose-500 ring-1 ring-rose-500/20' : ''
                            }`}
                        />
                      </div>
                      {touched.phone && errors.phone ? (
                        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      ) : (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                          Exactly 10 digits starting with 6, 7, 8, or 9
                        </span>
                      )}
                    </div>

                    {/* Service Required */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Service Required <span className="text-cyan-500">*</span>
                      </label>
                      <select
                        name="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white border border-slate-300 dark:border-slate-700/80 text-sm focus:outline-none focus:border-cyan-500 transition"
                      >
                        <option value="Personal Portfolio Websites">Personal Portfolio Websites</option>
                        <option value="Business Websites">Business Websites</option>
                        <option value="Landing Pages">Landing Pages</option>
                        <option value="Coaching and Education Websites">Coaching and Education Websites</option>
                        <option value="E-commerce Websites">E-commerce Websites</option>
                        <option value="React & MERN Stack Development">React & MERN Stack Development</option>
                        <option value="Website Redesign">Website Redesign</option>
                        <option value="Bug Fixing and Performance Optimization">Bug Fixing and Performance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Estimated Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white border border-slate-300 dark:border-slate-700/80 text-sm focus:outline-none focus:border-cyan-500 transition"
                      >
                        <option value="$100 - $300">$100 - $300 (Portfolio / Landing Page)</option>
                        <option value="$300 - $600">$300 - $600 (Business Site / Coaching Portal)</option>
                        <option value="$600 - $1,200">$600 - $1,200 (E-commerce / MERN App)</option>
                        <option value="$1,200+">$1,200+ (Custom Solution)</option>
                        <option value="Flexible">Flexible / Open for discussion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Target Completion Date
                      </label>
                      <input
                        type="text"
                        name="expectedCompletionDate"
                        value={formData.expectedCompletionDate}
                        onChange={handleChange}

                        className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white border border-slate-300 dark:border-slate-700/80 text-sm focus:outline-none focus:border-cyan-500 transition placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {formData.selectedTemplate && (
                    <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
                      <span>Selected Template Design: <strong>{formData.selectedTemplate}</strong></span>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, selectedTemplate: '' }))}
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Project Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Project Description & Requirements <span className="text-cyan-500">*</span>
                      </label>
                      <span className={`text-[11px] font-medium ${formData.projectDescription.length >= 10 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {formData.projectDescription.length}/10 chars min
                      </span>
                    </div>
                    <textarea
                      name="projectDescription"
                      rows={5}
                      value={formData.projectDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Please share details about your website requirements, target audience, preferred pages, or any reference links you like..."
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition resize-none placeholder:text-slate-400 focus:outline-none ${touched.projectDescription && errors.projectDescription
                        ? 'border border-rose-500 ring-1 ring-rose-500/20'
                        : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                        }`}
                    ></textarea>
                    {touched.projectDescription && errors.projectDescription && (
                      <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.projectDescription}</span>
                      </p>
                    )}
                  </div>

                  {/* Verified Badge */}
                  {isVerified && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold">Contact Details Verified via OTP</span>
                    </div>
                  )}

                  {/* Privacy Policy */}
                  <div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="pagePrivacyConsent"
                        name="privacyConsent"
                        checked={formData.privacyConsent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                      />
                      <label htmlFor="pagePrivacyConsent" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                        I have read and agree to the{' '}
                        <a href="/privacy-policy" target="_blank" className="text-cyan-600 dark:text-cyan-400 underline font-medium">
                          privacy policy
                        </a>{' '}
                        and consent to receiving a project proposal via email or WhatsApp. <span className="text-cyan-500">*</span>
                      </label>
                    </div>
                    {touched.privacyConsent && errors.privacyConsent && (
                      <p className="mt-1 text-xs text-rose-500 font-medium">{errors.privacyConsent}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Your Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal (Disabled for now - retained for future re-enabling) */}
      {ENABLE_OTP_VERIFICATION && (
        <OtpVerificationModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={formData.email}
          phone={normalizeIndianPhone(formData.phone)}
          fullName={formData.fullName}
          onVerified={handleOtpVerified}
        />
      )}
    </>
  );
};
