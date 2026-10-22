import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/formValidation';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-warm backend immediately when admin login page loads
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      fetch(`${baseUrl}/health`, { cache: 'no-cache' }).catch(() => { });
    } catch { }

    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateField = (field, value) => {
    if (field === 'email') {
      const res = validateEmail(value);
      return res.isValid ? '' : res.error;
    }
    if (field === 'password') {
      const trimmed = String(value).trim();
      if (!trimmed) return 'Password is required.';
      if (trimmed.length < 6) return 'Password must be at least 6 characters.';
      return '';
    }
    return '';
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (touched.email) {
      const err = validateField('email', val);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next.email = err;
        else delete next.email;
        return next;
      });
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (touched.password) {
      const err = validateField('password', val);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next.password = err;
        else delete next.password;
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'email' ? email : password;
    const err = validateField(field, val);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailErr = validateField('email', email);
    const passErr = validateField('password', password);

    if (emailErr || passErr) {
      setFieldErrors({
        ...(emailErr && { email: emailErr }),
        ...(passErr && { password: passErr }),
      });
      setTouched({ email: true, password: true });
      return;
    }

    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Mr. Vikas Maurya Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/10">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Administrative Portal</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Authorized access only. All actions and IP logins are strictly audited.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300">
                  Admin Email
                </label>
                {touched.email && fieldErrors.email && (
                  <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 animate-in fade-in">
                    {fieldErrors.email}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white dark:bg-slate-900 border text-slate-900 dark:text-white text-xs focus:outline-none transition ${touched.email && fieldErrors.email
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500'
                    }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300">
                  Password
                </label>
                {touched.password && fieldErrors.password && (
                  <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 animate-in fade-in">
                    {fieldErrors.password}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 hover:bg-white focus:bg-white dark:bg-slate-900 border text-slate-900 dark:text-white text-xs focus:outline-none transition ${touched.password && fieldErrors.password
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                    : 'border-slate-300 dark:border-slate-700 focus:border-cyan-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/[0.06] text-center">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 transition font-medium">
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
