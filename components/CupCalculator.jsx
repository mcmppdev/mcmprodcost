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
  const powerMonthly = monthlyBoxes * values.pwr;
  const powerCost = powerMonthly / monthlyOutput;
  const directCostPerCup = materialCost + laborCost + powerCost;
  const contributionPerCup = values.sp - directCostPerCup;
  const monthlyContribution = contributionPerCup * monthlyOutput;

  const fixedOverheadMonthly =
    values.rent + values.sup + values.trans + values.mech;
  const fixedOverheadPerCup = fixedOverheadMonthly / monthlyOutput;
  const fullyLoadedCostPerCup = directCostPerCup + fixedOverheadPerCup;
  const netMonthlyProfit = monthlyContribution - fixedOverheadMonthly;
  const overheadSavingsOpportunity = fixedOverheadMonthly;
  const savingsPerCup = fixedOverheadPerCup;

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
    directCostPerCup,
    contributionPerCup,
    monthlyContribution,
    fixedOverheadMonthly,
    fixedOverheadPerCup,
    fullyLoadedCostPerCup,
    netMonthlyProfit,
    overheadSavingsOpportunity,
    savingsPerCup,
    overheadCost: fixedOverheadPerCup,
    totalCost: fullyLoadedCostPerCup,
    profit: contributionPerCup,
    marginPercent: values.sp ? (contributionPerCup / values.sp) * 100 : 0,
    monthlyProfit: netMonthlyProfit
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

function withoutVariantFields(values, variantFields = []) {
  return Object.fromEntries(
    Object.entries(values).filter(([field]) => !variantFields.includes(field))
  );
}

function getStoredSharedState(cup, stored) {
  return withoutVariantFields(stored?.shared || {}, cup.variantFields);
}

function getFactoryState(cup) {
  if (!cup.variants?.length) {
    return {
      shared: cup.defaults,
      variants: {}
    };
  }

  return {
    shared: withoutVariantFields(cup.defaults, cup.variantFields),
    variants: Object.fromEntries(
      cup.variants.map((variant) => [
        variant.id,
        {
          ...variant.defaults
        }
      ])
    )
  };
}

function isVariantField(cup, field) {
  return cup.variantFields?.includes(field);
}

function getInitialVariant(cup) {
  return cup.initialVariant || cup.defaultVariant || cup.variants?.[0]?.id;
}

function getRouteVariant(cup) {
  return cup.variants?.find((variant) => variant.id === cup.requestedSlug)?.id;
}

function isFactoryState(current, factory) {
  return (
    JSON.stringify(current.shared) === JSON.stringify(factory.shared) &&
    JSON.stringify(current.variants) === JSON.stringify(factory.variants)
  );
}

