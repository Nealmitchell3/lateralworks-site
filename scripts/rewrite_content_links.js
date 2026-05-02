#!/usr/bin/env node
/**
 * rewrite_content_links.js
 *
 * Walks every JSON in content/posts/ and content/docs/ and rewrites
 * anchor href values that point at the live Squarespace site
 * (https://lateralworks.com/...) so they resolve to local routes.
 *
 * Idempotent — a second run finds zero matches and exits cleanly.
 *
 * Aborts before writing if the catch-all bucket exceeds 50 unique paths,
 * so unanticipated URL shapes can be reviewed before bulk rewriting.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SITE      = path.join(os.homedir(), 'Downloads', 'lateralworks-site');
const POSTS_DIR = path.join(SITE, 'content', 'posts');
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

const HOST = 'https://lateralworks.com';
// Match href="https://lateralworks.com<path>" — capture everything after the host.
const HREF_RE = /href="https:\/\/lateralworks\.com([^"]*)"/g;

const KNOWN_PAGES = new Set([
  '/about', '/methodology', '/software', '/consulting',
  '/results', '/contact', '/education',
]);

function classify(rawPath) {
  const p = rawPath.replace(/\/$/, '') || '/';
  if (/^\/ideas\/\d+\/\d+\/\d+\/.+/.test(p)) return 'ideas-internal';
  if (/^\/tools\/\d+\/\d+\/\d+\/.+/.test(p)) return 'docs-internal';
  if (/^\/technical\/\d+\/\d+\/\d+\/.+/.test(p)) return 'docs-internal';
  if (/^\/ideas\/category\/.+/.test(p)) return 'ideas-internal';
  if (KNOWN_PAGES.has(p)) return 'known-page';
  return 'catch-all';
}

function rewritePath(rawPath) {
  let m = rawPath.match(/^\/ideas\/\d+\/\d+\/\d+\/([^?#\/]+)/);
  if (m) return '/ideas/' + m[1];
  m = rawPath.match(/^\/tools\/\d+\/\d+\/\d+\/([^?#\/]+)/);
  if (m) return '/docs/' + m[1];
  m = rawPath.match(/^\/technical\/\d+\/\d+\/\d+\/([^?#\/]+)/);
  if (m) return '/docs/' + m[1];
  m = rawPath.match(/^\/ideas\/category\/([^?#\/]+)/);
  if (m) return '/ideas?category=' + m[1];
  const noTrail = rawPath.replace(/\/$/, '');
  if (noTrail === '/education') return '/academy';
  // catch-all: just strip the host prefix (rawPath already has leading /)
  return rawPath || '/';
}

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

const postFiles = collectFiles(POSTS_DIR);
const docFiles  = collectFiles(DOCS_DIR);
const files = [...postFiles, ...docFiles];
console.log(`Scanning ${files.length} JSON files (${postFiles.length} posts + ${docFiles.length} docs)\n`);

// ── PASS 1: enumerate and bucket ──────────────────────────────
const buckets = { 'ideas-internal': 0, 'docs-internal': 0, 'known-page': 0, 'catch-all': 0 };
const catchAllPaths = new Set();
const fileCache = new Map(); // file → parsed JSON (avoid double parse)
let totalOccurrences = 0;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  fileCache.set(file, data);
  const html = data.content || '';
  let m;
  HREF_RE.lastIndex = 0;
  while ((m = HREF_RE.exec(html)) !== null) {
    const rawPath = m[1];
    totalOccurrences++;
    const cat = classify(rawPath);
    buckets[cat]++;
    if (cat === 'catch-all') catchAllPaths.add(rawPath);
  }
}

console.log('── Pre-scan ──────────────────────────────────────');
console.log(`Total href="${HOST}/..." occurrences: ${totalOccurrences}`);
console.log(`  ideas-internal (/ideas/Y/M/D/slug):    ${buckets['ideas-internal']}`);
console.log(`  docs-internal  (/tools/Y/M/D/slug):    ${buckets['docs-internal']}`);
console.log(`  known-page     (/about, /contact, …):  ${buckets['known-page']}`);
console.log(`  catch-all      (other paths):          ${buckets['catch-all']}  (${catchAllPaths.size} unique)`);

if (catchAllPaths.size > 50) {
  console.error(`\n✗ ABORT: catch-all bucket has ${catchAllPaths.size} unique paths (threshold = 50).`);
  console.error('Review these before deciding rewrite rules:\n');
  [...catchAllPaths].sort().forEach(p => console.error('  ' + p));
  process.exit(1);
}

// ── PASS 2: rewrite host-prefixed URLs in place ───────────────
let filesChanged = 0;
let rewrites = 0;

if (totalOccurrences === 0) {
  console.log('\n✓ No https://lateralworks.com/ URLs to rewrite (already clean from prior run).');
} else {
  if (catchAllPaths.size > 0) {
    console.log('\n  Catch-all distinct paths (will rewrite by stripping host only):');
    [...catchAllPaths].sort().forEach(p => console.log('    ' + p));
  }
  console.log('\n── Rewriting host-prefixed URLs ──────────────────');
  for (const [file, data] of fileCache) {
    const before = data.content || '';
    let localRewrites = 0;
    const after = before.replace(HREF_RE, (_match, rawPath) => {
      localRewrites++;
      return `href="${rewritePath(rawPath)}"`;
    });
    if (localRewrites > 0) {
      data.content = after;
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      filesChanged++;
      rewrites += localRewrites;
    }
  }
  console.log(`  ✓ Files modified: ${filesChanged}`);
  console.log(`  ✓ Total rewrites: ${rewrites}`);
}

// ── PASS 3: close-match remaps for known broken /docs/ slugs ──
// Some /technical/<...>/<slug> live URLs map to a slightly-different local
// slug (typo / wording diff). Operate on /docs/<broken> directly so the rule
// works whether the URL came in fresh (just rewritten by PASS 2) or was
// already partially rewritten on disk from an earlier run.
const CLOSE_MATCH_REMAPS = [
  { from: '/docs/customize-a-lookahead-report',          to: '/docs/customize-the-lookahead-report' },
  { from: '/docs/importing-a-prefresh-lookahead-report', to: '/docs/import-a-lookahead-report' },
];
console.log('\n── Close-match remaps ───────────────────────────');
let remaps = 0;
let remapFilesChanged = 0;
for (const [file, data] of fileCache) {
  const before = data.content || '';
  let after = before;
  let localRemaps = 0;
  for (const { from, to } of CLOSE_MATCH_REMAPS) {
    const re = new RegExp(`href="${from.replace(/\//g, '\\/')}"`, 'g');
    after = after.replace(re, () => { localRemaps++; return `href="${to}"`; });
  }
  if (localRemaps > 0) {
    data.content = after;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    remapFilesChanged++;
    remaps += localRemaps;
  }
}
console.log(`  ${remaps} occurrences across ${remapFilesChanged} files remapped:`);
for (const { from, to } of CLOSE_MATCH_REMAPS) {
  console.log(`    ${from} → ${to}`);
}

// ── PASS 4: strip <a href="/docs/<missing-slug>">…</a> to plain text ──
const docSlugs = new Set(
  fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
);
const STRIP_RE = /<a\s+href="\/docs\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;

// Pre-scan: count what would be stripped, abort if above threshold.
const stripPlan = new Map();
let stripTotal = 0;
for (const [_file, data] of fileCache) {
  const html = data.content || '';
  let m;
  STRIP_RE.lastIndex = 0;
  while ((m = STRIP_RE.exec(html)) !== null) {
    const slug = m[1];
    if (!docSlugs.has(slug)) {
      stripPlan.set(slug, (stripPlan.get(slug) || 0) + 1);
      stripTotal++;
    }
  }
}

console.log('\n── Strip-broken /docs/ anchors ──────────────────');
console.log(`  Candidates: ${stripTotal} occurrences across ${stripPlan.size} unique missing slugs`);

if (stripTotal > 50) {
  console.error(`\n✗ ABORT: strip pass would touch ${stripTotal} occurrences (threshold = 50).`);
  console.error('Review these slugs before bulk stripping:\n');
  [...stripPlan.entries()].sort((a, b) => b[1] - a[1]).forEach(([slug, count]) => {
    console.error(`  ${count}× /docs/${slug}`);
  });
  process.exit(1);
}

if (stripTotal > 0) {
  console.log('  Slugs being stripped to plain text (anchor removed, link text kept):');
  [...stripPlan.entries()].sort((a, b) => b[1] - a[1]).forEach(([slug, count]) => {
    console.log(`    ${count}× ${slug}`);
  });
  let stripFilesChanged = 0;
  for (const [file, data] of fileCache) {
    const before = data.content || '';
    let stripped = false;
    const after = before.replace(STRIP_RE, (full, slug, inner) => {
      if (docSlugs.has(slug)) return full;
      stripped = true;
      return inner;
    });
    if (stripped) {
      data.content = after;
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      stripFilesChanged++;
    }
  }
  console.log(`  Stripped across ${stripFilesChanged} files.`);
}

console.log('\nDone. Safe to re-run — all passes are idempotent.');
