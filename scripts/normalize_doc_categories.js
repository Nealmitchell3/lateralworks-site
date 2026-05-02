#!/usr/bin/env node
/**
 * One-shot normalization of the `categories` field across all doc JSONs and
 * the docs index, reducing each doc to a single primary category.
 *
 * Steps applied to every doc's categories array (and index entry):
 *   1. Trim whitespace on each entry
 *   2. Drop any "fP Release Note" variant (case-insensitive: matches "fp release note", etc.)
 *   3. Dedupe, preserving order
 *   4. Keep only the first element (primary category)
 *   5. If the array is empty after filtering, set ["Uncategorized"] and warn
 *
 * Idempotent: re-running on already-normalized data is a no-op.
 *
 * Mirrors scripts/normalize_categories.js (the /ideas equivalent).
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(REPO_ROOT, 'content', 'docs');
const INDEX_FILE = path.join(REPO_ROOT, 'content', 'docs_index.json');

function isFpReleaseNote(s) {
  const norm = s.trim().toLowerCase().replace(/\s+/g, ' ');
  return norm === 'fp release note';
}

function normalize(rawCategories) {
  if (!Array.isArray(rawCategories)) return [];
  const cleaned = [];
  const seen = new Set();
  for (const entry of rawCategories) {
    if (typeof entry !== 'string') continue;
    const v = entry.trim();
    if (!v) continue;
    if (isFpReleaseNote(v)) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    cleaned.push(v);
  }
  return cleaned;
}

function primaryOnly(cleaned, slug) {
  if (cleaned.length === 0) {
    console.warn(`[WARN] doc "${slug}" has no categories after normalization — falling back to "Uncategorized"`);
    return ['Uncategorized'];
  }
  return [cleaned[0]];
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

const docFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.json'));
let docsModified = 0;
const finalCounts = {};

for (const file of docFiles) {
  const filePath = path.join(DOCS_DIR, file);
  const doc = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const before = doc.categories || [];
  const after = primaryOnly(normalize(before), doc.slug || file);
  if (!arraysEqual(before, after)) {
    doc.categories = after;
    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + '\n');
    docsModified++;
  }
  for (const cat of after) {
    finalCounts[cat] = (finalCounts[cat] || 0) + 1;
  }
}

const index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'));
let indexModified = 0;
for (const entry of index) {
  const before = entry.categories || [];
  const after = primaryOnly(normalize(before), entry.slug || '?');
  if (!arraysEqual(before, after)) {
    entry.categories = after;
    indexModified++;
  }
}
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2) + '\n');

const totalDocs = docFiles.length;
const sortedCounts = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
const sumOfCounts = sortedCounts.reduce((acc, [, n]) => acc + n, 0);

console.log('');
console.log('=== Doc normalization summary ===');
console.log(`Total docs:           ${totalDocs}`);
console.log(`Doc files updated:    ${docsModified}`);
console.log(`Index entries updated: ${indexModified}`);
console.log(`Distinct categories:  ${sortedCounts.length}`);
console.log(`Sum of category-tags: ${sumOfCounts} (expected ${totalDocs} since each doc has exactly one)`);
console.log('');
console.log('Per-category counts:');
for (const [cat, n] of sortedCounts) {
  console.log(`  ${cat.padEnd(28)} ${n}`);
}
console.log('');
