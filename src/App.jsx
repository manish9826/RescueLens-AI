import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import IncidentReport from './components/IncidentReport';
import AnalysisResult from './components/AnalysisResult';
import CommandCenter from './components/CommandCenter';
import EmergencyCommanderChat from './components/EmergencyCommanderChat';
import { DEMO_INCIDENTS } from './data/demoIncidents';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [incidents, setIncidents] = useState(DEMO_INCIDENTS);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commanderOpen, setCommanderOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({ geminiConfigured: false, online: false });

  // Fetch backend health status on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setApiStatus({
          geminiConfigured: Boolean(data.geminiConfigured),
          online: true
        });
      })
      .catch(() => {
        setApiStatus({ geminiConfigured: false, online: false });
      });
  }, []);

  // Handle emergency analysis submission
  const handleAnalyze = async ({ image, mimeType, description }) => {
    setIsLoading(true);
    setError(null);
    setCurrentImage(image);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, mimeType, description }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to process emergency scene analysis.');
      }

      setCurrentAnalysis(result);
      setActiveTab('result');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during Gemini analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Dispatch live Gemini analyzed report into Command Center Dashboard
  const handleDispatchToCommandCenter = (analysisData, image) => {
    const newIncident = {
      id: `INC-RL${Math.floor(1000 + Math.random() * 9000)}`,
      incidentType: analysisData.incidentType || 'Live Emergency Incident',
      severity: analysisData.severity || 'HIGH',
      priorityScore: analysisData.priorityScore || 85,
      confidence: analysisData.confidence || 90,
      summary: analysisData.summary || 'Live Gemini analyzed emergency report.',
      risks: analysisData.risks || [],
      immediateActions: analysisData.immediateActions || [],
      resources: analysisData.resources || [],
      image: image,
      location: 'Ground Zero Sector (Live Upload)',
      timestamp: 'Just now',
      isDemo: false,
      status: 'ACTIVE'
    };

    setIncidents(prev => [newIncident, ...prev]);
    setActiveTab('command');
  };

  const handleResetReport = () => {
    setCurrentAnalysis(null);
    setCurrentImage(null);
    setError(null);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-red-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiStatus={apiStatus}
        toggleCommanderChat={() => setCommanderOpen(!commanderOpen)}
        commanderOpen={commanderOpen}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage 
            setActiveTab={setActiveTab} 
            toggleCommanderChat={() => setCommanderOpen(true)}
          />
        )}

        {(activeTab === 'report' || (activeTab === 'result' && !currentAnalysis)) && (
          <IncidentReport 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            error={error} 
          />
        )}

        {activeTab === 'result' && currentAnalysis && (
          <AnalysisResult 
            result={currentAnalysis}
            image={currentImage}
            onDispatch={handleDispatchToCommandCenter}
            onReset={handleResetReport}
            toggleCommanderChat={() => setCommanderOpen(true)}
          />
        )}

        {activeTab === 'command' && (
          <CommandCenter 
            incidents={incidents}
            onSelectReport={(inc) => console.log('Selected:', inc)}
            toggleCommanderChat={() => setCommanderOpen(true)}
          />
        )}
      </main>

      {/* Emergency Commander Chat Drawer */}
      <EmergencyCommanderChat 
        isOpen={commanderOpen}
        onClose={() => setCommanderOpen(false)}
        incidents={incidents}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
