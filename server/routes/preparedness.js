import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const CURATED_PREPAREDNESS = {
  Home: {
    title: "Home Emergency Preparedness Checklist",
    summary: "Essential household life-safety measures to protect family members from domestic fire, structural hazards, and utility failures.",
    checklistItems: [
      { item: "Inspect smoke detectors & carbon monoxide alarms monthly", priority: "HIGH", why: "Provides early alert during night fires." },
      { item: "Keep ABC multi-purpose fire extinguisher in kitchen & garage", priority: "HIGH", why: "Suppresses grease and electrical sparks." },
      { item: "Store 3 days of potable drinking water (3 liters/person/day)", priority: "MEDIUM", why: "Maintains hydration during water supply cuts." },
      { item: "Establish two family evacuation meeting points outside the residence", priority: "HIGH", why: "Prevents confusion if separation occurs." },
      { item: "Identify main gas valve & electrical circuit breaker shutoffs", priority: "HIGH", why: "Stops secondary explosions during earthquakes or leaks." }
    ],
    kitItems: ["Multi-purpose fire extinguisher", "Battery-powered radio & flashlight", "Fully stocked first-aid kit", "3-day non-perishable food supply", "Whistle & heavy-duty gloves"],
    emergencyAction: "If sudden hazard strikes, evacuate immediately without gathering possessions and dial 112 from safe exterior perimeter."
  },
  College: {
    title: "Campus & Dormitory Emergency Preparedness Checklist",
    summary: "Safety-first protocols tailored for university students in student dormitories, classrooms, and campus transit.",
    checklistItems: [
      { item: "Save campus security and local 112 dispatch to mobile speed-dial", priority: "HIGH", why: "Enables instant emergency reporting." },
      { item: "Locate secondary stairwell exits in dormitories & lecture halls", priority: "HIGH", why: "Elevators are disabled during active alarms." },
      { item: "Keep a portable power bank & LED flashlight fully charged", priority: "MEDIUM", why: "Maintains connectivity during blackouts." },
      { item: "Enroll in university emergency broadcast SMS alerts", priority: "HIGH", why: "Delivers immediate active threat notifications." },
      { item: "Maintain a grab-and-go pouch with prescription medicines & IDs", priority: "HIGH", why: "Ensures rapid dorm evacuation." }
    ],
    kitItems: ["Emergency whistle", "Mini trauma first-aid pouch", "High-capacity power bank", "Compact LED torch", "Emergency contact pocket card"],
    emergencyAction: "Upon alarm activation, exit calmly via nearest stairwell, avoid elevators, and report to designated campus rally point."
  },
  Office: {
    title: "Workplace & High-Rise Emergency Preparedness Checklist",
    summary: "Corporate safety protocols for office towers, commercial workspaces, and industrial complexes.",
    checklistItems: [
      { item: "Identify designated floor fire wardens and first-aid champions", priority: "HIGH", why: "Coordinates structured floor evacuation." },
      { item: "Memorize locations of AED defibrillators & primary fire exits", priority: "HIGH", why: "Saves critical minutes during cardiac arrest or fire." },
      { item: "Maintain clear exit corridors free of boxes and cabling", priority: "HIGH", why: "Prevents tripping during dark evacuations." },
      { item: "Keep sturdy walking shoes and essential medications at work desk", priority: "MEDIUM", why: "Facilitates multi-story stair descents." },
      { item: "Participate proactively in semi-annual fire & disaster drills", priority: "MEDIUM", why: "Builds muscle memory under stress." }
    ],
    kitItems: ["Desk evacuation sneakers", "N95 smoke barrier mask", "AED station map", "Personal prescription supply", "Glow stick or mini flashlight"],
    emergencyAction: "At the sound of alarm, close office doors behind you, proceed directly down emergency stairs, and report to assembly zone."
  },
  Vehicle: {
    title: "Automobile & Roadway Emergency Preparedness Checklist",
    summary: "Highway safety readiness for vehicular breakdowns, remote strandings, and collision scenarios.",
    checklistItems: [
      { item: "Stow reflective warning triangle & high-visibility safety vest", priority: "HIGH", why: "Alerts high-speed traffic during roadside repairs." },
      { item: "Mount an emergency window punch & seatbelt cutter in driver reach", priority: "HIGH", why: "Ensures rapid escape if submerged or pinned." },
      { item: "Keep heavy-duty jumper cables & tire inflator in trunk", priority: "HIGH", why: "Resolves battery death and punctures safely." },
      { item: "Carry sealed emergency drinking water and energy rations", priority: "MEDIUM", why: "Sustains occupants during severe traffic jams." },
      { item: "Maintain spare tire pressure and jack functionality regularly", priority: "MEDIUM", why: "Prevents remote towing delays." }
    ],
    kitItems: ["Reflective breakdown triangle", "Emergency seatbelt cutter & window breaker", "Heavy-gauge jumper cables", "Automotive first-aid kit", "High-lumen magnetic worklight"],
    emergencyAction: "If stranded on highway, pull onto hard shoulder, exit away from traffic flow, activate hazard lights, and stand behind barrier."
  },
  Travel: {
    title: "Traveler & Transit Emergency Preparedness Checklist",
    summary: "Vital safety precautions for domestic journeys, international travel, and hotel stays.",
    checklistItems: [
      { item: "Save local 112 emergency and nearest embassy contact details", priority: "HIGH", why: "Guarantees consular and police assistance." },
      { item: "Count hotel room doors to nearest fire stair exit upon check-in", priority: "HIGH", why: "Enables crawling in blinding smoke." },
      { item: "Carry offline digital & paper copies of passport, visa, and insurance", priority: "HIGH", why: "Recovers identification if phone is lost." },
      { item: "Pack broad-spectrum travel medical kit with water purification tabs", priority: "MEDIUM", why: "Treats sudden gastrointestinal or trauma issues." },
      { item: "Share live itinerary with a designated trusted family contact", priority: "HIGH", why: "Provides search radius if check-in is missed." }
    ],
    kitItems: ["Travel first-aid pack", "Water purification tablets", "Offline travel document copies", "Universal adapter & powerbank", "Door stop alarm"],
    emergencyAction: "In foreign emergency, dial local unified dispatch (112), alert hotel front desk, and contact your embassy emergency liaison."
  }
};

