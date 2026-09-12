import React from 'react';
import { ShieldAlert, Cpu, Activity, HeartHandshake } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              RescueLens AI
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              AI-powered emergency intelligence platform built for rapid situational analysis, risk assessment, and decision support during crisis events. Powered by Google Gemini 2.5 multimodal AI model.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> @google/genai SDK</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Real-time Triage</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs tracking-wider uppercase">Platform Navigation</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => setActiveTab('landing')} className="hover:text-cyan-400 transition-colors">
                  System Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-cyan-400 transition-colors">
                  Report Emergency Scene
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('command')} className="hover:text-cyan-400 transition-colors">
                  Command Center Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs tracking-wider uppercase">Compliance & Disclaimer</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} RescueLens AI — Built for Emergency Intelligence & Disaster Response.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono text-[10px]">
              Google Gemini API
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
