import express from 'express';
import { body } from 'express-validator';
import {
  getAllTemplates,
  getAllTemplatesAdmin,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/admin/all', protectAdmin, getAllTemplatesAdmin);
router.get('/:slug', getTemplateBySlug);

router.post(
  '/',
  protectAdmin,
  [
    body('name').notEmpty().withMessage('Template name is required'),
    body('category').notEmpty().withMessage('Template category is required'),
    body('shortDescription').notEmpty().withMessage('Short description is required'),
  ],
  handleValidationErrors,
  createTemplate
);

router.put('/:id', protectAdmin, updateTemplate);
router.delete('/:id', protectAdmin, deleteTemplate);

export default router;
