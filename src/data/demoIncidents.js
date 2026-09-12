export const DEMO_INCIDENTS = [
  {
    id: "INC-8902",
    incidentType: "Urban Flash Flooding",
    severity: "CRITICAL",
    priorityScore: 94,
    confidence: 95,
    summary: "Severe water accumulation submerging critical arterial crossroads. Multiple civilian vehicles immobilized with trapped occupants.",
    risks: [
      "Submerged electrical infrastructure causing electrocution threat",
      "High water current rendering light rescue crafts vulnerable",
      "Cut off access route to District Hospital emergency room"
    ],
    immediateActions: [
      "Deploy Swift Water Rescue Teams to Sector 4",
      "Block entry to flooded causeway via automated barriers",
      "Notify regional power grid operators to shut down Substation B"
    ],
    resources: [
      "Swift Water Rescue Boat x2",
      "High-Clearance Rescue Truck",
      "Grid Isolation Squad"
    ],
    location: "Metro Crossing - Sector 4",
    timestamp: "12 mins ago",
    isDemo: true,
    status: "ACTIVE"
  },
  {
    id: "INC-8898",
    incidentType: "Industrial Chemical Storage Fire",
    severity: "CRITICAL",
    priorityScore: 91,
    confidence: 92,
    summary: "Active blaze at chemical processing facility. Dense toxic plume blowing southwest toward residential zone.",
    risks: [
      "Inhalation risk of chlorine compound derivative gases",
      "Thermal explosion threat from neighboring pressurised solvent tanks",
      "Runoff chemical contamination of municipal drainage"
    ],
    immediateActions: [
      "Issue Level-3 immediate shelter-in-place advisory for SW downwind zone",
      "Deploy specialized chemical foam suppression cannons",
      "Establish 500m hot-zone isolation boundary"
    ],
    resources: [
      "HAZMAT Response Unit x2",
      "Industrial Foam Pumper",
      "Air Quality Monitoring Drone"
    ],
    location: "Bayfront Industrial Park - Gate 3",
    timestamp: "28 mins ago",
    isDemo: true,
    status: "ACTIVE"
  },
  {
    id: "INC-8884",
    incidentType: "Multi-Vehicle Highway Pileup",
    severity: "HIGH",
    priorityScore: 84,
    confidence: 89,
    summary: "Chain collision involving 6 passenger cars and a heavy commercial freight rig on Highway 101 north corridor.",
    risks: [
      "Diesel fuel spill across 3 lanes",
      "Victims trapped in compressed cabin framework",
      "Risk of secondary collisions due to fog conditions"
    ],
    immediateActions: [
      "Divert Northbound freeway traffic at Exit 14",
      "Initiate hydraulic tool extraction on vehicle #2 and #4",
      "Apply bio-hazard and hydrocarbon binding agent to fuel spill"
    ],
    resources: [
      "Heavy Rescue Engine",
      "Advanced Trauma Ambulance x3",
      "Highway Patrol Units x4"
    ],
    location: "Highway 101 - Mile Marker 42",
    timestamp: "45 mins ago",
    isDemo: true,
    status: "ACTIVE"
  },
  {
    id: "INC-8871",
    incidentType: "Residential Structure Fire",
    severity: "HIGH",
    priorityScore: 78,
    confidence: 91,
    summary: "Two-story residential dwelling fully involved in fire. Roof structural collapse observed at rear section.",
    risks: [
      "Fire propagation to wooden structural eaves of adjacent homes",
      "Ruptured gas utility meter feeding localized flame jets",
      "Structural timber drop hazards"
    ],
    immediateActions: [
      "Establish exterior defensive master stream operation",
      "Shut off main natural gas supply valve at curb",
      "Evacuate left and right exposure residences"
    ],
    resources: [
      "Engine Company #12",
      "Ladder Truck #4",
      "EMS Commander Unit"
    ],
    location: "Oakridge Residential District - 412 Elm St",
    timestamp: "1 hr 15 mins ago",
    isDemo: true,
    status: "ACTIVE"
  },
  {
    id: "INC-8850",
    incidentType: "Hillside Landslide & Debris Flow",
    severity: "MEDIUM",
    priorityScore: 65,
    confidence: 86,
    summary: "Mud accumulation across secondary access road following intense rainfall. Power lines downed.",
    risks: [
      "Live power line contact with wet mud and metal guardrails",
      "Potential secondary slope slide under continued saturation",
      "Isolated 15 residential properties behind block"
    ],
    immediateActions: [
      "Coordinate electrical utility to de-energize downed high-voltage line",
      "Deploy heavy earthmoving equipment to clear single emergency lane",
      "Inspect upper hillside stability via drone visual scan"
    ],
    resources: [
      "Public Works Heavy Loader",
      "Power Grid Emergency Crew",
      "Geotechnical Survey Drone"
    ],
    location: "Canyon Ridge Pass - Mile 3",
    timestamp: "2 hrs ago",
    isDemo: true,
    status: "ACTIVE"
  },
  {
    id: "INC-8822",
    incidentType: "Commercial Elevator Entrapment",
    severity: "LOW",
    priorityScore: 35,
    confidence: 96,
    summary: "3 individuals stuck in stalled elevator car between 4th and 5th floors. HVAC operational, occupants calm.",
    risks: [
      "Minor panic / anxiety for occupants",
      "Improper manual brake release risking car drop if unmonitored"
    ],
    immediateActions: [
      "Technician on site performing safe mechanical elevator leveling",
      "Maintain continuous intercom contact with trapped occupants"
    ],
    resources: [
      "Building Safety Technician",
      "First Response Squad"
    ],
    location: "Apex Tower B - 120 Center Plaza",
    timestamp: "3 hrs ago",
    isDemo: true,
    status: "RESOLVED"
  }
];
