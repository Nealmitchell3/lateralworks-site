# lateralworks Site — Build Process

How Neal works on the lateralworks Vercel site. Drop this file into the project root so Claude Code reads it for context on every session.

---

## The Team

**Neal** — owner, design decisions, content direction, final approval
**Claude (claude.ai)** — design partner, strategist, writes structured instructions
**Claude Code (in VS Code)** — code executor, runs the changes locally
**Vercel** — auto-deploys whenever code is pushed to GitHub

The split is deliberate: claude.ai is better at the design conversation, Claude Code is better at executing changes against the codebase.

---

## The Three-Phase Workflow

### Phase 1 — Design conversation (in claude.ai)
Neal describes what he wants. Claude asks follow-ups, looks at examples, suggests options. Claude does not edit any code in this phase. The output of this phase is a clear, agreed-upon plan.

### Phase 2 — Structured instruction block (in claude.ai)
Claude writes a structured instruction block in a code fence. The block is detailed enough that Claude Code can execute it without guessing. The block always includes: task, files to edit, specific changes, constraints.

### Phase 3 — Execution (in Claude Code)
Neal copies the instruction block, pastes into Claude Code in VS Code, hits Enter. Claude Code edits the local files. Neal watches `localhost:3000` update live, reviews the change, then pushes to Vercel when satisfied.

---

## Instruction Block Format

Every handoff from claude.ai to Claude Code follows this exact format:

```
TASK: [one-line summary]

FILES TO EDIT:
- [path/to/file]
- [path/to/another/file]

CHANGES:
1. [specific change with old text → new text where relevant]
2. [next change]

CONSTRAINTS:
- [thing not to change]
- [style or content rule that applies]
```

Wrapping in a code fence makes it copy-paste clean. No prose around the block.

---

## Project Rules — Always Apply

These rules apply to every change, every page, every component. Claude includes the relevant ones in CONSTRAINTS sections, and Claude Code respects them implicitly.

### Brand
- `lateralworks` is always lowercase — never `Lateralworks`, `LATERALWORKS`, or `Lateral Works`
- `FTTM` is always all-caps
- `fastworks®` — camelCase with the registered trademark symbol
- `fastProject`, `fastDecision`, `fastROI` — camelCase

### Typography
- Single font: **DM Sans** (Google Font)
- No serif fonts anywhere
- Font fallback chain: `DM Sans → Helvetica Neue → Arial`

### Colors
- Navy: `#0C1B33` (primary)
- Navy light: `#1A3057` (hover state)
- Cream: `#F8F6F1` (page background)
- Cream dark: `#EDE9E1` (alternating sections)
- Gold: `#B8922A` (accents, CTAs, links)
- Gold light: `#D4A93A` (hover)
- Ink: `#1C1C1C` (body text)

### Voice
- Direct, professional, practitioner-led
- No marketing jargon: avoid "holistic", "synergy", "world-class", "best-in-class"
- Lead with outcomes, not process
- Name specific clients, programs, and results
- Use "we" — firm as active partner
- No exclamation marks in body copy

---

## Where Things Live

| What | File |
|---|---|
| All site copy (headlines, body, team, stats) | `content/site-data.ts` |
| Brand colors and font | `tailwind.config.ts` |
| Global styles | `app/globals.css` |
| Navigation bar | `components/Nav.tsx` |
| Footer | `components/Footer.tsx` |
| Page layouts | `app/{page-name}/page.tsx` |
| Blog posts | `content/posts/*.json` |
| Blog post index | `content/posts_index.json` |
| Images | `public/images/` |
| Downloadable documents | `public/downloads/` |

For most content edits, only `content/site-data.ts` needs to be touched.

---

## Publishing an Article (Ideas Page)

The proven pattern, first used for "The monthly project deep-dive" (July 31, 2026). The key idea: claude.ai prepares the finished files and drops them on Neal's machine; Claude Code **copies** them into the repo — it never retypes article content.

### Step 1 — Draft and build (in claude.ai / Cowork)
1. Neal points Claude at the source material (usually a folder under `~/Dropbox/website/Articles/<topic>/`).
2. Claude drafts the article per the Voice rules, Neal reviews the markdown.
3. Claude converts the approved markdown to HTML with `marked` (`{ breaks: false, gfm: true }` — same as the migration pipeline) and builds two files matching the site schema:
   - `<slug>.json` — full post: `slug, url, title, date ("July 31, 2026" format), dateISO ("2026-07-31"), author ("Neal Mitchell"), categories, tags, excerpt, content (HTML), images: [], externalLinks: [], imageCount: 0`
   - `index-entry.json` — the matching index entry: `slug, title, date, dateISO, author, categories, tags, excerpt, imageCount`
