import React from 'react';
import { ShieldAlert, Activity, Bot, PlusCircle, LayoutDashboard, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiStatus, toggleCommanderChat, commanderOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  RescueLens <span className="text-red-500 font-mono">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300">
                  <Cpu className="w-3 h-3 text-cyan-400" /> Gemini 2.5
                </span>
              </div>
              <span className="block text-[11px] text-slate-400 font-medium tracking-wide">
                Emergency Intelligence Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'report' || activeTab === 'result'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Emergency
            </button>

            <button
              onClick={() => setActiveTab('command')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'command'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Command Center
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Backend API Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${apiStatus?.geminiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-[11px] text-slate-300 font-mono">
                {apiStatus?.geminiConfigured ? 'Gemini Live' : 'Demo Engine'}
              </span>
            </div>

            {/* Toggle Emergency Commander Chat Button */}
            <button
              onClick={toggleCommanderChat}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                commanderOpen 
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-2 ring-cyan-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Emergency Commander</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-950 px-2 py-1.5 justify-around">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'landing' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'report' || activeTab === 'result' ? 'bg-red-600 text-white' : 'text-slate-400'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('command')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'command' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          Command Center
        </button>
      </div>
    </header>
  );
}
