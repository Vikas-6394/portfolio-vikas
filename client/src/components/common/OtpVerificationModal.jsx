import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { portfolioAPI } from '../../services/api';

export const OtpVerificationModal = ({
  isOpen,
  onClose,
  email,
  phone,
  fullName,
  onVerified,
}) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(30);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const inputRefs = useRef([]);

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && email && phone) {
      handleRequestOtp();
    } else {
      setOtpDigits(['', '', '', '', '', '']);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleRequestOtp = async () => {
    setResending(true);
    setError('');
    try {
      const res = await portfolioAPI.sendOtp({
        email,
        phone,
        fullName,
      });

      if (res.data.simulatedOtp) {
        setSimulatedOtp(res.data.simulatedOtp);
      }
      setTimer(30);
      setSuccessMsg('A 6-digit verification code was sent to your contact details.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to send verification code. Please check your network and try again.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // User pasted full code
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setError('');

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (simulatedOtp && simulatedOtp.length === 6) {
      setOtpDigits(simulatedOtp.split(''));
      setError('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await portfolioAPI.verifyOtp({
        email,
        phone,
        otp: enteredCode,
      });

      if (res.data.success && res.data.verified) {
        setSuccessMsg('Verified successfully!');
        setTimeout(() => {
          onVerified(res.data.verificationToken);
        }, 500);
      } else {
        setError(res.data.message || 'Verification failed. Please check the code.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
            Instant Verification
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Verify Contact Details
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Enter the 6-digit code sent to confirm your identity & secure your enquiry:
          </p>
          <div className="mt-2.5 inline-flex flex-col sm:flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            <span className="text-cyan-600 dark:text-cyan-400">{email}</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400">+91 {phone}</span>
          </div>
        </div>

        {/* Simulated Demo OTP Pill */}
        {simulatedOtp && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Demo Code: <strong className="font-mono tracking-wider">{simulatedOtp}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-500/20 hover:bg-amber-300 dark:hover:bg-amber-500/30 font-semibold text-[11px] transition text-amber-900 dark:text-amber-200"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 sm:gap-2.5">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold font-mono rounded-xl border bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white transition focus:outline-none ${
                  digit
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/30 dark:bg-cyan-950/20'
                    : 'border-slate-300 dark:border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {/* Resend Action */}
          <div className="text-center text-xs">
            {timer > 0 ? (
              <span className="text-slate-500 dark:text-slate-400">
                Resend code in <strong className="text-cyan-500 font-mono">{timer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Sending...' : 'Resend Verification Code'}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading || otpDigits.join('').length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Submit Enquiry</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onVerified('')}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/[0.04] transition"
            >
              Skip Verification & Submit Directly
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
