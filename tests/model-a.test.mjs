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


test("65ml matches every row of the supplied monthly costing table", () => {
  const r = calculateModelA(defaults);
  const expected = {
    cupsPerBox: 13500, monthlyOutput: 3855600, monthlyBoxes: 285.6,
    operatorMonthly: 49500, fixedOverheadMonthly: 82000,
    powerMonthly: 28560, totalOverheadMonthly: 110560
  };
  for (const [key, value] of Object.entries(expected)) close(r[key], value);
  const rounded = { blankCost: "0.11957", bottomCost: "0.03900", coverCost: "0.00794",
    boxCost: "0.00452", materialCost: "0.17102", laborCost: "0.01284",
    totalOverheadPerCup: "0.02868", directCostPerCup: "0.19127", totalCost: "0.21253" };
  for (const [key, value] of Object.entries(rounded)) assert.equal(r[key].toFixed(5), value, key);
  close(r.materialCostPerMonth, 659385.652173913);
  close(r.totalProductionCostMonthly, 819445.652173913);
  close(r.monthlyProfit, 9508.347826087);
});

test("fewer working days increase per-cup salary and fixed overhead without prorating monthly bills", () => {
  const a = calculateModelA(defaults), b = calculateModelA({ ...defaults, days: 12 });
  close(b.laborCost, a.laborCost * 2);
  close(b.operatorMonthly, a.operatorMonthly);
  close(b.fixedOverheadMonthly, a.fixedOverheadMonthly);
  close(b.powerMonthly, a.powerMonthly / 2);
  close(b.powerCost, a.powerCost);
});

test("every size reconciles direct cost, full cost, and monthly profit", () => {
  for (const cup of context.configured) {
    for (const key of ["opS", "pwr", "rent", "sup", "mech", "trans"]) assert.ok(cup.ranges[key], cup.slug + key);
    for (const v of cup.variants?.map(variant => variant.defaults) || [cup.defaults]) {
      const r = calculateModelA(v);
      close(r.directCostPerCup, r.materialCost + r.laborCost + r.powerCost);
      close(r.totalCost, r.materialCost + r.laborCost + r.totalOverheadPerCup);
      close(r.totalCost - r.directCostPerCup, r.fixedOverheadMonthly / r.monthlyOutput);
      close(r.totalProductionCostMonthly, r.totalCost * r.monthlyOutput);
      close(r.monthlyProfit, (v.sp - r.totalCost) * r.monthlyOutput);
    }
  }
});

test("hourly saved electricity is converted once, and combined salaries are not double counted", () => {
  const restored = restoreCostInputs(defaults, { powerCostPerHour: 100 * 85 * 60 / 13500, otherManpowerSalary: 42000 });
  close(restored.pwr, 100);
  close(restored.sup + restored.mech, 42000);
  close(restored.trans, 15000);
  close(calculateModelA(restored).totalCost, calculateModelA(defaults).totalCost);
  assert.deepEqual(restoreCostInputs(defaults, restored), restored);
  const explicit = restoreCostInputs(defaults, { pwr: 120, powerCostPerHour: 99, sup: 0, mech: 0, trans: 0 });
  assert.equal(explicit.pwr, 120);
  assert.equal(explicit.sup, 0);
});

test("old daily wages retain monthly expense when converted", () => {
  const cup = context.configured.find(c => c.slug === "100ml");
  const restored = restoreCostInputs(cup.defaults, { lab: 400, days: 10, shift: 2, pwr: 90 });
  assert.equal(restored.opS, 4000);
  assert.equal(restored.shifts, 2);
  assert.equal(restored.pwr, 90);
});

test("zero production retains monthly bills and avoids infinite unit costs", () => {
  const r = calculateModelA({ ...defaults, days: 0 });
  assert.ok(Number.isFinite(r.totalCost));
  assert.equal(r.monthlyProfit, -131500);
});
