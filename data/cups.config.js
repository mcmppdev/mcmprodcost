export const cups = [
  {
    slug: "65ml-tea",
    name: "65 ml Tea Cup",
    volumeMl: 65,
    modelType: "A",
    description: "Small tea and sampling cup.",
    defaults: {
      sellingPrice: 0.62,
      materialCost: 0.31,
      packingCost: 0.035,
      powerCost: 0.018,
      laborCost: 0.052,
      scrapPercent: 3,
      dailyOutput: 90000,
      rent: 1200,
      mechanic: 950,
      supervisor: 850,
      transport: 700
    },
    ranges: {
      sellingPrice: [0.3, 1.2, 0.01],
      materialCost: [0.1, 0.8, 0.01],
      packingCost: [0, 0.15, 0.005],
      powerCost: [0, 0.08, 0.001],
      laborCost: [0, 0.16, 0.002],
      scrapPercent: [0, 12, 0.25],
      dailyOutput: [20000, 140000, 1000],
      rent: [0, 4000, 50],
      mechanic: [0, 3000, 50],
      supervisor: [0, 3000, 50],
      transport: [0, 3000, 50]
    }
  },
  {
    slug: "80ml-tea",
    name: "80 ml Tea Cup",
    volumeMl: 80,
    modelType: "A",
    description: "Common tea service size.",
    defaults: {
      sellingPrice: 0.72,
      materialCost: 0.38,
      packingCost: 0.04,
      powerCost: 0.02,
      laborCost: 0.056,
      scrapPercent: 3,
      dailyOutput: 82000,
      rent: 1200,
      mechanic: 950,
      supervisor: 850,
      transport: 750
    },
    ranges: {
      sellingPrice: [0.35, 1.4, 0.01],
      materialCost: [0.14, 0.95, 0.01],
      packingCost: [0, 0.16, 0.005],
      powerCost: [0, 0.09, 0.001],
      laborCost: [0, 0.18, 0.002],
      scrapPercent: [0, 12, 0.25],
      dailyOutput: [20000, 130000, 1000],
      rent: [0, 4000, 50],
      mechanic: [0, 3000, 50],
      supervisor: [0, 3000, 50],
      transport: [0, 3000, 50]
    }
  },
  {
    slug: "100ml-water",
    name: "100 ml Water Cup",
    volumeMl: 100,
    modelType: "A",
    description: "Compact water and event cup.",
    defaults: {
      sellingPrice: 0.86,
      materialCost: 0.46,
      packingCost: 0.045,
      powerCost: 0.022,
      laborCost: 0.061,
      scrapPercent: 3.5,
      dailyOutput: 76000,
      rent: 1250,
      mechanic: 1000,
      supervisor: 900,
      transport: 800
    },
    ranges: {
      sellingPrice: [0.45, 1.7, 0.01],
      materialCost: [0.2, 1.1, 0.01],
      packingCost: [0, 0.18, 0.005],
      powerCost: [0, 0.1, 0.001],
      laborCost: [0, 0.2, 0.002],
      scrapPercent: [0, 14, 0.25],
      dailyOutput: [18000, 120000, 1000],
      rent: [0, 4500, 50],
      mechanic: [0, 3200, 50],
      supervisor: [0, 3200, 50],
      transport: [0, 3200, 50]
    }
  },
  {
    slug: "120ml-tea",
    name: "120 ml Tea Cup",
    volumeMl: 120,
    modelType: "A",
    description: "Large tea and small beverage cup.",
    defaults: {
      sellingPrice: 1.02,
      materialCost: 0.56,
      packingCost: 0.05,
      powerCost: 0.024,
      laborCost: 0.066,
      scrapPercent: 3.5,
      dailyOutput: 70000,
      rent: 1300,
      mechanic: 1050,
      supervisor: 950,
      transport: 850
    },
    ranges: {
      sellingPrice: [0.5, 2, 0.01],
      materialCost: [0.25, 1.3, 0.01],
      packingCost: [0, 0.2, 0.005],
      powerCost: [0, 0.11, 0.001],
      laborCost: [0, 0.22, 0.002],
      scrapPercent: [0, 14, 0.25],
      dailyOutput: [16000, 115000, 1000],
      rent: [0, 4500, 50],
      mechanic: [0, 3200, 50],
      supervisor: [0, 3200, 50],
      transport: [0, 3200, 50]
    }
  },
  {
    slug: "150ml-coffee",
    name: "150 ml Coffee Cup",
    volumeMl: 150,
    modelType: "B",
    description: "Small coffee and tasting cup.",
    defaults: {
      sellingPrice: 1.34,
      materialCost: 0.72,
      packingCost: 0.06,
      powerCost: 0.028,
      laborCost: 0.075,
      scrapPercent: 4,
      dailyOutput: 62000,
      overheadPerDay: 4300,
      maintenancePercent: 1.5
    },
    ranges: {
      sellingPrice: [0.7, 2.5, 0.01],
      materialCost: [0.35, 1.7, 0.01],
      packingCost: [0, 0.24, 0.005],
      powerCost: [0, 0.13, 0.001],
      laborCost: [0, 0.25, 0.002],
      scrapPercent: [0, 16, 0.25],
      dailyOutput: [14000, 100000, 1000],
      overheadPerDay: [0, 10000, 100],
      maintenancePercent: [0, 8, 0.25]
    }
  },
  {
    slug: "180ml-coffee",
    name: "180 ml Coffee Cup",
    volumeMl: 180,
    modelType: "B",
    description: "Coffee, tea, and office beverage cup.",
    defaults: {
      sellingPrice: 1.56,
      materialCost: 0.86,
      packingCost: 0.065,
      powerCost: 0.03,
      laborCost: 0.08,
      scrapPercent: 4,
      dailyOutput: 57000,
      overheadPerDay: 4550,
      maintenancePercent: 1.5
    },
    ranges: {
      sellingPrice: [0.8, 2.9, 0.01],
      materialCost: [0.4, 2, 0.01],
      packingCost: [0, 0.26, 0.005],
      powerCost: [0, 0.14, 0.001],
      laborCost: [0, 0.28, 0.002],
      scrapPercent: [0, 16, 0.25],
      dailyOutput: [12000, 95000, 1000],
      overheadPerDay: [0, 11000, 100],
      maintenancePercent: [0, 8, 0.25]
    }
  },
  {
    slug: "200ml-juice",
    name: "200 ml Juice Cup",
    volumeMl: 200,
    modelType: "B",
    description: "Juice and cold beverage cup.",
    defaults: {
      sellingPrice: 1.78,
      materialCost: 1.02,
      packingCost: 0.072,
      powerCost: 0.034,
      laborCost: 0.086,
      scrapPercent: 4.5,
      dailyOutput: 52000,
      overheadPerDay: 4800,
      maintenancePercent: 1.75
    },
    ranges: {
      sellingPrice: [0.95, 3.3, 0.01],
      materialCost: [0.5, 2.3, 0.01],
      packingCost: [0, 0.28, 0.005],
      powerCost: [0, 0.15, 0.001],
      laborCost: [0, 0.3, 0.002],
      scrapPercent: [0, 18, 0.25],
      dailyOutput: [10000, 90000, 1000],
      overheadPerDay: [0, 12000, 100],
      maintenancePercent: [0, 9, 0.25]
    }
  },
  {
    slug: "250ml-lassi",
    name: "250 ml Lassi Cup",
    volumeMl: 250,
    modelType: "B",
    description: "Lassi, shakes, and dessert cup.",
    defaults: {
      sellingPrice: 2.22,
      materialCost: 1.28,
      packingCost: 0.085,
      powerCost: 0.04,
      laborCost: 0.096,
      scrapPercent: 5,
      dailyOutput: 45000,
      overheadPerDay: 5200,
      maintenancePercent: 2
    },
    ranges: {
      sellingPrice: [1.1, 4.2, 0.01],
      materialCost: [0.65, 2.9, 0.01],
      packingCost: [0, 0.32, 0.005],
      powerCost: [0, 0.18, 0.001],
      laborCost: [0, 0.34, 0.002],
      scrapPercent: [0, 20, 0.25],
      dailyOutput: [8000, 80000, 1000],
      overheadPerDay: [0, 14000, 100],
      maintenancePercent: [0, 10, 0.25]
    }
  },
  {
    slug: "300ml-soda",
    name: "300 ml Soda Cup",
    volumeMl: 300,
    modelType: "B",
    description: "Cold drink and fountain service cup.",
    defaults: {
      sellingPrice: 2.64,
      materialCost: 1.55,
      packingCost: 0.095,
      powerCost: 0.046,
      laborCost: 0.108,
      scrapPercent: 5,
      dailyOutput: 39000,
      overheadPerDay: 5600,
      maintenancePercent: 2.25
    },
    ranges: {
      sellingPrice: [1.3, 5, 0.01],
      materialCost: [0.8, 3.5, 0.01],
      packingCost: [0, 0.36, 0.005],
      powerCost: [0, 0.2, 0.001],
      laborCost: [0, 0.38, 0.002],
      scrapPercent: [0, 20, 0.25],
      dailyOutput: [7000, 72000, 1000],
      overheadPerDay: [0, 15000, 100],
      maintenancePercent: [0, 10, 0.25]
    }
  },
  {
    slug: "350ml-shake",
    name: "350 ml Shake Cup",
    volumeMl: 350,
    modelType: "B",
    description: "Shake, juice, and dessert service.",
    defaults: {
      sellingPrice: 3.1,
      materialCost: 1.86,
      packingCost: 0.11,
      powerCost: 0.052,
      laborCost: 0.12,
      scrapPercent: 5.5,
      dailyOutput: 34000,
      overheadPerDay: 6100,
      maintenancePercent: 2.5
    },
    ranges: {
      sellingPrice: [1.6, 5.8, 0.01],
      materialCost: [0.95, 4.1, 0.01],
      packingCost: [0, 0.4, 0.005],
      powerCost: [0, 0.22, 0.001],
      laborCost: [0, 0.42, 0.002],
      scrapPercent: [0, 22, 0.25],
      dailyOutput: [6000, 65000, 1000],
      overheadPerDay: [0, 16000, 100],
      maintenancePercent: [0, 11, 0.25]
    }
  },
  {
    slug: "500ml-tub",
    name: "500 ml Tub",
    volumeMl: 500,
    modelType: "B",
    description: "Large tub for dessert and food packing.",
    defaults: {
      sellingPrice: 4.65,
      materialCost: 2.75,
      packingCost: 0.15,
      powerCost: 0.07,
      laborCost: 0.16,
      scrapPercent: 6,
      dailyOutput: 24000,
      overheadPerDay: 7600,
      maintenancePercent: 3
    },
    ranges: {
      sellingPrice: [2.4, 8.5, 0.01],
      materialCost: [1.3, 6.2, 0.01],
      packingCost: [0, 0.55, 0.005],
      powerCost: [0, 0.3, 0.001],
      laborCost: [0, 0.56, 0.002],
      scrapPercent: [0, 25, 0.25],
      dailyOutput: [4000, 48000, 1000],
      overheadPerDay: [0, 20000, 100],
      maintenancePercent: [0, 12, 0.25]
    }
  }
];

