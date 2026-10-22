import { ENV } from '../config/env.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Determine public origin so images load correctly from client apps
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = forwardedProto || (req.secure ? 'https' : (ENV.NODE_ENV === 'production' ? 'https' : req.protocol));
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    const relativeUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fullUrl,
      url: fullUrl,
      relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
};
