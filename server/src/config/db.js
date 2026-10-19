import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { ENV } from './env.js';

// Configure reliable DNS servers on Windows to resolve MongoDB Atlas SRV records
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch {
    // Ignore if custom dns servers cannot be configured
  }
}

export const dbConnectionDetails = {
  attemptedHost: '',
  atlasError: null,
  activeHost: '',
  isAtlas: false,
};

let memoryServerInstance = null;

export const connectDB = async () => {
  try {
    let uri = ENV.MONGODB_URI;

    if (!uri) {
      console.log('ℹ️ No MONGODB_URI provided in .env. Initializing local MongoDB storage...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const dbPath = path.resolve('data/db');
        if (!fs.existsSync(dbPath)) {
          fs.mkdirSync(dbPath, { recursive: true });
        }

        try {
          // Initialize persistent local storage
          memoryServerInstance = await MongoMemoryServer.create({
            instance: {
              dbPath,
              storageEngine: 'wiredTiger',
              dbName: 'portfolio_vikas',
            },
          });
        } catch {
          // Fallback if wiredTiger or custom directory lock occurs
          memoryServerInstance = await MongoMemoryServer.create({
            instance: {
              dbName: 'portfolio_vikas',
            },
          });
        }

        uri = memoryServerInstance.getUri();
        console.log(`✅ MongoDB server active at: ${uri}`);
      } catch (memErr) {
        console.warn('⚠️ Could not start embedded MongoDB, attempting local connection at mongodb://127.0.0.1:27017/portfolio_vikas', memErr.message);
        uri = 'mongodb://127.0.0.1:27017/portfolio_vikas';
      }
    }

    mongoose.set('strictQuery', true);
    let conn;
    try {
      conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      dbConnectionDetails.activeHost = conn.connection.host;
      dbConnectionDetails.isAtlas = (conn.connection.host || '').includes('mongodb.net');
      console.log(`🚀 MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);
      return conn;
    } catch (connectErr) {
      dbConnectionDetails.atlasError = connectErr.message;
      if (ENV.MONGODB_URI) {
        console.warn(`⚠️ Remote MongoDB Atlas connection failed (${connectErr.message}).`);
        console.warn('⚡ Activating local persistent MongoDB storage so your site continues to work without disruption...');
        
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const dbPath = path.resolve('data/db');
        if (!fs.existsSync(dbPath)) {
          fs.mkdirSync(dbPath, { recursive: true });
        }
        try {
          memoryServerInstance = await MongoMemoryServer.create({
            instance: { dbPath, storageEngine: 'wiredTiger', dbName: 'portfolio_vikas' },
          });
        } catch {
          memoryServerInstance = await MongoMemoryServer.create({
            instance: { dbName: 'portfolio_vikas' },
          });
        }
        const fallbackUri = memoryServerInstance.getUri();
        conn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 8000 });
        console.log(`✅ Local persistent MongoDB fallback active at: ${fallbackUri}`);
        return conn;
      }
      throw connectErr;
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.log('⚠️ Running server with degraded database connectivity. Please verify MONGODB_URI in .env');
    return null;
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
  } catch (err) {
    console.error('Error closing DB:', err.message);
  }
};
