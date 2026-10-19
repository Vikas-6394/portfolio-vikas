import express from 'express';
import { body } from 'express-validator';
import {
  submitEnquiry,
  sendOtp,
  verifyOtp,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
  getEnquiryStats,
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { enquiryRateLimiter } from '../middleware/rateLimiter.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/',
  enquiryRateLimiter,
  [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 2, max: 80 }).withMessage('Full name must be between 2 and 80 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Valid email address is required')
      .matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)
      .withMessage('Please provide a valid email format with domain extension (e.g. user@gmail.com, user@outlook.com)'),
    body('phone')
      .trim()
      .notEmpty().withMessage('Mobile number is required')
      .custom((val) => {
        const cleaned = String(val).replace(/\D/g, '').slice(-10);
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
          throw new Error('Valid 10-digit Indian mobile number is required starting with 6, 7, 8, or 9');
        }
        if (/^(\d)\1{9}$/.test(cleaned)) {
          throw new Error('Please provide a genuine mobile number, not repeated digits');
        }
        return true;
      }),
    body('serviceRequired').notEmpty().withMessage('Please select a service'),
    body('projectDescription').trim().isLength({ min: 10 }).withMessage('Please provide at least 10 characters describing your project'),
    body('privacyConsent').custom((val) => val === true || val === 'true').withMessage('You must agree to the privacy policy'),
  ],
  handleValidationErrors,
  submitEnquiry
);

router.post(
  '/send-otp',
  enquiryRateLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required')
      .matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)
      .withMessage('Please provide a valid email address with a valid domain'),
    body('phone')
      .trim()
      .notEmpty().withMessage('Mobile number is required')
      .custom((val) => {
        const cleaned = String(val).replace(/\D/g, '').slice(-10);
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
          throw new Error('Valid 10-digit Indian mobile number is required (starting with 6, 7, 8, or 9)');
        }
        return true;
      }),
  ],
  handleValidationErrors,
  sendOtp
);

router.post(
  '/verify-otp',
  enquiryRateLimiter,
  [
    body('email').trim().notEmpty().withMessage('Email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Verification code must be exactly 6 digits'),
  ],
  handleValidationErrors,
  verifyOtp
);

router.get('/', protectAdmin, getAllEnquiries);
router.get('/stats', protectAdmin, getEnquiryStats);
router.get('/:id', protectAdmin, getEnquiryById);
router.patch('/:id/status', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

export default router;
