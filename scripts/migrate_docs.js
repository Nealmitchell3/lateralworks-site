#!/usr/bin/env node
/**
 * lateralworks corpus → /docs migration
 *
 * Reads markdown files from ~/Downloads/lateralworks_corpus/tools/
 * (the corpus folder is named "tools" — that stays as-is)
 * Writes JSON to ~/Downloads/lateralworks-site/content/docs/
 * Writes index to ~/Downloads/lateralworks-site/content/docs_index.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Paths ──────────────────────────────────────────────────
const HOME       = os.homedir();
const CORPUS     = path.join(HOME, 'Downloads', 'lateralworks_corpus');
const SRC        = path.join(CORPUS, 'tools');     // corpus folder name stays "tools"

const SITE       = path.join(HOME, 'Downloads', 'lateralworks-site');
const DOCS_DST   = path.join(SITE, 'content', 'docs');
const INDEX_FILE = path.join(SITE, 'content', 'docs_index.json');

// ── Pre-flight ─────────────────────────────────────────────
if (!fs.existsSync(SRC)) {
  console.error(`✗ Cannot find docs source at: ${SRC}`);
  process.exit(1);
}
if (!fs.existsSync(SITE)) {
  console.error(`✗ Cannot find site at: ${SITE}`);
  process.exit(1);
}
fs.mkdirSync(DOCS_DST, { recursive: true });

// ── Fallback YAML parser ───────────────────────────────────
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
    let val = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      if (!inner) { data[key] = []; continue; }
      const items = [];
      let cur = '', inQuote = false;
      for (const ch of inner) {
        if (ch === '"' && cur[cur.length - 1] !== '\\') inQuote = !inQuote;
        if (ch === ',' && !inQuote) { items.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      if (cur.trim()) items.push(cur.trim());
      data[key] = items.map(s => s.replace(/^"(.+)"$/, '$1'));
    } else if (val.startsWith('"')) {
      const last = val.lastIndexOf('"');
      data[key] = last > 0 ? val.slice(1, last) : val.slice(1);
    } else if (/^-?\d+(\.\d+)?$/.test(val)) {
      data[key] = Number(val);
    } else {
      data[key] = val;
    }
  }
  return { data, content: body };
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

// ── Clear old ──────────────────────────────────────────────
console.log('\n[1/2] Clearing old docs JSON files...');
const oldDocs = fs.readdirSync(DOCS_DST).filter(f => f.endsWith('.json'));
for (const f of oldDocs) fs.unlinkSync(path.join(DOCS_DST, f));
console.log(`  ✓ Cleared ${oldDocs.length} old files`);

// ── Process ────────────────────────────────────────────────
console.log('\n[2/2] Processing markdown files...');
const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md'));
console.log(`  Found ${files.length} markdown files\n`);

const indexEntries = [];
const seenSlugs = new Set();
let written = 0, recovered = 0, failed = 0, duplicates = 0;

for (const file of files) {
  const fullPath = path.join(SRC, file);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  let parsed, wasRecovered = false;
  try {
    parsed = matter(raw);
  } catch {
    try {
      parsed = parseFrontmatterFallback(raw);
      wasRecovered = true;
      recovered++;
    } catch (err2) {
      console.warn(`  ✗ FAILED: ${file} — ${err2.message}`);
      failed++;
      continue;
    }
  }
  const fm = parsed.data;
  let body = parsed.content;
  const headerEnd = body.indexOf('\n---\n');
  if (headerEnd !== -1) body = body.slice(headerEnd + 5).trim();
  let excerpt = '';
  const sm = body.match(/^Summary:\s*([\s\S]+?)(?:\n\n|\n#|\n!|$)/);
  if (sm) {
    excerpt = sm[1].trim().replace(/\s+/g, ' ');
    body = body.slice(sm[0].length).trim();
  }
  let html;
  try { html = marked.parse(body, { breaks: false, gfm: true }); }
  catch { html = `<p>${body.replace(/\n/g, '<br>')}</p>`; }

  let slug = slugFromFilename(file);
  if (seenSlugs.has(slug)) { duplicates++; continue; }
  seenSlugs.add(slug);

  const categories = Array.isArray(fm.categories)
    ? [...new Set(fm.categories.map(c => String(c).trim()).filter(Boolean))]
    : [];
  const tags = Array.isArray(fm.tags)
    ? [...new Set(fm.tags.map(t => String(t).trim()).filter(Boolean))]
    : [];

  const doc = {
    slug,
    url:        fm.url || '',
    title:      String(fm.title || slug).trim(),
    date:       formatDate(fm.date),
    dateISO:    fm.date || '',
    author:     fm.author || 'lateralworks',
    categories,
    tags,
    excerpt,
    content:    html,
    images:     [],
    externalLinks: [],
    imageCount: fm.image_count || 0,
  };
  fs.writeFileSync(path.join(DOCS_DST, `${slug}.json`), JSON.stringify(doc, null, 2));
  written++;
  indexEntries.push({
    slug:       doc.slug,
    title:      doc.title,
    date:       doc.date,
    dateISO:    doc.dateISO,
    author:     doc.author,
    categories: doc.categories,
    tags:       doc.tags,
    excerpt:    doc.excerpt,
    imageCount: doc.imageCount,
  });
  if (wasRecovered) console.log(`  ✓ ${file}  (recovered)`);
}
indexEntries.sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));
fs.writeFileSync(INDEX_FILE, JSON.stringify(indexEntries, null, 2));

console.log('\n══════════════════════════════════════════');
console.log(`✓ Docs written:         ${written}`);
console.log(`  (recovered:           ${recovered})`);
console.log(`  Duplicates skipped:   ${duplicates}`);
console.log(`  Failed:               ${failed}`);
console.log(`✓ Index file:           ${INDEX_FILE}`);
console.log('══════════════════════════════════════════\n');
