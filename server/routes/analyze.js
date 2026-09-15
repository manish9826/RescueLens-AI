import express from 'express';
import { analyzeEmergencyScene, analyzeEmergencySpeech } from '../geminiService.js';

const router = express.Router();

// POST /api/analyze
// Accepts JSON body: { image: base64String, mimeType: string, description: string } or { speechText/text: string }
router.post('/', async (req, res) => {
  try {
    const { image, mimeType, description, text, speechText, language } = req.body;

    const voiceInput = speechText || text || (!image && description ? description : null);
    if (!image && voiceInput) {
      console.log(`Received speech/text analysis via /api/analyze: "${voiceInput}"`);
      const speechResult = await analyzeEmergencySpeech(voiceInput, language);
      return res.json(speechResult);
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No emergency image or voice description provided. Please upload an image or speak your emergency.',
      });
    }

    // Convert base64 or data URL to buffer safely
    let imageBuffer;
    let detectedMimeType = mimeType || 'image/jpeg';

    if (typeof image === 'string' && image.startsWith('data:')) {
      if (image.includes(';base64,')) {
        const parts = image.split(';base64,');
        detectedMimeType = parts[0].replace('data:', '') || detectedMimeType;
        const cleanBase64 = parts[1] || '';
        imageBuffer = Buffer.from(cleanBase64, 'base64');
      } else {
        // Handle non-base64 data URL (e.g. data:image/svg+xml;utf8,<svg...)
        const commaIndex = image.indexOf(',');
        if (commaIndex !== -1) {
          const header = image.slice(5, commaIndex);
          detectedMimeType = header.split(';')[0] || detectedMimeType;
          const rawData = decodeURIComponent(image.slice(commaIndex + 1));
          imageBuffer = Buffer.from(rawData, 'utf-8');
        } else {
          imageBuffer = Buffer.from(image, 'utf-8');
        }
      }
    } else if (typeof image === 'string') {
      imageBuffer = Buffer.from(image, 'base64');
    } else if (Buffer.isBuffer(image)) {
      imageBuffer = image;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported image data format. Please upload an image file.',
      });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(detectedMimeType.toLowerCase())) {
       return res.status(400).json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WEBP images are allowed.',
      });
    }

    // Example size limit: 5MB
    const maxSize = 5 * 1024 * 1024; 
    if (imageBuffer.length > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'Image is too large. Maximum size is 5MB.',
      });
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image data buffer. Please try uploading a valid image file.',
      });
    }

    console.log(`Received emergency analysis request (${language || 'en'}). Image size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

    const result = await analyzeEmergencyScene(imageBuffer, detectedMimeType, description, language || 'en');

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
