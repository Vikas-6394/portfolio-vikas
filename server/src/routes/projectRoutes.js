import express from 'express';
import { body } from 'express-validator';
import {
  getAllProjects,
  getAllProjectsAdmin,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/admin/all', protectAdmin, getAllProjectsAdmin);
router.get('/:slug', getProjectBySlug);

router.post(
  '/',
  protectAdmin,
  [
    body('title').notEmpty().withMessage('Project title is required'),
    body('shortDescription').notEmpty().withMessage('Short description is required'),
  ],
  handleValidationErrors,
  createProject
);

router.put('/:id', protectAdmin, updateProject);
router.delete('/:id', protectAdmin, deleteProject);

export default router;
