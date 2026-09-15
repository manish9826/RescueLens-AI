import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

const STORAGE_KEY = 'rescuelens_a11y_settings';

const DEFAULT_SETTINGS = {
  largeText: false,
  highContrast: false,
  voiceInstructions: false,
  reducedMotion: false,
  screenReaderFriendly: false,
  largeButtons: false
};

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState('');

  // Persist and apply classes to <html>
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save a11y settings:', e);
    }

    const root = document.documentElement;

    // Apply or remove classes
    root.classList.toggle('a11y-large-text', settings.largeText);
    root.classList.toggle('a11y-high-contrast', settings.highContrast);
    root.classList.toggle('a11y-reduced-motion', settings.reducedMotion);
    root.classList.toggle('a11y-large-buttons', settings.largeButtons);
    root.classList.toggle('a11y-screen-reader', settings.screenReaderFriendly);
  }, [settings]);

  // Voice announcement helper
  const announce = (message) => {
    setLiveAnnounce(message);
    if (settings.voiceInstructions && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      announce(`${label} ${updated[key] ? 'enabled' : 'disabled'}`);
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    announce('Accessibility settings reset to default');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleSetting,
        resetSettings,
        modalOpen,
        openModal: () => setModalOpen(true),
        closeModal: () => setModalOpen(false),
        announce
      }}
    >
      {children}
      
      {/* Hidden Live Region for Screen Readers */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {liveAnnounce}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
