# MCM Production Cost

Mobile-first PWA for cup production costing.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add or edit cup sizes

All cup calculators are generated from `data/cups.config.js`.

To add a new cup size:

1. Copy one cup object in the `cups` array.
2. Change `slug`, `name`, `volumeMl`, `description`, `modelType`, `defaults`, and `ranges`.
3. Commit and push to GitHub.
4. Vercel will rebuild and publish the new dynamic route.

No new page or component file is needed.

The `60 / 65 ml Short` calculator is one combined config with variants. Its
selling price, yield, bottom usage, machines, machine speed, shifts, operators,
and working days are stored separately for 60 ml and 65 ml.

## Cost models

Every cup size follows the supplied Apps Script production calculator:

- Machines, CPM, shifts, hours, and working days
- Daily fixed cost = (monthly operator salaries + other manpower salaries + rent) / 30
- Daily electricity = hourly electricity rate per machine × hours × shifts × machines
- Forming cost/cup = (daily fixed cost + daily electricity) / daily output
- Total cost/cup = materials/cup + forming cost/cup; profit and margin use this total
- Monthly forming costs charge only the entered working days, as in the reference
- Bottom usage remains g/kg (390 g/kg = 39%)

Legacy saved Model A electricity rates in Rs/box are converted once to
Rs/machine-hour using saved speed and box capacity. The factory equivalent is
100 × 85 × 60 / 13,500 = Rs37.77778/machine-hour. This is a converted allowance,
not a measured electricity tariff. Other manpower defaults to supervisor plus
mechanic salaries (Rs42,000/month); transport is excluded from salaries.
Former Model B sizes are migrated to the same calculation: daily operator wages
become monthly salary inputs by multiplying by 30, machine count starts at one,
and rent/other manpower start at zero. Saved power-per-box rates are converted
using each size's saved speed and box capacity. The hourly rate then stays fixed
when production inputs change. Enter actual salaries and electricity rates as needed.

The direct-cost summary includes materials, operator labor, and electricity.
Fully loaded cost also includes the allocated rent and other manpower; it matches
the reference's totalCostPerCup. Monthly profit and margin use fully loaded cost.

Run calculation regression checks with `node --test tests/model-a.test.mjs`.

## Local state

Slider changes are cached in `localStorage` per cup slug.

- Reset clears the saved local state for that cup and returns to factory defaults from config.
- Save stores the current slider state as the global default when a server store is configured, and falls back to local browser storage when it is not.
- The trash icon clears saved state without changing the visible sliders until reload or further edits.

Factory defaults live in `data/cups.config.js`; changing them permanently is a normal code/config change followed by deploy.

## Global defaults

Cross-device defaults use Vercel KV or Upstash Redis through REST env vars:

```bash
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Equivalent Upstash names also work:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

When these env vars are present, opening a calculator loads the saved global
defaults first. Pressing Save writes every current variable for that calculator
so the same defaults appear on the next device.
