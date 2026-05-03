#!/usr/bin/env node
/**
 * Attachment probe — for each /s/... URL in attachment_survey.json,
 * issue a HEAD request to https://lateralworks.com/s/<filename> and
 * record status + content-type + content-length + final URL after redirects.
 *
 * Read-only on disk except for the report.
 *
 * Run:  node scripts/probe_attachments.js
 * Output:
 *   - Console summary (alive / dead / redirected counts)
 *   - scripts/attachment_probe.json (full per-URL probe results)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const SITE = process.cwd();
const SURVEY = path.join(SITE, 'scripts', 'attachment_survey.json');
const REPORT = path.join(SITE, 'scripts', 'attachment_probe.json');

if (!fs.existsSync(SURVEY)) {
  console.error('✗ attachment_survey.json not found — run survey_attachments.js first.');
  process.exit(1);
}

const survey = JSON.parse(fs.readFileSync(SURVEY, 'utf-8'));
const findings = survey.findings;

// Build the set of unique URLs to probe (we only care once per URL,
// even if the same attachment is referenced from multiple posts).
const urlSet = new Set();
for (const f of findings) {
  // Normalize relative /s/... paths into absolute lateralworks.com URLs
  const abs = f.url.startsWith('http')
    ? f.url
    : `https://lateralworks.com${f.url}`;
  urlSet.add(abs);
}
const urls = [...urlSet];
console.log(`Probing ${urls.length} unique URLs (HEAD only)...\n`);

// HEAD request with redirect following (max 5 hops)
function head(urlStr, hopsLeft = 5) {
  return new Promise((resolve) => {
    const u = new URL(urlStr);
    const req = https.request({
      method: 'HEAD',
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 15000,
    }, (res) => {
      const status = res.statusCode;
      const loc    = res.headers.location;
      // Follow redirects to learn the final URL + content-type
      if (loc && hopsLeft > 0 && [301, 302, 303, 307, 308].includes(status)) {
        const next = loc.startsWith('http') ? loc : new URL(loc, urlStr).toString();
        head(next, hopsLeft - 1).then((r) => resolve({ ...r, redirectedFrom: urlStr, originalStatus: status }));
        return;
      }
      resolve({
        url: urlStr,
        status,
        contentType:   res.headers['content-type']   || null,
        contentLength: res.headers['content-length'] || null,
        finalUrl: urlStr,
      });
    });
    req.on('error', (e) => resolve({ url: urlStr, status: 0, error: String(e.message || e) }));
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 0, error: 'timeout' }); });
    req.end();
  });
}

(async () => {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    const r = await head(u);
    results.push(r);
    const tag = r.status === 200 ? '✓' : (r.status >= 300 && r.status < 400 ? '→' : '✗');
    const ct  = (r.contentType || '').split(';')[0];
    console.log(`  ${tag} [${String(r.status).padEnd(3)}] ${u.replace('https://lateralworks.com', '')}  ${ct}`);
    // Polite 1-second pacing
    await new Promise(res => setTimeout(res, 1000));
  }

  const alive = results.filter(r => r.status === 200);
  const dead  = results.filter(r => r.status !== 200);

  // Group dead by status so we can spot patterns (404 vs 403 vs network errors)
  const deadByStatus = {};
  for (const r of dead) {
    const k = String(r.status || 'error');
    deadByStatus[k] = (deadByStatus[k] || 0) + 1;
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  Probe summary');
  console.log('═══════════════════════════════════════════════');
  console.log(`Alive (200):   ${alive.length}`);
  console.log(`Dead/error:    ${dead.length}`);
  for (const [k, v] of Object.entries(deadByStatus)) console.log(`  status ${k}: ${v}`);

  // Report content-type distribution among the alive ones — exposes
  // the rotted-extension cases (e.g. *.pdf URLs serving image/png)
  const ctCounts = {};
  for (const r of alive) {
    const ct = (r.contentType || 'unknown').split(';')[0];
    ctCounts[ct] = (ctCounts[ct] || 0) + 1;
  }
  console.log('\nAlive by content-type:');
  for (const [k, v] of Object.entries(ctCounts).sort((a,b)=>b[1]-a[1])) console.log(`  ${k.padEnd(36)} ${v}`);

  fs.writeFileSync(REPORT, JSON.stringify({
    summary: { alive: alive.length, dead: dead.length, deadByStatus, ctCounts },
    results,
  }, null, 2));
  console.log(`\nFull probe report saved: ${REPORT}`);

  console.log('\nDead URLs (will be stripped from posts in step 4):');
  for (const r of dead) console.log(`  [${r.status || 'err'}] ${r.url}  ${r.error || ''}`);
})();
