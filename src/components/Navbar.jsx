import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Bot, PlusCircle, LayoutDashboard, Camera, PlayCircle, Menu, X, Mic, Download, MoreHorizontal, ShieldAlert, User, LogOut, Settings, LogIn, FileText } from 'lucide-react';
import RescueLensLogo from './RescueLensLogo';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { usePWA } from '../context/PWAContext';

export default function Navbar({ apiStatus, toggleCommanderChat, commanderOpen, openHelpModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isDemo, logout } = useAuth();
  const { t } = useTranslation();
  const { openModal: openAccessibilityModal } = useAccessibility();
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const profileDropdownRef = useRef(null);

  const currentPath = location.pathname;

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [currentPath]);

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: Activity, label: t('navHome'), hideInPrimary: false },
    { to: '/report', icon: PlusCircle, label: t('navUpload'), hideInPrimary: false, activeClass: 'bg-slate-800 text-white shadow-md shadow-slate-800/20' },
    { to: '/voice', icon: Mic, label: t('navVoice'), hideInPrimary: false, activeClass: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20', textClass: 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700' },
    { to: '/live', icon: Camera, label: t('navLive'), hideInPrimary: false, activeClass: 'bg-red-600 text-white shadow-md shadow-red-600/20', textClass: 'text-red-500 hover:text-red-600 dark:text-red-400' },
    { to: '/command', icon: LayoutDashboard, label: t('navCommand'), hideInPrimary: false, activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/20' },
    { to: '/demo', icon: PlayCircle, label: t('navDemo'), hideInPrimary: true, activeClass: 'bg-orange-500 text-white shadow-md shadow-orange-500/20', textClass: 'text-orange-500 hover:text-orange-600 dark:text-orange-400' },
    { to: '/preparedness', icon: ShieldAlert, label: t('navPreparedness'), hideInPrimary: true, activeClass: 'bg-amber-600 text-white shadow-md shadow-amber-600/20', textClass: 'text-amber-600 dark:text-amber-400 hover:text-amber-700' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 w-full">
        <div className="flex items-center justify-between h-16 gap-2 xl:gap-4">
          
          {/* Left: Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="cursor-pointer shrink-0">
              <RescueLensLogo size="md" />
            </Link>
          </div>

          {/* Center Navigation Bar (Hidden on Mobile/Tablet) */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl shrink-0">
              {navLinks.filter(l => !l.hideInPrimary).map((link) => {
                const isActive = currentPath === link.to || (link.to === '/report' && currentPath === '/result');
                const Icon = link.icon;
                
                const defaultActive = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700';
                const defaultHover = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40';
                
                const appliedClass = isActive 
                  ? (link.activeClass || defaultActive)
                  : (link.textClass ? `${link.textClass} hover:bg-slate-200/50 dark:hover:bg-slate-800/40` : defaultHover);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${appliedClass}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{link.label}</span>
                  </Link>
                )
              })}

              {/* More Dropdown for Desktop/Tablet */}
              <div className="relative">
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-[11px] xl:text-xs font-bold flex items-center gap-1 transition-all ${
                    moreMenuOpen ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden xl:inline">More</span>
                </button>
                
                {moreMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                      {navLinks.filter(l => l.hideInPrimary).map(link => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${link.textClass || 'text-slate-700 dark:text-slate-300'}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {link.label}
                          </Link>
                        )
                      })}
                      <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                      <button
                        onClick={() => { setMoreMenuOpen(false); toggleCommanderChat(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        {t('navCommander')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>

          {/* Right Controls Bar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 justify-end">
            
            {/* 🆘 I NEED HELP */}
            <button
              onClick={openHelpModal}
              id="navbar-i-need-help-button"
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer animate-pulse border border-red-400 whitespace-nowrap"
            >
              <span className="text-sm">🆘</span>
              <span className="hidden sm:inline">I NEED HELP</span>
              <span className="sm:hidden">HELP</span>
            </button>

            {/* ♿ Accessibility */}
            <button
              onClick={openAccessibilityModal}
              aria-label="Accessibility Mode"
              title="♿ ACCESSIBILITY MODE"
              className="px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center text-sm sm:text-base shrink-0"
            >
              ♿
            </button>

            {/* PWA Install */}
            {isInstallable && !isInstalled && (
              <button
                onClick={promptInstall}
                className="hidden md:flex px-2 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/40 dark:hover:bg-cyan-800/60 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700 transition-colors items-center justify-center shrink-0"
                title="Install App"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1">
              <LanguageSelector />
            </div>
            
            <ThemeToggle />

            {/* User Profile / Login */}
            <div className="relative ml-1 sm:ml-2" ref={profileDropdownRef}>
              {user ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                  title={user.name || 'Profile'}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              {profileDropdownOpen && user && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#0B1221] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name || 'Emergency Responder'}</p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  
                  <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <User className="w-4 h-4 text-cyan-600 dark:text-cyan-500" />
                    Profile
                  </Link>
                  <Link to="/command" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <FileText className="w-4 h-4 text-amber-500" />
                    My Incidents
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <Settings className="w-4 h-4 text-slate-500" />
                    Settings
                  </Link>
                  
                  <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Full-Screen Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-40 bg-white dark:bg-[#090D16] px-4 pb-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 max-w-md mx-auto pt-4">
            
            {/* Mobile User Profile Section */}
            {user ? (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{user.name || 'Responder'}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{user.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="mb-2 w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-black text-white bg-slate-800 shadow-lg">
                <LogIn className="w-5 h-5" />
                LOG IN / SIGN UP
              </Link>
            )}

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>

            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-colors ${
                    isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-700 dark:text-slate-300'
                  } ${!isActive && link.textClass ? link.textClass : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            
            <button
              onClick={toggleCommanderChat}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/50"
            >
              <Bot className="w-5 h-5" />
              {t('navCommander')}
            </button>
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
            
            <div className="flex items-center justify-between px-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Language Preference</span>
              <LanguageSelector />
            </div>
            
            {isInstallable && !isInstalled && (
              <button
                onClick={promptInstall}
                className="mt-6 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg"
              >
                <Download className="w-5 h-5" />
                INSTALL APP
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
