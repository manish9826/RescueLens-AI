import React, { useState } from 'react';
import { PlayCircle, ArrowRight, Activity, Car, Flame, HeartPulse, Droplets, Zap, Monitor, ShieldAlert } from 'lucide-react';
import AnalysisResult from './AnalysisResult';

const DEMO_SCENARIOS = [
  {
    title: 'Road Accident',
    image: '/assets/emergency/road-accident.jpg',
    icon: Car,
    color: 'text-red-500',
    data: {
      success: true,
      data: {
        incidentType: "Multi-Vehicle Highway Crash",
        emergencyCategory: "ACCIDENT",
        severity: "HIGH",
        priorityScore: 85,
        confidence: 94,
        summary: "Major roadway collision involving multiple passenger vehicles. Potential entrapment.",
        dangerLevel: "High danger due to high-speed approaching traffic and potential fuel leakage.",
        immediateActions: [
          "Move yourself away from traffic if safe",
          "Call emergency services immediately",
          "Do not move injured persons unless in immediate danger"
        ],
        doNotDo: [
          "Do not stand in traffic lanes",
          "Do not try to extract pinned victims"
        ],
        rescueResources: ["Heavy Rescue", "Ambulance", "Highway Patrol"],
        location: "Highway 101, Mile Marker 42"
      }
    }
  },
  {
    title: 'Structure Fire',
    image: '/assets/emergency/structure-fire.jpg',
    icon: Flame,
    color: 'text-orange-500',
    data: {
      success: true,
      data: {
        incidentType: "Commercial Structure Fire",
        emergencyCategory: "FIRE",
        severity: "CRITICAL",
        priorityScore: 98,
        confidence: 96,
        summary: "Active high-intensity structure fire observed with heavy dense smoke plume.",
        dangerLevel: "Extreme danger due to rapid thermal radiation spread and structural collapse risk.",
        immediateActions: [
          "Evacuate the area immediately",
          "Stay low to avoid smoke inhalation",
          "Alert nearby occupants if safe to do so"
        ],
        doNotDo: [
          "Do not enter the structure",
          "Do not try to extinguish large fires yourself"
        ],
        rescueResources: ["Fire Engine", "Ambulance", "Hazmat"],
        location: "Industrial District, Block A"
      }
    }
  },
  {
    title: 'Medical Emergency',
    image: '/assets/emergency/medical-emergency.jpg',
    icon: HeartPulse,
    color: 'text-rose-500',
    data: {
      success: true,
      data: {
        incidentType: "Cardiac Arrest Suspected",
        emergencyCategory: "MEDICAL",
        severity: "CRITICAL",
        priorityScore: 95,
        confidence: 88,
        summary: "Individual collapsed on the street, unresponsive. Suspected cardiac event.",
        dangerLevel: "Critical risk to life. Immediate intervention required.",
        immediateActions: [
          "Check for pulse and breathing",
          "Begin CPR immediately if trained",
          "Send someone to locate an AED"
        ],
        doNotDo: [
          "Do not leave the patient unattended",
          "Do not give food or water"
        ],
        rescueResources: ["Advanced Life Support Ambulance", "First Responders"],
        location: "Downtown Plaza"
      }
    }
  },
  {
    title: 'Flood / Water Rescue',
    image: '/assets/emergency/flood.jpg',
    icon: Droplets,
    color: 'text-blue-500',
    data: {
      success: true,
      data: {
        incidentType: "Flash Flood Entrapment",
        emergencyCategory: "NATURAL_DISASTER",
        severity: "HIGH",
        priorityScore: 90,
        confidence: 92,
        summary: "Rapidly rising flood waters trapping individuals in residential area.",
        dangerLevel: "High risk of drowning and electrocution.",
        immediateActions: [
          "Move to the highest ground possible",
          "Avoid walking or driving through flood waters",
          "Signal for help if trapped"
        ],
        doNotDo: [
          "Do not touch electrical equipment",
          "Do not attempt to swim through fast-moving water"
        ],
        rescueResources: ["Water Rescue Team", "Helicopter Evacuation"],
        location: "Riverfront Neighborhood"
      }
    }
  },
  {
    title: 'Electrical Hazard',
    image: '/assets/emergency/electrical-hazard.jpg',
    icon: Zap,
    color: 'text-yellow-400',
    data: {
      success: true,
      data: {
        incidentType: "Downed Power Line",
        emergencyCategory: "HAZARD",
        severity: "CRITICAL",
        priorityScore: 95,
        confidence: 98,
        summary: "Live high-voltage power lines down on wet roadway sparking actively.",
        dangerLevel: "Extreme danger of electrocution. Immediate area is lethal.",
        immediateActions: [
          "Stay at least 35 feet away",
          "Keep others away from the area",
          "Shuffle away with feet together if you feel a tingling sensation"
        ],
        doNotDo: [
          "Do not approach the downed line",
          "Do not touch anything in contact with the wire (cars, fences, trees)"
        ],
        rescueResources: ["Utility Company Emergency Response", "Fire Department"],
        location: "Main Street Intersection"
      }
    }
  },
  {
    title: 'Cyber Security Breach',
    image: '/assets/emergency/cyber-emergency.jpg',
    icon: Monitor,
    color: 'text-cyan-500',
    data: {
      success: true,
      data: {
        incidentType: "Critical Server Intrusion",
        emergencyCategory: "CYBER",
        severity: "HIGH",
        priorityScore: 88,
        confidence: 99,
        summary: "Unauthorized access detected on critical infrastructure servers with data exfiltration.",
        dangerLevel: "Severe risk of data loss and system compromise.",
        immediateActions: [
          "Isolate affected systems from the network",
          "Preserve logs for forensics",
          "Initiate incident response protocol"
        ],
        doNotDo: [
          "Do not reboot or power off the servers (preserves memory forensics)",
          "Do not communicate via compromised channels"
        ],
        rescueResources: ["Cyber Incident Response Team (CIRT)", "IT Security Admin"],
        location: "Data Center Alpha"
      }
    }
  }
];

