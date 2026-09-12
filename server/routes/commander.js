import express from 'express';
import { queryEmergencyCommander } from '../geminiService.js';

const router = express.Router();

// POST /api/commander
// Accepts JSON body: { message: string, context: array }
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required.',
      });
    }

    const incidentContext = Array.isArray(context) ? context : [];

    const result = await queryEmergencyCommander(message, incidentContext);

    res.json(result);
  } catch (error) {
    console.error('Error in /api/commander route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process command query with Gemini AI.',
      details: error.message,
    });
  }
});

export default router;
