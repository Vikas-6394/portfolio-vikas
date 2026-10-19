import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { handleFileUpload } from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('file'), handleFileUpload);

export default router;