export default function CupCalculator({ cup }) {
  const fields = modelFields[cup.modelType];
  const hasVariants = Boolean(cup.variants?.length);
  const factoryState = useMemo(() => getFactoryState(cup), [cup]);
  const initialVariant = getInitialVariant(cup);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [sharedValues, setSharedValues] = useState(factoryState.shared);
  const [variantValues, setVariantValues] = useState(factoryState.variants);
  const [baseline, setBaseline] = useState("Factory defaults");

  const values = useMemo(() => {
    if (!hasVariants) {
      return sharedValues;
    }

    return {
      ...sharedValues,
      ...variantValues[selectedVariant]
    };
  }, [hasVariants, selectedVariant, sharedValues, variantValues]);

  useEffect(() => {
    const stored = getStoredState(cup.slug);

    if (hasVariants) {
      const routeVariant = getRouteVariant(cup);
      const storedVariant = cup.variants.some(
        (variant) => variant.id === stored?.selectedVariant
      )
        ? stored.selectedVariant
        : initialVariant;

      setSelectedVariant(routeVariant || storedVariant);
      setSharedValues({
        ...factoryState.shared,
        ...getStoredSharedState(cup, stored)
      });
      setVariantValues({
        ...factoryState.variants,
        ...(stored?.variants || {})
      });
      setBaseline(stored ? "Saved local state" : "Factory defaults");
      return;
    }

    if (stored) {
      setSharedValues({ ...factoryState.shared, ...stored });
      setBaseline("Saved local state");
    } else {
      setSharedValues(factoryState.shared);
      setBaseline("Factory defaults");
    }
  }, [cup, cup.slug, cup.variants, factoryState, hasVariants, initialVariant]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (hasVariants) {
      const payload = {
        shared: sharedValues,
        variants: variantValues,
        selectedVariant
      };

      if (isFactoryState(payload, factoryState)) {
        window.localStorage.removeItem(storageKey(cup.slug));
        return;
      }

      window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(payload));
      return;
    }

    if (JSON.stringify(sharedValues) === JSON.stringify(factoryState.shared)) {
      window.localStorage.removeItem(storageKey(cup.slug));
      return;
    }

    window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(sharedValues));
  }, [
    cup.slug,
    factoryState,
    hasVariants,
    selectedVariant,
    sharedValues,
    variantValues
  ]);

  const totals = useMemo(() => {
    return cup.modelType === "A" ? calculateModelA(values) : calculateModelB(values);
  }, [cup.modelType, values]);

  function updateValue(field, nextValue) {
    if (hasVariants && isVariantField(cup, field)) {
      setVariantValues((current) => ({
        ...current,
        [selectedVariant]: {
          ...current[selectedVariant],
          [field]: Number(nextValue)
        }
      }));
      return;
    }

    setSharedValues((current) => ({
      ...current,
      [field]: Number(nextValue)
    }));
  }

  function resetToDefaults() {
    window.localStorage.removeItem(storageKey(cup.slug));
    setSharedValues(factoryState.shared);
    setVariantValues(factoryState.variants);
    setBaseline("Factory defaults");
  }

  function saveAsDefault() {
    if (hasVariants) {
      window.localStorage.setItem(
        storageKey(cup.slug),
        JSON.stringify({
          shared: sharedValues,
          variants: variantValues,
          selectedVariant
        })
      );
    } else {
      window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(sharedValues));
    }

    setBaseline("Saved local default");
  }

  function clearSavedState() {
    window.localStorage.removeItem(storageKey(cup.slug));
    setBaseline("Factory defaults on next load");
  }

  const profitTone = totals.monthlyProfit >= 0 ? "positive" : "negative";
  const isModelA = cup.modelType === "A";

  return (
    <article className="calculator">
      <header className="calculator-header">
        <div>
          <p className="eyebrow">Model {cup.modelType}</p>
          <h1>{cup.name}</h1>
          <p>{cup.description}</p>
          {hasVariants && (
            <div
              className="variant-selector"
              role="radiogroup"
              aria-label="Cup size"
            >
              {cup.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedVariant === variant.id}
                  className={selectedVariant === variant.id ? "active" : ""}
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className={`profit-badge ${profitTone}`}>
          {formatNumber(totals.marginPercent, "percent")} margin
        </span>
      </header>

      <section className="summary-strip" aria-label="Cost summary">
        {isModelA ? (
          <>
            <Metric label="Selling price" value={values.sp} />
            <Metric label="Direct cost/cup" value={totals.directCostPerCup} />
            <Metric
              label="Contribution/cup"
              value={totals.contributionPerCup}
              tone={totals.contributionPerCup >= 0 ? "positive" : "negative"}
            />
            <Metric
              label="Net monthly profit"
              value={totals.netMonthlyProfit}
              kind="currencyDay"
              tone={profitTone}
            />
          </>
        ) : (
          <>
            <Metric label="Selling price" value={values.sp} />
            <Metric label="Total cost" value={totals.totalCost} />
            <Metric label="Profit/cup" value={totals.profit} tone={profitTone} />
            <Metric
              label="Monthly profit"
              value={totals.monthlyProfit}
              kind="currencyDay"
              tone={profitTone}
            />
          </>
        )}
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

      <section className="input-groups" aria-label="Calculator inputs">
        {hasVariants ? (
          <>
            <SliderGroup
              title={`Variant inputs - ${
                cup.variants.find((variant) => variant.id === selectedVariant)?.label
              }`}
              fields={fields.filter((field) => isVariantField(cup, field))}
              cup={cup}
              values={values}
              selectedVariant={selectedVariant}
              onChange={updateValue}
            />
            <SliderGroup
              title="Shared fixed costs"
              fields={fields.filter((field) => !isVariantField(cup, field))}
              cup={cup}
              values={values}
              selectedVariant={selectedVariant}
              onChange={updateValue}
            />
          </>
        ) : (
          <SliderGroup
            title="Inputs"
            fields={fields}
            cup={cup}
            values={values}
            selectedVariant={selectedVariant}
            onChange={updateValue}
          />
        )}
      </section>

      <section className="breakdown" aria-label="Cost breakdown">
        <h2>Breakdown</h2>
        <BreakdownRow label="Blanks" value={totals.blankCost} />
        <BreakdownRow label="Bottom" value={totals.bottomCost} />
        <BreakdownRow label="Cover" value={totals.coverCost} />
        <BreakdownRow label="Box" value={totals.boxCost} />
        <BreakdownRow label="Material total" value={totals.materialCost} />
        <BreakdownRow label="Labor" value={totals.laborCost} />
        {isModelA ? (
          <>
            <BreakdownRow label="Power" value={totals.powerCost} />
            <BreakdownRow
              label="Production cost before overhead"
              value={totals.directCostPerCup}
            />
            <BreakdownRow
              label="Contribution before overhead"
              value={totals.monthlyContribution}
            />
            <BreakdownRow
              label="Fixed overhead deducted"
              value={totals.fixedOverheadMonthly}
            />
            <BreakdownRow label="Net after overhead" value={totals.netMonthlyProfit} />
            <BreakdownRow
              label="Fixed overhead per cup"
              value={totals.fixedOverheadPerCup}
            />
            <BreakdownRow
              label="Fully loaded cost/cup"
              value={totals.fullyLoadedCostPerCup}
            />
            <BreakdownRow
              label="Savings opportunity"
              value={totals.overheadSavingsOpportunity}
            />
            <BreakdownRow label="Savings per cup" value={totals.savingsPerCup} />
          </>
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

function SliderGroup({ title, fields, cup, values, selectedVariant, onChange }) {
  return (
    <div className="slider-group">
      <h2>{title}</h2>
      <div className="slider-list">
        {fields.map((field) => {
          const [min, max, step] = cup.ranges[field];
          const meta = fieldMeta[field];
          const selectedLabel = cup.variants?.find(
            (variant) => variant.id === selectedVariant
          )?.label;

          return (
            <label className="slider-row" key={field}>
              <span>
                <strong>{meta.label}</strong>
                <em>
                  {meta.unit}
                  {isVariantField(cup, field) && selectedLabel
                    ? ` for ${selectedLabel}`
                    : ""}
                </em>
              </span>
              <output>{formatNumber(values[field], meta.kind)}</output>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={values[field]}
                onChange={(event) => onChange(field, event.target.value)}
              />
            </label>
          );
        })}
      </div>
    </div>
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
