#!/usr/bin/env node
/**
 * One-shot normalization of the `categories` field across all post JSONs and
 * the index, reducing each post to a single primary category.
 *
 * Steps applied to every post's categories array (and index entry):
 *   1. Trim whitespace on each entry
 *   2. Drop any "Critical Thinking" variant (case-insensitive, hyphen-insensitive)
 *   3. Replace "VOC - Voice of the Customer" / "VOC-Voice of the Customer" with "VOC"
 *   4. Dedupe, preserving order
 *   5. Keep only the first element (primary category)
 *   6. If the array is empty after filtering, set ["Uncategorized"] and warn
 *
 * Idempotent: re-running on already-normalized data is a no-op.
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(REPO_ROOT, 'content', 'posts');
const INDEX_FILE = path.join(REPO_ROOT, 'content', 'posts_index.json');

function isCriticalThinking(s) {
  const norm = s.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
  return norm === 'critical thinking';
}

function isVocLong(s) {
  const norm = s.trim().toLowerCase().replace(/\s+/g, '');
  return norm === 'voc-voiceofthecustomer';
}

function normalize(rawCategories) {
  if (!Array.isArray(rawCategories)) return [];
  const cleaned = [];
  const seen = new Set();
  for (const entry of rawCategories) {
    if (typeof entry !== 'string') continue;
    let v = entry.trim();
    if (!v) continue;
    if (isCriticalThinking(v)) continue;
    if (isVocLong(v)) v = 'VOC';
    if (seen.has(v)) continue;
    seen.add(v);
    cleaned.push(v);
  }
  return cleaned;
}

function primaryOnly(cleaned, slug) {
  if (cleaned.length === 0) {
    console.warn(`[WARN] post "${slug}" has no categories after normalization — falling back to "Uncategorized"`);
    return ['Uncategorized'];
  }
  return [cleaned[0]];
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

// --- Process individual post files ---
const postFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
let postsModified = 0;
const finalCounts = {};

for (const file of postFiles) {
  const filePath = path.join(POSTS_DIR, file);
  const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const before = post.categories || [];
  const after = primaryOnly(normalize(before), post.slug || file);
  if (!arraysEqual(before, after)) {
    post.categories = after;
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + '\n');
    postsModified++;
  }
  for (const cat of after) {
    finalCounts[cat] = (finalCounts[cat] || 0) + 1;
  }
}

// --- Process the index ---
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

// --- Summary ---
const totalPosts = postFiles.length;
const sortedCounts = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
const sumOfCounts = sortedCounts.reduce((acc, [, n]) => acc + n, 0);

console.log('');
console.log('=== Normalization summary ===');
console.log(`Total posts:        ${totalPosts}`);
console.log(`Post files updated: ${postsModified}`);
console.log(`Index entries updated: ${indexModified}`);
console.log(`Distinct categories: ${sortedCounts.length}`);
console.log(`Sum of category-tags: ${sumOfCounts} (expected ${totalPosts} since each post has exactly one)`);
console.log('');
console.log('Per-category counts:');
for (const [cat, n] of sortedCounts) {
  console.log(`  ${cat.padEnd(16)} ${n}`);
}
console.log('');
