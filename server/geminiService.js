import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-pro',
];

/**
 * Helper to call Gemini models with dynamic fallback to available model names
 */
async function callGeminiWithFallback(ai, contents, config = {}) {
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`Attempting Gemini API request with model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });

      if (response && response.text) {
        console.log(`Gemini API call succeeded using model: ${modelName}`);
        return { text: response.text, usedModel: modelName };
      }
    } catch (err) {
      console.warn(`Model ${modelName} call failed: ${err.message}. Trying next candidate model...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}

/**
 * Analyzes emergency image and optional description using Gemini API
 */
export async function analyzeEmergencyScene(imageBuffer, mimeType = 'image/jpeg', userDescription = '') {
  const ai = getGeminiClient();

  const systemPrompt = `You are RescueLens AI, a specialized emergency intelligence vision AI used by emergency response commanders.
Analyze the provided emergency scene image along with any extra situational context provided by the reporter.

You MUST respond ONLY with a strict valid JSON object (no markdown surrounding ticks, no extra text) matching this JSON structure:
{
  "incidentType": "Short descriptive title, e.g. Urban Flooding / Structure Fire / Multi-Vehicle Crash",
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "priorityScore": <number between 0 and 100 representing urgency>,
  "confidence": <number between 0 and 100 representing AI detection confidence>,
  "summary": "Concise 1-2 sentence executive summary of the emergency scene",
  "risks": [
    "Specific hazard 1 detected or anticipated",
    "Specific hazard 2",
    "Specific hazard 3"
  ],
  "immediateActions": [
    "Immediate action 1 for emergency responders",
    "Immediate action 2",
    "Immediate action 3"
  ],
  "resources": [
    "Required unit / equipment 1",
    "Required unit / equipment 2",
    "Required unit / equipment 3"
  ]
}

Ensure all metrics (priorityScore, confidence) are realistic integer values based on visible visual damage, structural threats, fire/water exposure, or casualty indicators.
User Provided Description: "${userDescription || 'No additional description provided.'}"`;

  if (ai) {
    try {
      const base64Data = imageBuffer.toString('base64');
      const contents = [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        systemPrompt,
      ];

      const { text, usedModel } = await callGeminiWithFallback(ai, contents, {
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      // Clean up markdown wrapping if present
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedJson);

      return {
        success: true,
        isLive: true,
        usedModel,
        data: parsedData,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      return {
        success: true,
        isLive: false,
        warning: `Gemini API call error: ${error.message}. Generated fallback decision support intelligence.`,
        data: generateFallbackAnalysis(userDescription, mimeType),
      };
    }
  } else {
    console.log('GEMINI_API_KEY not configured. Using intelligent demo synthesis.');
    return {
      success: true,
      isLive: false,
      warning: 'GEMINI_API_KEY is not configured in backend .env. Output generated using intelligence synthesis engine.',
      data: generateFallbackAnalysis(userDescription, mimeType),
    };
  }
}

/**
 * Gemini Emergency Commander Chat function
 */
export async function queryEmergencyCommander(message, incidentContext = []) {
  const ai = getGeminiClient();

  const formattedContext = incidentContext.map(inc => 
    `- [ID: ${inc.id}] ${inc.incidentType} | Severity: ${inc.severity} | Priority Score: ${inc.priorityScore}/100 | Status: ${inc.status || 'ACTIVE'} | Key Risks: ${inc.risks?.join(', ') || 'N/A'}`
  ).join('\n');

  const prompt = `You are the RescueLens Emergency Commander, an elite AI tactical advisor assisting first responders and incident commanders.
You are evaluating current active incidents in the Command Center:

ACTIVE INCIDENTS SNAPSHOT:
${formattedContext || 'No active incidents currently logged.'}

USER QUESTION: "${message}"

Provide a concise, direct, tactical recommendation suitable for emergency decision support.
Format with clear bullet points, risk prioritization, and resource allocation instructions. Always maintain a calm, authoritative tone. Remind commander that final decision rests with qualified field personnel.`;

  if (ai) {
    try {
      const { text, usedModel } = await callGeminiWithFallback(ai, prompt, { temperature: 0.3 });

      return {
        success: true,
        isLive: true,
        usedModel,
        reply: text,
      };
    } catch (error) {
      console.error('Commander Gemini API Error:', error.message);
      return {
        success: true,
        isLive: false,
        reply: generateFallbackCommanderResponse(message, incidentContext),
      };
    }
  } else {
    return {
      success: true,
      isLive: false,
      reply: generateFallbackCommanderResponse(message, incidentContext),
    };
  }
}

/**
 * Intelligent heuristics fallback when API key is unconfigured or rate limited
 */
function generateFallbackAnalysis(userDescription = '', mimeType = '') {
  const descLower = userDescription.toLowerCase();

  if (descLower.includes('fire') || descLower.includes('smoke') || descLower.includes('flame')) {
    return {
      incidentType: "Structural Fire & Smoke Hazard",
      severity: "CRITICAL",
      priorityScore: 94,
      confidence: 91,
      summary: "Active high-intensity structure fire observed with heavy dense smoke plume threatening adjacent properties.",
      risks: [
        "Rapid lateral thermal radiation spread",
        "Structural integrity collapse threat",
        "Toxic smoke inhalation hazards for nearby residents"
      ],
      immediateActions: [
        "Establish 300-meter safety perimeter and evacuate adjacent structures",
        "Deploy main water line attack and aerial ladder platform",
        "Isolate local natural gas and high-voltage grid lines"
      ],
      resources: [
        "Engine Companies x3",
        "Ladder Truck Unit x1",
        "HAZMAT Response Unit",
        "Advanced Life Support Ambulances x2"
      ]
    };
  } else if (descLower.includes('flood') || descLower.includes('water') || descLower.includes('submerged')) {
    return {
      incidentType: "Severe Urban Inundation",
      severity: "CRITICAL",
      priorityScore: 89,
      confidence: 93,
      summary: "Flash urban flooding detected submerging transit arteries and threatening trapped vehicles.",
      risks: [
        "Submerged electrical transformers and localized electrocution hazard",
        "Rapidly rising water current stranding low-riding vehicles",
        "Contaminated runoff and drainage system backflow"
      ],
      immediateActions: [
        "Block vehicle access to flooded causeways immediately",
        "Launch swift-water rescue operations for stranded motorists",
        "Alert municipal drainage control to initiate emergency pumping"
      ],
      resources: [
        "Swift Water Rescue Squad",
        "High-Water Transport Trucks",
        "Emergency Utility Grid Team",
        "Traffic Control Units"
      ]
    };
  } else if (descLower.includes('crash') || descLower.includes('car') || descLower.includes('collision') || descLower.includes('accident')) {
    return {
      incidentType: "Multi-Vehicle Highway Crash",
      severity: "HIGH",
      priorityScore: 85,
      confidence: 88,
      summary: "Major roadway collision involving multiple passenger vehicles with suspected victim entrapment.",
      risks: [
        "Fuel leakage posing immediate ignition hazard",
        "Secondary crash risk due to high-speed approaching traffic",
        "Trauma injuries requiring heavy hydraulic extrication"
      ],
      immediateActions: [
        "Close incoming traffic lanes and establish safe extraction zone",
        "Apply heavy hydraulic cutters (Jaws of Life) to free trapped occupants",
        "Deploy absorbent foam to neutralize fuel spills"
      ],
      resources: [
        "Heavy Rescue Extrication Truck",
        "Paramedic Transport Units x3",
        "Highway Patrol Units x2",
        "Towing & Salvage Rigs"
      ]
    };
  }

  // Default balanced emergency intelligence payload
  return {
    incidentType: "Emergency Hazard & Incident Scene",
    severity: "HIGH",
    priorityScore: 82,
    confidence: 89,
    summary: "Visual hazard detected requiring immediate triage, perimeter stabilization, and responder deployment.",
    risks: [
      "Unstabilized hazard zone risking secondary casualties",
      "Public bystander intrusion into hazardous perimeter",
      "Potential utility infrastructure compromise"
    ],
    immediateActions: [
      "Dispatch primary reconnaissance team to verify scene perimeter",
      "Coordinate with regional dispatch for specialized equipment deployment",
      "Establish triage staging area outside active incident radius"
    ],
    resources: [
      "Incident Recon Unit",
      "Emergency Medical Services Team",
      "Perimeter Security Unit"
    ]
  };
}

function generateFallbackCommanderResponse(message, incidents) {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes('first') || msgLower.includes('handle') || msgLower.includes('priority')) {
    const critical = incidents.find(i => i.severity === 'CRITICAL') || incidents[0];
    if (critical) {
      return `**Tactical Priority Guidance:**\n\n1. **Highest Priority Incident:** [ID ${critical.id}] **${critical.incidentType}** (Priority Score: ${critical.priorityScore}/100).\n2. **Reasoning:** Critical severity level with high risk of immediate life safety impact and escalation.\n3. **Recommended Immediate Action:** Direct primary response teams to stabilize this scene prior to secondary dispatches. Ensure safety perimeters are active.`;
    }
  }

  if (msgLower.includes('resource') || msgLower.includes('equipment')) {
    return `**Resource Allocation Summary:**\n\n- **Heavy Rescue / Fire:** Prioritize active structure fire & collision scenes.\n- **Medical / EMS:** Maintain 2 ALS ambulance units staging at central sector hub.\n- **Utilities & HAZMAT:** On standby for flooding and power grid isolation.\n\n*Suggestion:* Verify unit arrival times on the Command Center timeline.`;
  }

  return `**Emergency Commander Analysis:**\n\nBased on current Command Center data (${incidents.length} active incidents logged):\n- **Status:** All incidents are categorized by priority scores.\n- **Recommendation:** Focus response efforts on CRITICAL rated items first. Keep safety staging perimeters clear.\n- Always cross-reference AI decision support recommendations with on-scene field officers.`;
}
