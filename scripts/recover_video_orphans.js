#!/usr/bin/env node
/**
 * Video orphan recovery — DRY RUN mode by default.
 *
 * For each post in scripts/video_orphan_survey.json with verdict='orphan':
 *  - Fetch post.url (canonical Squarespace URL recorded at migration time)
 *  - Extract the YouTube iframe URL from the .sqs-block-video data-html attribute
 *  - Verify the YouTube video still exists via youtube.com/oembed (200 = alive)
 *  - Build a clean <figure class="video-embed"><iframe ...></iframe>
 *    <figcaption>...</figcaption></figure> block
 *  - Print what would be inserted into the post.content field
 *  - Write nothing.
 *
 * To actually apply, re-run with --apply.
 *
 * Run:
 *   node scripts/recover_video_orphans.js          (dry run)
 *   node scripts/recover_video_orphans.js --apply  (writes the changes)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const APPLY = process.argv.includes('--apply');
const SITE  = process.cwd();
const SURVEY = path.join(SITE, 'scripts', 'video_orphan_survey.json');
if (!fs.existsSync(SURVEY)) {
  console.error('Cannot find video_orphan_survey.json — run survey first.');
  process.exit(1);
}

function pickIdeasDir() {
  for (const d of ['content/ideas','content/posts']) {
    if (fs.existsSync(path.join(SITE, d))) return path.join(SITE, d);
  }
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

// Apply policy: skip these slugs even if their video is recoverable
//   - Two video-dead posts (handled separately as a prose fix later)
//   - One third-party video (reality-distortion-is-misunderstood — DontBeKurt's
//     NeXT documentary; we don't host third-party content)
const SKIP_SLUGS = new Set([
  'getting-the-objectives-right',     // YouTube video deleted (w_gMS9ID9X0)
  'the-right-objectives',             // YouTube video deleted (TSLcxPXvKtI)
  'reality-distortion-is-misunderstood', // Third-party video (not Neal's content)
]);

const survey = JSON.parse(fs.readFileSync(SURVEY, 'utf-8'));
const orphans = survey.findings.filter(f => f.verdict === 'orphan');
console.log(`${APPLY ? 'APPLY' : 'DRY RUN'}: processing ${orphans.length} orphan posts\n`);

function getDir(section) { return section === 'docs' ? DOCS_DIR : IDEAS_DIR; }

function getPost(section, slug) {
  const fp = path.join(getDir(section), `${slug}.json`);
  if (!fs.existsSync(fp)) return null;
  return { fp, post: JSON.parse(fs.readFileSync(fp, 'utf-8')) };
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

function decodeEntities(s) {
  return String(s)
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// Extract a clean YouTube iframe src from a post's data-html block(s).
// Returns the FIRST one we find — Squarespace pages typically have one video block per post.
function extractYoutubeSrc(html) {
  const dataHtmlMatches = [...html.matchAll(/data-html="([^"]+)"/g)];
  for (const m of dataHtmlMatches) {
    const decoded = decodeEntities(m[1]);
    const srcMatch = decoded.match(/src="([^"]+)"/i);
    if (srcMatch && /youtube\.com\/embed\/|youtu\.be\//.test(srcMatch[1])) {
      return srcMatch[1];
    }
  }
  return null;
}

// Pull a clean YouTube embed URL — strip Squarespace-specific query params, normalize protocol
function cleanEmbedUrl(rawSrc) {
  let src = rawSrc.startsWith('//') ? 'https:' + rawSrc : rawSrc;
  // Extract just the video ID
  const idMatch = src.match(/\/embed\/([\w-]+)/) || src.match(/youtu\.be\/([\w-]+)/);
  if (!idMatch) return src;
  const videoId = idMatch[1];
  return `https://www.youtube.com/embed/${videoId}`;
}

// Pull caption text from a post's body HTML if present
function extractCaption(html) {
  const m = html.match(/<div class="video-caption"[^>]*>([\s\S]*?)<\/div>/i);
  if (!m) return null;
  const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return text || null;
}

// Verify a YouTube video still exists via oEmbed (200 = alive, 404 = deleted/private)
function verifyYoutubeAlive(embedUrl) {
  return new Promise(resolve => {
    const idMatch = embedUrl.match(/\/embed\/([\w-]+)/);
    if (!idMatch) return resolve({ alive: false, reason: 'cannot-extract-id' });
    const watchUrl = `https://www.youtube.com/watch?v=${idMatch[1]}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
    const u = new URL(oembedUrl);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const meta = JSON.parse(body);
            resolve({ alive: true, title: meta.title, channel: meta.author_name });
          } catch {
            resolve({ alive: true });
          }
        } else {
          resolve({ alive: false, reason: `oembed status ${res.statusCode}` });
        }
      });
    });
    req.on('error', e => resolve({ alive: false, reason: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ alive: false, reason: 'timeout' }); });
    req.end();
  });
}

// Build the replacement HTML block to insert at the top of post.content
function buildVideoFigure(embedUrl, caption) {
  const cap = caption ? `\n  <figcaption>${caption}</figcaption>` : '';
  return `<figure class="video-embed">\n  <iframe src="${embedUrl}" width="854" height="480" frameborder="0" allowfullscreen></iframe>${cap}\n</figure>`;
}

(async () => {
  const results = [];
  for (let i = 0; i < orphans.length; i++) {
    const o = orphans[i];
    if (SKIP_SLUGS.has(o.slug)) {
      console.log(`\n── ${i+1}/${orphans.length}: [${o.section}] ${o.slug} ──`);
      console.log('   ⊙ skipped per apply policy');
      results.push({ slug: o.slug, section: o.section, status: 'skipped-by-policy' });
      continue;
    }
    const localPost = getPost(o.section, o.slug);
    console.log(`\n── ${i+1}/${orphans.length}: [${o.section}] ${o.slug} ──`);
    if (!localPost) { console.log('   ✗ local post not found'); continue; }
    const url = localPost.post.url;
    if (!url) { console.log('   ✗ no canonical url field'); continue; }
    console.log(`   url:   ${url}`);

    const r = await fetchHtml(url);
    if (r.status !== 200 || !r.body) {
      console.log(`   ✗ fetch failed (status=${r.status}${r.error ? ', ' + r.error : ''})`);
      results.push({ slug: o.slug, section: o.section, status: 'fetch-failed' });
      continue;
    }

    const rawSrc = extractYoutubeSrc(r.body);
    if (!rawSrc) {
      console.log('   ✗ no YouTube iframe found in data-html');
      results.push({ slug: o.slug, section: o.section, status: 'no-iframe' });
      continue;
    }
    const embedUrl = cleanEmbedUrl(rawSrc);
    const caption  = extractCaption(r.body);
    const verify   = await verifyYoutubeAlive(embedUrl);
    const figureHtml = buildVideoFigure(embedUrl, caption);

    console.log(`   embed:    ${embedUrl}`);
    if (caption) console.log(`   caption:  "${caption.slice(0, 100)}"`);
    console.log(`   verify:   ${verify.alive ? '✓ alive' : '✗ ' + (verify.reason || 'dead')}` + (verify.title ? ` ("${verify.title}" by ${verify.channel})` : ''));
    console.log(`   would insert at top of content:\n${figureHtml.split('\n').map(l => '       ' + l).join('\n')}`);

    if (APPLY) {
      // Insert the figure at the top of the post.content body. Skip if already present.
      const post = localPost.post;
      const html = String(post.content || '');
      if (html.includes(`src="${embedUrl}"`)) {
        console.log('   ⊙ already inserted, skipping');
      } else {
        post.content = figureHtml + '\n\n' + html;
        fs.writeFileSync(localPost.fp, JSON.stringify(post, null, 2));
        console.log('   ✓ inserted');
      }
    }

    results.push({
      slug: o.slug, section: o.section,
      status: verify.alive ? 'recoverable' : 'video-dead',
      embedUrl, caption, verify, figureHtml,
    });

    await new Promise(x => setTimeout(x, 2000));
  }

  // Summary
  const recoverable = results.filter(r => r.status === 'recoverable').length;
  const videoDead   = results.filter(r => r.status === 'video-dead').length;
  const fetchFailed = results.filter(r => r.status === 'fetch-failed').length;
  const noIframe    = results.filter(r => r.status === 'no-iframe').length;
  const skipped     = results.filter(r => r.status === 'skipped-by-policy').length;

  console.log('\n═══════════════════════════════════════════════');
  console.log(`  ${APPLY ? 'APPLY' : 'DRY RUN'} summary`);
  console.log('═══════════════════════════════════════════════');
  console.log(`Recoverable:        ${recoverable}`);
  console.log(`Video dead:         ${videoDead}`);
  console.log(`Fetch failed:       ${fetchFailed}`);
  console.log(`No iframe:          ${noIframe}`);
  console.log(`Skipped by policy:  ${skipped}`);
  console.log(`Total processed:    ${results.length}`);

  fs.writeFileSync(
    path.join(SITE, 'scripts', 'video_orphan_recovery_log.json'),
    JSON.stringify({ apply: APPLY, summary: { recoverable, videoDead, fetchFailed, noIframe, skipped }, results }, null, 2),
  );
  console.log('\nLog saved: scripts/video_orphan_recovery_log.json');

  if (!APPLY) {
    console.log('\nDry run complete. To actually write the changes:');
    console.log('  node scripts/recover_video_orphans.js --apply');
  }
})();
