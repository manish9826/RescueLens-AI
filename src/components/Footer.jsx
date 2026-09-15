import React from 'react';
import { Link } from 'react-router-dom';
import RescueLensLogo from './RescueLensLogo';
import { Activity, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <RescueLensLogo size="sm" />
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed max-w-md">
              AI-powered emergency intelligence platform built for rapid situational analysis, risk assessment, and decision support during crisis events. Powered by Google Gemini multimodal AI.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> @google/genai SDK</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Real-time Triage</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase font-mono">Platform Navigation</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block">
                  System Overview
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block">
                  Report Emergency Scene
                </Link>
              </li>
              <li>
                <Link to="/command" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block">
                  Command Center Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-3 text-xs tracking-wider uppercase font-mono">Compliance & Disclaimer</h4>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              AI-generated recommendations are decision-support only and should be verified by qualified emergency personnel.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} RescueLens AI — Emergency Intelligence Platform.
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="px-2.5 py-0.5 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded font-mono text-[10px] font-bold">
              Google Gemini
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
