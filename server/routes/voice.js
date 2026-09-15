import express from 'express';
import { analyzeEmergencySpeech } from '../geminiService.js';

const router = express.Router();

// POST /api/voice/analyze
// Body: { speechText: string, language: 'en' | 'hi' }
router.post('/analyze', async (req, res) => {
  try {
    const { speechText, text, language = 'en' } = req.body;
    const query = speechText || text;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No voice emergency text provided. Please speak or type your emergency description.'
      });
    }

    console.log(`[Voice Assistant] Analyzing emergency speech (${language}): "${query}"`);
    const result = await analyzeEmergencySpeech(query.trim(), language);
    res.json(result);
  } catch (error) {
    console.error('[Voice Assistant] Error in /api/voice/analyze:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process voice emergency analysis.',
      details: error.message
    });
  }
});

export default router;
