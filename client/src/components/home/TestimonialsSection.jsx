import React, { useState } from 'react';
import { MessageSquare, Star, Quote, PlusCircle, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioAPI } from '../../services/api';

export const TestimonialsSection = () => {
  const { testimonials } = usePortfolio();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    testimonialText: '',
    rating: 5,
    projectTitle: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, val) => {
    if (name === 'clientName') {
      const trimmed = String(val).trim();
      if (!trimmed) return 'Your name is required.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (/[0-9]/.test(trimmed)) return 'Name cannot contain numbers.';
      return '';
    }
    if (name === 'testimonialText') {
      const trimmed = String(val).trim();
      if (!trimmed) return 'Testimonial content is required.';
      if (trimmed.length < 15) return `Testimonial must be at least 15 characters (${trimmed.length}/15 entered).`;
      return '';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setSubmitForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[field] = err;
        else delete next[field];
        return next;
      });
    }
  };

  const handleInputBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, submitForm[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateField('clientName', submitForm.clientName);
    const textErr = validateField('testimonialText', submitForm.testimonialText);

    if (nameErr || textErr) {
      setErrors({
        ...(nameErr && { clientName: nameErr }),
        ...(textErr && { testimonialText: textErr }),
      });
      setTouched({ clientName: true, testimonialText: true });
      return;
    }

    setLoading(true);
    try {
      const res = await portfolioAPI.submitTestimonial(submitForm);
      if (res.data.success) {
        setSubmitted(true);
        setErrors({});
        setTouched({});
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting testimonial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 border-t border-slate-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <MessageSquare className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Client Reviews</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            What Clients <span className="text-gradient">Say</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Genuine feedback and ratings from business owners and founders who worked with me.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          type="button"
          className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-amber-500/40 dark:text-amber-300 text-xs font-semibold flex items-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Leave a Review</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((review) => (
          <div
            key={review._id || review.clientName}
            className="p-6 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] hover:border-amber-500/30 shadow-sm dark:shadow-none transition duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <Quote className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-2 opacity-70" />
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                "{review.testimonialText}"
              </p>
            </div>

            {/* Client info */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 overflow-hidden flex-shrink-0">
                <img
                  src={
                    review.clientAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={review.clientName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{review.clientName}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {review.clientRole} {review.clientCompany ? `• ${review.clientCompany}` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Submit Your Feedback</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              All reviews undergo quick admin moderation before publishing.
            </p>

            {submitted ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Thank You!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 mb-4">
                  Your feedback has been received and will be published after verification.
                </p>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-xs font-bold shadow-md hover:bg-cyan-600 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Your Name *</label>
                    {touched.clientName && errors.clientName && (
                      <span className="text-[11px] font-semibold text-rose-500 animate-in fade-in">{errors.clientName}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={submitForm.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    onBlur={() => handleInputBlur('clientName')}
                    className={`w-full px-3 py-2 rounded-lg bg-slate-50 hover:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border text-xs focus:outline-none transition ${
                      touched.clientName && errors.clientName
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:border-amber-500'
                    }`}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <input
                      type="text"
                      value={submitForm.clientRole}
                      onChange={(e) => setSubmitForm({ ...submitForm, clientRole: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 hover:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 transition"
                      placeholder="e.g. Founder"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={submitForm.clientCompany}
                      onChange={(e) => setSubmitForm({ ...submitForm, clientCompany: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 hover:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 transition"
                      placeholder="e.g. Apex Classes"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={submitForm.rating}
                    onChange={(e) => setSubmitForm({ ...submitForm, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 hover:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value={3}>⭐⭐⭐ 3 Stars - Good</option>
                    <option value={2}>⭐⭐ 2 Stars - Fair</option>
                    <option value={1}>⭐ 1 Star - Poor</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Your Testimonial *</label>
                    {touched.testimonialText && errors.testimonialText && (
                      <span className="text-[11px] font-semibold text-rose-500 animate-in fade-in">{errors.testimonialText}</span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={submitForm.testimonialText}
                    onChange={(e) => handleInputChange('testimonialText', e.target.value)}
                    onBlur={() => handleInputBlur('testimonialText')}
                    className={`w-full px-3 py-2 rounded-lg bg-slate-50 hover:bg-white text-slate-900 dark:bg-slate-900 dark:text-white border text-xs resize-none focus:outline-none transition ${
                      touched.testimonialText && errors.testimonialText
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                        : 'border-slate-300 dark:border-slate-700 focus:border-amber-500'
                    }`}
                    placeholder="Share your experience working with Mr. Vikas Maurya..."
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
