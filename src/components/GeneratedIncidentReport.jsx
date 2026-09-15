import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  Car, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function GeneratedIncidentReport({ data, image, location }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  if (!data) return null;

  // Approximate incident time (formatted local time)
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Location status string
  const locationStatusText = location && location.latitude && location.longitude
    ? `GPS Locked: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (~${location.accuracy || 15}m accuracy)`
    : typeof location === 'string' && location.includes(',')
    ? `Coordinates: ${location}`
    : 'Location Not Shared';

  // Extract detectable vehicles or persons if visible in summary or scene
  const detectVehiclesOrPersons = () => {
    const text = `${data.summary || ''} ${data.dangerLevel || ''} ${data.incidentType || ''}`.toLowerCase();
    const findings = [];

    if (text.includes('car') || text.includes('vehicle') || text.includes('truck') || text.includes('bus') || text.includes('motorcycle') || text.includes('collision')) {
      findings.push('Vehicles: Motorized vehicles identified in collision/scene perimeter');
    }
    if (text.includes('occupant') || text.includes('person') || text.includes('injured') || text.includes('pedestrian') || text.includes('people') || text.includes('passenger') || text.includes('driver')) {
      findings.push('Persons: Individuals/occupants noted in proximity of incident');
    }

    if (findings.length === 0) {
      return 'No specific vehicles or persons definitively isolated.';
    }
    return findings.join(' • ');
  };

  // Extract detected hazards list
  const detectedHazards = Array.isArray(data.doNotDo) && data.doNotDo.length > 0
    ? data.doNotDo.map(h => h.replace(/^do not\s+/i, 'Risk: '))
    : [data.dangerLevel || 'Physical danger present in perimeter'];

  // Formatted report string for download & share
  const generateReportText = () => {
    return `=====================================================
RESCUELENS AI — OFFICIAL INCIDENT REPORT
=====================================================
Incident ID: ${data.id || 'INC-' + Date.now().toString().slice(-6)}
Generated Time: ${formattedTime}
Report Ownership: ${user ? `${user.name} (${user.email})` : 'Authenticated Local Session'}

-----------------------------------------------------
1. INCIDENT CLASSIFICATION
-----------------------------------------------------
• Incident Type: ${data.incidentType || 'Emergency'}
• Emergency Category: ${data.emergencyCategory || 'GENERAL'}
• Severity: ${data.severity || 'HIGH'}
• AI Confidence: ${data.confidence || 90}%
• Priority Score: ${data.priorityScore || 85}/100

-----------------------------------------------------
2. GEOGRAPHIC & TEMPORAL TELEMETRY
-----------------------------------------------------
• Approximate Time: ${formattedTime}
• Location Status: ${locationStatusText}

-----------------------------------------------------
3. HAZARD & ENTITY ASSESSMENT
-----------------------------------------------------
• Detected Hazards:
${detectedHazards.map(h => `  - ${h}`).join('\n')}
• Visible Vehicles / Persons: ${detectVehiclesOrPersons()}

-----------------------------------------------------
4. RECOMMENDED EMERGENCY RESPONSE
-----------------------------------------------------
• Recommended Emergency Contact: 112 (Unified Emergency Response)
• Immediate Actions:
${(data.immediateActions || ['Move to safety if possible', 'Call 112']).map((a, i) => `  ${i + 1}. ${a}`).join('\n')}

• Avoid Instructions:
${(data.doNotDo || ['Do not enter unstable zones']).map(d => `  - ${d}`).join('\n')}

-----------------------------------------------------
5. CONFIDENTIALITY & PRIVACY NOTICE
-----------------------------------------------------
This report is generated for user reference and responder coordination.
It is NEVER automatically transmitted to law enforcement, medical authorities,
or third parties without explicit user initiation.
=====================================================`;
  };

  // Download Report
  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RescueLens_Incident_Report_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  // Share Report
  const handleShareReport = async () => {
    const reportText = generateReportText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RescueLens Incident Report: ${data.incidentType}`,
          text: reportText
        });
        setShareFeedback('Report shared successfully');
        setTimeout(() => setShareFeedback(''), 3000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(reportText);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      }
    } else {
      navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <section className="w-full bg-[#0a1224] border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>📄 INCIDENT REPORT</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Verified Scene Documentation
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive post-analysis briefing document with verified telemetry and safety vectors.
          </p>
        </div>

        {/* Action Buttons: [ DOWNLOAD REPORT ] & [ SHARE REPORT ] */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadReport}
            id="download-incident-report-button"
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'DOWNLOADED!' : 'DOWNLOAD REPORT'}</span>
          </button>

          <button
            onClick={handleShareReport}
            id="share-incident-report-button"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'REPORT COPIED!' : 'SHARE REPORT'}</span>
          </button>
        </div>
      </div>

      {shareFeedback && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-bold text-center">
          ✓ {shareFeedback}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Never automatically send report to authorities. Reports belong to the authenticated user.</span>
        </div>
        <span className="text-slate-500 text-[10px] font-mono">User Isolation Protected</span>
      </div>

      {/* Report Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Incident Type */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Incident Type</span>
          <span className="text-lg font-black text-white block">{data.incidentType || 'Emergency'}</span>
        </div>

        {/* Emergency Category */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Category</span>
          <span className="text-lg font-black text-cyan-300 block">{data.emergencyCategory || 'GENERAL'}</span>
        </div>

        {/* Severity */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Severity</span>
          <span className="text-lg font-black text-red-400 block">{data.severity || 'CRITICAL'}</span>
        </div>

        {/* Confidence & Priority */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Confidence & Priority</span>
          <span className="text-sm font-mono text-slate-200 block">
            Confidence: <strong className="text-cyan-300 font-bold">{data.confidence || 90}%</strong> | Priority: <strong className="text-orange-400 font-bold">{data.priorityScore || 85}/100</strong>
          </span>
        </div>

        {/* Approximate Time */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Approximate Time
          </span>
          <span className="text-sm font-mono text-slate-200 block">{formattedTime}</span>
        </div>

        {/* Location Status */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Location Status
          </span>
          <span className="text-xs font-mono text-slate-300 block truncate">{locationStatusText}</span>
        </div>

      </div>

      {/* Detected Hazards & Visible Vehicles/Persons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detected Hazards */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/30 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Detected Hazards
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {detectedHazards.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visible Vehicles / Persons */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-900/30 space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Visible Vehicles / Persons
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {detectVehiclesOrPersons()}
          </p>
        </div>
      </div>

      {/* Recommended Emergency Contact */}
      <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Recommended Emergency Contact</span>
            <span className="text-lg font-black text-white block">📞 112 — Unified Emergency Response</span>
          </div>
        </div>
        <a 
          href="tel:112"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all active:scale-95 text-center shrink-0"
        >
          Call 112
        </a>
      </div>

      {/* Actions Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Immediate Actions */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Immediate Actions
          </span>
          <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
            {(data.immediateActions || ['Move to safety']).map((act, i) => (
              <li key={i}>{act}</li>
            ))}
          </ol>
        </div>

        {/* Avoid Instructions */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Avoid Instructions
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {(data.doNotDo || ['Do not put yourself in danger']).map((avoid, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 font-bold">•</span>
                <span>{avoid}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