// POST /api/preparedness/generate
router.post('/generate', async (req, res) => {
  try {
    const rawContext = req.body.contextType || req.body.context || 'Home';
    const language = req.body.language || 'en';
    const validContext = ['Home', 'College', 'Office', 'Vehicle', 'Travel'].includes(rawContext)
      ? rawContext
      : 'Home';

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback to curated safety checklists if API key not available
      return res.json({
        success: true,
        source: 'curated_cache',
        checklist: CURATED_PREPAREDNESS[validContext]
      });
    }

    const prompt = `You are a certified emergency management disaster planner.
Generate a concise, safety-first emergency preparedness checklist specifically for: ${validContext}.
Do NOT collect, ask for, or include any personal information.
Language: ${language === 'hi' ? 'Hindi' : 'English'}.

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Clear setting-specific title",
  "summary": "1-2 sentence high-level life-safety summary",
  "checklistItems": [
    { "item": "Actionable safety step", "priority": "HIGH or MEDIUM", "why": "Brief reason" }
  ],
  "kitItems": ["5 specific emergency equipment or kit items"],
  "emergencyAction": "One sentence immediate action if disaster strikes"
}`;

    const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json'
          }
        });

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            source: 'gemini_ai',
            model: modelName,
            checklist: parsed
          });
        }
      } catch (aiErr) {
        console.warn(`Gemini model ${modelName} preparedness generation error: ${aiErr.message}`);
      }
    }

    // Fallback to curated high-quality data
    res.json({
      success: true,
      source: 'curated_fallback',
      checklist: CURATED_PREPAREDNESS[validContext]
    });
  } catch (err) {
    console.error('Preparedness endpoint error:', err);
    res.status(500).json({ error: 'Failed to generate preparedness checklist.' });
  }
});

export default router;
