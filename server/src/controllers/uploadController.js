import fs from 'fs';
import { ENV } from '../config/env.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Read file buffer to produce persistent base64 data URI
    // This prevents images from 404ing / disappearing on cloud containers (e.g. Render free tier restarts)
    const fileBuffer = fs.readFileSync(req.file.path);
    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64Data = fileBuffer.toString('base64');
    const persistentDataUrl = `data:${mimeType};base64,${base64Data}`;

    // Clean up temporary local file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (_) {}

    res.status(200).json({
      success: true,
      message: 'File uploaded and converted to persistent storage successfully',
      fileUrl: persistentDataUrl,
      url: persistentDataUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
};
