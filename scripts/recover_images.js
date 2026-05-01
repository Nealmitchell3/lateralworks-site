#!/usr/bin/env node
/**
 * recover_images.js
 *
 * For each migrated post, fetches the live Squarespace HTML, walks the
 * .sqs-block elements in order, downloads images to public/images/ideas/,
 * and rewrites the post's content field with clean HTML that has
 * <figure><img/><figcaption></figcaption></figure> for each image.
 *
 * Run:  npm install --save-dev cheerio
 *       node scripts/recover_images.js
 *
 * Idempotent — safe to re-run. Skips images that already exist locally.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const cheerio = require('cheerio');

// ── Paths ───────────────────────────────────────────────────────────
const HOME    = os.homedir();
const SITE    = path.join(HOME, 'Downloads', 'lateralworks-site');
const POSTS   = path.join(SITE, 'content', 'posts');
const IMAGES  = path.join(SITE, 'public', 'images', 'ideas');
const INDEX   = path.join(SITE, 'content', 'posts_index.json');

// ── Settings ────────────────────────────────────────────────────────
const DELAY_MS = 1000;          // polite delay between post fetches
const MAX_RETRIES = 2;

// ── Helpers ─────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchUrl(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (recovery script)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(2000);
    }
  }
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

// Convert Squarespace CDN URL to clean local filename
function urlToFilename(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const uuid = parts[parts.length - 2] || '';
    let name = parts[parts.length - 1] || 'image.png';
    name = decodeURIComponent(name).replace(/[^a-zA-Z0-9._+-]/g, '_');
    const prefix = uuid.replace(/-/g, '').substring(0, 8);
    return `${prefix}_${name}`;
  } catch {
    return null;
  }
}

// Strip Squarespace cruft from HTML inside an HTML block
function cleanInnerHtml($, $content) {
  $content.find('script, style, noscript').remove();
  $content.find('*').each(function () {
    const el = this;
    const $el = $(el);
    Object.keys(el.attribs || {}).forEach((attr) => {
      if (attr.startsWith('data-')) $el.removeAttr(attr);
    });
    $el.removeAttr('style');
    const id = $el.attr('id');
    if (id && /^(block-|yui_|figure)/.test(id)) $el.removeAttr('id');
    const cls = $el.attr('class');
    if (cls) {
      const cleaned = cls
        .split(/\s+/)
        .filter(
          (c) =>
            c &&
            !c.startsWith('sqs-') &&
            !c.startsWith('image-') &&
            !c.startsWith('html-') &&
            !c.startsWith('has-') &&
            !c.startsWith('content-') &&
            !c.startsWith('intrinsic') &&
            !/^col(umns)?(-\d+)?$/.test(c)
        )
        .join(' ');
      if (cleaned.trim()) $el.attr('class', cleaned);
      else $el.removeAttr('class');
    }
  });
  return $content.html() || '';
}

// Process a single post — fetch, parse, download images, return cleaned HTML
async function processPost(post) {
  const html = await fetchUrl(post.url);
  const $ = cheerio.load(html);
  const $article = $('.entry-content');
  if (!$article.length) return null;

  const blocks = [];
  let imgsDownloaded = 0;
  let imgsSkipped = 0;

  for (const blockEl of $article.find('.sqs-block').toArray()) {
    const $block = $(blockEl);
    const cls = $block.attr('class') || '';

    // ── Image block ─────────────────────────────────────────
    if (cls.includes('image-block') || cls.includes('sqs-block-image')) {
      const $img = $block.find('img').first();
      if (!$img.length) continue;

      const src = $img.attr('data-src') || $img.attr('src');
      if (!src || !src.includes('squarespace-cdn.com')) continue;

      const filename = urlToFilename(src);
      if (!filename) continue;

      const localPath = path.join(IMAGES, filename);
      if (!fs.existsSync(localPath)) {
        try {
          await downloadFile(src, localPath);
          imgsDownloaded++;
        } catch {
          // download failed, skip this image silently
          continue;
        }
      } else {
        imgsSkipped++;
      }

      const caption = $block.find('.image-caption').first().text().trim();
      const alt = ($img.attr('alt') || caption || '').replace(/"/g, '&quot;');
      let figHtml = `<figure><img src="/images/ideas/${filename}" alt="${alt}" />`;
      if (caption) figHtml += `<figcaption>${caption}</figcaption>`;
      figHtml += '</figure>';
      blocks.push(figHtml);
    }
    // ── HTML/text block ─────────────────────────────────────
    else if (cls.includes('html-block') || cls.includes('sqs-block-html')) {
      const $content = $block.find('.sqs-block-content').first();
      if (!$content.length) continue;
      const inner = cleanInnerHtml($, $content);
      if (inner.trim()) blocks.push(inner.trim());
    }
    // (other block types: spacer, line, code, embed — skipped)
  }

  let cleanedHtml = blocks.join('\n\n');
  // Strip leading "Summary:" paragraph (already in post.excerpt)
  cleanedHtml = cleanedHtml.replace(/^<p[^>]*>\s*Summary:[\s\S]+?<\/p>\s*/i, '');

  return {
    content: cleanedHtml,
    imageCount: blocks.filter((b) => b.startsWith('<figure>')).length,
    imgsDownloaded,
    imgsSkipped,
  };
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(INDEX)) {
    console.error(`✗ posts_index.json not found at ${INDEX}`);
    process.exit(1);
  }
  fs.mkdirSync(IMAGES, { recursive: true });

  const indexEntries = JSON.parse(fs.readFileSync(INDEX, 'utf-8'));
  console.log(`Processing ${indexEntries.length} posts (≈${Math.ceil(indexEntries.length / 60)}m at 1s/post)\n`);

  let processed = 0;
  let withImages = 0;
  let imagesDownloaded = 0;
  let imagesSkipped = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  const startTime = Date.now();

  for (let i = 0; i < indexEntries.length; i++) {
    const entry = indexEntries[i];
    const postFile = path.join(POSTS, `${entry.slug}.json`);
    if (!fs.existsSync(postFile)) {
      skipped++;
      continue;
    }
    const post = JSON.parse(fs.readFileSync(postFile, 'utf-8'));
    if (!post.url) {
      skipped++;
      continue;
    }

    const label = `[${(i + 1).toString().padStart(3)}/${indexEntries.length}] ${entry.slug.substring(0, 45).padEnd(46)}`;
    process.stdout.write(label);

    try {
      const result = await processPost(post);
      if (!result) {
        console.log(' ⚠ no .entry-content');
        skipped++;
      } else {
        post.content = result.content;
        post.imageCount = result.imageCount;
        fs.writeFileSync(postFile, JSON.stringify(post, null, 2));
        processed++;
        imagesDownloaded += result.imgsDownloaded;
        imagesSkipped += result.imgsSkipped;
        if (result.imageCount > 0) withImages++;
        console.log(` ✓ ${result.imageCount} imgs (${result.imgsDownloaded} new)`);
      }
    } catch (err) {
      failed++;
      failures.push({ slug: entry.slug, error: err.message });
      console.log(` ✗ ${err.message.substring(0, 60)}`);
    }

    await sleep(DELAY_MS);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n══════════════════════════════════════════`);
  console.log(`Time:                   ${Math.floor(elapsed / 60)}m ${elapsed % 60}s`);
  console.log(`✓ Posts updated:        ${processed}`);
  console.log(`✓ Posts with images:    ${withImages}`);
  console.log(`✓ Images downloaded:    ${imagesDownloaded}`);
  console.log(`  Images already there: ${imagesSkipped}`);
  console.log(`  Skipped (no URL):     ${skipped}`);
  console.log(`  Failed:               ${failed}`);
  console.log(`══════════════════════════════════════════`);

  if (failures.length) {
    console.log(`\nFailures:`);
    for (const f of failures.slice(0, 10)) {
      console.log(`  • ${f.slug} — ${f.error}`);
    }
    if (failures.length > 10) console.log(`  ...and ${failures.length - 10} more`);
    console.log(`\nSafe to re-run the script — it'll skip already-downloaded images.`);
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
