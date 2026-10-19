import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Check } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
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
} from '../../utils/formValidation';
import { OtpVerificationModal } from './OtpVerificationModal';

export const HireMeModal = ({ isOpen, onClose, initialService = '', initialTemplate = '' }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceRequired: initialService || 'Personal Portfolio Websites',
    budgetRange: '$150 - $500',
    projectDescription: '',
    selectedTemplate: initialTemplate || '',
    privacyConsent: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '', ref: '' });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

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

    // For phone: restrict to 10 digits
    if (name === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Real-time validation: clear/update error as user types
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

  // Called when user clicks "Send Project Proposal"
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '', ref: '' });

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

  // Callback from OtpVerificationModal
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
    setStatus({ type: '', message: '', ref: '' });

    const submissionPayload = {
      ...formData,
      phone: normalizeIndianPhone(formData.phone),
      verificationToken: token || verificationToken,
    };

    try {
      const res = await portfolioAPI.submitEnquiry(submissionPayload);
      if (res.data.success) {
        setStatus({
          type: 'success',
          message: res.data.message,
          ref: res.data.referenceNumber,
        });

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Failed to submit enquiry. Please verify your details or message Mr. Vikas Maurya via WhatsApp.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 p-6 md:p-8 shadow-2xl transition-colors">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
              Project Proposal
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Let's Build Something Great</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Fill in your project requirements. Mr. Vikas Maurya will review and send you a proposal within 24 hours.
            </p>
          </div>

          {status.type === 'success' ? (
            <div className="p-6 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 text-center my-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Enquiry Sent Successfully!</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{status.message}</p>
              </div>
              <div className="bg-white dark:bg-slate-900/80 px-4 py-2.5 rounded-xl inline-block border border-cyan-500/20">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Enquiry Reference:</span>
                <span className="text-base font-mono font-bold text-cyan-600 dark:text-cyan-400">{status.ref}</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-95 shadow-md shadow-cyan-500/20 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {status.type === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500 dark:text-rose-400" />
                  <span>{status.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Full Name <span className="text-cyan-500">*</span>
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
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${
                      touched.fullName && errors.fullName
                        ? 'border border-rose-500 ring-1 ring-rose-500/20'
                        : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
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
                    placeholder="rahul@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${
                      touched.email && errors.email
                        ? 'border border-rose-500 ring-1 ring-rose-500/20'
                        : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number (Exactly 10 Digits, Indian Format) */}
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
                    <span className="inline-flex items-center px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border-r border-slate-300 dark:border-slate-700/80 select-none">
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
                      placeholder="9876543210"
                      className={`w-full px-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition placeholder:text-slate-400 focus:outline-none ${
                        touched.phone && errors.phone ? 'border-l border-rose-500 ring-1 ring-rose-500/20' : ''
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone ? (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white border border-slate-300 dark:border-slate-700/80 text-sm focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="Personal Portfolio Websites">Personal Portfolio Websites</option>
                    <option value="Business Websites">Business Websites</option>
                    <option value="Landing Pages">Landing Pages</option>
                    <option value="Coaching and Education Websites">Coaching and Education Websites</option>
                    <option value="E-commerce Websites">E-commerce Websites</option>
                    <option value="React & MERN Stack Development">React & MERN Stack Development</option>
                    <option value="Website Redesign">Website Redesign</option>
                    <option value="Bug Fixing & Performance">Bug Fixing & Performance</option>
                  </select>
                </div>
              </div>

              {formData.selectedTemplate && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
                  <span>
                    Requested Template: <strong>{formData.selectedTemplate}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, selectedTemplate: '' }))}
                    className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget Range (Estimated)
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white border border-slate-300 dark:border-slate-700/80 text-sm focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="$100 - $300">$100 - $300 (Standard Portfolio / Landing Page)</option>
                  <option value="$300 - $600">$300 - $600 (Business Site / Coaching Portal)</option>
                  <option value="$600 - $1,200">$600 - $1,200 (E-commerce / Full MERN App)</option>
                  <option value="$1,200+">$1,200+ (Custom Enterprise Solution)</option>
                  <option value="Flexible">Flexible / Discuss Later</option>
                </select>
              </div>

              {/* Project Details */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Project Details & Requirements <span className="text-cyan-500">*</span>
                  </label>
                  <span className={`text-[11px] font-medium ${formData.projectDescription.length >= 10 ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {formData.projectDescription.length}/10 chars min
                  </span>
                </div>
                <textarea
                  name="projectDescription"
                  rows={4}
                  value={formData.projectDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Briefly describe what kind of website you need, target audience, required features, or reference links..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white text-slate-900 dark:bg-slate-900/80 dark:text-white text-sm transition resize-none placeholder:text-slate-400 focus:outline-none ${
                    touched.projectDescription && errors.projectDescription
                      ? 'border border-rose-500 ring-1 ring-rose-500/20'
                      : 'border border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20'
                  }`}
                ></textarea>
                {touched.projectDescription && errors.projectDescription && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.projectDescription}</span>
                  </p>
                )}
              </div>

              {/* Verified Badge if already verified */}
              {isVerified && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold">Contact Details Verified via OTP</span>
                </div>
              )}

              {/* Privacy Policy Checkbox */}
              <div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modalPrivacyConsent"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                  />
                  <label htmlFor="modalPrivacyConsent" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    I agree to the privacy policy and consent to being contacted regarding this enquiry. <span className="text-cyan-500">*</span>
                  </label>
                </div>
                {touched.privacyConsent && errors.privacyConsent && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.privacyConsent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Project Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
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
