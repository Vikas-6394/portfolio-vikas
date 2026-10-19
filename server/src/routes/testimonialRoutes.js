import express from 'express';
import { body } from 'express-validator';
import {
  getApprovedTestimonials,
  getAllTestimonialsAdmin,
  submitTestimonial,
  toggleApproval,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getApprovedTestimonials);
router.get('/admin/all', protectAdmin, getAllTestimonialsAdmin);

router.post(
  '/',
  [
    body('clientName')
      .trim()
      .notEmpty().withMessage('Your name is required')
      .isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters'),
    body('testimonialText')
      .trim()
      .notEmpty().withMessage('Testimonial content is required')
      .isLength({ min: 15, max: 1000 }).withMessage('Testimonial must be between 15 and 1000 characters'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5 stars'),
  ],
  handleValidationErrors,
  submitTestimonial
);

router.post(
  '/admin/create',
  protectAdmin,
  [
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('testimonialText').notEmpty().withMessage('Testimonial text is required'),
  ],
  handleValidationErrors,
  createTestimonial
);

router.patch('/:id/toggle-approval', protectAdmin, toggleApproval);
router.put('/:id', protectAdmin, updateTestimonial);
router.delete('/:id', protectAdmin, deleteTestimonial);

export default router;
