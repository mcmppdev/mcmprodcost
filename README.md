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

## Cost models

Model A keeps overhead as separate daily sliders:

- Rent
- Mechanic
- Supervisor
- Transport

Model B keeps overhead consolidated and adds maintenance as a percentage of base unit cost.

## Local state

Slider changes are stored in `localStorage` per cup slug.

- Reset clears the saved local state for that cup and returns to factory defaults from config.
- Save stores the current slider state as the local default for that browser.
- The trash icon clears saved state without changing the visible sliders until reload or further edits.

Factory defaults live in `data/cups.config.js`; changing them permanently is a normal code/config change followed by deploy.
