# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # local dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # next lint
```

There are no tests in this project.

## Architecture

Next.js 14 App Router site (TypeScript, Tailwind, React 18). Static marketing site for lateralworks; deployed to Vercel via push-to-`main` (see `DEPLOYMENT_GUIDE.md`).

**Content lives in one file.** `content/site-data.ts` is the single source of truth for every page's copy. Each top-level page imports a named export from it (`home`, `methodology`, `software`, `academy`, `results`, `consulting`, `ideas`, `about`, `contact`, plus shared `siteConfig`, `nav`, `team`, `footer`). Page components in `app/<route>/page.tsx` are essentially layout shells that render data from this file — to change site copy, edit `site-data.ts`, not the page components. Adding a new section to a page usually means: extend the relevant export's shape in `site-data.ts`, then render it in the matching `app/<route>/page.tsx`.

**Layout chrome.** `app/layout.tsx` mounts `components/Nav.tsx` (fixed header — only client component, has mobile menu state) and `components/Footer.tsx` around every page, and loads the DM Sans Google font as the `--font-dm-sans` CSS variable. All other components are server components.

**Path alias.** `@/*` resolves to the repo root (e.g. `@/content/site-data`, `@/components/Nav`).

## Styling system

Two parallel token systems that must stay in sync:

- **CSS variables** in `app/globals.css` (`--navy`, `--cream`, `--gold`, `--ink`, etc.) — used by hand-written CSS classes like `.section-label`, `.stat-number`, `.tag`, `.card-hover`, `.nav-link`, `.hairline`.
- **Tailwind theme** in `tailwind.config.ts` — exposes the same palette as `bg-navy`, `text-gold`, `text-ink-secondary`, etc., plus a custom `max-w-8xl` (88rem) used as the page container width across all routes.

When adding or changing a color, update **both** files. Page sections consistently use `max-w-8xl mx-auto px-6 lg:px-10` as the outer container — match this when adding new sections.

Reusable visual primitives are CSS classes in `globals.css` (not React components): `.section-label` (gold uppercase eyebrow), `.display-heading` / `.site-heading`, `.stat-number`, `.tag`, `.card-hover`, plus the `animate-fadeup` / `animate-fadeup-delay-{1..4}` hero entrance animations. Prefer these over redefining inline styles.

## Brand conventions

- The wordmark `lateralworks` is **always lowercase**, including in the nav logo (`siteConfig.name`).
- Headings are sans-serif throughout (DM Sans). Don't introduce serif fonts — see the recent commit history for prior font experiments that were reverted.