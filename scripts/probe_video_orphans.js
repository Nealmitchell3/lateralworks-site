#!/usr/bin/env node
/**
 * Video orphan probe — fetch a small sample of live Squarespace pages from
 * the orphan list, look at what kind of video block they have.
 *
 * Read-only. Polite 2-second pacing. Saves the raw HTML and a structured
 * report to scripts/ for review.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const SITE = process.cwd();

// Sample 3 orphan slugs spanning ideas and docs
const SAMPLES = [
  { section: 'docs',  slug: 'macro-mind-mapping' },
  { section: 'docs',  slug: 'common-cpm-scheduling-mistakes' },
  { section: 'ideas', slug: 'accelerate-pain' },
];

// Live URL patterns to try (Squarespace had multiple URL shapes over the years)
function urlCandidates(section, slug) {
  const base = section === 'docs' ? '/tools' : '/ideas';
  return [
    `https://lateralworks.com${base}/${slug}`,
    `https://lateralworks.com${base}/2019/1/24/${slug}`,
    `https://lateralworks.com${base}/2019/1/25/${slug}`,
    `https://lateralworks.com${base}/2020/1/1/${slug}`,
    `https://lateralworks.com${base}/2018/6/1/${slug}`,
    `https://lateralworks.com${base}/2017/1/1/${slug}`,
  ];
}

function fetchHtml(urlStr, hops = 5) {
  return new Promise(resolve => {
    let u;
    try { u = new URL(urlStr); } catch { return resolve({ url: urlStr, status: 0, error: 'bad-url' }); }
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
      res.on('data', c => { body += c; if (body.length > 500000) res.destroy(); });
      res.on('end', () => resolve({ url: urlStr, status, body, finalUrl: urlStr }));
      res.on('close', () => resolve({ url: urlStr, status, body, finalUrl: urlStr }));
    });
    req.on('error', e => resolve({ url: urlStr, status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 0, error: 'timeout' }); });
    req.end();
  });
}

(async () => {
  const findings = [];
  for (const { section, slug } of SAMPLES) {
    console.log(`\n── ${section}/${slug} ──`);
    let resolvedHtml = null;
    let resolvedUrl  = null;
    for (const candidate of urlCandidates(section, slug)) {
      const r = await fetchHtml(candidate);
      const tag = r.status >= 200 && r.status < 300 ? '✓' : '✗';
      console.log(`  ${tag} [${r.status}] ${candidate}`);
      if (r.status === 200 && r.body && r.body.length > 1000) {
        resolvedHtml = r.body;
        resolvedUrl  = candidate;
        break;
      }
      await new Promise(x => setTimeout(x, 2000));
    }

    if (!resolvedHtml) {
      console.log('  → no working URL found');
      findings.push({ section, slug, found: false });
      continue;
    }

    // Search the live HTML for video-shaped patterns
    const checks = {
      'sqs-block-video': /class="[^"]*sqs-block-video[^"]*"/gi,
      'iframe (any)':    /<iframe[^>]*>/gi,
      'iframe vimeo':    /<iframe[^>]*src="[^"]*vimeo[^"]*"/gi,
      'iframe youtube':  /<iframe[^>]*src="[^"]*you(?:tube|tu\.be)[^"]*"/gi,
      'video tag':       /<video[^>]*>/gi,
      'data-block-type video':  /data-block-type="video"/gi,
      'data-html (block JSON)': /data-html="[^"]*video[^"]*"/gi,
    };
    const counts = {};
    for (const [k, re] of Object.entries(checks)) {
      const m = resolvedHtml.match(re);
      counts[k] = m ? m.length : 0;
    }
    console.log('  Live page video patterns:');
    for (const [k, v] of Object.entries(counts)) console.log(`    ${k.padEnd(30)} ${v}`);

    // Also extract iframe src URLs if any
    const iframeSrcs = [...resolvedHtml.matchAll(/<iframe[^>]*src="([^"]+)"/gi)].map(m => m[1]).slice(0, 10);
    if (iframeSrcs.length > 0) {
      console.log('  iframe sources:');
      iframeSrcs.forEach(s => console.log(`    ${s}`));
    }

    // Capture the snippet of live HTML around the video block (if any) for inspection
    let videoSnippet = '';
    const idx = resolvedHtml.search(/sqs-block-video|<iframe|<video/i);
    if (idx >= 0) {
      const start = Math.max(0, idx - 200);
      const end   = Math.min(resolvedHtml.length, idx + 800);
      videoSnippet = resolvedHtml.slice(start, end);
    }

    findings.push({ section, slug, found: true, resolvedUrl, counts, iframeSrcs, videoSnippet });
    await new Promise(x => setTimeout(x, 2000));
  }

  fs.writeFileSync(
    path.join(SITE, 'scripts', 'video_orphan_probe.json'),
    JSON.stringify(findings, null, 2),
  );
  console.log('\nReport saved: scripts/video_orphan_probe.json');
})();
