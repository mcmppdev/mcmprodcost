"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { fieldMeta, modelFields } from "@/data/cups.config";

const storageKey = (slug) => `mcm-cup-state:${slug}`;

function round(value, digits = 4) {
  return Number.parseFloat(Number(value).toFixed(digits));
}

function formatNumber(value, kind) {
  if (kind === "integer") {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      value
    );
  }

  if (kind === "percent") {
    return `${round(value, 2)}%`;
  }

  if (kind === "decimal") {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }).format(value);
}

function calculateModelA(values) {
  const cupsPerBox = values.cpp * values.ppb;
  const dailyOutput =
    values.mach * values.cpm * 60 * values.hrs * values.shifts;
  const monthlyOutput = dailyOutput * values.days;
  const monthlyBoxes = monthlyOutput / cupsPerBox;

  const blankCost = values.bc / values.cpk;
  const bottomCost = (values.botc * (values.botu / 1000)) / values.cpk;
  const coverCost = values.cc / values.ppk / values.cpp;
  const boxCost = values.boxr / cupsPerBox;
  const materialCost = blankCost + bottomCost + coverCost + boxCost;

  const operatorMonthly = values.ops * values.opS;
  const laborCost = operatorMonthly / monthlyOutput;

  const fixedOverhead = values.sup + values.rent + values.mech + values.trans;
  const powerMonthly = monthlyBoxes * values.pwr;
  const overheadMonthly = fixedOverhead + powerMonthly;
  const overheadCost = overheadMonthly / monthlyOutput;

  const totalCost = materialCost + laborCost + overheadCost;
  const profit = values.sp - totalCost;
  const monthlyProfit = profit * monthlyOutput;

  return {
    cupsPerBox,
    dailyOutput,
    monthlyOutput,
    monthlyBoxes,
    blankCost,
    bottomCost,
    coverCost,
    boxCost,
    materialCost,
    laborCost,
    overheadCost,
    powerCost: powerMonthly / monthlyOutput,
    totalCost,
    profit,
    marginPercent: values.sp ? (profit / values.sp) * 100 : 0,
    monthlyProfit
  };
}

function calculateModelB(values) {
  const cupsPerBox = values.cpp * values.ppb;
  const dailyOutput = values.cpm * 60 * values.hrs * values.shift;
  const monthlyOutput = dailyOutput * values.days;
  const monthlyBoxes = monthlyOutput / cupsPerBox;

  const blankCost = values.bc / values.cpk;
  const bottomCost = (values.botc * (values.botu / 1000)) / values.cpk;
  const coverCost = values.cc / (values.ppk * values.cpp);
  const boxCost = values.boxr / cupsPerBox;
  const laborCost = dailyOutput > 0 ? (values.lab * values.ops) / dailyOutput : 0;
  const powerCost = values.pwr / cupsPerBox;
  const materialCost = blankCost + bottomCost + coverCost + boxCost;

  const totalCost = materialCost + laborCost + powerCost;
  const profit = values.sp - totalCost;
  const monthlyProfit = profit * monthlyOutput;

  return {
    cupsPerBox,
    dailyOutput,
    monthlyOutput,
    monthlyBoxes,
    blankCost,
    bottomCost,
    coverCost,
    boxCost,
    materialCost,
    laborCost,
    powerCost,
    overheadCost: laborCost + powerCost,
    totalCost,
    profit,
    marginPercent: values.sp ? (profit / values.sp) * 100 : 0,
    monthlyProfit
  };
}

function getStoredState(slug) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey(slug)));
  } catch {
    return null;
  }
}

