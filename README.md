# Hango — Marketing Website

Next.js (App Router) + TypeScript + Tailwind CSS site for Hango, a digital marketing and
software development agency in Coimbatore, Tamil Nadu.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/` — routes (`/`, `/services`, `/about`, `/internships`, `/contact`)
- `src/components/` — layout (header/footer) and UI components
- `src/data/` — site content as plain TypeScript data (services, internships, company/brand copy)
- `src/lib/site-config.ts` — nav, contact info, site-wide constants
- `public/brand/` — logo assets extracted from the official Hango brand files
- `brand-source/` — original design source files (`.ai`, `.pdf`), not served by the site

## Editing content

Most copy (services, pricing tiers, mission/values, internship programs) lives in
`src/data/*.ts` as plain objects/arrays — edit those files directly rather than the page
components to change text.

## Brand

- Colors, in `src/app/globals.css`: `--color-brand-red` (#e82c25), `--color-brand-cream`
  (#fff2dd), `--color-brand-black`, `--color-brand-white` — sampled from the final logo
  files, not the older brand-book palette.
- Fonts: **Space Grotesk** for headings/display, **Arimo** for body copy (a free,
  metric-compatible substitute for Arial — the brand book's specified font, whose actual
  font file is proprietary and isn't licensed for redistribution on the web).

## Deploying

Built for zero-config deployment on [Vercel](https://vercel.com/new).
