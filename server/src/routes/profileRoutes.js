import express from 'express';
import { getPublicProfile, updateProfile, updateSiteSettings } from '../controllers/profileController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicProfile);
router.put('/', protectAdmin, updateProfile);
router.put('/settings', protectAdmin, updateSiteSettings);

export default router;
