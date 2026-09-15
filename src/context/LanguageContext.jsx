import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Session / Local persistence
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('rescuelens_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (newLang) => {
    const valid = SUPPORTED_LANGUAGES.some(l => l.code === newLang);
    const code = valid ? newLang : 'en';
    setLanguageState(code);
    try {
      localStorage.setItem('rescuelens_lang', code);
    } catch (e) {
      console.warn('Could not persist language choice:', e);
    }
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Translation lookup with fallback to English
  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    return TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangInfo,
        languages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
