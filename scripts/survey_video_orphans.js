#!/usr/bin/env node
/**
 * Stranded video/screencast survey.
 *
 * Scans every post in content/ideas (or content/posts) and content/docs
 * looking for posts where the prose promises a video/screencast but the body
 * contains no actual embed.
 *
 * Read-only. Produces scripts/video_orphan_survey.json plus console summary.
 */

const fs = require('fs');
const path = require('path');

const SITE = process.cwd();

function pickIdeasDir() {
  for (const d of ['content/ideas','content/posts']) {
    if (fs.existsSync(path.join(SITE, d))) return path.join(SITE, d);
  }
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

// "Promise" patterns in the prose
const PROMISE_PATTERNS = [
  { name: 'screencast',          re: /\bscreencast\b/i },
  { name: 'in this video',       re: /\bin this video\b/i },
  { name: 'this short video',    re: /\bthis (short |brief |quick )?video\b/i },
  { name: 'watch the (video|screencast)', re: /\bwatch (the|this) (video|screencast|recording|presentation)\b/i },
  { name: 'video below',         re: /\bvideo below\b/i },
  { name: 'see the recording',   re: /\bsee the recording\b/i },
  { name: 'in the following video', re: /\bin the following video\b/i },
];

// "Embed present" markers — if any of these are in the body, the video DID survive
const EMBED_MARKERS = [
  /<video\b/i,
  /<iframe\b/i,
  /youtube\.com\/embed/i,
  /youtu\.be\//i,
  /player\.vimeo\.com/i,
  /\.mp4\b/i,
  /\.mov\b/i,
  /\.webm\b/i,
];

function scanDir(dir, section) {
  if (!fs.existsSync(dir)) return [];
  const findings = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const post = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    const html = String(post.content || '');
    if (!html) continue;

    // Check each promise pattern
    const promises = [];
    for (const pat of PROMISE_PATTERNS) {
      if (pat.re.test(html)) promises.push(pat.name);
    }
    if (promises.length === 0) continue;

    // Check whether any embed marker is present
    const hasEmbed = EMBED_MARKERS.some(m => m.test(html));

    // Also count anchor tags that look like they might point at video files
    const videoAnchors = (html.match(/<a [^>]*href="[^"]*\.(mp4|mov|webm|m4v)[^"]*"[^>]*>/gi) || []).length;

    // Pull a short snippet of context around the first promise match
    let snippet = '';
    for (const pat of PROMISE_PATTERNS) {
      const m = html.match(pat.re);
      if (m) {
        const idx = html.indexOf(m[0]);
        const start = Math.max(0, idx - 80);
        const end   = Math.min(html.length, idx + 200);
        snippet = html.slice(start, end).replace(/\s+/g, ' ').trim();
        break;
      }
    }

    findings.push({
      section,
      slug: post.slug,
      title: post.title,
      promises,
      hasEmbed,
      videoAnchors,
      verdict: hasEmbed || videoAnchors > 0 ? 'has-video-or-link' : 'orphan',
      snippet,
    });
  }
  return findings;
}

const all = [...scanDir(IDEAS_DIR, 'ideas'), ...scanDir(DOCS_DIR, 'docs')];
const orphans = all.filter(f => f.verdict === 'orphan');
const okay    = all.filter(f => f.verdict !== 'orphan');

// Counts
const orphansBySection = {};
for (const o of orphans) orphansBySection[o.section] = (orphansBySection[o.section] || 0) + 1;
const orphansByPromiseType = {};
for (const o of orphans) for (const p of o.promises) orphansByPromiseType[p] = (orphansByPromiseType[p] || 0) + 1;

console.log('═══════════════════════════════════════════════');
console.log('  Stranded video/screencast survey');
console.log('═══════════════════════════════════════════════\n');
console.log(`Total posts mentioning video/screencast: ${all.length}`);
console.log(`  with intact embed or video link:       ${okay.length}`);
console.log(`  ORPHANED (prose promises, no embed):    ${orphans.length}\n`);
if (orphans.length > 0) {
  console.log('Orphans by section:');
  for (const [k, v] of Object.entries(orphansBySection)) console.log(`  ${k.padEnd(8)} ${v}`);
  console.log('\nOrphans by promise pattern:');
  for (const [k, v] of Object.entries(orphansByPromiseType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(3)}  "${k}"`);
  }
  console.log('\nOrphan list:');
  orphans.forEach((o, i) => {
    console.log(`\n  ${String(i+1).padStart(2)}. [${o.section}] ${o.slug}`);
    console.log(`      title: ${o.title}`);
    console.log(`      promises: ${o.promises.join(', ')}`);
    console.log(`      snippet: "${o.snippet.slice(0, 200)}..."`);
  });
}

fs.writeFileSync(
  path.join(SITE, 'scripts', 'video_orphan_survey.json'),
  JSON.stringify({ summary: { total: all.length, okay: okay.length, orphans: orphans.length, orphansBySection, orphansByPromiseType }, findings: all }, null, 2),
);
console.log('\nReport saved: scripts/video_orphan_survey.json');
