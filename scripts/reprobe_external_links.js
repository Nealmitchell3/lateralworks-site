#!/usr/bin/env node
/**
 * Re-probe gray-zone external links with better instrumentation.
 *
 * Reads scripts/external_link_review.json
 * For every row whose verdict is in {dead, error, maybe-bot-block}:
 *   - Try HEAD with browser-like UA, 30s timeout
 *   - On 405/403/timeout/network-error → fall back to GET (downloading only the
 *     first ~16KB of body, then aborting — enough to get the real status code)
 *   - Capture the actual error message verbatim so we can distinguish DNS
 *     failure (ENOTFOUND) from rate limiting from real 404s.
 * Pacing: 2.5 seconds between requests.
 *
 * Updates external_link_review.json in place — refined verdicts only for
 * the rows that needed re-probing. "alive" rows are left untouched.
 *
 * Run:  node scripts/reprobe_external_links.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');
const { URL } = require('url');

const SITE   = process.cwd();
const REVIEW = path.join(SITE, 'scripts', 'external_link_review.json');

if (!fs.existsSync(REVIEW)) {
  console.error('✗ external_link_review.json not found — run survey_external_links.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(REVIEW, 'utf-8'));
const rows = data.rows;

// Collect unique URLs that need re-probing
const grayVerdicts = new Set(['dead', 'error', 'maybe-bot-block']);
const toReprobe = [...new Set(rows.filter(r => grayVerdicts.has(r.verdict)).map(r => r.url))];

console.log(`Re-probing ${toReprobe.length} unique gray-zone URLs (pacing: 2.5s, timeout: 30s, GET fallback)\n`);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function request(urlStr, method, hopsLeft = 5) {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(urlStr); } catch { return resolve({ status: 0, error: 'invalid-url' }); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      method,
      hostname: u.hostname,
      port: u.port || (u.protocol === 'http:' ? 80 : 443),
      path: u.pathname + u.search,
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
      },
      timeout: 30000,
    }, (res) => {
      const status = res.statusCode;
      const loc = res.headers.location;
      if (loc && hopsLeft > 0 && [301, 302, 303, 307, 308].includes(status)) {
        const next = loc.startsWith('http') ? loc : new URL(loc, urlStr).toString();
        res.resume();
        request(next, method, hopsLeft - 1).then(resolve);
        return;
      }
      // For GET, drain a small chunk then abort — we just want the status, not the body
      let bytes = 0;
      res.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > 16384) res.destroy();
      });
      res.on('end',   () => resolve({ status, finalUrl: urlStr }));
      res.on('close', () => resolve({ status, finalUrl: urlStr }));
    });
    req.on('error', (e) => resolve({ status: 0, error: `${e.code || 'ERR'}: ${e.message}` }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout' }); });
    req.end();
  });
}

async function probeWithFallback(urlStr) {
  let r = await request(urlStr, 'HEAD');
  // Fall back to GET on ambiguous responses
  if (r.status === 0 || r.status === 405 || r.status === 403 || r.status === 401 || r.status === 429) {
    const headStatus = r.status;
    const headError  = r.error;
    r = await request(urlStr, 'GET');
    return { ...r, headStatus, headError };
  }
  return r;
}

(async () => {
  const refined = new Map();
  for (let i = 0; i < toReprobe.length; i++) {
    const url = toReprobe[i];
    const r = await probeWithFallback(url);
    refined.set(url, r);
    let host = '';
    try { host = new URL(url).hostname; } catch {}
    const tag = r.status >= 200 && r.status < 300 ? '✓'
              : r.status === 0                   ? '✗'
              : r.status === 404                 ? '✗'
              : '?';
    const note = r.headStatus ? `(HEAD→${r.headStatus}, GET→${r.status})` : '';
    process.stdout.write(`  ${tag} [${String(r.status).padEnd(3)}] ${host.padEnd(28)} ${note}  ${r.error || ''}\n`);
    await new Promise(res => setTimeout(res, 2500));
  }

  // Refined verdict logic — much stricter about what counts as "dead"
  function refineVerdict(originalRow, refinedResult) {
    const s = refinedResult.status;
    if (s >= 200 && s < 300) return 'alive';
    if (s === 404 || s === 410) return 'dead';
    if (s === 0) {
      const e = String(refinedResult.error || '');
      if (e.includes('ENOTFOUND') || e.includes('EAI_AGAIN')) return 'dead-dns';
      return 'error-network';
    }
    if (s === 401 || s === 403 || s === 405 || s === 429) return 'maybe-bot-block';
    return 'other';
  }

  // Update the rows in place
  for (const row of rows) {
    if (!grayVerdicts.has(row.verdict)) continue;
    const r = refined.get(row.url);
    if (!r) continue;
    row.status = r.status;
    row.error  = r.error || null;
    row.headStatus = r.headStatus || null;
    row.verdict = refineVerdict(row, r);
    row.action = row.verdict === 'alive' ? 'keep'
              : row.verdict === 'dead' || row.verdict === 'dead-dns' ? 'strip'
              : 'review';
  }

  // Recompute summary
  const counts = {};
  for (const r of rows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  const deadByHost = {};
  for (const r of rows) {
    if (r.verdict === 'dead' || r.verdict === 'dead-dns' || r.verdict === 'error-network') {
      deadByHost[r.host] = (deadByHost[r.host] || 0) + 1;
    }
  }

  data.summary = {
    totalOccurrences: rows.length,
    uniqueUrls: data.summary.uniqueUrls,
    counts,
    deadByHost,
  };
  fs.writeFileSync(REVIEW, JSON.stringify(data, null, 2));

  console.log('\n═══════════════════════════════════════════════');
  console.log('  Refined verdicts');
  console.log('═══════════════════════════════════════════════');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(20)} ${v}`);
  console.log('\nDead/network-error by host:');
  Object.entries(deadByHost).sort((a, b) => b[1] - a[1])
    .forEach(([h, n]) => console.log(`  ${h.padEnd(32)} ${n}`));

  // List the rows that will be auto-stripped
  const toStrip = rows.filter(r => r.action === 'strip');
  console.log(`\nRows that will be stripped on next step (action=strip): ${toStrip.length}`);
  toStrip.slice(0, 30).forEach((r, i) => {
    console.log(`  ${String(i+1).padStart(2)}. [${r.section}] ${r.slug}`);
    console.log(`       text: "${(r.linkText || '').slice(0, 70)}"`);
    console.log(`       url:  ${r.url}`);
    console.log(`       why:  ${r.verdict} (${r.status}${r.error ? ' ' + r.error : ''})`);
  });
  if (toStrip.length > 30) console.log(`  ... and ${toStrip.length - 30} more in external_link_review.json`);
})();
