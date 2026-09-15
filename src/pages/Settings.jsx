import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { Palette, Globe, Bell, Shield, LogOut, ArrowLeft, Camera, Mic, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [emergencyAlerts, setEmergencyAlerts] = useState(localStorage.getItem('emergencyAlerts') !== 'false');
  const [generalAlerts, setGeneralAlerts] = useState(localStorage.getItem('generalAlerts') !== 'false');

  const [permissions, setPermissions] = useState({
    camera: 'checking...',
    mic: 'checking...',
    location: 'checking...'
  });

  useEffect(() => {
    // Check permissions safely (some browsers don't support all queries)
    const checkPerm = async (name) => {
      try {
        const res = await navigator.permissions.query({ name });
        return res.state;
      } catch (e) {
        return 'unknown';
      }
    };

    Promise.all([
      checkPerm('camera').catch(() => 'unknown'),
      checkPerm('microphone').catch(() => 'unknown'),
      checkPerm('geolocation').catch(() => 'unknown')
    ]).then(([cam, mic, loc]) => {
      setPermissions({ camera: cam, mic, location: loc });
    });
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAlertChange = (type, val) => {
    if (type === 'emergency') {
      setEmergencyAlerts(val);
      localStorage.setItem('emergencyAlerts', val);
    } else {
      setGeneralAlerts(val);
      localStorage.setItem('generalAlerts', val);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">Manage your account preferences and configurations</p>
        </div>

        <div className="p-6 sm:p-10 space-y-10">
          
          {/* Appearance */}
          <section>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-cyan-600" /> Appearance
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Theme Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${theme === t ? 'bg-cyan-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Language */}
          <section>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" /> Language
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Interface Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-amber-500" /> Notifications
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Emergency Alerts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Push notifications for critical nearby incidents.</p>
                </div>
                <button 
                  onClick={() => handleAlertChange('emergency', !emergencyAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${emergencyAlerts ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emergencyAlerts ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>
              <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">General Updates</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">System updates and general information.</p>
                </div>
                <button 
                  onClick={() => handleAlertChange('general', !generalAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${generalAlerts ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${generalAlerts ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-500" /> Privacy & Security
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Permissions are only requested when features are actively used. We never record background data.</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg"><Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" /></div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Camera</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">{permissions.camera}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg"><Mic className="w-4 h-4 text-slate-600 dark:text-slate-300" /></div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Microphone</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">{permissions.mic}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg"><MapPin className="w-4 h-4 text-slate-600 dark:text-slate-300" /></div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Location</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">{permissions.location}</span>
              </div>
            </div>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-500" /> Account Details
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Logged in as {user?.name}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
