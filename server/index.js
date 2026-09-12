import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import commanderRouter from './routes/commander.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
// Support large payload for base64 image data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

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

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 RescueLens AI Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Gemini API Key Status: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here' ? 'CONNECTED ✅' : 'DEMO SYNTHESIS MODE ⚠️'}`);
  console.log(`=================================================`);
});
