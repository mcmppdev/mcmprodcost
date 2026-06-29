const modelA65 = {
  defaults: {
    sp: 0.215,
    bc: 110,
    cpk: 920,
    botc: 92,
    botu: 390,
    cc: 250,
    ppk: 350,
    cpp: 90,
    ppb: 150,
    boxr: 61,
    mach: 3,
    cpm: 85,
    shifts: 1,
    hrs: 10.5,
    days: 24,
    ops: 3,
    opS: 16500,
    sup: 22000,
    rent: 25000,
    mech: 20000,
    trans: 15000,
    pwr: 100
  },
  ranges: {
    sp: [0.15, 0.3, 0.005],
    bc: [90, 150, 1],
    cpk: [800, 1100, 1],
    botc: [70, 110, 1],
    botu: [300, 500, 5],
    cc: [100, 300, 1],
    ppk: [100, 600, 1],
    cpp: [30, 100, 1],
    ppb: [50, 400, 1],
    boxr: [40, 100, 1],
    mach: [1, 10, 1],
    cpm: [40, 110, 1],
    shifts: [1, 3, 0.5],
    hrs: [6, 12, 0.5],
    days: [20, 31, 1],
    ops: [1, 10, 1],
    opS: [10000, 25000, 500],
    sup: [5000, 50000, 500],
    rent: [5000, 50000, 1],
    mech: [5000, 50000, 1],
    trans: [0, 30000, 1],
    pwr: [50, 300, 1]
  }
};