4. Claude writes the prepared files to `~/Dropbox/website/Articles/<topic>/site-files/` on Neal's machine, along with any downloadable documents renamed to their published web names.

### Step 2 — Instruction block (claude.ai → Claude Code)
The block instructs Claude Code to:
1. `cp` the post JSON from `site-files/` into `content/posts/`
2. Insert the `index-entry.json` object into `content/posts_index.json` at the position that keeps the array sorted by `dateISO` descending (new articles go first)
3. `cp` any downloadable documents into `public/downloads/`
4. Verify on `localhost:3000`: article at top of Ideas page, post page renders, download links serve the right files, `tsc` exits 0
5. Commit and push only after Neal approves the localhost review

### Rules
- **Downloads**: live in `public/downloads/`, lowercase-hyphen filenames (e.g. `monthly-deep-dive-review-briefing.docx`), linked from the article as `/downloads/<filename>`. When replacing a download, keep the exact filename so article links don't break.
- **Categories**: reuse the existing set — single words only. As of August 2026: AI, Decisions, Host, Innovation, Leadership, Planning, Portfolio, Strategy, Systems, Team, VOC. Don't invent a new category without an explicit decision from Neal (fold into the closest existing one instead — e.g. project-management topics → Planning).
- **Slug**: lowercase-hyphen from the title, e.g. `the-monthly-project-deep-dive`. Post file is `content/posts/<slug>.json`.
- **Post JSON and index entry must stay identical** on their shared fields.
- **Source archive**: the `site-files/` folder in Dropbox holds the exact copies of what was deployed, so the repo and source folder stay in sync. When a download is updated later, update the `site-files/` copy too.

---

## Local Dev Setup — Daily Routine

When starting a work session:

1. Open VS Code → File → Open Folder → `lateralworks-site`
2. Open Terminal: `Ctrl + ` ` (backtick)
3. **Tab 1** — start the live preview:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in Chrome
4. **Tab 2** — start Claude Code (click `+` in Terminal panel):
   ```bash
   claude
   ```
5. Ready to work. Paste instruction blocks into Claude Code. Watch localhost update live.

When done with a change:

```bash
git add .
git commit -m "describe what changed"
git push
```

Vercel auto-deploys in ~90 seconds.

---

## Example Handoff — Full Cycle

**Phase 1 — Conversation:**
> Neal: I want to change the homepage headline to focus on outcomes rather than the iPod.
> Claude: What outcome do you want to lead with? Options: schedule acceleration, programs shipped on time, the $5M/day GlobalFoundries metric, or the 36-year track record?
> Neal: Programs shipped on time.
> Claude: Suggested headline: "The methodology behind teams that ship on time." Body: pull forward from the founding date and program scale.

**Phase 2 — Instruction block:**
```
TASK: Update homepage hero headline and body

FILES TO EDIT:
- content/site-data.ts

CHANGES:
1. In `home.hero.headline`, change from
   "We accelerated the team that built the iPod."
   to
   "The methodology behind teams that ship on time."

2. In `home.hero.body`, change from current text to:
   "Since 1988, lateralworks has delivered fast-time-to-market
   results on advanced technology programs — from the iPod
   to $7B semiconductor fabs."

CONSTRAINTS:
- Keep "lateralworks" lowercase
- Do not change cta1, cta2, or any other home object properties
- Do not modify styling
```

**Phase 3 — Execution:**
Neal pastes block into Claude Code, hits Enter. File edits in ~5 seconds. Localhost:3000 reflects the change. Neal reviews, says "looks good," and pushes to Vercel.

---

## What Claude Code Should NOT Do Without Permission

- Add new dependencies (`npm install`)
- Restructure the file/folder layout
- Modify deployment configs (`next.config.js`, `vercel.json`)
- Touch `package.json` beyond what an explicit task requires
- Make sweeping style changes across multiple components
- Rewrite copy that wasn't part of the task

If a task seems to require any of the above, Claude Code should pause and ask.

---

*Last updated: August 2026*
