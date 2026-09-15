import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTranslation } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import IncidentReport from './components/IncidentReport';
import AnalysisResult from './components/AnalysisResult';
import RescueMode from './components/RescueMode';
import VoiceEmergencyAssistant from './components/VoiceEmergencyAssistant';
import CommandCenter from './components/CommandCenter';
import EmergencyCommanderChat from './components/EmergencyCommanderChat';
import Toast from './components/Toast';
import LiveRescue from './components/LiveRescue';
import DemoMode from './components/DemoMode';
import OneTapHelpModal from './components/OneTapHelpModal';
import OfflineBanner from './components/OfflineBanner';
import InstallBanner from './components/InstallBanner';
import { PWAProvider } from './context/PWAContext';
import AccessibilityModal from './components/AccessibilityModal';
import BePrepared from './components/BePrepared';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { DEMO_INCIDENTS } from './data/demoIncidents';
import SecureLiveLocation from './components/SecureLiveLocation';

// Layout wrapper for authenticated/main app pages
function AppLayout({ 
  commanderOpen, 
  setCommanderOpen, 
  incidents, 
  setIncidents, 
  handleDispatchToCommandCenter, 
  currentAnalysis, 
  currentImage, 
  handleAnalyze, 
  isLoading, 
  error, 
  handleResetReport, 
  apiStatus, 
  setCurrentAnalysis, 
  setCurrentImage,
  helpModalOpen,
  setHelpModalOpen
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-red-500 selection:text-white transition-colors">
      <OfflineBanner />
      <Navbar 
        apiStatus={apiStatus}
        toggleCommanderChat={() => setCommanderOpen(!commanderOpen)}
        commanderOpen={commanderOpen}
        openHelpModal={() => setHelpModalOpen(true)}
      />
      
      <main className="flex-1 w-full flex flex-col items-center">
        <Routes>
          <Route path="/" element={
            <LandingPage 
              toggleCommanderChat={() => setCommanderOpen(true)} 
              openHelpModal={() => setHelpModalOpen(true)} 
            />
          } />
          <Route path="/quick-help" element={
            <div className="max-w-xl w-full mx-auto px-4 py-8">
              <OneTapHelpModal isOpen={true} onClose={() => navigate('/')} />
            </div>
          } />
          <Route path="/report" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <IncidentReport onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />
            </div>
          } />
          <Route path="/live" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <LiveRescue onAnalyze={handleAnalyze} isLoading={isLoading} error={error} />
            </div>
          } />
          <Route path="/demo" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <DemoMode onDispatch={handleDispatchToCommandCenter} />
            </div>
          } />
          <Route path="/voice" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <VoiceEmergencyAssistant 
                onAnalysisComplete={(res) => {
                  setCurrentAnalysis(res);
                  setCurrentImage(null);
                }}
              />
            </div>
          } />
          <Route path="/rescue-mode" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <RescueMode 
                result={currentAnalysis}
                image={currentImage}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                error={error}
                onDispatch={handleDispatchToCommandCenter}
                onReset={handleResetReport}
                toggleCommanderChat={() => setCommanderOpen(true)}
              />
            </div>
          } />
          <Route path="/result" element={
            currentAnalysis ? (
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <AnalysisResult 
                  result={currentAnalysis}
                  image={currentImage}
                  onDispatch={handleDispatchToCommandCenter}
                  onReset={handleResetReport}
                  toggleCommanderChat={() => setCommanderOpen(true)}
                />
              </div>
            ) : (
              <Navigate to="/report" replace />
            )
          } />
          <Route path="/command" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <CommandCenter 
                incidents={incidents}
                setIncidents={setIncidents}
                onSelectReport={(inc) => {}}
                toggleCommanderChat={() => setCommanderOpen(true)}
              />
            </div>
          } />
          <Route path="/preparedness" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <BePrepared />
            </div>
          } />
          <Route path="/nearby" element={
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <SecureLiveLocation />
            </div>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Profile />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Settings />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <OneTapHelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />

      <EmergencyCommanderChat 
        isOpen={commanderOpen}
        onClose={() => setCommanderOpen(false)}
        incidents={incidents}
      />

      <AccessibilityModal />

      <Footer />
    </div>
  );
}

export default function App() {
  const [incidents, setIncidents] = useState(DEMO_INCIDENTS);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commanderOpen, setCommanderOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({ geminiConfigured: false, online: false });
  const [toast, setToast] = useState(null);
  
  const navigate = useNavigate();
  const { token, isDemo, logout } = useAuth();
  const { language } = useTranslation();

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

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

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setError(null);
    setCurrentImage(payload.image);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from server:", text.substring(0, 200));
        if (res.status === 413) {
          throw new Error("The image file is too large. Please upload a smaller image.");
        }
        throw new Error(`Server connection issue (Status: ${res.status}). Please ensure the backend is running and try again.`);
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to analyze emergency scene.');
      }

      setCurrentAnalysis(data);

      if (data.data && (data.data.severity === 'HIGH' || data.data.severity === 'CRITICAL')) {
        navigate('/rescue-mode');
      } else {
        navigate('/result');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchToCommandCenter = async (analysisData, sceneImage) => {
    const newIncident = {
      id: 'INC-' + Math.floor(1000 + Math.random() * 9000),
      incidentType: analysisData.incidentType || 'Unspecified Emergency',
      emergencyCategory: analysisData.emergencyCategory || 'OTHER',
      severity: analysisData.severity || 'MEDIUM',
      priorityScore: analysisData.priorityScore || 50,
      confidence: analysisData.confidence || 75,
      summary: analysisData.summary || 'Incident reported through RescueLens AI.',
      dangerLevel: analysisData.dangerLevel || 'Unknown Danger',
      immediateActions: analysisData.immediateActions || [],
      doNotDo: analysisData.doNotDo || [],
      rescueResources: analysisData.rescueResources || [],
      image: sceneImage,
      location: analysisData.location || 'Unknown Coordinates',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE'
    };

    if (isDemo) {
      setIncidents(prev => [newIncident, ...prev]);
      navigate('/command');
      showToast(`Incident #${newIncident.id} Dispatched to Demo Command Center!`, 'success');
      return;
    }

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newIncident)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Optimistically add to state, or let CommandCenter refetch
        setIncidents(prev => [newIncident, ...prev]);
        navigate('/command');
        showToast(`Incident #${newIncident.id} Dispatched to Command Center!`, 'success');
      } else {
        showToast(data.error || 'Failed to dispatch incident.', 'error');
      }
    } catch (err) {
      showToast('Network error while saving incident.', 'error');
    }
  };

  const handleResetReport = () => {
    setCurrentAnalysis(null);
    setCurrentImage(null);
    setError(null);
    navigate('/report');
  };

  return (
    <PWAProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={
          <AppLayout 
            commanderOpen={commanderOpen}
            setCommanderOpen={setCommanderOpen}
            incidents={incidents}
            setIncidents={setIncidents}
            handleDispatchToCommandCenter={handleDispatchToCommandCenter}
            currentAnalysis={currentAnalysis}
            currentImage={currentImage}
            handleAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
            handleResetReport={handleResetReport}
            apiStatus={apiStatus}
            setCurrentAnalysis={setCurrentAnalysis}
            setCurrentImage={setCurrentImage}
            helpModalOpen={helpModalOpen}
            setHelpModalOpen={setHelpModalOpen}
          />
        } />
      </Routes>
      <InstallBanner />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </PWAProvider>
  );
}
