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

Model A keeps the original multi-machine monthly-cost structure:

- Machines, CPM, shifts, hours, and working days
- Monthly operator salaries
- Monthly rent, mechanic/repair, supervisor, and transport
- Power per box

Model B keeps the original single-machine daily-cost structure:

- CPM, shifts, hours, and working days
- Operator cost per day
- Electricity per box
- Material, bottom, cover, packet, and box assumptions

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
