#!/usr/bin/env node
/**
 * External link survey — finds every <a href="http(s)://..."> in the
 * post HTML where the host is NOT lateralworks.com (or www / vercel),
 * HEAD-checks each unique URL, and writes a review file.
 *
 * Read-only on the content. No rewrites in this step.
 *
 * Run:  node scripts/survey_external_links.js
 * Output:
 *   - scripts/external_link_review.json (full per-link findings + status)
 *   - Console summary
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');
const { URL } = require('url');

const SITE = process.cwd();

function pickIdeasDir() {
  const a = path.join(SITE, 'content', 'ideas');
  const b = path.join(SITE, 'content', 'posts');
  if (fs.existsSync(a)) return a;
  if (fs.existsSync(b)) return b;
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

const REPORT = path.join(SITE, 'scripts', 'external_link_review.json');

// Hosts that are "ours" — we skip these. They're handled by other scripts.
const OURS = new Set([
  'lateralworks.com',
  'www.lateralworks.com',
  'lateralworks-site.vercel.app',
]);

// Pull <a href="..."> with link text together
function extractLinks(html, slug, section) {
  const out = [];
  const re = /<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let host;
    try { host = new URL(m[1]).hostname.toLowerCase(); }
    catch { continue; }
    if (OURS.has(host)) continue;
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    out.push({ section, slug, url: m[1], host, linkText: text });
  }
  return out;
}

function scanDir(dir, section) {
  if (!fs.existsSync(dir)) return [];
  const links = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const post = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    const html = String(post.content || '');
    links.push(...extractLinks(html, post.slug, section));
  }
  return links;
}

const allLinks = [...scanDir(IDEAS_DIR, 'ideas'), ...scanDir(DOCS_DIR, 'docs')];

// Build the unique URL set for probing
const urlSet = new Set(allLinks.map(l => l.url));
const urls = [...urlSet];

console.log(`Found ${allLinks.length} external link occurrences`);
console.log(`Unique URLs to probe: ${urls.length}`);
console.log(`Distinct hosts: ${new Set(allLinks.map(l => l.host)).size}\n`);

// HEAD with redirect follow (max 5 hops). Falls back to GET if HEAD is rejected (some
// hosts return 405 to HEAD requests). Treats 405-from-HEAD-then-200-from-GET as alive.
function probe(urlStr, hopsLeft = 5, method = 'HEAD') {
  return new Promise((resolve) => {
    let u;
    try { u = new URL(urlStr); } catch { return resolve({ url: urlStr, status: 0, error: 'invalid-url' }); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.request({
      method,
      hostname: u.hostname,
      port: u.port || (u.protocol === 'http:' ? 80 : 443),
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 15000,
    }, (res) => {
      const status = res.statusCode;
      const loc = res.headers.location;
      // Follow redirects to learn the final status
      if (loc && hopsLeft > 0 && [301, 302, 303, 307, 308].includes(status)) {
        const next = loc.startsWith('http') ? loc : new URL(loc, urlStr).toString();
        res.resume();
        probe(next, hopsLeft - 1, method).then((r) => resolve({ ...r, redirectedFrom: urlStr, originalStatus: status }));
        return;
      }
      // 405 to HEAD — retry with GET once
      if (status === 405 && method === 'HEAD') {
        res.resume();
        probe(urlStr, hopsLeft, 'GET').then(resolve);
        return;
      }
      res.resume();
      resolve({ url: urlStr, status, finalUrl: urlStr });
    });
    req.on('error', (e) => resolve({ url: urlStr, status: 0, error: String(e.message || e) }));
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 0, error: 'timeout' }); });
    req.end();
  });
}

(async () => {
  const probed = [];
  for (let i = 0; i < urls.length; i++) {
    const r = await probe(urls[i]);
    probed.push(r);
    const tag = r.status >= 200 && r.status < 300 ? '✓'
              : r.status >= 300 && r.status < 400 ? '→'
              : '✗';
    let host = '';
    try { host = new URL(urls[i]).hostname; } catch {}
    process.stdout.write(`  ${tag} [${String(r.status).padEnd(3)}] ${host.padEnd(28)} ${urls[i].slice(0, 80)}\n`);
    await new Promise(res => setTimeout(res, 1000));
  }

  // Build the per-occurrence review by joining link occurrences with probe results
  const probeByUrl = new Map(probed.map(p => [p.url, p]));
  const reviewRows = allLinks.map(l => {
    const p = probeByUrl.get(l.url);
    const status = p ? p.status : 0;
    const verdict =
      status >= 200 && status < 300 ? 'alive'
      : status === 0                ? 'error'
      : status === 401 || status === 403 ? 'maybe-bot-block'
      : status === 404              ? 'dead'
      : status >= 400 && status < 500 ? 'maybe-bot-block'
      : 'other';
    return {
      section: l.section,
      slug: l.slug,
      host: l.host,
      url: l.url,
      linkText: l.linkText,
      status,
      verdict,
      // Default action — user reviews and edits before strip step
      action: verdict === 'alive' ? 'keep' : (verdict === 'dead' ? 'strip' : 'review'),
      error: p?.error || null,
    };
  });

  // Summary
  const counts = { alive: 0, dead: 0, 'maybe-bot-block': 0, error: 0, other: 0 };
  for (const r of reviewRows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;

  // Per-host breakdown of dead/error so you can spot patterns
  const deadByHost = {};
  for (const r of reviewRows) {
    if (r.verdict === 'dead' || r.verdict === 'error') {
      deadByHost[r.host] = (deadByHost[r.host] || 0) + 1;
    }
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  External link survey — summary');
  console.log('═══════════════════════════════════════════════');
  console.log(`Total occurrences: ${reviewRows.length}  (across ${urls.length} unique URLs)`);
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(18)} ${v}`);
  console.log('\nDead/error by host (top 15):');
  Object.entries(deadByHost).sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([h, n]) => console.log(`  ${h.padEnd(32)} ${n}`));

  fs.writeFileSync(REPORT, JSON.stringify({
    summary: { totalOccurrences: reviewRows.length, uniqueUrls: urls.length, counts, deadByHost },
    rows: reviewRows,
  }, null, 2));
  console.log(`\nReview file saved: ${REPORT}`);
  console.log(`\nNext: review the rows array — each has an "action" field defaulting to keep/strip/review.`);
  console.log(`      Edit any "review" rows to either "keep" or "strip" before running the strip script.`);
})();
