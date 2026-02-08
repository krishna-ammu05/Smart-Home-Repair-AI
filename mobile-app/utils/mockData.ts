import { Technician, RepairStep } from "./storage";

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: "tech1",
    name: "John Miller",
    specialty: "Electrical Appliances",
    rating: 4.8,
    reviewCount: 156,
    distance: "2.3 km",
    availability: "Available Today",
    hourlyRate: 45,
    phone: "+1 555-0101",
  },
  {
    id: "tech2",
    name: "Sarah Chen",
    specialty: "HVAC Systems",
    rating: 4.9,
    reviewCount: 203,
    distance: "3.1 km",
    availability: "Available Tomorrow",
    hourlyRate: 55,
    phone: "+1 555-0102",
  },
  {
    id: "tech3",
    name: "Michael Brown",
    specialty: "Plumbing",
    rating: 4.7,
    reviewCount: 128,
    distance: "1.8 km",
    availability: "Available Today",
    hourlyRate: 40,
    phone: "+1 555-0103",
  },
  {
    id: "tech4",
    name: "Emily Davis",
    specialty: "Kitchen Appliances",
    rating: 4.6,
    reviewCount: 94,
    distance: "4.2 km",
    availability: "Next Week",
    hourlyRate: 42,
    phone: "+1 555-0104",
  },
  {
    id: "tech5",
    name: "David Wilson",
    specialty: "General Repairs",
    rating: 4.5,
    reviewCount: 178,
    distance: "2.8 km",
    availability: "Available Today",
    hourlyRate: 38,
    phone: "+1 555-0105",
  },
];

export const FAULT_TYPES = [
  {
    id: "electrical",
    name: "Electrical Fault",
    description: "Issues with wiring, switches, or electrical components",
    icon: "zap",
  },
  {
    id: "mechanical",
    name: "Mechanical Damage",
    description: "Physical damage or wear to moving parts",
    icon: "settings",
  },
  {
    id: "leak",
    name: "Water Leak",
    description: "Leaking pipes, faucets, or water damage",
    icon: "droplet",
  },
  {
    id: "heating",
    name: "Heating Issue",
    description: "Problems with heating elements or HVAC",
    icon: "thermometer",
  },
  {
    id: "structural",
    name: "Structural Damage",
    description: "Cracks, breaks, or structural wear",
    icon: "home",
  },
];

