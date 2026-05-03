#!/usr/bin/env node
/**
 * Rewrite Squarespace /s/<filename> hrefs in post JSONs to point at
 * the locally-downloaded /attachments/<filename> path.
 *
 * Uses the URL→filename mapping from attachment_download_log.json — does
 * not naively transform /s/ to /attachments/, because Squarespace URL paths
 * sometimes differ from the on-disk filename (URL decoding, etc.).
 *
 * The download log records post-redirect Squarespace CDN URLs, not the
 * original /s/... paths that appear in post HTML. To recover the original
 * URLs we join the log to attachment_probe.json via redirectedFrom.
 *
 * Filenames are URL-encoded in the new href so that + becomes %2B and any
 * spaces or other reserved chars are escaped.
 *
 * Run:  node scripts/rewrite_attachment_hrefs.js
 * Output:
 *   - Modified content/ideas (or posts) and content/docs JSON files
 *   - scripts/attachment_rewrite_log.json
 */

const fs = require('fs');
const path = require('path');

const SITE = process.cwd();
const LOG  = path.join(SITE, 'scripts', 'attachment_download_log.json');

function pickIdeasDir() {
  const a = path.join(SITE, 'content', 'ideas');
  const b = path.join(SITE, 'content', 'posts');
  if (fs.existsSync(a)) return a;
  if (fs.existsSync(b)) return b;
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

if (!fs.existsSync(LOG)) {
  console.error('✗ attachment_download_log.json not found — run download_attachments.js first.');
  process.exit(1);
}

const downloadLog = JSON.parse(fs.readFileSync(LOG, 'utf-8'));

// Build the URL → encoded-href map.
// The download log only has post-redirect CDN URLs, so we join through the
// probe report (whose results carry `redirectedFrom` = original /s/... URL).
const probe = JSON.parse(fs.readFileSync(path.join(SITE, 'scripts', 'attachment_probe.json'), 'utf-8'));
// Map post-redirect CDN URL → original /s/ URL
const cdnToOriginal = new Map();
for (const r of probe.results) {
  if (r.redirectedFrom) cdnToOriginal.set(r.url, r.redirectedFrom);
}

const urlMap = new Map();
for (const entry of downloadLog.log) {
  if (entry.status === 'failed') continue;
  const original = cdnToOriginal.get(entry.url);
  if (!original) continue;             // unredirected entries (none expected, but safe)
  const oldPath = original.replace(/^https?:\/\/(?:www\.)?lateralworks\.com/, '');
  const encoded = encodeURIComponent(entry.filename);
  const newHref = `/attachments/${encoded}`;
  urlMap.set(oldPath, newHref);
  urlMap.set(`https://lateralworks.com${oldPath}`, newHref);
  urlMap.set(`https://www.lateralworks.com${oldPath}`, newHref);
}

console.log(`Rewrite map: ${urlMap.size} URL variants → ${new Set([...urlMap.values()]).size} unique attachments\n`);

function rewriteDir(dir, section) {
  if (!fs.existsSync(dir)) return { filesScanned: 0, filesChanged: 0, hrefsRewritten: 0, perFile: [] };
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let filesChanged = 0, hrefsRewritten = 0;
  const perFile = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const post = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
    let html = String(post.content || '');
    let changes = 0;

    // Replace each href= occurrence whose URL is in the map.
    // Use a single regex pass to avoid double-rewriting.
    html = html.replace(/href="([^"]+)"/g, (full, url) => {
      if (urlMap.has(url)) {
        changes++;
        return `href="${urlMap.get(url)}"`;
      }
      return full;
    });

    if (changes > 0) {
      post.content = html;
      fs.writeFileSync(fullPath, JSON.stringify(post, null, 2));
      filesChanged++;
      hrefsRewritten += changes;
      perFile.push({ section, slug: post.slug, changes });
      console.log(`  ✓ [${section}] ${post.slug}  (${changes} href${changes === 1 ? '' : 's'})`);
    }
  }

  return { filesScanned: files.length, filesChanged, hrefsRewritten, perFile };
}

const ideasResult = rewriteDir(IDEAS_DIR, 'ideas');
const docsResult  = rewriteDir(DOCS_DIR,  'docs');

console.log('\n═══════════════════════════════════════════════');
console.log('  Rewrite summary');
console.log('═══════════════════════════════════════════════');
console.log(`Ideas:  ${ideasResult.filesChanged}/${ideasResult.filesScanned} files changed, ${ideasResult.hrefsRewritten} hrefs rewritten`);
console.log(`Docs:   ${docsResult.filesChanged}/${docsResult.filesScanned} files changed, ${docsResult.hrefsRewritten} hrefs rewritten`);
console.log(`Total hrefs rewritten: ${ideasResult.hrefsRewritten + docsResult.hrefsRewritten}`);

// Sanity check: re-scan the JSONs for any remaining /s/ hrefs that should have been rewritten.
function residualCount(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const html = String(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')).content || '');
    const matches = html.match(/href="(\/s\/[^"]+|https?:\/\/(?:www\.)?lateralworks\.com\/s\/[^"]+)"/g);
    if (matches) n += matches.length;
  }
  return n;
}
const residualIdeas = residualCount(IDEAS_DIR);
const residualDocs  = residualCount(DOCS_DIR);
console.log(`\nResidual /s/ hrefs after rewrite (should be 0):`);
console.log(`  Ideas: ${residualIdeas}`);
console.log(`  Docs:  ${residualDocs}`);

fs.writeFileSync(
  path.join(SITE, 'scripts', 'attachment_rewrite_log.json'),
  JSON.stringify({
    summary: {
      ideas: ideasResult,
      docs: docsResult,
      residualSquarespaceHrefs: { ideas: residualIdeas, docs: residualDocs },
    },
  }, null, 2),
);
console.log(`\nRewrite log saved: scripts/attachment_rewrite_log.json`);

if (residualIdeas + residualDocs > 0) {
  console.log('\n⚠ Residual /s/ hrefs found — investigate before committing.');
}
