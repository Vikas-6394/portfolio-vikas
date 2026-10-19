import express from 'express';
import { body } from 'express-validator';
import {
  getAllServices,
  getAllServicesAdmin,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/admin/all', protectAdmin, getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);

router.post(
  '/',
  protectAdmin,
  [
    body('title').notEmpty().withMessage('Service title is required'),
    body('shortDescription').notEmpty().withMessage('Short description is required'),
  ],
  handleValidationErrors,
  createService
);

router.put('/:id', protectAdmin, updateService);
router.delete('/:id', protectAdmin, deleteService);

export default router;
