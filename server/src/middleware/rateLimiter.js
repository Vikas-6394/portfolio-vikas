import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';

const isDevOrLocal = (req) => {
  if (ENV.NODE_ENV === 'development') return true;
  const ip = req.ip || req.connection?.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

export const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 submissions per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrLocal,
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP. Please wait 15 minutes before sending another message or contact directly via WhatsApp.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // max 30 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevOrLocal,
  message: {
    success: false,
    message: 'Too many login attempts. For security reasons, please wait 15 minutes before trying again.',
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // generous rate limit for regular page browsing
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Never block auth routes or dev/local environments
    if (req.path.startsWith('/auth') || req.originalUrl?.includes('/api/auth')) return true;
    return isDevOrLocal(req);
  },
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

