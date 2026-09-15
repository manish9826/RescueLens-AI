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
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
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
export async function analyzeEmergencyScene(imageBuffer, mimeType = 'image/jpeg', userDescription = '', language = 'en') {
  const ai = getGeminiClient();

  const LANGUAGE_NAMES = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    gu: 'Gujarati',
    pa: 'Punjabi',
  };
  const langName = LANGUAGE_NAMES[language] || 'English';

  const systemPrompt = `You are RescueLens AI, a specialized emergency intelligence vision AI used by emergency response commanders.
Analyze the provided emergency scene image along with any extra situational context provided by the reporter.

User Language Requirement:
Selected Language: ${langName} (${language})
You MUST return the following text fields in ${langName}:
- incidentType (e.g. title in ${langName})
- summary (incident summary in ${langName})
- dangerLevel (danger description in ${langName})
- immediateActions (array of actionable instructions in ${langName})
- doNotDo (array of hazard avoidance instructions in ${langName})
- rescueResources (in ${langName})

CRITICAL SAFETY RULES:
1. Emergency phone numbers (such as 112, 100, 101, 108, 1098, 1930) must remain numeric digits and NEVER be translated or changed into words.
2. Keep instructions short, clear, and unambiguous. Do not translate emergency instructions in a way that changes their meaning.

You MUST respond ONLY with a strict valid JSON object (no markdown surrounding ticks, no extra text) matching this JSON structure:
{
  "incidentType": "Short descriptive title in ${langName}, e.g. Urban Flooding / Structure Fire / Multi-Vehicle Crash",
  "emergencyCategory": "ACCIDENT | FIRE | MEDICAL | POLICE | WOMEN_SAFETY | CHILD_SAFETY | FLOOD | DISASTER | ELECTRICAL | CYBER | OTHER",
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "priorityScore": <number between 0 and 100 representing urgency>,
  "confidence": <number between 0 and 100 representing AI detection confidence>,
  "summary": "Concise 1-2 sentence executive summary of the emergency scene in ${langName}",
  "dangerLevel": "Short description of the immediate danger level in ${langName}",
  "immediateActions": [
    "Practical, safety-first instruction 1 in ${langName}",
    "Practical, safety-first instruction 2 in ${langName}"
  ],
  "doNotDo": [
    "Dangerous action to avoid 1 in ${langName}",
    "Dangerous action to avoid 2 in ${langName}"
  ],
  "rescueResources": [
    "Required unit / equipment 1 in ${langName}"
  ]
}

Ensure all metrics (priorityScore, confidence) are realistic integer values based on visible visual damage, structural threats, fire/water exposure, or casualty indicators.
User Provided Description: "${userDescription || 'No additional description provided.'}"`;

  if (ai) {
    try {
      let contents;
      const isRasterImage = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType.toLowerCase());

      if (isRasterImage) {
        const base64Data = imageBuffer.toString('base64');
        contents = [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          systemPrompt,
        ];
      } else {
        // For SVGs or non-raster formats, pass situational text context to Gemini model
        const svgSnippet = imageBuffer.toString('utf-8').slice(0, 2000);
        contents = [
          `Emergency incident visual vector/description metadata: ${svgSnippet}\n\n${systemPrompt}`
        ];
      }

      const { text, usedModel } = await callGeminiWithFallback(ai, contents, {
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      // Clean up markdown wrapping if present and extract outermost JSON object
      let parsedData;
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsedData = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } else {
        parsedData = JSON.parse(cleaned);
      }

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
        data: generateFallbackAnalysis(userDescription, mimeType, language),
      };
    }
  } else {
    console.log('GEMINI_API_KEY not configured. Using intelligent demo synthesis.');
    return {
      success: true,
      isLive: false,
      warning: 'GEMINI_API_KEY is not configured in backend .env. Output generated using intelligence synthesis engine.',
      data: generateFallbackAnalysis(userDescription, mimeType, language),
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
function generateFallbackAnalysis(userDescription = '', mimeType = '', language = 'en') {
  const descLower = userDescription.toLowerCase();
  const isHindi = language === 'hi';

  if (descLower.includes('fire') || descLower.includes('smoke') || descLower.includes('flame')) {
    return {
      incidentType: isHindi ? "आग और धुएं का खतरा" : "Structural Fire & Smoke Hazard",
      emergencyCategory: "FIRE",
      severity: "CRITICAL",
      priorityScore: 94,
      confidence: 91,
      summary: isHindi 
        ? "सक्रिय तीव्र आग और घना धुआं दर्ज किया गया है जो आस-पास के क्षेत्रों के लिए खतरा पैदा कर रहा है।"
        : "Active high-intensity structure fire observed with heavy dense smoke plume threatening adjacent properties.",
      dangerLevel: isHindi 
        ? "तेज लपटों और अत्यधिक गर्मी के कारण गंभीर खतरा।"
        : "Extreme danger due to rapid lateral thermal radiation spread.",
      immediateActions: isHindi ? [
        "तुरंत 300 मीटर का सुरक्षा घेरा बनाएं और इमारत खाली करें",
        "दमकल विभाग 112 या 101 को तुरंत सूचित करें"
      ] : [
        "Establish 300-meter safety perimeter and evacuate adjacent structures",
        "Deploy main water line attack and aerial ladder platform"
      ],
      doNotDo: isHindi ? [
        "जलती हुई इमारत में प्रवेश न करें",
        "धुएं में सांस न लें"
      ] : [
        "Do not enter the structure",
        "Do not inhale smoke"
      ],
      rescueResources: [
        "Engine Companies x3",
        "Ladder Truck Unit x1"
      ]
    };
  } else if (descLower.includes('flood') || descLower.includes('water') || descLower.includes('submerged')) {
    return {
      incidentType: isHindi ? "गंभीर शहरी जलभराव व बाढ़" : "Severe Urban Inundation",
      emergencyCategory: "FLOOD",
      severity: "CRITICAL",
      priorityScore: 89,
      confidence: 93,
      summary: isHindi
        ? "बाढ़ का पानी सड़कों और वाहनों को डुबो रहा है।"
        : "Flash urban flooding detected submerging transit arteries and threatening trapped vehicles.",
      dangerLevel: isHindi
        ? "डूबने और बिजली के झटके का गंभीर खतरा।"
        : "High danger of drowning and electrocution.",
      immediateActions: isHindi ? [
        "तुरंत किसी ऊंचे सुरक्षित स्थान पर जाएं",
        "बाढ़ वाले मार्गों पर वाहनों का प्रवेश रोकें"
      ] : [
        "Move to higher ground immediately",
        "Block vehicle access to flooded causeways"
      ],
      doNotDo: isHindi ? [
        "बाढ़ के पानी में गाड़ी न चलाएं",
        "पानी में डूबे बिजली के खंभों को न छुएं"
      ] : [
        "Do not drive through flooded waters",
        "Do not touch submerged electrical transformers"
      ],
      rescueResources: [
        "Swift Water Rescue Squad",
        "High-Water Transport Trucks"
      ]
    };
  } else if (descLower.includes('crash') || descLower.includes('car') || descLower.includes('collision') || descLower.includes('accident')) {
    return {
      incidentType: isHindi ? "हाईवे सड़क दुर्घटना" : "Multi-Vehicle Highway Crash",
      emergencyCategory: "ACCIDENT",
      severity: "HIGH",
      priorityScore: 85,
      confidence: 88,
      summary: isHindi
        ? "कई वाहनों की भीषण टक्कर हुई है, पीड़ितों के फंसे होने की आशंका है।"
        : "Major roadway collision involving multiple passenger vehicles with suspected victim entrapment.",
      dangerLevel: isHindi
        ? "तेज गति से आते वाहनों और ईंधन रिसाव के कारण उच्च खतरा।"
        : "High danger due to high-speed approaching traffic and fuel leakage.",
      immediateActions: isHindi ? [
        "सुरक्षित होने पर खुद को यातायात से दूर ले जाएं",
        "यदि कोई गंभीर घायल है तो 112 पर आपातकालीन सेवाओं को तुरंत कॉल करें"
      ] : [
        "Move yourself away from traffic if safe",
        "Call emergency services if anyone is seriously injured"
      ],
      doNotDo: isHindi ? [
        "घायल व्यक्ति को अनावश्यक रूप से न हिलाएं",
        "लीक हो रहे ईंधन के पास न जाएं"
      ] : [
        "Do not unnecessarily move an injured person",
        "Do not approach leaking fuel"
      ],
      rescueResources: [
        "Heavy Rescue Extrication Truck",
        "Paramedic Transport Units x3"
      ]
    };
  }

  // Default balanced emergency intelligence payload
  return {
    incidentType: isHindi ? "आपातकालीन खतरा और घटनास्थल" : "Emergency Hazard & Incident Scene",
    emergencyCategory: "OTHER",
    severity: "HIGH",
    priorityScore: 82,
    confidence: 89,
    summary: isHindi
      ? "दृश्य खतरे का पता चला है, तुरंत प्राथमिकता और सुरक्षा घेरा आवश्यक है।"
      : "Visual hazard detected requiring immediate triage, perimeter stabilization, and responder deployment.",
    dangerLevel: isHindi
      ? "मध्यम खतरा जिसके लिए पेशेवर मूल्यांकन की आवश्यकता है।"
      : "Medium danger requiring professional evaluation.",
    immediateActions: isHindi ? [
      "घटनास्थल से सुरक्षित दूरी बनाए रखें",
      "112 पर आपातकालीन सहायता प्राप्त करें"
    ] : [
      "Keep a safe distance from the incident",
      "Seek professional emergency assistance"
    ],
    doNotDo: isHindi ? [
      "खतरनाक क्षेत्र में प्रवेश न करें",
      "खुद को जोखिम में न डालें"
    ] : [
      "Do not enter the hazardous perimeter",
      "Do not put yourself in danger"
    ],
    rescueResources: [
      "Incident Recon Unit",
      "Emergency Medical Services Team"
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

/**
/**
 * Intelligent heuristics for speech/voice emergency reports (supports English & Hindi/Hinglish)
 */
function generateVoiceFallbackAnalysis(speechText = '', language = 'en') {
  const textLower = speechText.toLowerCase();
  const isHindi = language === 'hi';

  // Accident / Crash / Road Collision / Injury (English + Hindi/Hinglish keywords)
  if (
    textLower.includes('accident') ||
    textLower.includes('injured') ||
    textLower.includes('chot') ||
    textLower.includes('ghayal') ||
    textLower.includes('collision') ||
    textLower.includes('crash') ||
    textLower.includes('gadi') ||
    textLower.includes('car') ||
    textLower.includes('truck') ||
    textLower.includes('bike') ||
    textLower.includes('takkar')
  ) {
    const isInjured = textLower.includes('injured') || textLower.includes('chot') || textLower.includes('ghayal') || textLower.includes('blood') || textLower.includes('khoon');
    return {
      incidentType: isHindi ? "संभावित सड़क दुर्घटना" : "Possible Road Accident",
      emergencyCategory: "ACCIDENT",
      severity: isInjured ? "CRITICAL" : "HIGH",
      priorityScore: isInjured ? 94 : 88,
      confidence: 94,
      summary: isHindi 
        ? `सड़क दुर्घटना और चोट की आपातकालीन सूचना दर्ज: "${speechText}"।`
        : `Voice emergency report indicates a road vehicular incident${isInjured ? ' with suspected casualty/injuries' : ''}: "${speechText}".`,
      dangerLevel: isHindi
        ? "गुजरते वाहनों और संभावित शारीरिक चोट के कारण उच्च खतरा।"
        : "High danger due to oncoming traffic, vehicle deformation, and possible physical injury.",
      immediateActions: isHindi ? [
        "यदि संभव हो तो तुरंत सुरक्षित स्थान पर जाएं।",
        "यदि कोई व्यक्ति गंभीर रूप से घायल है तो 112 पर तुरंत कॉल करें।",
        "घायल व्यक्ति को अनावश्यक रूप से बिल्कुल न हिलाएं।",
        "आपातकालीन ऑपरेटर के निर्देशों का ध्यानपूर्वक पालन करें।"
      ] : [
        "Move to a safe location if possible.",
        "Call emergency services if someone is seriously injured.",
        "Avoid unnecessary movement of injured people.",
        "Follow emergency operator instructions."
      ],
      doNotDo: isHindi ? [
        "खुद को किसी भी खतरे में न डालें।",
        "घायल व्यक्ति को अनावश्यक रूप से न हिलाएं।",
        "लीक हो रहे ईंधन या खुले तारों के पास न जाएं।",
        "असुरक्षित यातायात लेन में प्रवेश न करें।"
      ] : [
        "Do not put yourself in danger.",
        "Do not unnecessarily move an injured person.",
        "Do not approach leaking fuel or exposed vehicle electrical lines.",
        "Do not enter unsafe traffic lanes."
      ],
      recommendedHelpline: "112",
      helplineName: "Unified Emergency Response"
    };
  }

  // Fire / Smoke / Gas / Burn (English + Hindi/Hinglish keywords)
  if (
    textLower.includes('fire') ||
    textLower.includes('aag') ||
    textLower.includes('smoke') ||
    textLower.includes('dhuan') ||
    textLower.includes('cylinder') ||
    textLower.includes('blast') ||
    textLower.includes('jal') ||
    textLower.includes('flame')
  ) {
    return {
      incidentType: isHindi ? "आग और धुएं का आपातकाल" : "Structural Fire & Smoke Emergency",
      emergencyCategory: "FIRE",
      severity: "CRITICAL",
      priorityScore: 96,
      confidence: 92,
      summary: isHindi
        ? `सक्रिय आग/धुएं के खतरे की आपातकालीन रिपोर्ट: "${speechText}"।`
        : `Voice report indicates active fire/smoke hazard: "${speechText}".`,
      dangerLevel: isHindi
        ? "तेज लपटों और जहरीले धुएं से गंभीर खतरा।"
        : "Extreme danger from thermal burns, toxic smoke inhalation, and rapid fire spread.",
      immediateActions: isHindi ? [
        "तुरंत किसी खुले और सुरक्षित बाहरी क्षेत्र में जाएं।",
        "दमकल विभाग के लिए तुरंत 112 या 101 पर कॉल करें।",
        "निकासी के दौरान धुएं से बचने के लिए नीचे झुककर चलें।",
        "आग फैलने से रोकने के लिए दरवाजे बंद कर दें।"
      ] : [
        "Evacuate immediately to an open, safe outdoor assembly area.",
        "Call 112 / 101 Fire Department right away.",
        "Stay low beneath the smoke layer during evacuation.",
        "Close doors behind you if safe to slow flame progression."
      ],
      doNotDo: isHindi ? [
        "आग के दौरान लिफ्ट का उपयोग न करें।",
        "सामान लाने के लिए जलती हुई इमारत में वापस न जाएं।",
        "बिजली या तेल की आग पर पानी न डालें।",
        "घने धुएं में प्रवेश न करें।"
      ] : [
        "Do not use elevators during a fire.",
        "Do not re-enter a burning structure for belongings.",
        "Do not use water on electrical or grease/oil fires.",
        "Do not enter dense smoke clouds."
      ],
      recommendedHelpline: "112",
      helplineName: "Unified Emergency Response"
    };
  }

  // Medical / Cardiac / Breathing / Unconscious
  if (
    textLower.includes('medical') ||
    textLower.includes('heart') ||
    textLower.includes('attack') ||
    textLower.includes('chest') ||
    textLower.includes('saans') ||
    textLower.includes('breath') ||
    textLower.includes('unconscious') ||
    textLower.includes('behosh') ||
    textLower.includes('stroke') ||
    textLower.includes('seizure') ||
    textLower.includes('khoon')
  ) {
    return {
      incidentType: isHindi ? "गंभीर चिकित्सा आपातकाल" : "Critical Medical Emergency",
      emergencyCategory: "MEDICAL",
      severity: "CRITICAL",
      priorityScore: 95,
      confidence: 93,
      summary: isHindi
        ? `गंभीर स्वास्थ्य स्थिति की आपातकालीन रिपोर्ट: "${speechText}"।`
        : `Voice report indicates severe health emergency: "${speechText}".`,
      dangerLevel: isHindi
        ? "जीवन के लिए तत्काल खतरा, त्वरित चिकित्सा एम्बुलेंस की आवश्यकता।"
        : "Immediate life threat requiring rapid medical assessment and ALS ambulance.",
      immediateActions: isHindi ? [
        "तुरंत 112 या 108 एम्बुलेंस को कॉल करें।",
        "मरीज को शांत रखें और सांस तथा नब्ज पर नजर रखें।",
        "बेहोश मरीज को सुरक्षित रिकवरी स्थिति में रखें।",
        "मेडिकल डिस्पैचर को सटीक स्थान बताएं।"
      ] : [
        "Call 112 or 108 ambulance immediately.",
        "Keep patient calm, resting, and monitor breathing and pulse.",
        "Place unconscious breathing patients in safe recovery position.",
        "Provide clear location landmarks to the medical dispatcher."
      ],
      doNotDo: isHindi ? [
        "बेहोश व्यक्ति को खाने या पीने के लिए कुछ न दें।",
        "मरीज को अकेला न छोड़ें।",
        "रीढ़ या गर्दन में चोट की आशंका हो तो मरीज को न हिलाएं।"
      ] : [
        "Do not give food or drink to an unconscious person.",
        "Do not leave the patient unattended.",
        "Do not move patient if neck/spine injury is suspected."
      ],
      recommendedHelpline: "112",
      helplineName: "Unified Emergency Response"
    };
  }

  // Police / Crime / Security
  if (
    textLower.includes('police') ||
    textLower.includes('chor') ||
    textLower.includes('theft') ||
    textLower.includes('robbery') ||
    textLower.includes('assault') ||
    textLower.includes('threat') ||
    textLower.includes('fight') ||
    textLower.includes('loot') ||
    textLower.includes('gun') ||
    textLower.includes('weapon')
  ) {
    return {
      incidentType: isHindi ? "सुरक्षा और कानून व्यवस्था आपातकाल" : "Law Enforcement & Security Incident",
      emergencyCategory: "POLICE",
      severity: "HIGH",
      priorityScore: 89,
      confidence: 90,
      summary: isHindi
        ? `सुरक्षा या अपराध की स्थिति की आपातकालीन रिपोर्ट: "${speechText}"।`
        : `Voice report indicates active security or crime situation: "${speechText}".`,
      dangerLevel: isHindi
        ? "व्यक्तिगत सुरक्षा और सार्वजनिक कानून व्यवस्था के लिए खतरा।"
        : "Threat to personal safety and public security.",
      immediateActions: isHindi ? [
        "तुरंत किसी सुरक्षित और बंद या भीड़भाड़ वाले स्थान पर जाएं।",
        "तुरंत 112 या 100 पुलिस कंट्रोल रूम को कॉल करें।",
        "संदिग्धों के विवरण और दिशा को नोट करें लेकिन उलझें नहीं।",
        "पुलिस अधिकारियों के साथ पूरा सहयोग करें।"
      ] : [
        "Move to a secure, locked, or crowded safe space immediately.",
        "Call 112 or 100 Police Control Room right away.",
        "Note details of suspects, vehicles, or direction without engaging.",
        "Cooperate fully with police officers."
      ],
      doNotDo: isHindi ? [
        "हथियारबंद या उत्तेजित संदिग्धों का सामना न करें।",
        "सामान बचाने के लिए अपनी जान जोखिम में न डालें।",
        "घटनास्थल पर मौजूद सबूतों को न छुएं।"
      ] : [
        "Do not confront armed or agitated suspects.",
        "Do not put yourself in danger to protect property.",
        "Do not touch or disturb evidence at the scene."
      ],
      recommendedHelpline: "112",
      helplineName: "Unified Emergency Response"
    };
  }

  // General Emergency Fallback
  return {
    incidentType: isHindi ? "तत्काल आपातकालीन सहायता" : "Urgent Voice Emergency Incident",
    emergencyCategory: "OTHER",
    severity: "HIGH",
    priorityScore: 86,
    confidence: 88,
    summary: isHindi
      ? `आपातकालीन सहायता का अनुरोध: "${speechText}"।`
      : `Voice emergency assistance requested: "${speechText}".`,
    dangerLevel: isHindi
      ? "संभावित खतरा जिसकी आपातकालीन जांच आवश्यक है।"
      : "Potential hazard requiring immediate responder verification.",
    immediateActions: isHindi ? [
      "यदि संभव हो तो तुरंत सुरक्षित स्थान पर जाएं।",
      "सीधे 112 आपातकालीन सेवाओं पर कॉल करें।",
      "शांत रहें और आधिकारिक आपातकालीन निर्देशों का पालन करें।",
      "पूरी तरह सुरक्षित होने पर ही दूसरों की सहायता करें।"
    ] : [
      "Move to a safe location if possible.",
      "Call emergency services directly on 112.",
      "Stay calm and follow official emergency instructions.",
      "Assist others only if it is completely safe to do so."
    ],
    doNotDo: isHindi ? [
      "खुद को किसी खतरे में न डालें।",
      "असुरक्षित या गैर-सत्यापित क्षेत्रों में न जाएं।",
      "घबराएं नहीं और स्थिति शांत बनाए रखें।"
    ] : [
      "Do not put yourself in danger.",
      "Do not enter unsafe or unverified hazard zones.",
      "Do not panic or rush into hazardous areas."
    ],
    recommendedHelpline: "112",
    helplineName: "Unified Emergency Response"
  };
}

/**
 * Analyzes voice or text emergency description using Gemini API
 */
export async function analyzeEmergencySpeech(speechText, language = 'en') {
  const ai = getGeminiClient();

  const LANGUAGE_NAMES = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    gu: 'Gujarati',
    pa: 'Punjabi',
  };
  const langName = LANGUAGE_NAMES[language] || 'English';

  const prompt = `You are RescueLens AI Voice Emergency Assistant, an elite emergency intelligence vision and voice AI used by first responders.
The user has reported an emergency in ${langName}:
User Emergency Report: "${speechText}"
Target Language: ${langName} (${language})

Analyze this emergency report immediately with safety-first priority.
You MUST respond ONLY with a strict valid JSON object (no markdown surrounding ticks, no extra text) matching this JSON structure:
{
  "incidentType": "Short descriptive title in ${langName}, e.g. Possible Road Accident / Structural Fire / Severe Injury",
  "emergencyCategory": "ACCIDENT | FIRE | MEDICAL | POLICE | WOMEN_SAFETY | CHILD_SAFETY | FLOOD | DISASTER | ELECTRICAL | CYBER | OTHER",
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "priorityScore": <integer 0-100 representing urgency>,
  "confidence": <integer 0-100 representing AI classification confidence>,
  "summary": "1-2 sentence executive summary of the emergency situation reported in ${langName}",
  "dangerLevel": "Short description of immediate danger level in ${langName}",
  "immediateActions": [
    "Safety-first instruction 1 in ${langName}",
    "Safety-first instruction 2 in ${langName}",
    "Safety-first instruction 3 in ${langName}",
    "Safety-first instruction 4 in ${langName}"
  ],
  "doNotDo": [
    "Hazard action to avoid 1 in ${langName}",
    "Hazard action to avoid 2 in ${langName}",
    "Hazard action to avoid 3 in ${langName}"
  ],
  "recommendedHelpline": "112",
  "helplineName": "Unified Emergency Response"
}

Safety Requirements:
- If someone is injured, unconscious, bleeding, trapped, or facing fire/flood, severity MUST be CRITICAL or HIGH.
- Immediate actions must be actionable and safety-first. Keep instructions short and clear.
- Gemini must NEVER invent emergency numbers. Recommended helpline must remain numeric digits (e.g. 112, 100, 101, 108) and NEVER translated into words.`;

  if (ai) {
    try {
      const { text, usedModel } = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: 'application/json',
        temperature: 0.2,
      });

      let parsedData;
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsedData = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } else {
        parsedData = JSON.parse(cleaned);
      }

      if (!parsedData.recommendedHelpline) {
        parsedData.recommendedHelpline = '112';
        parsedData.helplineName = 'Unified Emergency Response';
      }

      return {
        success: true,
        isLive: true,
        usedModel,
        data: parsedData,
      };
    } catch (error) {
      console.error('Error calling Gemini for speech report:', error.message);
      return {
        success: true,
        isLive: false,
        warning: `Gemini API call error: ${error.message}. Generated speech intelligence heuristic.`,
        data: generateVoiceFallbackAnalysis(speechText, language),
      };
    }
  } else {
    console.log('GEMINI_API_KEY not configured. Using voice intelligence synthesis.');
    return {
      success: true,
      isLive: false,
      warning: 'GEMINI_API_KEY is not configured in backend .env. Output generated using voice intelligence engine.',
      data: generateVoiceFallbackAnalysis(speechText, language),
    };
  }
}
