#!/usr/bin/env node
/**
 * lateralworks corpus → Next.js site migration
 *
 * Reads markdown files from ~/Downloads/lateralworks_corpus/ideas/
 * Converts each to JSON matching the existing site's posts schema
 * Copies all images to public/images/ideas/
 *
 * Run:  node scripts/migrate_corpus.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Paths ──────────────────────────────────────────────────
const HOME    = os.homedir();
const CORPUS  = path.join(HOME, 'Downloads', 'lateralworks_corpus');
const IDEAS_SRC  = path.join(CORPUS, 'ideas');
const IMAGES_SRC = path.join(CORPUS, 'images');

const SITE    = path.join(HOME, 'Downloads', 'lateralworks-site');
const POSTS_DST  = path.join(SITE, 'content', 'posts');
const IMAGES_DST = path.join(SITE, 'public', 'images', 'ideas');
const INDEX_FILE = path.join(SITE, 'content', 'posts_index.json');

// ── Pre-flight checks ──────────────────────────────────────
if (!fs.existsSync(IDEAS_SRC)) {
  console.error(`✗ Cannot find corpus at: ${IDEAS_SRC}`);
  console.error(`  Make sure the tarball is extracted in ~/Downloads/`);
  process.exit(1);
}
if (!fs.existsSync(SITE)) {
  console.error(`✗ Cannot find site at: ${SITE}`);
  process.exit(1);
}

// Make sure output dirs exist
fs.mkdirSync(POSTS_DST,  { recursive: true });
fs.mkdirSync(IMAGES_DST, { recursive: true });

// ── Clear old posts (so re-runs are clean) ─────────────────
const oldPosts = fs.readdirSync(POSTS_DST).filter(f => f.endsWith('.json'));
for (const f of oldPosts) fs.unlinkSync(path.join(POSTS_DST, f));
console.log(`✓ Cleared ${oldPosts.length} existing post files`);

// ── Helpers ────────────────────────────────────────────────
function slugFromFilename(f) {
  // "2024-12-14_its-the-second-or-third-critical-path.md" → "its-the-second-or-third-critical-path"
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

// Track images we copy
const copiedImages = new Set();

function copyImageIfExists(srcPath) {
  if (!fs.existsSync(srcPath)) return null;
  const filename = path.basename(srcPath);
  const dest = path.join(IMAGES_DST, filename);
  if (!copiedImages.has(filename)) {
    fs.copyFileSync(srcPath, dest);
    copiedImages.add(filename);
  }
  return `/images/ideas/${filename}`;
}

// ── Process each markdown file ─────────────────────────────
const files = fs.readdirSync(IDEAS_SRC).filter(f => f.endsWith('.md'));
console.log(`✓ Found ${files.length} ideas markdown files`);

const indexEntries = [];
const seenSlugs = new Set();
let postsWritten = 0;
let duplicatesSkipped = 0;

for (const file of files) {
  const fullPath = path.join(IDEAS_SRC, file);
  const raw = fs.readFileSync(fullPath, 'utf-8');

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    console.warn(`  ⚠ Skipping ${file} — frontmatter parse error: ${err.message}`);
    continue;
  }

  const fm = parsed.data;
  let body  = parsed.content;

  // Strip the redundant header block in the body
  // Format is: # Title \n *By Author* \n *Published: date* \n ---
  // We strip from start up through the second --- divider
  const headerEnd = body.indexOf('\n---\n');
  if (headerEnd !== -1) {
    body = body.slice(headerEnd + 5).trim();
  }

  // Extract Summary line as excerpt
  let excerpt = '';
  const summaryMatch = body.match(/^Summary:\s*([\s\S]+?)(?:\n\n|\n#|\n!|$)/);
  if (summaryMatch) {
    excerpt = summaryMatch[1].trim().replace(/\s+/g, ' ');
    body = body.slice(summaryMatch[0].length).trim();
  }

  // Process inline images: ![alt](path) — copy and rewrite to /images/ideas/
  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, url) => {
    if (url.startsWith('http')) return full;  // external URL — leave alone
    // Try multiple lookup paths
    const candidates = [
      path.join(CORPUS, url),
      path.join(IMAGES_SRC, path.basename(url)),
      path.join(CORPUS, 'images', url),
    ];
    for (const c of candidates) {
      const newUrl = copyImageIfExists(c);
      if (newUrl) return `![${alt}](${newUrl})`;
    }
    return full;  // not found, keep as-is
  });

  // Convert markdown body to HTML
  let html;
  try {
    html = marked.parse(body, { breaks: false, gfm: true });
  } catch (err) {
    console.warn(`  ⚠ Markdown render error for ${file}: ${err.message}`);
    html = `<p>${body.replace(/\n/g, '<br>')}</p>`;
  }

  // Build slug — handle duplicates by appending date
  let slug = slugFromFilename(file);
  if (seenSlugs.has(slug)) {
    duplicatesSkipped++;
    continue;
  }
  seenSlugs.add(slug);

  // Build categories — dedupe and trim
  const categories = Array.isArray(fm.categories) ? [...new Set(fm.categories.map(c => String(c).trim()))] : [];
  const tags       = Array.isArray(fm.tags)       ? [...new Set(fm.tags.map(t => String(t).trim()))] : [];

  // Build post
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

  // Save individual post JSON
  fs.writeFileSync(
    path.join(POSTS_DST, `${slug}.json`),
    JSON.stringify(post, null, 2)
  );
  postsWritten++;

  // Add to index (without full content for fast loading)
  indexEntries.push({
    slug:        post.slug,
    title:       post.title,
    date:        post.date,
    dateISO:     post.dateISO,
    author:      post.author,
    categories:  post.categories,
    tags:        post.tags,
    excerpt:     post.excerpt,
    imageCount:  post.imageCount,
  });
}

// Sort index by date descending (most recent first)
indexEntries.sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));

// Save the index
fs.writeFileSync(INDEX_FILE, JSON.stringify(indexEntries, null, 2));

// ── Done ───────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log(`✓ Posts written:       ${postsWritten}`);
console.log(`✓ Duplicates skipped:  ${duplicatesSkipped}`);
console.log(`✓ Images copied:       ${copiedImages.size}`);
console.log(`✓ Index saved:         ${INDEX_FILE}`);
console.log('══════════════════════════════════════════');
console.log('\nNext: cd ~/Downloads/lateralworks-site && git add . && git commit -m "Migrate corpus" && git push');
