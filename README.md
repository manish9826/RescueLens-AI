# RescueLens AI — Emergency Intelligence Platform

> **Tagline:** See the emergency. Understand the risk. Act faster.

RescueLens AI is a hackathon-ready, AI-powered emergency intelligence platform designed for rapid situational analysis, risk assessment, and decision support during crisis events. First responders, emergency coordinators, and dispatchers can upload emergency scene photos (or select preset crisis scenarios) along with optional descriptions.

The platform processes the multimodal image data via a secure Node.js/Express backend using the official `@google/genai` SDK to produce structured JSON decision-support intelligence.

---

## 🚨 Problem Statement

During natural disasters, urban flooding, structural fires, and high-speed highway collisions:
1. **Information Overload & Delay**: Emergency dispatchers receive chaotic, fragmented, or unverified verbal scene descriptions.
2. **Visual Hazard Blind Spots**: Critical physical threats (e.g. submerged high-voltage transformers, toxic smoke plumes, compromised load-bearing structures) are easily missed during initial triage.
3. **Resource Misallocation**: Units are often misassigned without accurate priority scoring.

---

## 💡 Solution

**RescueLens AI** transforms raw crisis imagery into structured, actionable intelligence in under 3 seconds:
- **Multimodal Visual Telemetry**: Uses Google Gemini 2.5 vision models to inspect photos for thermal hazards, water depth, debris flow, structural wall integrity, and vehicle entrapment.
- **Algorithmic Priority Scoring**: Computes a priority score (0–100) and severity classification (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) to rank dispatch queues.
- **Immediate Response Protocols**: Generates structured, actionable responder checklists and lists specific required emergency response units.
- **Emergency Commander AI Assistant**: An interactive tactical assistant powered by Gemini API to answer operational queries like *"Which incident should be handled first?"* or *"What resources are required?"*.

---

## ⚙️ Key Features

1. **Landing Page**: Emergency hero section with tagline, live stats, workflow breakdown, and quick action CTAs.
2. **Emergency Scene Reporting**: Drag-and-drop file uploader, preset emergency scene samples (flood, fire, crash, collapse), optional description input, and animated radar scanner overlay.
3. **Gemini 2.5 Vision Analysis**: Multimodal analysis generating structured JSON containing:
   - `incidentType`
   - `severity` (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
   - `priorityScore` (0-100)
   - `confidence` (0-100)
   - `summary`
   - `risks` (array of detected hazards)
   - `immediateActions` (array of step-by-step actions)
   - `resources` (array of required emergency units)
4. **Analysis Result Dashboard**: Dynamic cards presenting priority meters, hazard alerts, action items, unit requirements, and one-click dispatch to the Command Center.
5. **Command Center Dashboard**: Live metrics overview (Active, Critical, High Priority, Resolved), filterable incident stream, and distinction badges between real Gemini AI scans and demo streams.
6. **Emergency Commander AI**: Gemini-powered conversational decision support panel with contextual awareness of all active incidents in the Command Center.
7. **Safety & Advisory Compliance**: Prominent disclaimers reinforcing that recommendations are decision-support only and must be verified by field personnel.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS (Tactical dark theme with glassmorphism, radar animations, neon status pills)
- **Icons**: Lucide React

### Backend
- **Server**: Node.js + Express
- **AI SDK**: Official `@google/genai` SDK (`GoogleGenAI` client)
- **Environment Management**: `dotenv`
- **Security**: API key strictly stored server-side; never exposed to client code.

```
RescueLens AI/
├── server/
│   ├── index.js          # Express server with CORS & body parsing
│   ├── geminiService.js  # @google/genai SDK integration & fallback generator
│   └── routes/
│       ├── analyze.js    # POST /api/analyze endpoint
│       └── commander.js  # POST /api/commander endpoint
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SafetyDisclaimer.jsx
│   │   ├── LandingPage.jsx
│   │   ├── IncidentReport.jsx
│   │   ├── AnalysisResult.jsx
│   │   ├── CommandCenter.jsx
│   │   └── EmergencyCommanderChat.jsx
│   ├── data/
│   │   └── demoIncidents.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 🔐 Gemini API Integration Details

The backend utilizes the official `@google/genai` SDK to interact with the `gemini-2.5-flash` model:

```js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [
    {
      inlineData: {
        data: base64ImageData,
        mimeType: 'image/jpeg',
      },
    },
    systemPrompt,
  ],
  config: {
    responseMimeType: 'application/json',
  },
});
```

*Note:* If `GEMINI_API_KEY` is not present in `.env`, the backend gracefully operates in synthesized intelligence mode so judges and reviewers can test all prototype features out of the box.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/rescuelens-ai.git
cd rescuelens-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Run Development Server
```bash
npm run dev
```
This launches both the Express backend (`http://localhost:3001`) and the Vite React frontend (`http://localhost:5173`) concurrently.

---

## 🔮 Future Scope
- **Drone Telemetry Stream**: Live video frame analysis from unmanned aerial vehicles (UAVs).
- **GIS Heatmap Integration**: Real-time spatial mapping with live GPS coordinates.
- **Multi-Lingual Responder Briefings**: Automatic translation of tactical actions into local regional languages.
- **Offline Edge Inference**: On-device lightweight model fallback for remote disaster areas with lost connectivity.

---

## ⚠️ Safety Disclaimer
> AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel.
