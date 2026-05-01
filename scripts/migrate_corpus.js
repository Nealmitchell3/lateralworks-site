#!/usr/bin/env node
/**
 * lateralworks corpus → Next.js site migration  (v2)
 *
 * v2 changes:
 * - Adds fallback YAML parser for files where gray-matter chokes on
 *   unescaped quotes inside titles (e.g. "Reality Distortion" is Misunderstood)
 * - Copies ALL images from corpus/images/ to public/images/ideas/ unconditionally
 *
 * Run:  node scripts/migrate_corpus.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Paths ──────────────────────────────────────────────────
const HOME       = os.homedir();
const CORPUS     = path.join(HOME, 'Downloads', 'lateralworks_corpus');
const IDEAS_SRC  = path.join(CORPUS, 'ideas');
const IMAGES_SRC = path.join(CORPUS, 'images');

const SITE       = path.join(HOME, 'Downloads', 'lateralworks-site');
const POSTS_DST  = path.join(SITE, 'content', 'posts');
const IMAGES_DST = path.join(SITE, 'public', 'images', 'ideas');
const INDEX_FILE = path.join(SITE, 'content', 'posts_index.json');

// ── Pre-flight checks ──────────────────────────────────────
if (!fs.existsSync(IDEAS_SRC)) {
  console.error(`✗ Cannot find corpus at: ${IDEAS_SRC}`);
  process.exit(1);
}
if (!fs.existsSync(SITE)) {
  console.error(`✗ Cannot find site at: ${SITE}`);
  process.exit(1);
}

fs.mkdirSync(POSTS_DST,  { recursive: true });
fs.mkdirSync(IMAGES_DST, { recursive: true });

// ── Fallback YAML parser ───────────────────────────────────
// Used when gray-matter can't parse a frontmatter block.
// Handles: quoted strings (with escaped inner quotes), numbers, and bracketed arrays.
function parseFrontmatterFallback(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) throw new Error('No frontmatter delimiters found');

  const fmRaw = fmMatch[1];
  const body  = fmMatch[2];
  const data  = {};

  for (const line of fmRaw.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val   = m[2].trim();

    // Array: [item1, item2, ...]
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      if (!inner) { data[key] = []; continue; }
      // Split on commas that are NOT inside quotes
      const items = [];
      let cur = '', inQuote = false;
      for (const ch of inner) {
        if (ch === '"' && cur[cur.length - 1] !== '\\') inQuote = !inQuote;
        if (ch === ',' && !inQuote) { items.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      if (cur.trim()) items.push(cur.trim());
      data[key] = items.map(s => s.replace(/^"(.+)"$/, '$1'));
    }
    // Quoted string — take everything between first quote and last quote
    else if (val.startsWith('"')) {
      const last = val.lastIndexOf('"');
      data[key] = last > 0 ? val.slice(1, last) : val.slice(1);
    }
    // Number
    else if (/^-?\d+(\.\d+)?$/.test(val)) {
      data[key] = Number(val);
    }
    // Plain string
    else {
      data[key] = val;
    }
  }

  return { data, content: body };
}

function parseFrontmatter(raw) {
  try {
    return matter(raw);
  } catch (err) {
    // gray-matter failed — try our forgiving fallback
    return parseFrontmatterFallback(raw);
  }
}

// ── Helpers ────────────────────────────────────────────────
function slugFromFilename(f) {
  const base = f.replace(/\.md$/, '');
  const parts = base.split('_');
  return parts.slice(1).join('_') || base;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
}

// ── STEP 1: Copy all images ─────────────────────────────────
console.log('\n[1/3] Copying images...');
let imagesCopied = 0;
let imagesSkipped = 0;

if (fs.existsSync(IMAGES_SRC)) {
  const imageFiles = fs.readdirSync(IMAGES_SRC);
  for (const img of imageFiles) {
    const src = path.join(IMAGES_SRC, img);
    const dst = path.join(IMAGES_DST, img);
    if (fs.statSync(src).isFile()) {
      if (fs.existsSync(dst)) {
        imagesSkipped++;
      } else {
        fs.copyFileSync(src, dst);
        imagesCopied++;
      }
    }
  }
  console.log(`  ✓ ${imagesCopied} new, ${imagesSkipped} already existed (${imageFiles.length} total)`);
} else {
  console.log(`  ⚠ No images folder at ${IMAGES_SRC}`);
}

// ── STEP 2: Clear old posts ────────────────────────────────
console.log('\n[2/3] Clearing old post JSON files...');
const oldPosts = fs.readdirSync(POSTS_DST).filter(f => f.endsWith('.json'));
for (const f of oldPosts) fs.unlinkSync(path.join(POSTS_DST, f));
console.log(`  ✓ Cleared ${oldPosts.length} old posts`);

// ── STEP 3: Process markdown files ─────────────────────────
console.log('\n[3/3] Processing markdown files...');
const files = fs.readdirSync(IDEAS_SRC).filter(f => f.endsWith('.md'));
console.log(`  Found ${files.length} markdown files\n`);

const indexEntries = [];
const seenSlugs = new Set();
let postsWritten = 0;
let postsRecovered = 0;
let postsFailed = 0;
let duplicatesSkipped = 0;

for (const file of files) {
  const fullPath = path.join(IDEAS_SRC, file);
  const raw = fs.readFileSync(fullPath, 'utf-8');

  let parsed, recovered = false;
  try {
    parsed = matter(raw);
  } catch {
    try {
      parsed = parseFrontmatterFallback(raw);
      recovered = true;
      postsRecovered++;
    } catch (err2) {
      console.warn(`  ✗ FAILED: ${file} — ${err2.message}`);
      postsFailed++;
      continue;
    }
  }

  const fm = parsed.data;
  let body = parsed.content;

  // Strip redundant header block (# Title \n *By Author* \n *Published: date* \n ---)
  const headerEnd = body.indexOf('\n---\n');
  if (headerEnd !== -1) {
    body = body.slice(headerEnd + 5).trim();
  }

  // Extract Summary as excerpt
  let excerpt = '';
  const summaryMatch = body.match(/^Summary:\s*([\s\S]+?)(?:\n\n|\n#|\n!|$)/);
  if (summaryMatch) {
    excerpt = summaryMatch[1].trim().replace(/\s+/g, ' ');
    body = body.slice(summaryMatch[0].length).trim();
  }

  // Markdown → HTML
  let html;
  try {
    html = marked.parse(body, { breaks: false, gfm: true });
  } catch (err) {
    html = `<p>${body.replace(/\n/g, '<br>')}</p>`;
  }

  // Slug + dedupe
  let slug = slugFromFilename(file);
  if (seenSlugs.has(slug)) {
    duplicatesSkipped++;
    continue;
  }
  seenSlugs.add(slug);

  const categories = Array.isArray(fm.categories)
    ? [...new Set(fm.categories.map(c => String(c).trim()).filter(Boolean))]
    : [];
  const tags = Array.isArray(fm.tags)
    ? [...new Set(fm.tags.map(t => String(t).trim()).filter(Boolean))]
    : [];

  const post = {
    slug,
    url:        fm.url || '',
    title:      String(fm.title || slug).trim(),
    date:       formatDate(fm.date),
    dateISO:    fm.date || '',
    author:     fm.author || 'Neal Mitchell',
    categories,
    tags,
    excerpt,
    content:    html,
    images:     [],
    externalLinks: [],
    imageCount: fm.image_count || 0,
  };

  fs.writeFileSync(
    path.join(POSTS_DST, `${slug}.json`),
    JSON.stringify(post, null, 2)
  );
  postsWritten++;

  indexEntries.push({
    slug:       post.slug,
    title:      post.title,
    date:       post.date,
    dateISO:    post.dateISO,
    author:     post.author,
    categories: post.categories,
    tags:       post.tags,
    excerpt:    post.excerpt,
    imageCount: post.imageCount,
  });

  if (recovered) console.log(`  ✓ ${file}  (recovered with fallback parser)`);
}

// Sort index by date desc
indexEntries.sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));

fs.writeFileSync(INDEX_FILE, JSON.stringify(indexEntries, null, 2));

// ── Summary ─────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log(`✓ Posts written:        ${postsWritten}`);
console.log(`  (of which recovered:  ${postsRecovered})`);
console.log(`  Duplicates skipped:   ${duplicatesSkipped}`);
console.log(`  Failed:               ${postsFailed}`);
console.log(`✓ Images copied (new):  ${imagesCopied}`);
console.log(`  Images already there: ${imagesSkipped}`);
console.log(`✓ Index file:           ${INDEX_FILE}`);
console.log('══════════════════════════════════════════');
console.log('\nNext: git add . && git commit -m "..." && git push');
