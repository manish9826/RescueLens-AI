import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Truck, 
  Clock, 
  ChevronRight, 
  X,
  MapPin,
  Bot,
  Radio,
  Layers,
  Crosshair
} from 'lucide-react';
import SafetyDisclaimer from './SafetyDisclaimer';

export default function CommandCenter({ incidents, onSelectReport, toggleCommanderChat }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalIncident, setSelectedModalIncident] = useState(null);
  const [activeTabSector, setActiveTabSector] = useState('grid'); // 'grid' | 'map'

  // Compute metrics
  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const highCount = incidents.filter(i => i.severity === 'HIGH' && i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  // Filtered list sorted by priority score descending
  const filteredIncidents = incidents
    .filter(i => {
      if (filterSeverity !== 'ALL' && i.severity !== filterSeverity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          i.incidentType?.toLowerCase().includes(q) ||
          i.summary?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.id?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const getSeverityBadge = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-950/90 border-red-500/60 text-red-300 glow-red';
      case 'HIGH':
        return 'bg-orange-950/90 border-orange-500/60 text-orange-300';
      case 'MEDIUM':
        return 'bg-amber-950/90 border-amber-500/60 text-amber-300';
      case 'LOW':
        return 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Operations Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel border border-slate-800 p-6 rounded-3xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              CRISIS OPERATIONS DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Emergency Command Center</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Map vs Grid Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTabSector('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                activeTabSector === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTabSector('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                activeTabSector === 'map' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Sector Map
            </button>
          </div>

          <button
            onClick={toggleCommanderChat}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
          >
            <Bot className="w-4 h-4" />
            Commander AI
          </button>
        </div>
      </div>

      <SafetyDisclaimer compact />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Active Metric */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Active Incidents</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activeCount}</div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Telemetry Feed
          </div>
        </div>

        {/* Critical Metric */}
        <div className="glass-card p-5 rounded-3xl border border-red-500/40 bg-red-950/20 space-y-2">
          <div className="flex items-center justify-between text-red-400 text-xs font-mono uppercase tracking-wider">
            <span>Critical Tier</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">{criticalCount}</div>
          <div className="text-[11px] text-red-300 font-medium font-mono">Immediate Staging Required</div>
        </div>

        {/* High Priority Metric */}
        <div className="glass-card p-5 rounded-3xl border border-orange-500/40 bg-orange-950/10 space-y-2">
          <div className="flex items-center justify-between text-orange-400 text-xs font-mono uppercase tracking-wider">
            <span>High Priority</span>
            <ShieldAlert className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-orange-400 font-mono">{highCount}</div>
          <div className="text-[11px] text-orange-300 font-medium font-mono">Secondary Dispatch</div>
        </div>

        {/* Resolved Metric */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{resolvedCount}</div>
          <div className="text-[11px] text-slate-400 font-medium font-mono">Cleared & Stabilized</div>
        </div>

      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                filterSeverity === sev
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident type, ID, or location..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

      </div>

      {/* View Sector 1: Interactive Tactical Sector Radar Map */}
      {activeTabSector === 'map' && (
        <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
              <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
              TACTICAL SECTOR RADAR MAP (LIVE DISPATCH COORDINATES)
            </div>
            <span className="text-[10px] font-mono text-slate-400">SECTOR GRID: QUAD 4</span>
          </div>

          <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden bg-grid-cyber flex items-center justify-center">
            {/* Simulated Radar Rings */}
            <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20" />
            <div className="absolute w-48 h-48 rounded-full border border-cyan-500/30" />
            <div className="absolute w-24 h-24 rounded-full border border-cyan-500/40" />

            {/* Incident Map Pings */}
            {filteredIncidents.slice(0, 5).map((inc, idx) => {
              const offsets = [
                { top: '30%', left: '40%' },
                { top: '60%', left: '70%' },
                { top: '25%', left: '75%' },
                { top: '70%', left: '30%' },
                { top: '45%', left: '20%' },
              ];
              const pos = offsets[idx % offsets.length];
              return (
                <div
                  key={inc.id}
                  style={pos}
                  onClick={() => setSelectedModalIncident(inc)}
                  className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative flex items-center justify-center">
                    <span className={`w-4 h-4 rounded-full ${inc.severity === 'CRITICAL' ? 'bg-red-500 beacon-red' : 'bg-orange-500 animate-ping'}`} />
                    <span className="absolute w-2 h-2 rounded-full bg-white" />
                  </div>
                  
                  {/* Ping Hover Label */}
                  <div className="hidden group-hover:block absolute top-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700 px-3 py-1.5 rounded-xl shadow-2xl z-20 text-[11px] font-mono whitespace-nowrap text-cyan-300">
                    <div className="font-bold text-white">{inc.incidentType}</div>
                    <div className="text-[10px] text-slate-400">Score: {inc.priorityScore}/100</div>
                  </div>
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
              Click radar pings to inspect incident telemetry
            </div>
          </div>
        </div>
      )}

      {/* View Sector 2: Incident Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIncidents.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-400 text-sm font-mono">
            No emergency incidents match the current filter criteria.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedModalIncident(inc)}
              className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-4 relative group shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getSeverityBadge(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  
                  {/* Demo vs Real Gemini Badge */}
                  {inc.isDemo ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Demo Stream
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Real Gemini Scan
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-300">
                    ID: {inc.id}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {inc.timestamp || 'Just now'}
                  </div>
                </div>
              </div>

              {/* Title & Priority Score */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-400 transition-colors">
                  {inc.incidentType}
                </h3>
                <div className="px-3 py-1 bg-slate-900 rounded-xl border border-slate-800 text-center shrink-0">
                  <div className="text-[9px] font-mono text-slate-500 uppercase">Priority</div>
                  <div className="text-xs font-extrabold font-mono text-amber-400">{inc.priorityScore}/100</div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                {inc.summary}
              </p>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[200px] font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{inc.location || 'Sector 4 Ground Zero'}</span>
                </div>
                <div className="text-cyan-400 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Telemetry <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Detail Modal View */}
      {selectedModalIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-6 relative shadow-2xl">
            
            <button
              onClick={() => setSelectedModalIncident(null)}
              className="absolute top-5 right-5 p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getSeverityBadge(selectedModalIncident.severity)}`}>
                  {selectedModalIncident.severity}
                </span>
                {selectedModalIncident.isDemo ? (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Demo Stream Data
                  </span>
                ) : (
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Verified Gemini Intelligence
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-white">
                {selectedModalIncident.incidentType}
              </h2>
              <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                <span>ID: {selectedModalIncident.id}</span>
                <span>•</span>
                <span>Priority Score: {selectedModalIncident.priorityScore}/100</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 leading-relaxed font-sans">
              "{selectedModalIncident.summary}"
            </p>

            {/* Identified Hazards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-400 uppercase font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Detected Hazard Factors
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {selectedModalIncident.risks?.map((r, idx) => (
                  <li key={idx} className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-xl flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Response Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Immediate Action Checklist
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {selectedModalIncident.immediateActions?.map((a, idx) => (
                  <li key={idx} className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Units */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Required Response Units
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedModalIncident.resources?.map((res, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold">
                    {res}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedModalIncident(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Telemetry View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
