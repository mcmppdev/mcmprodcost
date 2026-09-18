// Full monthly salaries and fixed overhead are allocated over monthly production.
export function migrateModelA(values) {
  const v = { ...values };
  v.mach ??= 1;
  v.shifts ??= v.shift ?? 1;
  v.opS ??= (v.lab || 0) * v.days;
  v.rent ??= 0;
  v.sup ??= v.otherManpowerSalary ?? 0;
  v.mech ??= 0;
  v.trans ??= 0;
  if (v.pwr == null) {
    v.pwr = v.cpm > 0 ? (v.powerCostPerHour || 0) * v.cpp * v.ppb / (v.cpm * 60) : 0;
  }
  for (const key of ["lab", "shift", "otherManpowerSalary", "powerCostPerHour"]) delete v[key];
  return v;
}

export function restoreCostInputs(defaults, saved = {}) {
  const merged = { ...defaults, ...saved };
  if (saved.pwr == null && saved.powerCostPerHour != null) delete merged.pwr;
  if (saved.opS == null && saved.lab != null) delete merged.opS;
  if (saved.shifts == null && saved.shift != null) delete merged.shifts;
  if (saved.otherManpowerSalary != null && saved.sup == null && saved.mech == null) {
    // Preserve the saved combined salary without counting the factory salaries twice.
    merged.sup = saved.otherManpowerSalary;
    merged.mech = 0;
  }
  return migrateModelA(merged);
}

export function calculateModelA(values) {
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, parseFloat(value) || 0]));
  const divide = (a, b) => b > 0 ? a / b : 0;
  const cupsPerBox = v.cpp * v.ppb;
  const dailyOutput = v.hrs * v.shifts * v.cpm * 60 * v.mach;
  const monthlyOutput = dailyOutput * v.days;
  const monthlyBoxes = divide(monthlyOutput, cupsPerBox);
  const blankCost = divide(v.bc, v.cpk);
  const bottomCost = divide(v.botc * v.botu / 1000, v.cpk);
  const coverCost = divide(v.cc, v.ppk * v.cpp);
  const boxCost = divide(v.boxr, cupsPerBox);
  const materialCost = blankCost + bottomCost + coverCost + boxCost;
  const operatorMonthly = v.ops * v.opS;
  const laborCost = divide(operatorMonthly, monthlyOutput);
  const powerMonthly = monthlyBoxes * v.pwr;
  const powerCost = divide(powerMonthly, monthlyOutput);
  const fixedOverheadMonthly = v.rent + v.sup + v.mech + v.trans;
  const totalOverheadMonthly = fixedOverheadMonthly + powerMonthly;
  const totalOverheadPerCup = divide(totalOverheadMonthly, monthlyOutput);
  const directCostPerCup = materialCost + laborCost + powerCost;
  const totalCost = materialCost + laborCost + totalOverheadPerCup;
  const contributionPerCup = v.sp - directCostPerCup;
  const profit = v.sp - totalCost;
  const materialCostPerMonth = materialCost * monthlyOutput;
  const totalProductionCostMonthly = materialCostPerMonth + operatorMonthly + totalOverheadMonthly;
  return {
    cupsPerBox, dailyOutput, monthlyOutput, monthlyBoxes,
    blankCost, bottomCost, coverCost, boxCost, materialCost, materialCostPerMonth,
    operatorMonthly, laborCost, powerMonthly, powerCost,
    fixedOverheadMonthly, totalOverheadMonthly, totalOverheadPerCup,
    directCostPerCup, totalCost, contributionPerCup, profit,
    totalProductionCostMonthly,
    monthlyProfit: v.sp * monthlyOutput - totalProductionCostMonthly,
    marginPercent: v.sp ? profit / v.sp * 100 : 0
  };
}
