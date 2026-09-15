const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'assets', 'emergency');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svgs = {
  'hero.svg': `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="fire-glow" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="cyan-glow" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  <!-- Distant Fire Glow -->
  <circle cx="1400" cy="800" r="600" fill="url(#fire-glow)" filter="url(#blur)" />
  <circle cx="400" cy="400" r="500" fill="url(#cyan-glow)" filter="url(#blur)" />
  
  <!-- City Skyline Silhouette -->
  <path d="M0,1080 L0,700 L100,700 L100,600 L200,600 L200,650 L350,650 L350,500 L500,500 L500,750 L650,750 L650,550 L800,550 L800,800 L1000,800 L1000,600 L1150,600 L1150,450 L1300,450 L1300,750 L1450,750 L1450,650 L1600,650 L1600,750 L1750,750 L1750,600 L1920,600 L1920,1080 Z" fill="#020617" opacity="0.8" />
  
  <!-- Emergency Vehicle -->
  <rect x="600" y="850" width="300" height="150" rx="20" fill="#1e293b" />
  <rect x="850" y="900" width="100" height="100" rx="10" fill="#334155" />
  <circle cx="650" cy="1000" r="40" fill="#0f172a" />
  <circle cx="850" cy="1000" r="40" fill="#0f172a" />
  
  <!-- Flashing Lights -->
  <path d="M620,850 L660,850 L640,830 Z" fill="#ef4444" />
  <path d="M840,850 L880,850 L860,830 Z" fill="#06b6d4" />
  <circle cx="640" cy="830" r="80" fill="#ef4444" opacity="0.3" filter="url(#blur)" />
  <circle cx="860" cy="830" r="80" fill="#06b6d4" opacity="0.3" filter="url(#blur)" />

  <!-- First Responder Silhouette -->
  <path d="M1200,1080 L1200,900 L1220,880 L1240,900 L1240,1080 Z" fill="#020617" />
  <circle cx="1220" cy="860" r="20" fill="#020617" />
</svg>
  `,
  'road-accident.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="15" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <!-- Road -->
  <polygon points="0,600 800,600 500,300 300,300" fill="#334155" />
  <line x1="400" y1="600" x2="400" y2="300" stroke="#fcd34d" stroke-width="10" stroke-dasharray="40 40" />
  <!-- Damaged Car -->
  <rect x="350" y="450" width="120" height="60" rx="10" fill="#94a3b8" transform="rotate(15 410 480)" />
  <path d="M360,450 Q380,430 410,430 T460,450 Z" fill="#64748b" transform="rotate(15 410 480)" />
  <!-- Ambulance -->
  <rect x="500" y="350" width="150" height="80" rx="10" fill="#f8fafc" />
  <rect x="560" y="370" width="40" height="10" fill="#ef4444" />
  <rect x="575" y="355" width="10" height="40" fill="#ef4444" />
  <circle cx="530" cy="430" r="15" fill="#1e293b" />
  <circle cx="620" cy="430" r="15" fill="#1e293b" />
  <!-- Lights -->
  <circle cx="520" cy="350" r="40" fill="#ef4444" opacity="0.4" filter="url(#glow)" />
  <circle cx="630" cy="350" r="40" fill="#3b82f6" opacity="0.4" filter="url(#glow)" />
  <!-- Responder -->
  <rect x="470" y="410" width="15" height="40" fill="#0f172a" />
  <circle cx="477" cy="400" r="10" fill="#facc15" />
</svg>
  `,
  'structure-fire.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="fire" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.5" />
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="20" /></filter>
    <filter id="smoke"><feGaussianBlur stdDeviation="30" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <!-- Building -->
  <rect x="200" y="100" width="400" height="500" fill="#334155" />
  <rect x="250" y="150" width="50" height="80" fill="#ef4444" />
  <rect x="350" y="150" width="50" height="80" fill="#ef4444" />
  <rect x="500" y="150" width="50" height="80" fill="#0f172a" />
  <rect x="250" y="300" width="50" height="80" fill="#ef4444" />
  <rect x="350" y="300" width="50" height="80" fill="#ef4444" />
  <rect x="500" y="300" width="50" height="80" fill="#0f172a" />
  
  <!-- Massive Fire Glow -->
  <circle cx="350" cy="250" r="150" fill="url(#fire)" filter="url(#blur)" opacity="0.8" />
  
  <!-- Smoke -->
  <circle cx="350" cy="100" r="200" fill="#1e293b" filter="url(#smoke)" opacity="0.9" />
  <circle cx="450" cy="50" r="150" fill="#0f172a" filter="url(#smoke)" opacity="0.9" />
  
  <!-- Firetruck -->
  <rect x="50" y="450" width="250" height="150" rx="10" fill="#dc2626" />
  <circle cx="100" cy="600" r="25" fill="#020617" />
  <circle cx="250" cy="600" r="25" fill="#020617" />
  <path d="M250,450 L350,300" stroke="#94a3b8" stroke-width="10" />
  
  <!-- Responders -->
  <rect x="330" y="520" width="20" height="80" fill="#0f172a" />
  <circle cx="340" cy="510" r="12" fill="#facc15" />
</svg>
  `,
  'medical-emergency.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="15" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <polygon points="0,600 800,600 800,400 0,400" fill="#334155" />
  
  <!-- Ambulance -->
  <rect x="200" y="250" width="400" height="200" rx="15" fill="#f8fafc" />
  <path d="M450,250 L550,250 L600,350 L600,450 L450,450 Z" fill="#e2e8f0" />
  <!-- Cross -->
  <rect x="300" y="300" width="80" height="20" fill="#ef4444" />
  <rect x="330" y="270" width="20" height="80" fill="#ef4444" />
  <!-- Lights -->
  <circle cx="250" cy="240" r="50" fill="#ef4444" opacity="0.4" filter="url(#glow)" />
  <circle cx="550" cy="240" r="50" fill="#3b82f6" opacity="0.4" filter="url(#glow)" />
  
  <circle cx="280" cy="450" r="30" fill="#0f172a" />
  <circle cx="520" cy="450" r="30" fill="#0f172a" />
  
  <!-- Stretcher -->
  <rect x="350" y="480" width="120" height="10" fill="#94a3b8" />
  <!-- EMT -->
  <rect x="300" y="420" width="20" height="60" fill="#020617" />
  <circle cx="310" cy="410" r="12" fill="#0ea5e9" />
</svg>
  `,
  'flood.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="wave"><feGaussianBlur stdDeviation="5" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  
  <!-- Submerged Houses -->
  <rect x="100" y="200" width="200" height="200" fill="#334155" />
  <polygon points="100,200 200,100 300,200" fill="#1e293b" />
  
  <rect x="500" y="250" width="150" height="150" fill="#475569" />
  <polygon points="500,250 575,180 650,250" fill="#334155" />
  
  <!-- Flood Water -->
  <path d="M0,400 Q100,380 200,400 T400,400 T600,400 T800,400 L800,600 L0,600 Z" fill="#0ea5e9" opacity="0.8" filter="url(#wave)" />
  
  <!-- Rescue Boat -->
  <path d="M350,450 L450,450 L470,420 L330,420 Z" fill="#ef4444" />
  <rect x="380" y="400" width="40" height="20" fill="#f1f5f9" />
  <circle cx="400" cy="390" r="10" fill="#facc15" />
</svg>
  `,
  'electrical-hazard.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <filter id="spark"><feGaussianBlur stdDeviation="8" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  
  <!-- Broken Pole -->
  <rect x="380" y="200" width="20" height="400" fill="#475569" transform="rotate(20 400 400)" />
  <rect x="360" y="200" width="60" height="10" fill="#94a3b8" transform="rotate(20 400 400)" />
  
  <!-- Snapped Wires -->
  <path d="M0,100 Q200,300 370,200" fill="none" stroke="#1e293b" stroke-width="4" />
  <path d="M370,200 Q400,500 500,550" fill="none" stroke="#1e293b" stroke-width="4" />
  
  <!-- Sparks -->
  <circle cx="500" cy="550" r="30" fill="#fde047" filter="url(#spark)" />
  <path d="M500,550 L520,520 L510,510 L540,480" fill="none" stroke="#fef08a" stroke-width="4" filter="url(#spark)" />
  <path d="M500,550 L480,530 L490,510 L470,490" fill="none" stroke="#fef08a" stroke-width="4" filter="url(#spark)" />
  
  <!-- Utility Truck -->
  <rect x="600" y="450" width="150" height="80" rx="10" fill="#f59e0b" />
  <circle cx="630" cy="530" r="20" fill="#0f172a" />
  <circle cx="720" cy="530" r="20" fill="#0f172a" />
</svg>
  `,
  'police-safety.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="siren"><feGaussianBlur stdDeviation="20" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <polygon points="0,600 800,600 700,300 100,300" fill="#1e293b" />
  
  <!-- Police Cars -->
  <rect x="200" y="350" width="200" height="80" rx="10" fill="#f8fafc" />
  <rect x="200" y="380" width="200" height="20" fill="#0f172a" />
  <circle cx="240" cy="430" r="20" fill="#020617" />
  <circle cx="360" cy="430" r="20" fill="#020617" />
  
  <!-- Sirens -->
  <circle cx="250" cy="340" r="60" fill="#3b82f6" opacity="0.5" filter="url(#siren)" />
  <circle cx="350" cy="340" r="60" fill="#ef4444" opacity="0.5" filter="url(#siren)" />
  
  <!-- Police Tape -->
  <polygon points="0,500 800,450 800,470 0,520" fill="#facc15" opacity="0.8" />
  <text x="350" y="480" font-family="monospace" font-weight="bold" font-size="20" fill="#020617" transform="rotate(-3.5 350 480)">POLICE LINE DO NOT CROSS</text>
  
  <!-- Officer Silhouette -->
  <rect x="500" y="360" width="30" height="90" fill="#020617" />
  <circle cx="515" cy="350" r="15" fill="#020617" />
</svg>
  `,
  'women-child-safety.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2e1065" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="25" /></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  
  <!-- Shield Emblem -->
  <path d="M400,100 L550,150 L550,300 Q550,450 400,550 Q250,450 250,300 L250,150 Z" fill="#4c1d95" opacity="0.5" filter="url(#glow)" />
  <path d="M400,120 L530,165 L530,300 Q530,430 400,520 Q270,430 270,300 L270,165 Z" fill="none" stroke="#c084fc" stroke-width="8" opacity="0.8" />
  
  <!-- Abstract Safety Figures (Mother and Child) -->
  <circle cx="380" cy="250" r="30" fill="#e9d5ff" />
  <path d="M340,320 Q380,280 420,320 L440,450 L320,450 Z" fill="#e9d5ff" />
  
  <circle cx="440" cy="330" r="20" fill="#d8b4fe" />
  <path d="M420,380 Q440,350 460,380 L470,450 L410,450 Z" fill="#d8b4fe" />
  
  <!-- Connecting Hands / Heart abstraction -->
  <path d="M380,350 Q400,380 440,350" fill="none" stroke="#a855f7" stroke-width="6" />
</svg>
  `,
  'cyber-emergency.svg': `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <filter id="neon"><feGaussianBlur stdDeviation="8" /></filter>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#0ea5e9" stroke-width="1" opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <!-- Server Racks -->
  <rect x="200" y="150" width="100" height="350" rx="5" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />
  <rect x="220" y="200" width="60" height="15" fill="#3b82f6" />
  <rect x="220" y="240" width="60" height="15" fill="#ef4444" filter="url(#neon)" />
  <rect x="220" y="280" width="60" height="15" fill="#3b82f6" />
  
  <rect x="500" y="150" width="100" height="350" rx="5" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />
  <rect x="520" y="200" width="60" height="15" fill="#ef4444" filter="url(#neon)" />
  <rect x="520" y="240" width="60" height="15" fill="#3b82f6" />
  <rect x="520" y="280" width="60" height="15" fill="#3b82f6" />
  
  <!-- Connection Lines -->
  <path d="M300,250 L500,210" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="10 10" filter="url(#neon)" />
  <path d="M300,290 L500,290" fill="none" stroke="#0ea5e9" stroke-width="4" />
  
  <!-- Security Shield Broken -->
  <path d="M400,50 L480,100 L480,200 Q480,300 400,380 Q320,300 320,200 L320,100 Z" fill="none" stroke="#ef4444" stroke-width="8" opacity="0.6" filter="url(#neon)" />
  <path d="M370,180 L430,240 M430,180 L370,240" stroke="#ef4444" stroke-width="10" filter="url(#neon)" />
</svg>
  `
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim());
}
console.log('Successfully generated all 9 high-quality SVG assets to public/assets/emergency/');
