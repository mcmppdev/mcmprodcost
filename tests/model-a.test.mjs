import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { calculateModelA, migrateModelA, restoreCostInputs } from "../data/model-a.mjs";

const config = readFileSync(new URL("../data/cups.config.js", import.meta.url), "utf8");
const context = { migrateModelA };
vm.runInNewContext(config.replace(/^import .*;\r?\n/m, "").replaceAll("export ", "") + ";this.defaults = modelA65.defaults;this.configured = cups;", context);
const defaults = context.defaults;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);

// Independently evaluate the supplied reference's per-kg material method.
function reference(v) {
  const hours = v.hrs * v.shifts;
  const cups = hours * v.cpm * 60 * v.mach;
  const production = v.bc + v.botc * (v.botu / 10) / 100;
  const cover = v.cc * ((v.cpk / v.cpp) / v.ppk);
  const box = v.boxr / ((v.cpp * v.ppb) / v.cpk);
  const material = (production + cover + box) / v.cpk;
  const fixed = (v.opS * v.ops) / 30 + v.otherManpowerSalary / 30 + v.rent / 30;
  const power = v.powerCostPerHour * hours * v.mach;
  return { cups, material, fixed, power, forming: (fixed + power) / cups };
}

test("matches Apps Script at factory and changed production inputs", () => {
  for (const v of [defaults, { ...defaults, days: 30, mach: 2, shifts: 2, cpm: 70, powerCostPerHour: 52, otherManpowerSalary: 30000 }, { ...defaults, cpk: 980, botu: 360, cpp: 75, ppb: 120 }]) {
    const actual = calculateModelA(v), expected = reference(v);
    close(actual.dailyOutput, expected.cups);
    close(actual.materialCost, expected.material);
    close(actual.dailyFixedCost, expected.fixed);
    close(actual.dailyPowerCost, expected.power);
    close(actual.formingCostPerCup, expected.forming);
    close(actual.totalCost, expected.material + expected.forming);
    close(actual.totalMonthlyCost, (expected.fixed + expected.power) * v.days);
    close(actual.monthlyProfit, (v.sp - actual.totalCost) * expected.cups * v.days);
  }
});

test("working days scale monthly amounts, not per-cup fixed charges", () => {
  const a = calculateModelA(defaults);
  const b = calculateModelA({ ...defaults, days: 12 });
  close(a.totalCost, b.totalCost);
  close(a.totalMonthlyCost / 2, b.totalMonthlyCost);
  close(a.totalCost, 0.20260028326950746);
  close(a.directCostPerCup, 0.18869842623039556);
});

test("legacy electricity conversion preserves baseline power cost and excludes transport from salary", () => {
  const { powerCostPerHour, otherManpowerSalary, ...base } = defaults;
  const migrated = migrateModelA({ ...base, pwr: 100, sup: 22000, mech: 20000, trans: 15000 });
  close(migrated.powerCostPerHour, 37.77777777777778);
  assert.equal(migrated.otherManpowerSalary, 42000);
  close(calculateModelA(migrated).dailyPowerCost * defaults.days, 28560);
  assert.deepEqual(migrateModelA(migrated), migrated);
  const explicit = migrateModelA({ ...migrated, powerCostPerHour: 50, otherManpowerSalary: 0, pwr: 100 });
  assert.equal(explicit.powerCostPerHour, 50);
  assert.equal(explicit.otherManpowerSalary, 0);
});

test("zero output does not produce infinite per-cup costs", () => {
  const r = calculateModelA({ ...defaults, mach: 0 });
  assert.equal(r.formingCostPerCup, 0);
  assert.equal(r.monthlyProfit, 0);
  assert.ok(Number.isFinite(r.totalCost));
});

test("every cup size matches the reference and has ranges for the monthly inputs", () => {
  for (const cup of context.configured) {
    assert.equal(cup.modelType, "A");
    for (const field of ["mach", "shifts", "opS", "rent", "otherManpowerSalary", "powerCostPerHour"]) {
      assert.ok(cup.ranges[field], `${cup.slug}: ${field}`);
    }
    for (const v of cup.variants?.map(variant => variant.defaults) || [cup.defaults]) {
      const expected = reference(v);
      close(calculateModelA(v).totalCost, expected.material + expected.forming);
    }
  }
});

test("saved daily-wage inputs override factory defaults with correct unit conversion", () => {
  const cup = context.configured.find(cup => cup.slug === "100ml");
  const restored = restoreCostInputs(cup.defaults, { lab: 400, shift: 2, pwr: 90, cpm: 50 });
  assert.equal(restored.opS, 12000);
  assert.equal(restored.shifts, 2);
  close(restored.powerCostPerHour, 90 * 50 * 60 / (cup.defaults.cpp * cup.defaults.ppb));
  assert.equal(restored.otherManpowerSalary, 0);
  const r = calculateModelA(restored), expected = reference(restored);
  close(r.totalCost, expected.material + expected.forming);
  assert.deepEqual(restoreCostInputs(cup.defaults, restored), restored);
});
