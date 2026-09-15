import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage, languages, currentLangInfo } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="language-selector-button"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all active:scale-95 cursor-pointer"
        title="Select Language / भाषा चुनें"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-500" />
        <span>{currentLangInfo.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          id="language-selector-dropdown"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#0b1426] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
            Select Language / भाषा
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    {lang.code !== 'en' && (
                      <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                    )}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
