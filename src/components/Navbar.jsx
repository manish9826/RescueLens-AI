import React from 'react';
import { ShieldAlert, Activity, Bot, PlusCircle, LayoutDashboard, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiStatus, toggleCommanderChat, commanderOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-[#070A12]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-all">
              <ShieldAlert className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  RescueLens <span className="text-red-500 font-mono">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Gemini Powered
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Emergency Intelligence Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'report' || activeTab === 'result'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Emergency
            </button>

            <button
              onClick={() => setActiveTab('command')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'command'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Command Center
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Gemini Live API Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${apiStatus?.geminiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[11px] text-slate-300">
                {apiStatus?.geminiConfigured ? 'Gemini Live' : 'Demo Mode'}
              </span>
            </div>

            {/* Toggle Emergency Commander Button */}
            <button
              onClick={toggleCommanderChat}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                commanderOpen 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/40 ring-2 ring-cyan-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Emergency Commander</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-slate-800/80 bg-slate-950 px-2 py-2 justify-around">
        <button
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium ${
            activeTab === 'landing' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium ${
            activeTab === 'report' || activeTab === 'result' ? 'bg-red-600 text-white' : 'text-slate-400'
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('command')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium ${
            activeTab === 'command' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          Command
        </button>
      </div>
    </header>
  );
}