export const generateRepairSteps = (faultType: string): RepairStep[] => {
  const steps: Record<string, RepairStep[]> = {
    electrical: [
      {
        id: "e1",
        stepNumber: 1,
        title: "Safety First",
        description:
          "Turn off the main power supply to the affected area. Use a voltage tester to confirm no electricity is flowing.",
        isCompleted: false,
      },
      {
        id: "e2",
        stepNumber: 2,
        title: "Inspect the Wiring",
        description:
          "Carefully examine the wiring for any visible damage, burn marks, or loose connections.",
        isCompleted: false,
      },
      {
        id: "e3",
        stepNumber: 3,
        title: "Test Components",
        description:
          "Use a multimeter to test the continuity of switches and outlets. Replace any faulty components.",
        isCompleted: false,
      },
      {
        id: "e4",
        stepNumber: 4,
        title: "Reconnect and Test",
        description:
          "Securely reconnect all wires, restore power, and test the repaired components.",
        isCompleted: false,
      },
    ],
    mechanical: [
      {
        id: "m1",
        stepNumber: 1,
        title: "Disconnect Power",
        description:
          "Unplug the appliance or turn off the circuit breaker before inspection.",
        isCompleted: false,
      },
      {
        id: "m2",
        stepNumber: 2,
        title: "Disassemble Carefully",
        description:
          "Remove the outer casing and locate the damaged mechanical parts. Take photos for reference.",
        isCompleted: false,
      },
      {
        id: "m3",
        stepNumber: 3,
        title: "Replace or Repair Parts",
        description:
          "Replace worn bearings, gears, or belts. Lubricate moving parts as needed.",
        isCompleted: false,
      },
      {
        id: "m4",
        stepNumber: 4,
        title: "Reassemble and Test",
        description:
          "Reassemble the unit following your reference photos. Test operation before full use.",
        isCompleted: false,
      },
    ],
    leak: [
      {
        id: "l1",
        stepNumber: 1,
        title: "Shut Off Water",
        description:
          "Locate and turn off the water supply valve to stop the leak immediately.",
        isCompleted: false,
      },
      {
        id: "l2",
        stepNumber: 2,
        title: "Identify the Source",
        description:
          "Trace the leak to its origin point. Check pipe joints, seals, and fittings.",
        isCompleted: false,
      },
      {
        id: "l3",
        stepNumber: 3,
        title: "Apply Repair",
        description:
          "Use appropriate sealant, replace washers, or tighten connections as needed.",
        isCompleted: false,
      },
      {
        id: "l4",
        stepNumber: 4,
        title: "Test for Leaks",
        description:
          "Turn water back on slowly and check for any remaining leaks. Dry the area completely.",
        isCompleted: false,
      },
    ],
    heating: [
      {
        id: "h1",
        stepNumber: 1,
        title: "Check Thermostat",
        description:
          "Verify thermostat settings and replace batteries if needed. Ensure it's set correctly.",
        isCompleted: false,
      },
      {
        id: "h2",
        stepNumber: 2,
        title: "Inspect Filters",
        description:
          "Check and replace air filters. Dirty filters can block airflow and reduce efficiency.",
        isCompleted: false,
      },
      {
        id: "h3",
        stepNumber: 3,
        title: "Examine Heating Elements",
        description:
          "For electric heaters, check heating elements for damage. For gas units, check pilot light.",
        isCompleted: false,
      },
      {
        id: "h4",
        stepNumber: 4,
        title: "Test System",
        description:
          "Run the heating system and monitor temperature changes. Listen for unusual sounds.",
        isCompleted: false,
      },
    ],
    structural: [
      {
        id: "s1",
        stepNumber: 1,
        title: "Assess Damage",
        description:
          "Carefully examine the extent of structural damage. Document with photos.",
        isCompleted: false,
      },
      {
        id: "s2",
        stepNumber: 2,
        title: "Clean the Area",
        description:
          "Remove loose debris and clean the damaged area thoroughly before repair.",
        isCompleted: false,
      },
      {
        id: "s3",
        stepNumber: 3,
        title: "Apply Filler or Sealant",
        description:
          "Use appropriate filler for cracks or structural adhesive for breaks. Allow proper curing time.",
        isCompleted: false,
      },
      {
        id: "s4",
        stepNumber: 4,
        title: "Finish and Protect",
        description:
          "Sand smooth, paint if needed, and apply protective coating to prevent future damage.",
        isCompleted: false,
      },
    ],
  };

  return steps[faultType] || steps.mechanical;
};

export const simulateFaultDetection = (
  imageUri: string
): {
  faultType: string;
  confidence: number;
  description: string;
} => {
  const faults = [
    {
      faultType: "electrical",
      confidence: 0.87,
      description:
        "Detected electrical component damage. Possible short circuit or worn wiring visible.",
    },
    {
      faultType: "mechanical",
      confidence: 0.92,
      description:
        "Mechanical wear detected. Components show signs of friction damage or misalignment.",
    },
    {
      faultType: "leak",
      confidence: 0.78,
      description:
        "Water damage detected. Signs of moisture accumulation and potential leak source identified.",
    },
    {
      faultType: "heating",
      confidence: 0.85,
      description:
        "Heating element issue detected. Thermal irregularities suggest component failure.",
    },
    {
      faultType: "structural",
      confidence: 0.81,
      description:
        "Structural damage identified. Visible cracks or deformation in the material.",
    },
  ];

  return faults[Math.floor(Math.random() * faults.length)];
};
