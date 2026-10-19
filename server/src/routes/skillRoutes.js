import express from 'express';
import { body } from 'express-validator';
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllSkills);

router.post(
  '/',
  protectAdmin,
  [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Skill category is required'),
  ],
  handleValidationErrors,
  createSkill
);

router.put('/:id', protectAdmin, updateSkill);
router.delete('/:id', protectAdmin, deleteSkill);

export default router;