export default function DemoMode({ onDispatch }) {
  const [activeScenario, setActiveScenario] = useState(null);

  if (activeScenario) {
    return (
      <div className="w-full space-y-4 max-w-7xl mx-auto px-4 py-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-orange-500/10 border border-orange-500/30 px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-orange-400 font-mono text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <ShieldAlert className="w-5 h-5" />
          <span>Hackathon Demo Mode Active — No Emergency Services Contacted</span>
          <ShieldAlert className="w-5 h-5" />
        </div>
        <AnalysisResult 
          result={activeScenario.data} 
          image={activeScenario.image} 
          onDispatch={onDispatch} 
          onReset={() => setActiveScenario(null)} 
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-12 space-y-8 bg-[#030712] min-h-screen text-white font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 bg-cyan-950/50 p-2 rounded-lg border border-cyan-500/30">
            <PlayCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide">Interactive Demo Mode</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Select a pre-configured emergency scenario below to experience the full AI analysis, guidance generation, and command center dispatch flow without triggering a real emergency alert.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500 tracking-wider">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>Real-time simulation</span>
        </div>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_SCENARIOS.map((scenario, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveScenario(scenario)}
            className="group cursor-pointer bg-[#091120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1 flex flex-col"
          >
            {/* Image Area */}
            <div className="h-56 overflow-hidden relative">
              <img 
                src={scenario.image} 
                alt={scenario.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091120] via-transparent to-transparent"></div>
              
              {/* Top HUD Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                <div className="bg-black/60 backdrop-blur-sm border border-slate-700/50 px-2 py-1 rounded text-[10px] font-mono text-cyan-400 font-bold tracking-widest">
                  AI READY
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1 border-t border-slate-800/50 relative">
              {/* Overlapping Icon */}
              <div className={`absolute -top-6 left-6 w-12 h-12 rounded-full bg-slate-900 border-2 border-[#091120] flex items-center justify-center shadow-lg`}>
                <scenario.icon className={`w-6 h-6 ${scenario.color}`} />
              </div>
              
              <div className="mt-4">
                <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {scenario.data.data.summary}
                </p>
              </div>

              {/* Run Button */}
              <div className="mt-auto">
                <button className="w-full py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 hover:from-cyan-600 hover:to-blue-600 text-cyan-400 hover:text-white border border-cyan-800/50 hover:border-transparent rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2">
                  Run Simulation <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
