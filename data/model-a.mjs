// Match the supplied Apps Script: monthly fixed charges are allocated over 30 days.
export function migrateModelA(values) {
  const result = { ...values };
  result.mach ??= 1;
  result.shifts ??= result.shift ?? 1;
  result.opS ??= (result.lab || 0) * 30;
  result.rent ??= 0;
  if (result.powerCostPerHour == null && result.pwr != null) {
    const cupsPerBox = result.cpp * result.ppb;
    result.powerCostPerHour = cupsPerBox > 0
      ? result.pwr * result.cpm * 60 / cupsPerBox : 0;
  }
  if (result.otherManpowerSalary == null) {
    result.otherManpowerSalary = (result.sup || 0) + (result.mech || 0);
  }
  delete result.pwr;
  delete result.sup;
  delete result.mech;
  delete result.trans;
  delete result.lab;
  delete result.shift;
  return result;
}

export function restoreCostInputs(defaults, saved = {}) {
  const merged = { ...defaults, ...saved };
  if (saved.powerCostPerHour == null && saved.pwr != null) delete merged.powerCostPerHour;
  if (saved.opS == null && saved.lab != null) delete merged.opS;
  if (saved.shifts == null && saved.shift != null) delete merged.shifts;
  if (saved.otherManpowerSalary == null && ["sup", "mech", "trans"].some(key => saved[key] != null)) {
    delete merged.otherManpowerSalary;
    merged.sup ??= 22000;
    merged.mech ??= 20000;
  }
  return migrateModelA(merged);
}

export function calculateModelA(values) {
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, parseFloat(value) || 0]));
  const divide = (a, b) => b > 0 ? a / b : 0;
  const cupsPerBox = v.cpp * v.ppb;
  const workHoursPerDay = v.hrs * v.shifts;
  const dailyOutput = workHoursPerDay * v.cpm * 60 * v.mach;
  const monthlyOutput = dailyOutput * v.days;
  const blankCost = divide(v.bc, v.cpk);
  // Existing bottom usage is g/kg: 390 g/kg equals 39 percent.
  const bottomCost = divide(v.botc * v.botu / 1000, v.cpk);
  const coverCost = divide(v.cc, v.ppk * v.cpp);
  const boxCost = v.cpk > 0 ? divide(v.boxr, cupsPerBox) : 0;
  const materialCost = v.cpk > 0 ? blankCost + bottomCost + coverCost + boxCost : 0;
  const operatorMonthly = v.ops * v.opS;
  const dailyFixedCost = (operatorMonthly + v.otherManpowerSalary + v.rent) / 30;
  const dailyPowerCost = v.powerCostPerHour * workHoursPerDay * v.mach;
  const totalDailyCost = dailyFixedCost + dailyPowerCost;
  const totalMonthlyCost = totalDailyCost * v.days;
  const formingCostPerCup = divide(totalDailyCost, dailyOutput);
  const totalCost = materialCost + formingCostPerCup;
  const directCostPerCup = materialCost + divide(operatorMonthly / 30 + dailyPowerCost, dailyOutput);
  const contributionPerCup = v.sp - directCostPerCup;
  const profit = v.sp - totalCost;
  return {
    cupsPerBox, dailyOutput, monthlyOutput,
    monthlyBoxes: divide(monthlyOutput, cupsPerBox),
    blankCost, bottomCost, coverCost, boxCost, materialCost,
    materialCostPerMonth: materialCost * monthlyOutput,
    operatorMonthly,
    laborCost: divide(operatorMonthly / 30, dailyOutput),
    powerCost: divide(dailyPowerCost, dailyOutput),
    dailyFixedCost, dailyPowerCost, totalDailyCost, totalMonthlyCost,
    formingCostPerCup, totalCost, profit,
    directCostPerCup, contributionPerCup,
    monthlyProfit: profit * monthlyOutput,
    marginPercent: v.sp ? profit / v.sp * 100 : 0
  };
}
