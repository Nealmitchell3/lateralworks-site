# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # local dev server at http://localhost:3000
npm run build   # production build (~318 static pages)
npm run start   # serve the production build
npm run lint    # next lint
```

There are no tests. Verify changes by running `npm run build` and checking the route table.

## Architecture

Next.js 14 App Router site (TypeScript, Tailwind, React 18). Marketing site for lateralworks deployed to Vercel via push-to-`main` (`DEPLOYMENT_GUIDE.md`).

The site has **three parallel content systems**, each owning different pages:

1. **Static page copy** — `content/site-data.ts` exports named objects (`siteConfig`, `nav`, `home`, `methodology`, `software`, `academy`, `results`, `consulting`, `about`, `contact`, `team`, `footer`). Each `app/<route>/page.tsx` for a static marketing page imports its corresponding export. To change copy on those pages, edit `site-data.ts`, not the page components. The `ideas` export at the bottom of the file is dead code (kept for now) — /ideas was made dynamic and no longer reads it.

2. **Ideas posts** — 191 articles in `content/posts/*.json` with `content/posts_index.json` as a sorted summary. `content/posts-utils.ts` exposes `getAllPostMeta`, `getPost`, `getAllSlugs`, `getPostsByPage`, `getRelatedPosts`. `app/ideas/page.tsx` is a static server component (SSG) that renders the full post list inside a `<Suspense>` boundary; the `IdeasListing` client child uses `useSearchParams` to filter by `?category=` and `?page=` on the client. `app/ideas/[slug]/page.tsx` is SSG via `generateStaticParams` over all slugs. Types in `content/post-types.ts`.

3. **Docs** — 115 release notes/how-tos in `content/docs/*.json` + `content/docs_index.json`. `content/docs-utils.ts` mirrors the posts API (`getAllDocMeta`, `getDoc`, `getDocsByPage`, `getRelatedDocs`). Same SSG + client-filtering pattern as /ideas (`app/docs/page.tsx` static, `DocsListing` client-side filter). Types in `content/doc-types.ts`. Not linked from `Nav.tsx` yet — accessible by direct URL only.

Posts and docs HTML was generated from a markdown corpus, then re-scraped from the live Squarespace site to recover image positions — see "Content pipeline" below.

**Layout chrome.** `app/layout.tsx` mounts `components/Nav.tsx` (fixed header, the only client component) and `components/Footer.tsx` around every page, loading the DM Sans Google font as the `--font-dm-sans` CSS variable. All other components are server components.

**Path alias.** `@/*` resolves to the repo root.

**Dynamic count pattern.** Any "X articles" / "X docs" headline derives the count at build time from the index (`getAllPostMeta().length`, `getAllDocMeta().length`) — never hardcoded. See `app/ideas/page.tsx` (hero), `app/page.tsx` (homepage Ideas Library), `app/software/page.tsx` (Documentation section). When adding a similar headline, follow this pattern so it doesn't go stale.

## Content pipeline

Posts and docs are sourced from a markdown corpus at `~/Downloads/lateralworks_corpus/{ideas,tools}/`. The corpus folder for docs is named `tools/` because the live Squarespace site still uses `lateralworks.com/tools/...` URLs — the local /docs URL is a deliberate rename, but the corpus and live URLs stay as `tools` for compatibility with the recovery scripts.

Two scripts in `scripts/`:

- **`migrate_corpus.js` / `migrate_docs.js`** — read corpus markdown, parse YAML frontmatter (with a fallback parser for malformed quotes), convert markdown → HTML via `marked`, write to `content/posts/` or `content/docs/` and rebuild the corresponding `_index.json`. Idempotent — clears destination first.
- **`recover_images.js` / `recover_doc_images.js`** — fetch each post's live URL on `lateralworks.com`, walk `.entry-content .sqs-block` elements via `cheerio`, download images to `public/images/{ideas,docs}/`, rewrite the `content` field with `<figure><img/><figcaption></figcaption></figure>` blocks reflecting the live layout. Polite 1s delay, 2 retries with backoff. Idempotent — skips images already on disk.

Workflow when corpus content changes: migrate → build → commit/push → wait for Vercel deploy → recover → build → commit/push. Two separate commits because recovery is slow (5–13 min depending on section size) and image positions are independent of getting the index page live.

Script deps: `gray-matter` and `marked` (deps), `cheerio` (devDep).

## Styling system

Two parallel token systems that must stay in sync:

- **CSS variables** in `app/globals.css` (`--navy`, `--cream`, `--gold`, `--ink`, etc.) — used by hand-written CSS classes like `.section-label`, `.stat-number`, `.tag`, `.card-hover`, `.nav-link`, `.hairline`, plus the `.post-content` typography family used by both `[slug]` pages.
- **Tailwind theme** in `tailwind.config.ts` — same palette as `bg-navy`, `text-gold`, `text-ink-secondary`, etc., plus a custom `max-w-8xl` (88rem) used as the page container across all routes.

When adding or changing a color, update **both** files. Page sections consistently use `max-w-8xl mx-auto px-6 lg:px-10` as the outer container.

Reusable visual primitives are CSS classes in `globals.css` (not React components): `.section-label` (gold uppercase eyebrow), `.display-heading` / `.site-heading`, `.stat-number`, `.tag`, `.card-hover`, the `animate-fadeup` entrance animations, and the `.post-content` family for blog/doc bodies (handles `h2/h3/p/img/figure/figcaption/blockquote/ul/ol`). Prefer these over redefining inline styles.

Section background alternation across page sections is intentional rhythm (cream → cream-dark → cream → … → navy CTA). Match the alternation when inserting a new section.

## Brand conventions

- The wordmark `lateralworks` is **always lowercase**, including in the nav logo (`siteConfig.name`).
- Headings are sans-serif throughout (DM Sans). Don't introduce serif fonts.
- The product suite is named `fastProjectAI Suite` (renamed from `fastWorks Suite`) — the older name still appears in legacy body copy where it's referring to the historical product line; only the suite name itself changed.
