#!/usr/bin/env node
/**
 * Attachment downloader — for each URL in attachment_probe.json with
 * status 200, download the file to public/attachments/<basename>.
 *
 * Idempotent: skips files that already exist with non-zero size.
 * Polite: 1-second delay between downloads.
 *
 * Run:  node scripts/download_attachments.js
 * Output:
 *   - Files saved under public/attachments/
 *   - Console summary
 *   - scripts/attachment_download_log.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const SITE   = process.cwd();
const PROBE  = path.join(SITE, 'scripts', 'attachment_probe.json');
const DEST   = path.join(SITE, 'public', 'attachments');
const LOG    = path.join(SITE, 'scripts', 'attachment_download_log.json');

if (!fs.existsSync(PROBE)) {
  console.error('✗ attachment_probe.json not found — run probe_attachments.js first.');
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });

const probe = JSON.parse(fs.readFileSync(PROBE, 'utf-8'));
const alive = probe.results.filter(r => r.status === 200);

console.log(`Downloading ${alive.length} attachments to ${DEST}\n`);

// Extract the filename from a /s/<filename> URL
function basenameFromUrl(urlStr) {
  const u = new URL(urlStr);
  const parts = u.pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1]);
}

// GET with redirect following (max 5 hops) and stream-to-file
function download(urlStr, outPath, hopsLeft = 5) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = https.request({
      method: 'GET',
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      timeout: 30000,
    }, (res) => {
      const status = res.statusCode;
      const loc = res.headers.location;
      if (loc && hopsLeft > 0 && [301, 302, 303, 307, 308].includes(status)) {
        const next = loc.startsWith('http') ? loc : new URL(loc, urlStr).toString();
        res.resume();
        download(next, outPath, hopsLeft - 1).then(resolve, reject);
        return;
      }
      if (status !== 200) {
        res.resume();
        reject(new Error(`HTTP ${status}`));
        return;
      }
      const tmpPath = outPath + '.part';
      const out = fs.createWriteStream(tmpPath);
      res.pipe(out);
      out.on('finish', () => {
        out.close(() => {
          fs.renameSync(tmpPath, outPath);
          resolve(fs.statSync(outPath).size);
        });
      });
      out.on('error', (e) => { try { fs.unlinkSync(tmpPath); } catch {} reject(e); });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

(async () => {
  const log = [];
  let downloaded = 0, skipped = 0, failed = 0;

  for (let i = 0; i < alive.length; i++) {
    const r = alive[i];
    const filename = basenameFromUrl(r.url);
    const outPath  = path.join(DEST, filename);

    // Idempotency: skip if already present and non-empty
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
      skipped++;
      log.push({ url: r.url, filename, status: 'skipped-existing', size: fs.statSync(outPath).size });
      console.log(`  ⊙ [skip] ${filename}  (${fs.statSync(outPath).size} bytes already on disk)`);
      continue;
    }

    try {
      const size = await download(r.url, outPath);
      downloaded++;
      log.push({ url: r.url, filename, status: 'downloaded', size });
      console.log(`  ✓ [${String(size).padStart(8)} bytes] ${filename}`);
    } catch (e) {
      failed++;
      log.push({ url: r.url, filename, status: 'failed', error: String(e.message || e) });
      console.log(`  ✗ [fail] ${filename}  ${e.message || e}`);
    }

    await new Promise(res => setTimeout(res, 1000));
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  Download summary');
  console.log('═══════════════════════════════════════════════');
  console.log(`Downloaded:        ${downloaded}`);
  console.log(`Skipped (exists):  ${skipped}`);
  console.log(`Failed:            ${failed}`);
  console.log(`Total in target:   ${fs.readdirSync(DEST).length}`);

  fs.writeFileSync(LOG, JSON.stringify({ summary: { downloaded, skipped, failed }, log }, null, 2));
  console.log(`\nDownload log saved: ${LOG}`);

  if (failed > 0) {
    console.log('\nFailures:');
    log.filter(l => l.status === 'failed').forEach(l => console.log(`  ${l.filename}  ${l.error}`));
  }
})();
