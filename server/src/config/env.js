import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_vikas_maurya_min_32_characters_long_for_hmac_sha256',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'dev_cookie_secret_vikas_maurya',
  ADMIN_DEFAULT_EMAIL: process.env.ADMIN_DEFAULT_EMAIL || 'admin@vikasmaurya.dev',
  ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!@#',
  ADMIN_SETUP_SECRET: process.env.ADMIN_SETUP_SECRET || 'setup_admin_secret_key_2026',
  ENABLE_EMAIL: process.env.ENABLE_EMAIL === 'true',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  MAIL_FROM: process.env.MAIL_FROM || '"Mr. Vikas Maurya" <noreply@vikasmaurya.dev>',
  CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL || 'vikasmaurya195771@gmail.com',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '916394195771',
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  }
};
