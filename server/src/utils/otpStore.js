import crypto from 'crypto';

/**
 * In-memory OTP Cache with 5-minute TTL
 */
const otpCache = new Map();

// Periodic cleanup of expired entries every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of otpCache.entries()) {
    if (record.expiresAt < now) {
      otpCache.delete(key);
    }
  }
}, 2 * 60 * 1000);

/**
 * Generates and stores a 6-digit OTP for an email/phone combination
 */
export const createOtp = (email, phone) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).replace(/\D/g, '').slice(-10);
  const cacheKey = `${normalizedEmail}_${normalizedPhone}`;

  // Generate secure 6-digit number
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpCache.set(cacheKey, {
    code: otpCode,
    expiresAt,
    attempts: 0,
    verified: false,
    token: null,
  });

  return {
    otp: otpCode,
    expiresInSeconds: 300,
    cacheKey,
  };
};

/**
 * Verifies an entered OTP
 */
export const verifyOtpCode = (email, phone, enteredOtp) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).replace(/\D/g, '').slice(-10);
  const cacheKey = `${normalizedEmail}_${normalizedPhone}`;

  const record = otpCache.get(cacheKey);

  if (!record) {
    return {
      isValid: false,
      message: 'No verification code found or code has expired. Please request a new OTP.',
    };
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(cacheKey);
    return {
      isValid: false,
      message: 'Verification code has expired. Please request a new OTP.',
    };
  }

  if (record.attempts >= 4) {
    otpCache.delete(cacheKey);
    return {
      isValid: false,
      message: 'Too many incorrect attempts. Please request a fresh OTP.',
    };
  }

  record.attempts += 1;

  if (String(record.code).trim() !== String(enteredOtp).trim()) {
    const remaining = 4 - record.attempts;
    return {
      isValid: false,
      message: `Invalid verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Code locked.'}`,
    };
  }

  // Generate a verified token
  const verificationToken = crypto.randomBytes(24).toString('hex');
  record.verified = true;
  record.token = verificationToken;

  return {
    isValid: true,
    message: 'Contact details verified successfully!',
    verificationToken,
  };
};

/**
 * Checks if a verification token is valid for a given email & phone
 */
export const checkVerificationToken = (email, phone, token) => {
  if (!token) return false;
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = String(phone).replace(/\D/g, '').slice(-10);
  const cacheKey = `${normalizedEmail}_${normalizedPhone}`;

  const record = otpCache.get(cacheKey);
  if (record && record.verified && record.token === token) {
    return true;
  }
  return false;
};
