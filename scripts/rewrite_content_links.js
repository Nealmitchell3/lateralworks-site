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

if (totalOccurrences === 0) {
  console.log('\n✓ Nothing to rewrite — already clean. (Idempotent re-run.)');
  process.exit(0);
}

if (catchAllPaths.size > 0) {
  console.log('\n  Catch-all distinct paths (will rewrite by stripping host only):');
  [...catchAllPaths].sort().forEach(p => console.log('    ' + p));
}

// ── PASS 2: rewrite in place ──────────────────────────────────
console.log('\n── Rewriting ─────────────────────────────────────');
let filesChanged = 0;
let rewrites = 0;
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

console.log(`✓ Files modified: ${filesChanged}`);
console.log(`✓ Total rewrites: ${rewrites}`);
console.log('\nDone. Safe to re-run — second pass will find zero occurrences.');
