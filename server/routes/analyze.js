import express from 'express';
import { analyzeEmergencyScene } from '../geminiService.js';

const router = express.Router();

// POST /api/analyze
// Accepts JSON body: { image: base64String, mimeType: string, description: string }
router.post('/', async (req, res) => {
  try {
    const { image, mimeType, description } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No emergency image provided. Please upload an image file.',
      });
    }

    // Convert base64 data URL to buffer if full data URL string is passed
    let cleanBase64 = image;
    let detectedMimeType = mimeType || 'image/jpeg';

    if (image.startsWith('data:')) {
      const parts = image.split(';base64,');
      detectedMimeType = parts[0].replace('data:', '');
      cleanBase64 = parts[1];
    }

    const imageBuffer = Buffer.from(cleanBase64, 'base64');

    if (imageBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image data buffer. Please try uploading a valid image file.',
      });
    }

    console.log(`Received emergency analysis request. Image size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

    const result = await analyzeEmergencyScene(imageBuffer, detectedMimeType, description);

    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze route:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing the emergency image with Gemini.',
      details: error.message,
    });
  }
});

export default router;
