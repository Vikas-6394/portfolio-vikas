import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

import { ENV } from './config/env.js';
import { connectDB, dbConnectionDetails } from './config/db.js';
import { initMailer } from './config/mailer.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Models for auto-seed check
import { Profile } from './models/Profile.js';
import { AdminUser } from './models/AdminUser.js';
import { runSeed } from './scripts/seed.js';
import { defaultProfileData } from './utils/seedData.js';

const app = express();
app.set('trust proxy', 1);

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://res.cloudinary.com', 'https:'],
        connectSrc: ["'self'", 'http://localhost:*', 'http://127.0.0.1:*', 'https:'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: ENV.NODE_ENV === 'production' ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS Configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin, matched origins, vercel previews, or dev mode
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        ENV.NODE_ENV === 'development' ||
        /\.vercel\.app$/.test(new URL(origin).hostname) ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Not allowed by origin'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Compression, Logging, Body Parsers
app.use(compression());
app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiting for general API endpoints
app.use('/api', apiRateLimiter);

// 5. Static uploads directory
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  },
  express.static(uploadsDir)
);

// 6. Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV,
    developer: 'Mr. Vikas Maurya',
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'none',
      name: mongoose.connection.name || 'none',
      isAtlas: (mongoose.connection.host || '').includes('mongodb.net'),
      hasMongoUriEnv: Boolean(ENV.MONGODB_URI),
      uriPreview: ENV.MONGODB_URI ? ENV.MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'EMPTY',
      atlasError: dbConnectionDetails.atlasError,
    },
  });
});

// 7. Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/uploads', uploadRoutes);

// 8. 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

// 9. Startup & Initialization
const startServer = async () => {
  const conn = await connectDB();
  initMailer();

  // If database is connected, check if initial seed is needed
  if (conn) {
    try {
      const profileCount = await Profile.countDocuments();
      if (profileCount === 0) {
        console.log('⚡ Initializing database with starter seed data...');
        await runSeed();
      } else {
        await AdminUser.updateOne({ email: ENV.ADMIN_DEFAULT_EMAIL.toLowerCase() }, { name: 'Mr. Vikas Maurya' });
        await Profile.updateMany({}, { $set: { heroDescription: defaultProfileData.heroDescription } });
      }
    } catch (checkErr) {
      console.warn('Could not check seed status:', checkErr.message);
    }
  }

  const PORT = ENV.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Mr. Vikas Maurya Portfolio Backend Server`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔒 Security: Helmet, CORS, Rate-Limiting Active`);
    console.log(`======================================================\n`);
  });

  // Handle unhandled rejections safely
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
  });
};

startServer();

export default app;