export const fieldMeta = {
  sellingPrice: { label: "Selling price", unit: "Rs/cup", kind: "currency" },
  materialCost: { label: "Material", unit: "Rs/cup", kind: "currency" },
  packingCost: { label: "Packing", unit: "Rs/cup", kind: "currency" },
  powerCost: { label: "Power", unit: "Rs/cup", kind: "currency" },
  laborCost: { label: "Labor", unit: "Rs/cup", kind: "currency" },
  scrapPercent: { label: "Scrap", unit: "%", kind: "percent" },
  dailyOutput: { label: "Daily output", unit: "cups", kind: "integer" },
  rent: { label: "Rent", unit: "Rs/day", kind: "currencyDay" },
  mechanic: { label: "Mechanic", unit: "Rs/day", kind: "currencyDay" },
  supervisor: { label: "Supervisor", unit: "Rs/day", kind: "currencyDay" },
  transport: { label: "Transport", unit: "Rs/day", kind: "currencyDay" },
  overheadPerDay: { label: "Overhead", unit: "Rs/day", kind: "currencyDay" },
  maintenancePercent: { label: "Maintenance", unit: "% of base", kind: "percent" }
};

export const modelFields = {
  A: [
    "sellingPrice",
    "materialCost",
    "packingCost",
    "powerCost",
    "laborCost",
    "scrapPercent",
    "dailyOutput",
    "rent",
    "mechanic",
    "supervisor",
    "transport"
  ],
  B: [
    "sellingPrice",
    "materialCost",
    "packingCost",
    "powerCost",
    "laborCost",
    "scrapPercent",
    "dailyOutput",
    "overheadPerDay",
    "maintenancePercent"
  ]
};

export function getCupBySlug(slug) {
  return cups.find((cup) => cup.slug === slug);
}
