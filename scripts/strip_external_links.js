#!/usr/bin/env node
/**
 * Strip dead external links from post JSONs.
 *
 * Reads scripts/external_link_review.json
 * Step A — promote the 3 ambiguous rows (error-network + Cloudflare 522) to
 *          action=strip, persist back to the review file.
 * Step B — for every (slug, url) with action=strip, find the matching <a ...
 *          href="<url>">...</a> in the post content and replace it with the
 *          link text alone (preserving the human-readable phrase). If the
 *          link text is just the URL itself, replace with empty string.
 *
 * Run:  node scripts/strip_external_links.js
 */

const fs = require('fs');
const path = require('path');

const SITE   = process.cwd();
const REVIEW = path.join(SITE, 'scripts', 'external_link_review.json');

function pickIdeasDir() {
  const a = path.join(SITE, 'content', 'ideas');
  const b = path.join(SITE, 'content', 'posts');
  if (fs.existsSync(a)) return a;
  if (fs.existsSync(b)) return b;
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

if (!fs.existsSync(REVIEW)) {
  console.error('✗ external_link_review.json not found.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(REVIEW, 'utf-8'));
const rows = data.rows;

// ── Step A — promote ambiguous rows to strip ───────────────────────────────
let promoted = 0;
for (const r of rows) {
  if (r.action === 'review' && (r.verdict === 'error-network' || r.verdict === 'other')) {
    r.action = 'strip';
    r.promotedFrom = r.verdict;
    promoted++;
  }
}
console.log(`Step A — promoted ${promoted} ambiguous row(s) to strip\n`);

// Persist the updated review file before any content edits, so the audit
// trail reflects the decision even if the strip step crashes later.
fs.writeFileSync(REVIEW, JSON.stringify(data, null, 2));

// ── Step B — apply strips ──────────────────────────────────────────────────
const toStrip = rows.filter(r => r.action === 'strip');
console.log(`Step B — stripping ${toStrip.length} <a> tag occurrence(s)\n`);

// Group by slug for efficient per-file processing
const bySlug = new Map();
for (const r of toStrip) {
  const key = `${r.section}|${r.slug}`;
  if (!bySlug.has(key)) bySlug.set(key, []);
  bySlug.get(key).push(r);
}

// Escape a string for use in a RegExp literal
function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Decide what to put in place of the stripped <a> tag.
// Rule: if the link text is plain prose (not the same URL), keep the text.
//      if it's just the URL, drop the whole reference.
function replacementFor(linkText, url) {
  const t = (linkText || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  // Heuristic: if the visible text IS the URL (or a close variant) → drop
  const tNoProto = t.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const uNoProto = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (tNoProto === uNoProto) return '';
  return t;
}

let filesModified = 0;
let stripsApplied = 0;
let stripsMissed  = 0;
const log = [];

for (const [key, stripList] of bySlug.entries()) {
  const [section, slug] = key.split('|');
  const dir = section === 'ideas' ? IDEAS_DIR : DOCS_DIR;
  const fp  = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(fp)) {
    console.log(`  ⚠ Missing post file: ${fp}`);
    continue;
  }
  const post = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  let html = String(post.content || '');
  let changed = 0;

  for (const r of stripList) {
    // Match <a ...href="<url>"...>...</a> — non-greedy on the body, so we don't
    // swallow neighboring tags. The href value is anchored to the exact URL.
    const re = new RegExp(`<a\\s[^>]*href="${reEscape(r.url)}"[^>]*>([\\s\\S]*?)</a>`, 'i');
    const m = html.match(re);
    if (!m) {
      stripsMissed++;
      log.push({ section, slug, url: r.url, status: 'no-match', linkText: r.linkText });
      continue;
    }
    const replacement = replacementFor(m[1].replace(/<[^>]+>/g, ''), r.url);
    html = html.replace(re, replacement);
    changed++;
    stripsApplied++;
    log.push({
      section, slug, url: r.url,
      status: 'stripped',
      linkText: r.linkText,
      replacedWith: replacement || '(empty — link text was the URL itself)',
      verdict: r.verdict,
    });
  }

  if (changed > 0) {
    post.content = html;
    fs.writeFileSync(fp, JSON.stringify(post, null, 2));
    filesModified++;
    console.log(`  ✓ [${section}] ${slug}  (${changed} strip${changed === 1 ? '' : 's'})`);
  }
}

console.log('\n═══════════════════════════════════════════════');
console.log('  Strip summary');
console.log('═══════════════════════════════════════════════');
console.log(`Files modified:       ${filesModified}`);
console.log(`Strips applied:       ${stripsApplied}`);
console.log(`Strips missed (no match in HTML): ${stripsMissed}`);

const logPath = path.join(SITE, 'scripts', 'external_link_strip_log.json');
fs.writeFileSync(logPath, JSON.stringify({
  summary: { promoted, filesModified, stripsApplied, stripsMissed },
  log,
}, null, 2));
console.log(`\nStrip log saved: ${logPath}`);

if (stripsMissed > 0) {
  console.log('\n⚠ Some strips could not be applied — investigate before committing:');
  log.filter(l => l.status === 'no-match').forEach(l => {
    console.log(`  [${l.section}] ${l.slug}  ${l.url}  ("${(l.linkText || '').slice(0, 50)}")`);
  });
}

console.log('\nNext: spot-check one or two modified posts on localhost, then commit + push.');
