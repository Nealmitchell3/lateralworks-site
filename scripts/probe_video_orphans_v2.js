#!/usr/bin/env node
/**
 * Wider video orphan probe — uses post.url (the canonical Squarespace URL
 * recorded at migration time) instead of guessing dates. Looks at the
 * data-html attribute of every .sqs-block-video element and decodes the
 * iframe to find out what video provider it points at.
 *
 * Read-only. 2-second pacing.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const SITE = process.cwd();
const ORPHAN_REPORT = path.join(SITE, 'scripts', 'video_orphan_survey.json');
if (!fs.existsSync(ORPHAN_REPORT)) {
  console.error('Cannot find video_orphan_survey.json — run survey first.');
  process.exit(1);
}

const survey = JSON.parse(fs.readFileSync(ORPHAN_REPORT, 'utf-8'));
const allOrphans = survey.findings.filter(f => f.verdict === 'orphan');

// Pick a wider sample — 4 orphans spanning sections and doc types
const SAMPLE_SLUGS = [
  'accelerate-pain',
  'fttm-planning-methodology',
  'decision-mapping',
  'introduction-to-decision-analysis-2',
];
const samples = SAMPLE_SLUGS.map(slug => allOrphans.find(o => o.slug === slug)).filter(Boolean);

// Also need each post's url field — read from the JSON files
function getPostUrl(section, slug) {
  const dir = section === 'docs' ? path.join(SITE, 'content', 'docs')
            : (fs.existsSync(path.join(SITE, 'content', 'ideas')) ? path.join(SITE, 'content', 'ideas') : path.join(SITE, 'content', 'posts'));
  const fp = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(fp)) return null;
  const post = JSON.parse(fs.readFileSync(fp, 'utf-8'));
  return post.url || null;
}

function fetchHtml(urlStr, hops = 5) {
  return new Promise(resolve => {
    let u; try { u = new URL(urlStr); } catch { return resolve({ status: 0, error: 'bad-url' }); }
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 30000,
    }, res => {
      const status = res.statusCode;
      const loc = res.headers.location;
      if (loc && hops > 0 && [301,302,303,307,308].includes(status)) {
        const next = loc.startsWith('http') ? loc : new URL(loc, urlStr).toString();
        res.resume();
        fetchHtml(next, hops - 1).then(resolve);
        return;
      }
      let body = '';
      res.on('data', c => { body += c; if (body.length > 800000) res.destroy(); });
      res.on('end',   () => resolve({ status, body }));
      res.on('close', () => resolve({ status, body }));
    });
    req.on('error', e => resolve({ status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout' }); });
    req.end();
  });
}

// Decode HTML entities for the data-html attribute
function decodeEntities(s) {
  return String(s)
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

(async () => {
  for (const sample of samples) {
    const { section, slug, title } = sample;
    const url = getPostUrl(section, slug);
    console.log(`\n── [${section}] ${slug} ──`);
    console.log(`   title: ${title}`);
    console.log(`   url:   ${url || '(no url field)'}`);

    if (!url) { console.log('   → skipping, no canonical url'); continue; }
    const r = await fetchHtml(url);
    if (r.status !== 200 || !r.body) {
      console.log(`   ✗ fetch failed (${r.status})${r.error ? ' ' + r.error : ''}`);
      continue;
    }

    // Find every .sqs-block-video element and extract its data-html
    const blockRe = /<div[^>]*class="[^"]*sqs-block-video[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
    const dataHtmlRe = /data-html="([^"]+)"/gi;
    const blocks = r.body.match(blockRe) || [];
    console.log(`   sqs-block-video blocks found: ${blocks.length}`);

    // Pull data-html from anywhere in the response (more reliable than nested div parsing)
    const dataHtmlMatches = [...r.body.matchAll(/data-html="([^"]+)"/g)];
    if (dataHtmlMatches.length === 0) {
      console.log('   no data-html attribute found');
      continue;
    }

    dataHtmlMatches.slice(0, 3).forEach((m, i) => {
      const decoded = decodeEntities(m[1]);
      // Detect provider from the decoded iframe src
      let provider = 'unknown';
      let iframeSrc = '';
      const srcMatch = decoded.match(/src="([^"]+)"/i);
      if (srcMatch) {
        iframeSrc = srcMatch[1];
        if (/youtube\.com|youtu\.be/.test(iframeSrc))      provider = 'YouTube';
        else if (/vimeo\.com/.test(iframeSrc))             provider = 'Vimeo';
        else if (/wistia/.test(iframeSrc))                 provider = 'Wistia';
        else if (/squarespace/.test(iframeSrc))            provider = 'Squarespace-hosted';
      }
      console.log(`   block ${i+1}: provider=${provider}`);
      console.log(`      iframe src: ${iframeSrc}`);
      console.log(`      decoded snippet: ${decoded.slice(0, 200).replace(/\s+/g, ' ')}...`);
    });

    await new Promise(x => setTimeout(x, 2000));
  }

  console.log('\nDone. No fixes applied; just provider-detection.');
})();
