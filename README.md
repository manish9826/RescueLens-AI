# RescueLens AI

"See the Emergency. Understand the Risk. Act Faster."

> **SAFETY DISCLAIMER:** RescueLens AI is an AI-assisted emergency decision-support prototype. It does not replace emergency responders and does not automatically contact emergency services.

RescueLens AI is a secure, polished, hackathon-ready emergency intelligence platform designed to analyze live scenes using Google Gemini Vision AI and provide immediate, localized, safety-first decision support.

## Features

- **Live Rescue Assistant**: Point your camera at the scene, capture, and let Gemini Vision analyze the severity and immediate risks.
- **Strict Emergency Categorization**: Outputs consistent JSON data prioritizing severity and confidence.
- **Location Permissions**: Secure location gathering with options for Live Location tracking and Sharing.
- **Emergency Helpline Recommendation**: Maps AI-identified incidents to verified regional helplines (e.g., 112, 101, 108) via a secure backend directory.
- **Demo Mode**: Includes pre-configured incident scenarios to demonstrate the flow without burning API credits or making live calls.
- **Command Center Integration**: Analyzed emergencies can be dispatched to a central dashboard.
- **Security & Privacy**: 
  - Express Rate Limiting.
  - JWT Authentication (Mock/In-Memory).
  - Strict input sanitization and payload limits.
  - No secret keys exposed on the frontend.

## Architecture

- **Frontend**: React + Vite + TailwindCSS. Uses `react-leaflet` for maps.
- **Backend**: Node.js + Express.
- **AI**: Google Gemini API (`@google/genai`).

## Setup

1. Copy `.env.example` to `.env` in the root directory.
2. Add your Gemini API key and JWT secret:
   ```env
   GEMINI_API_KEY=your_key_here
   JWT_SECRET=super_secret_jwt
   PORT=3001
   ```
3. Run `npm install`
4. Run `npm run dev` to start both the frontend and backend concurrently.

## Environment Variables

Ensure these are set in your `.env` (never commit this file):
- `GEMINI_API_KEY`: Google AI Studio Key.
- `JWT_SECRET`: Secret for user auth.
- `PORT`: Backend port (default 3001).

## Privacy

- RescueLens only accesses your camera and location after your permission.
- Your location is not automatically sent to emergency services.
- RescueLens does not automatically call or SMS emergency services.
- AI-generated recommendations may be incorrect and should be verified.
