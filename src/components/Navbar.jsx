import React from 'react';
import { Activity, Bot, PlusCircle, LayoutDashboard, Sparkles } from 'lucide-react';
import RescueLensLogo from './RescueLensLogo';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ activeTab, setActiveTab, apiStatus, toggleCommanderChat, commanderOpen }) {
  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Redesigned Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="cursor-pointer group"
          >
            <RescueLensLogo size="md" />
          </div>

          {/* Center Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'landing'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'report' || activeTab === 'result'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Emergency
            </button>

            <button
              onClick={() => setActiveTab('command')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'command'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Command Center
            </button>

            <button
              onClick={toggleCommanderChat}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                commanderOpen
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Emergency Commander
            </button>
          </nav>

          {/* Right Controls Bar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Gemini Powered Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 text-xs text-cyan-800 dark:text-cyan-300 font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Gemini Powered
            </div>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-2 justify-around">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
            activeTab === 'landing' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
            activeTab === 'report' || activeTab === 'result' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('command')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
            activeTab === 'command' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Command
        </button>
        <button
          onClick={toggleCommanderChat}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex items-center gap-1"
        >
          <Bot className="w-3.5 h-3.5" /> AI
        </button>
      </div>
    </header>
  );
}
