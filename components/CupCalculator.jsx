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

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }).format(value);
}

function calculateModelA(values) {
  const baseUnitCost =
    values.materialCost + values.packingCost + values.powerCost + values.laborCost;
  const overheadPerCup =
    (values.rent + values.mechanic + values.supervisor + values.transport) /
    values.dailyOutput;
  const scrapCost = baseUnitCost * (values.scrapPercent / 100);
  const totalCost = baseUnitCost + overheadPerCup + scrapCost;
  const profit = values.sellingPrice - totalCost;

  return {
    baseUnitCost,
    overheadPerCup,
    scrapCost,
    maintenanceCost: 0,
    totalCost,
    profit,
    marginPercent: values.sellingPrice ? (profit / values.sellingPrice) * 100 : 0,
    dailyProfit: profit * values.dailyOutput
  };
}

function calculateModelB(values) {
  const baseUnitCost =
    values.materialCost + values.packingCost + values.powerCost + values.laborCost;
  const overheadPerCup = values.overheadPerDay / values.dailyOutput;
  const maintenanceCost = baseUnitCost * (values.maintenancePercent / 100);
  const scrapCost = (baseUnitCost + maintenanceCost) * (values.scrapPercent / 100);
  const totalCost = baseUnitCost + overheadPerCup + maintenanceCost + scrapCost;
  const profit = values.sellingPrice - totalCost;

  return {
    baseUnitCost,
    overheadPerCup,
    maintenanceCost,
    scrapCost,
    totalCost,
    profit,
    marginPercent: values.sellingPrice ? (profit / values.sellingPrice) * 100 : 0,
    dailyProfit: profit * values.dailyOutput
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
        <Metric label="Selling price" value={values.sellingPrice} />
        <Metric label="Total cost" value={totals.totalCost} />
        <Metric label="Profit/cup" value={totals.profit} tone={profitTone} />
        <Metric
          label="Daily profit"
          value={totals.dailyProfit}
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
        <BreakdownRow label="Base unit cost" value={totals.baseUnitCost} />
        <BreakdownRow label="Overhead per cup" value={totals.overheadPerCup} />
        {cup.modelType === "B" && (
          <BreakdownRow label="Maintenance cost" value={totals.maintenanceCost} />
        )}
        <BreakdownRow label="Scrap allowance" value={totals.scrapCost} />
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

function BreakdownRow({ label, value }) {
  return (
    <div className="breakdown-row">
      <span>{label}</span>
      <strong>Rs {formatNumber(round(value), "currency")}</strong>
    </div>
  );
}
