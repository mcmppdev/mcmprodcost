"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import { fieldMeta, modelFields } from "@/data/cups.config";

import { calculateModelA, restoreCostInputs } from "@/data/model-a.mjs";

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
    maximumFractionDigits: kind === "currency" ? 5 : kind === "moneyMonthly" ? 2 : 3
  }).format(value);
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

async function getRemoteState(slug) {
  const response = await fetch(`/api/defaults?slug=${encodeURIComponent(slug)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.state;
}

async function saveRemoteState(slug, state) {
  const response = await fetch("/api/defaults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ slug, state })
  });

  if (!response.ok) {
    throw new Error("Remote defaults could not be saved");
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

function getStoredVariantState(cup, stored, factoryVariants) {
  return Object.fromEntries(cup.variants.map((variant) => {
    const saved = { ...(stored?.shared || {}), ...(stored?.variants?.[variant.id] || {}) };
    return [variant.id, restoreCostInputs(factoryVariants[variant.id], saved)];
  }));
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

function makeStatePayload({ hasVariants, selectedVariant, sharedValues, variantValues }) {
  if (hasVariants) {
    return {
      shared: sharedValues,
      variants: variantValues,
      selectedVariant
    };
  }

  return sharedValues;
}

export default function CupCalculator({ cup }) {
  const fields = modelFields[cup.modelType];
  const hasVariants = Boolean(cup.variants?.length);
  const factoryState = useMemo(() => getFactoryState(cup), [cup]);
  const initialVariant = getInitialVariant(cup);
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [sharedValues, setSharedValues] = useState(factoryState.shared);
  const [variantValues, setVariantValues] = useState(factoryState.variants);
  const [baseline, setBaseline] = useState("Loading saved inputs...");
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);

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
    let isCurrent = true;

    async function loadDefaults() {
      setDefaultsLoaded(false);
      const local = getStoredState(cup.slug);
      const remote = await getRemoteState(cup.slug).catch(() => null);
      const stored = remote || local;

      if (!isCurrent) {
        return;
      }

      if (remote && typeof window !== "undefined") {
        window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(remote));
      }

      if (!hasVariants) {
        if (stored) {
          setSharedValues(restoreCostInputs(factoryState.shared, stored));
          setBaseline(remote ? "Saved global defaults" : "Saved local state");
        } else {
          setSharedValues(factoryState.shared);
          setBaseline("Factory defaults");
        }
        setDefaultsLoaded(true);
        return;
      }

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
      setVariantValues(getStoredVariantState(cup, stored, factoryState.variants));
      setBaseline(
        stored
          ? remote
            ? "Saved global defaults"
            : "Saved local state"
          : "Factory defaults"
      );
      setDefaultsLoaded(true);
    }

    loadDefaults();

    return () => {
      isCurrent = false;
    };
  }, [cup, cup.slug, cup.variants, factoryState, hasVariants, initialVariant]);

  useEffect(() => {
    if (typeof window === "undefined" || !defaultsLoaded) {
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
    defaultsLoaded,
    factoryState,
    hasVariants,
    selectedVariant,
    sharedValues,
    variantValues
  ]);

  const totals = useMemo(() => {
    return calculateModelA(values);
  }, [values]);

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
    const payload = makeStatePayload({
      hasVariants,
      selectedVariant,
      sharedValues,
      variantValues
    });

    window.localStorage.setItem(storageKey(cup.slug), JSON.stringify(payload));

    setBaseline("Saving global defaults...");
    saveRemoteState(cup.slug, payload)
      .then(() => setBaseline("Saved global defaults"))
      .catch(() => setBaseline("Saved locally; global store unavailable"));
  }

  function clearSavedState() {
    window.localStorage.removeItem(storageKey(cup.slug));
    setBaseline("Factory defaults on next load");
  }

  const profitTone = totals.monthlyProfit >= 0 ? "positive" : "negative";
  const isModelA = cup.modelType === "A";
  const variantInputFields = fields.filter((field) => isVariantField(cup, field));
  const sharedInputFields = fields.filter((field) => !isVariantField(cup, field));

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
        <Metric label="Selling price" value={values.sp} />
        <Metric label={isModelA ? "Direct cost/cup" : "Total cost"}
          value={isModelA ? totals.directCostPerCup : totals.totalCost}
          detail={isModelA ? "Materials + labor + power" : undefined} />
        <Metric label={isModelA ? "Contribution/cup" : "Profit/cup"}
          value={isModelA ? totals.contributionPerCup : totals.profit}
          tone={(isModelA ? totals.contributionPerCup : totals.profit) >= 0 ? "positive" : "negative"} />
        <Metric label={isModelA ? "Net monthly profit" : "Monthly profit"} value={totals.monthlyProfit} kind="currencyDay" tone={profitTone} />
      </section>

      <section className="production-total" aria-label="Total production cost">
        <h2>Total production cost</h2>
        <p>Materials + labor + overhead (including power)</p>
        <p>Totals use unrounded values; displayed amounts may differ slightly when added.</p>
        <div className="production-total-grid">
          <div>
            <h3>Per cup</h3>
            <BreakdownRow label="Materials" value={totals.materialCost} />
            <BreakdownRow label="+ Labor" value={totals.laborCost} />
            <BreakdownRow label="+ Overhead (fixed + power)" value={totals.totalOverheadPerCup} />
            <div className="production-total-result">
              <BreakdownRow label="Total production cost/cup" value={totals.totalCost} />
            </div>
          </div>
          <div>
            <h3>Per month</h3>
            <BreakdownRow label="Materials" value={totals.materialCostPerMonth} kind="moneyMonthly" />
            <BreakdownRow label="+ Labor" value={totals.operatorMonthly} kind="moneyMonthly" />
            <BreakdownRow label="+ Overhead (fixed + power)" value={totals.totalOverheadMonthly} kind="moneyMonthly" />
            <div className="production-total-result">
              <BreakdownRow label="Total production cost/month" value={totals.totalProductionCostMonthly} kind="moneyMonthly" />
            </div>
          </div>
        </div>
      </section>

      <div className="action-row">
        <span>{baseline}</span>
        <button type="button" onClick={resetToDefaults} disabled={!defaultsLoaded}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
        <button type="button" onClick={saveAsDefault} disabled={!defaultsLoaded}>
          <Save size={17} aria-hidden="true" />
          Save
        </button>
        <button type="button" onClick={clearSavedState} disabled={!defaultsLoaded} aria-label="Clear saved state">
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>

      <fieldset className="input-groups" aria-label="Calculator inputs" disabled={!defaultsLoaded} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {hasVariants ? (
          <>
            <SliderGroup
              title={`Variant costs - ${
                cup.variants.find((variant) => variant.id === selectedVariant)?.label
              }`}
              fields={variantInputFields}
              cup={cup}
              values={values}
              selectedVariant={selectedVariant}
              onChange={updateValue}
            />
            {sharedInputFields.length > 0 && (
              <SliderGroup
                title="Shared inputs"
                fields={sharedInputFields}
                cup={cup}
                values={values}
                selectedVariant={selectedVariant}
                onChange={updateValue}
              />
            )}
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
      </fieldset>

      <section className="breakdown" aria-label="Cost breakdown">
        <h2>Breakdown</h2>
        <BreakdownRow label="Blanks" value={totals.blankCost} />
        <BreakdownRow label="Bottom" value={totals.bottomCost} />
        <BreakdownRow label="Cover" value={totals.coverCost} />
        <BreakdownRow label="Box" value={totals.boxCost} />
        <BreakdownRow label="Material total" value={totals.materialCost} />
        <BreakdownRow label="Labor" value={totals.laborCost} />
        <BreakdownRow label="Power per cup" value={totals.powerCost} />
        {isModelA && (
          <>
            <BreakdownRow label="Total monthly operator salaries" value={totals.operatorMonthly} />
            <BreakdownRow label="Fixed overhead (rent + mechanic + supervisor + transport)" value={totals.fixedOverheadMonthly} />
            <BreakdownRow label="Monthly power cost" value={totals.powerMonthly} />
            <BreakdownRow label="Total monthly overhead (fixed + power)" value={totals.totalOverheadMonthly} />
            <BreakdownRow label="Overhead cost per cup" value={totals.totalOverheadPerCup} />
            <BreakdownRow label="Monthly material cost" value={totals.materialCostPerMonth} />
            <BreakdownRow label="Fully loaded cost/cup" value={totals.totalCost} />
          </>
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

function Metric({ label, value, kind = "currency", tone, detail }) {
  return (
    <div className={tone ? `metric ${tone}` : "metric"}>
      <span>{label}</span>
      <strong>Rs {formatNumber(value, kind)}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function BreakdownRow({ label, value, kind = "currency" }) {
  return (
    <div className="breakdown-row">
      <span>{label}</span>
      <strong>
        {kind === "currency" || kind === "moneyMonthly" ? "Rs " : ""}
        {formatNumber(value, kind)}
      </strong>
    </div>
  );
}