export default function CupCalculator({ cup }) {
  const fields = modelFields[cup.modelType];
  const factoryDefaults = cup.defaults;
  const [values, setValues] = useState(cup.defaults);
  const [baseline, setBaseline] = useState("Factory defaults");

  useEffect(() => {
    const stored = getStoredState(cup.slug);

    if (stored) {
      setValues({ ...factoryDefaults, ...stored });
      setBaseline("Saved local state");
    } else {
      setValues(factoryDefaults);
      setBaseline("Factory defaults");
    }
  }, [cup.slug, factoryDefaults]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (JSON.stringify(values) === JSON.stringify(factoryDefaults)) {
      window.localStorage.removeItem(storageKey(cup.slug));
      return;
    }

    window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(values));
  }, [cup.slug, factoryDefaults, values]);

  const totals = useMemo(() => {
    return cup.modelType === "A" ? calculateModelA(values) : calculateModelB(values);
  }, [cup.modelType, values]);

  function updateValue(field, nextValue) {
    setValues((current) => ({
      ...current,
      [field]: Number(nextValue)
    }));
  }

  function resetToDefaults() {
    window.localStorage.removeItem(storageKey(cup.slug));
    setValues(factoryDefaults);
    setBaseline("Factory defaults");
  }

  function saveAsDefault() {
    window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(values));
    setBaseline("Saved local default");
  }

  function clearSavedState() {
    window.localStorage.removeItem(storageKey(cup.slug));
    setBaseline("Factory defaults on next load");
  }

  const profitTone = totals.profit >= 0 ? "positive" : "negative";

  return (
    <article className="calculator">
      <header className="calculator-header">
        <div>
          <p className="eyebrow">Model {cup.modelType}</p>
          <h1>{cup.name}</h1>
          <p>{cup.description}</p>
        </div>
        <span className={`profit-badge ${profitTone}`}>
          {formatNumber(totals.marginPercent, "percent")} margin
        </span>
      </header>

      <section className="summary-strip" aria-label="Cost summary">
        <Metric label="Selling price" value={values.sp} />
        <Metric label="Total cost" value={totals.totalCost} />
        <Metric label="Profit/cup" value={totals.profit} tone={profitTone} />
        <Metric
          label="Monthly profit"
          value={totals.monthlyProfit}
          kind="currencyDay"
          tone={profitTone}
        />
      </section>

      <div className="action-row">
        <span>{baseline}</span>
        <button type="button" onClick={resetToDefaults}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
        <button type="button" onClick={saveAsDefault}>
          <Save size={17} aria-hidden="true" />
          Save
        </button>
        <button type="button" onClick={clearSavedState} aria-label="Clear saved state">
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>

      <section className="slider-list" aria-label="Calculator inputs">
        {fields.map((field) => {
          const [min, max, step] = cup.ranges[field];
          const meta = fieldMeta[field];

          return (
            <label className="slider-row" key={field}>
              <span>
                <strong>{meta.label}</strong>
                <em>{meta.unit}</em>
              </span>
              <output>{formatNumber(values[field], meta.kind)}</output>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={values[field]}
                onChange={(event) => updateValue(field, event.target.value)}
              />
            </label>
          );
        })}
      </section>

      <section className="breakdown" aria-label="Cost breakdown">
        <h2>Breakdown</h2>
        <BreakdownRow label="Blanks" value={totals.blankCost} />
        <BreakdownRow label="Bottom" value={totals.bottomCost} />
        <BreakdownRow label="Cover" value={totals.coverCost} />
        <BreakdownRow label="Box" value={totals.boxCost} />
        <BreakdownRow label="Material total" value={totals.materialCost} />
        <BreakdownRow label="Labor" value={totals.laborCost} />
        {cup.modelType === "A" ? (
          <BreakdownRow label="Overhead incl. power" value={totals.overheadCost} />
        ) : (
          <BreakdownRow label="Power" value={totals.powerCost} />
        )}
        <BreakdownRow label="Cups per box" value={totals.cupsPerBox} kind="integer" />
        <BreakdownRow
          label="Monthly output"
          value={totals.monthlyOutput}
          kind="integer"
        />
        <BreakdownRow
          label="Monthly boxes"
          value={totals.monthlyBoxes}
          kind="integer"
        />
      </section>
    </article>
  );
}

function Metric({ label, value, kind = "currency", tone }) {
  return (
    <div className={tone ? `metric ${tone}` : "metric"}>
      <span>{label}</span>
      <strong>Rs {formatNumber(value, kind)}</strong>
    </div>
  );
}

function BreakdownRow({ label, value, kind = "currency" }) {
  return (
    <div className="breakdown-row">
      <span>{label}</span>
      <strong>
        {kind === "currency" ? "Rs " : ""}
        {formatNumber(round(value), kind)}
      </strong>
    </div>
  );
}
