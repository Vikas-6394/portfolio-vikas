import express from 'express';
import { body } from 'express-validator';
import { login, getMe, logout, setupInitialAdmin, changePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/login',
  authRateLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Valid email is required')
      .matches(/^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)
      .withMessage('Valid email address with proper domain is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

router.get('/me', protectAdmin, getMe);
router.post('/logout', logout);

router.put(
  '/change-password',
  protectAdmin,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long'),
  ],
  handleValidationErrors,
  changePassword
);

// One-time setup of admin account if zero accounts exist
router.post(
  '/setup-admin',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('setupSecret').notEmpty().withMessage('Setup secret key is required'),
  ],
  handleValidationErrors,
  setupInitialAdmin
);

export default router;