const modelB75Short = {
  defaults: {
    sp: 0.28,
    bc: 110,
    botc: 92,
    cpk: 760,
    botu: 250,
    boxr: 61,
    cc: 250,
    ppk: 450,
    cpp: 45,
    ppb: 250,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 10,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.2, 0.45, 0.005],
    bc: [90, 150, 1],
    botc: [70, 110, 1],
    cpk: [650, 850, 5],
    botu: [150, 350, 5],
    boxr: [40, 100, 1],
    cc: [100, 300, 1],
    ppk: [350, 500, 1],
    cpp: [20, 100, 1],
    ppb: [150, 350, 1],
    cpm: [20, 100, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB85Long = {
  defaults: {
    sp: 0.32,
    bc: 110,
    botc: 92,
    cpk: 610,
    botu: 250,
    boxr: 61,
    cc: 140,
    ppk: 450,
    cpp: 45,
    ppb: 250,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 10,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.25, 0.45, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [500, 700, 5],
    botu: [150, 350, 5],
    boxr: [40, 100, 1],
    cc: [100, 200, 1],
    ppk: [350, 500, 1],
    cpp: [20, 100, 1],
    ppb: [150, 350, 1],
    cpm: [20, 100, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB100 = {
  defaults: {
    sp: 0.34,
    bc: 110,
    botc: 92,
    cpk: 680,
    botu: 450,
    boxr: 61,
    cc: 250,
    ppk: 250,
    cpp: 45,
    ppb: 150,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 10,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.3, 0.45, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [480, 700, 5],
    botu: [150, 550, 5],
    boxr: [40, 100, 1],
    cc: [100, 350, 1],
    ppk: [150, 400, 1],
    cpp: [20, 100, 1],
    ppb: [50, 250, 1],
    cpm: [20, 120, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB110 = {
  defaults: {
    sp: 0.45,
    bc: 110,
    botc: 92,
    cpk: 530,
    botu: 430,
    boxr: 61,
    cc: 140,
    ppk: 230,
    cpp: 45,
    ppb: 130,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 7,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.3, 0.6, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [480, 580, 5],
    botu: [300, 550, 5],
    boxr: [40, 100, 1],
    cc: [100, 200, 1],
    ppk: [150, 400, 1],
    cpp: [20, 100, 1],
    ppb: [50, 250, 1],
    cpm: [20, 100, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB210 = {
  defaults: {
    sp: 0.54,
    bc: 110,
    botc: 92,
    cpk: 290,
    botu: 200,
    boxr: 61,
    cc: 250,
    ppk: 250,
    cpp: 45,
    ppb: 130,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 20,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.3, 0.6, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [200, 380, 5],
    botu: [150, 300, 5],
    boxr: [40, 100, 1],
    cc: [100, 300, 1],
    ppk: [150, 400, 1],
    cpp: [20, 100, 1],
    ppb: [50, 250, 1],
    cpm: [20, 100, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB250 = {
  defaults: {
    sp: 0.6,
    bc: 110,
    botc: 92,
    cpk: 290,
    botu: 200,
    boxr: 61,
    cc: 250,
    ppk: 250,
    cpp: 45,
    ppb: 100,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 10,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.45, 0.75, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [160, 300, 5],
    botu: [150, 300, 5],
    boxr: [40, 100, 1],
    cc: [100, 300, 1],
    ppk: [150, 400, 1],
    cpp: [20, 100, 1],
    ppb: [50, 250, 1],
    cpm: [20, 90, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

const modelB300 = {
  defaults: {
    sp: 0.85,
    bc: 110,
    botc: 92,
    cpk: 180,
    botu: 200,
    boxr: 61,
    cc: 250,
    ppk: 250,
    cpp: 45,
    ppb: 90,
    cpm: 40,
    shift: 1,
    hrs: 8,
    days: 10,
    ops: 1,
    lab: 300,
    pwr: 70
  },
  ranges: {
    sp: [0.5, 1.2, 0.005],
    bc: [90, 130, 1],
    botc: [70, 110, 1],
    cpk: [150, 380, 5],
    botu: [150, 300, 5],
    boxr: [40, 100, 1],
    cc: [100, 300, 1],
    ppk: [150, 400, 1],
    cpp: [20, 100, 1],
    ppb: [50, 250, 1],
    cpm: [20, 100, 1],
    shift: [1, 3, 0.5],
    hrs: [4, 12, 0.5],
    days: [7, 31, 1],
    ops: [1, 5, 1],
    lab: [200, 600, 10],
    pwr: [40, 150, 5]
  }
};

function cup({ slug, name, volumeMl, modelType, description, source }) {
  return {
    slug,
    name,
    volumeMl,
    modelType,
    description,
    defaults: source.defaults,
    ranges: source.ranges
  };
}

export const cups = [
  {
    slug: "60-65ml-short",
    aliases: ["60ml-short", "65ml-short"],
    name: "60 / 65 ml Short",
    volumeMl: "60 / 65",
    modelType: "A",
    description: "Shared Model A calculator with size-specific yield and bottom usage.",
    defaults: modelA65.defaults,
    ranges: modelA65.ranges,
    defaultVariant: "65ml-short",
    variantFields: ["cpk", "botu"],
    variants: [
      {
        id: "60ml-short",
        label: "60 ml",
        volumeMl: 60,
        defaults: {
          cpk: 980,
          botu: 360
        }
      },
      {
        id: "65ml-short",
        label: "65 ml",
        volumeMl: 65,
        defaults: {
          cpk: 920,
          botu: 390
        }
      }
    ]
  },
  cup({
    slug: "75ml-short",
    name: "75 ml Short",
    volumeMl: 75,
    modelType: "B",
    description: "Existing Model B short cup calculator.",
    source: modelB75Short
  }),
  cup({
    slug: "75ml-long",
    name: "75 ml Long",
    volumeMl: 75,
    modelType: "B",
    description: "New long cup size, seeded from the 75 ml short baseline.",
    source: modelB75Short
  }),
  cup({
    slug: "85ml-long",
    name: "85 ml Long",
    volumeMl: 85,
    modelType: "B",
    description: "Existing Model B long cup calculator.",
    source: modelB85Long
  }),
  cup({
    slug: "90ml",
    name: "90 ml",
    volumeMl: 90,
    modelType: "B",
    description: "New size cloned from 75 ml short defaults.",
    source: modelB75Short
  }),
  cup({
    slug: "100ml",
    name: "100 ml",
    volumeMl: 100,
    modelType: "B",
    description: "Existing Model B calculator.",
    source: modelB100
  }),
  cup({
    slug: "110ml-icecream",
    name: "110 ml Ice Cream",
    volumeMl: 110,
    modelType: "B",
    description: "Existing Model B ice cream cup calculator.",
    source: modelB110
  }),
  cup({
    slug: "210ml",
    name: "210 ml",
    volumeMl: 210,
    modelType: "B",
    description: "Existing Model B calculator.",
    source: modelB210
  }),
  cup({
    slug: "250ml",
    name: "250 ml",
    volumeMl: 250,
    modelType: "B",
    description: "Existing Model B calculator.",
    source: modelB250
  }),
  cup({
    slug: "300ml",
    name: "300 ml",
    volumeMl: 300,
    modelType: "B",
    description: "Existing Model B calculator.",
    source: modelB300
  })
];

export const cupRouteSlugs = cups.flatMap((cup) => [cup.slug, ...(cup.aliases || [])]);

export const fieldMeta = {
  sp: { label: "Selling price", unit: "Rs/cup", kind: "currency" },
  bc: { label: "Blank cost", unit: "Rs/kg", kind: "currency" },
  cpk: { label: "Yield", unit: "cups/kg", kind: "integer" },
  botc: { label: "Bottom cost", unit: "Rs/kg", kind: "currency" },
  botu: { label: "Bottom usage", unit: "g/kg", kind: "integer" },
  cc: { label: "Cover cost", unit: "Rs/kg", kind: "currency" },
  ppk: { label: "Packets per kg", unit: "packets", kind: "integer" },
  cpp: { label: "Cups per packet", unit: "cups", kind: "integer" },
  ppb: { label: "Packets per box", unit: "packets", kind: "integer" },
  boxr: { label: "Box rate", unit: "Rs/box", kind: "currency" },
  mach: { label: "Machines", unit: "machines", kind: "integer" },
  cpm: { label: "Machine speed", unit: "cups/min", kind: "integer" },
  shifts: { label: "Shifts per day", unit: "shifts", kind: "decimal" },
  shift: { label: "Shifts per day", unit: "shifts", kind: "decimal" },
  hrs: { label: "Hours per shift", unit: "hours", kind: "decimal" },
  days: { label: "Working days", unit: "days/month", kind: "integer" },
  ops: { label: "Operators", unit: "people", kind: "integer" },
  opS: { label: "Operator salary", unit: "Rs/month", kind: "currency" },
  lab: { label: "Operator cost", unit: "Rs/day", kind: "currency" },
  sup: { label: "Supervisor", unit: "Rs/month", kind: "currency" },
  rent: { label: "Rent", unit: "Rs/month", kind: "currency" },
  mech: { label: "Mechanic/repair", unit: "Rs/month", kind: "currency" },
  trans: { label: "Transport", unit: "Rs/month", kind: "currency" },
  pwr: { label: "Power", unit: "Rs/box", kind: "currency" }
};

export const modelFields = {
  A: [
    "sp",
    "bc",
    "cpk",
    "botc",
    "botu",
    "cc",
    "ppk",
    "cpp",
    "ppb",
    "boxr",
    "mach",
    "cpm",
    "shifts",
    "hrs",
    "days",
    "ops",
    "opS",
    "sup",
    "rent",
    "mech",
    "trans",
    "pwr"
  ],
  B: [
    "sp",
    "bc",
    "botc",
    "cpk",
    "botu",
    "boxr",
    "cc",
    "ppk",
    "cpp",
    "ppb",
    "cpm",
    "shift",
    "hrs",
    "days",
    "ops",
    "lab",
    "pwr"
  ]
};

export function getCupBySlug(slug) {
  const cup = cups.find((item) => item.slug === slug || item.aliases?.includes(slug));

  if (!cup) {
    return undefined;
  }

  const matchedVariant = cup.variants?.find((variant) => variant.id === slug);

  return {
    ...cup,
    requestedSlug: slug,
    initialVariant: matchedVariant?.id || cup.defaultVariant
  };
}
