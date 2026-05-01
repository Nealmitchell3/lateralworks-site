#!/usr/bin/env node
/**
 * recover_doc_images.js
 *
 * For each migrated doc, fetches the live Squarespace HTML, walks the
 * .sqs-block elements, downloads images to public/images/docs/, and
 * rewrites the doc's content field with clean HTML.
 *
 * Run AFTER migrate_docs.js. Idempotent — safe to re-run.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const cheerio = require('cheerio');

const HOME    = os.homedir();
const SITE    = path.join(HOME, 'Downloads', 'lateralworks-site');
const DOCS    = path.join(SITE, 'content', 'docs');
const IMAGES  = path.join(SITE, 'public', 'images', 'docs');
const INDEX   = path.join(SITE, 'content', 'docs_index.json');

const DELAY_MS = 1000;
const MAX_RETRIES = 2;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

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

function cleanInnerHtml($, $content) {
  $content.find('script, style, noscript').remove();
  $content.find('*').each(function () {
    const el = this;
    const $el = $(el);
    Object.keys(el.attribs || {}).forEach(attr => {
      if (attr.startsWith('data-')) $el.removeAttr(attr);
    });
    $el.removeAttr('style');
    const id = $el.attr('id');
    if (id && /^(block-|yui_|figure)/.test(id)) $el.removeAttr('id');
    const cls = $el.attr('class');
    if (cls) {
      const cleaned = cls.split(/\s+/)
        .filter(c => c &&
          !c.startsWith('sqs-') &&
          !c.startsWith('image-') &&
          !c.startsWith('html-') &&
          !c.startsWith('has-') &&
          !c.startsWith('content-') &&
          !c.startsWith('intrinsic') &&
          !/^col(umns)?(-\d+)?$/.test(c)
        ).join(' ');
      if (cleaned.trim()) $el.attr('class', cleaned);
      else $el.removeAttr('class');
    }
  });
  return $content.html() || '';
}

async function processDoc(doc) {
  const html = await fetchUrl(doc.url);
  const $ = cheerio.load(html);
  const $article = $('.entry-content');
  if (!$article.length) return null;
  const blocks = [];
  let imgsDownloaded = 0, imgsSkipped = 0;
  for (const blockEl of $article.find('.sqs-block').toArray()) {
    const $block = $(blockEl);
    const cls = $block.attr('class') || '';
    if (cls.includes('image-block') || cls.includes('sqs-block-image')) {
      const $img = $block.find('img').first();
      if (!$img.length) continue;
      const src = $img.attr('data-src') || $img.attr('src');
      if (!src || !src.includes('squarespace-cdn.com')) continue;
      const filename = urlToFilename(src);
      if (!filename) continue;
      const localPath = path.join(IMAGES, filename);
      if (!fs.existsSync(localPath)) {
        try { await downloadFile(src, localPath); imgsDownloaded++; }
        catch { continue; }
      } else { imgsSkipped++; }
      const caption = $block.find('.image-caption').first().text().trim();
      const alt = ($img.attr('alt') || caption || '').replace(/"/g, '&quot;');
      let figHtml = `<figure><img src="/images/docs/${filename}" alt="${alt}" />`;
      if (caption) figHtml += `<figcaption>${caption}</figcaption>`;
      figHtml += '</figure>';
      blocks.push(figHtml);
    } else if (cls.includes('html-block') || cls.includes('sqs-block-html')) {
      const $content = $block.find('.sqs-block-content').first();
      if (!$content.length) continue;
      const inner = cleanInnerHtml($, $content);
      if (inner.trim()) blocks.push(inner.trim());
    }
  }
  let cleanedHtml = blocks.join('\n\n');
  cleanedHtml = cleanedHtml.replace(/^<p[^>]*>\s*Summary:[\s\S]+?<\/p>\s*/i, '');
  return {
    content: cleanedHtml,
    imageCount: blocks.filter(b => b.startsWith('<figure>')).length,
    imgsDownloaded,
    imgsSkipped,
  };
}

async function main() {
  if (!fs.existsSync(INDEX)) {
    console.error(`✗ docs_index.json not found at ${INDEX}`);
    console.error(`  Run scripts/migrate_docs.js first.`);
    process.exit(1);
  }
  fs.mkdirSync(IMAGES, { recursive: true });
  const indexEntries = JSON.parse(fs.readFileSync(INDEX, 'utf-8'));
  console.log(`Processing ${indexEntries.length} docs (≈${Math.ceil(indexEntries.length / 60)}m at 1s/doc)\n`);

  let processed = 0, withImages = 0, downloaded = 0, skipped = 0;
  let failed = 0, missingUrl = 0;
  const failures = [];
  const startTime = Date.now();

  for (let i = 0; i < indexEntries.length; i++) {
    const entry = indexEntries[i];
    const docFile = path.join(DOCS, `${entry.slug}.json`);
    if (!fs.existsSync(docFile)) { missingUrl++; continue; }
    const doc = JSON.parse(fs.readFileSync(docFile, 'utf-8'));
    if (!doc.url) { missingUrl++; continue; }
    const label = `[${(i+1).toString().padStart(3)}/${indexEntries.length}] ${entry.slug.substring(0, 45).padEnd(46)}`;
    process.stdout.write(label);
    try {
      const result = await processDoc(doc);
      if (!result) { console.log(' ⚠ no .entry-content'); missingUrl++; }
      else {
        doc.content = result.content;
        doc.imageCount = result.imageCount;
        fs.writeFileSync(docFile, JSON.stringify(doc, null, 2));
        processed++;
        downloaded += result.imgsDownloaded;
        skipped += result.imgsSkipped;
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
  console.log(`Time:                   ${Math.floor(elapsed/60)}m ${elapsed%60}s`);
  console.log(`✓ Docs updated:         ${processed}`);
  console.log(`✓ Docs with images:     ${withImages}`);
  console.log(`✓ Images downloaded:    ${downloaded}`);
  console.log(`  Already on disk:      ${skipped}`);
  console.log(`  Skipped (no URL):     ${missingUrl}`);
  console.log(`  Failed:               ${failed}`);
  console.log(`══════════════════════════════════════════`);
  if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures.slice(0, 10)) console.log(`  • ${f.slug} — ${f.error}`);
    if (failures.length > 10) console.log(`  ...and ${failures.length - 10} more`);
  }
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
