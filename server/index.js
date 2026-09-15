import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import analyzeRouter from './routes/analyze.js';
import commanderRouter from './routes/commander.js';
import authRouter from './routes/auth.js';
import helplineRouter from './routes/helpline.js';
import incidentsRouter from './routes/incidents.js';
import voiceRouter from './routes/voice.js';
import nearbyRouter from './routes/nearby.js';
import preparednessRouter from './routes/preparedness.js';
import { getDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication routes to prevent credential brute forcing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth attempts per 15 minutes
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS Middleware with explicit headers and methods
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Strict JSON body limit per requirements
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply rate limiters to sensitive routes
app.use('/api/analyze', apiLimiter);
app.use('/api/voice', apiLimiter);
app.use('/api/commander', apiLimiter);
app.use('/api/preparedness', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Status / Health Check Endpoint
app.get('/api/health', (req, res) => {
  const hasApiKey = Boolean(
    process.env.GEMINI_API_KEY && 
    process.env.GEMINI_API_KEY !== 'your_api_key_here' && 
    process.env.GEMINI_API_KEY.trim() !== ''
  );

  res.json({
    status: 'online',
    service: 'RescueLens AI Emergency Intelligence Backend',
    geminiConfigured: hasApiKey,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/commander', commanderRouter);
app.use('/api/auth', authRouter);
app.use('/api/helpline', helplineRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/nearby', nearbyRouter);
app.use('/api/preparedness', preparednessRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

// Start Server and Init DB
app.listen(PORT, async () => {
  try {
    await getDb(); // Initialize SQLite database
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  console.log(`=================================================`);
  console.log(`🚀 RescueLens AI Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Gemini API Key Status: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here' ? 'CONNECTED ✅' : 'DEMO SYNTHESIS MODE ⚠️'}`);
  console.log(`=================================================`);
});
