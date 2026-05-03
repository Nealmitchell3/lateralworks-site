#!/usr/bin/env node
/**
 * Attachment survey — read-only inventory of /s/... and squarespace-hosted
 * attachment links in every ideas + docs post JSON.
 *
 * Run:  node scripts/survey_attachments.js
 * Output:
 *   - Console summary (totals, by section, by file type)
 *   - scripts/attachment_survey.json (full per-link findings)
 */

const fs = require('fs');
const path = require('path');

const SITE = process.cwd();

// Locate the ideas dir (named either content/ideas or content/posts depending on migration vintage)
function pickIdeasDir() {
  const a = path.join(SITE, 'content', 'ideas');
  const b = path.join(SITE, 'content', 'posts');
  if (fs.existsSync(a)) return a;
  if (fs.existsSync(b)) return b;
  throw new Error('Cannot find content/ideas or content/posts');
}
const IDEAS_DIR = pickIdeasDir();
const DOCS_DIR  = path.join(SITE, 'content', 'docs');

// Patterns we want to inventory
const PATTERNS = [
  { name: 'squarespace-asset-relative', regex: /href="(\/s\/[^"]+)"/g },
  { name: 'squarespace-asset-absolute', regex: /href="(https?:\/\/(?:www\.)?lateralworks\.com\/s\/[^"]+)"/g },
  { name: 'squarespace-cdn',            regex: /href="(https?:\/\/[^"]*squarespace[^"]+\.(?:pdf|docx?|pptx?|xlsx?|zip|mp4|mov|mp3))"/gi },
];

function surveyDir(dir, section) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const findings = [];
  for (const file of files) {
    const post = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    const html = String(post.content || '');
    for (const { name, regex } of PATTERNS) {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(html)) !== null) {
        // Capture link text from the surrounding <a>...</a>
        const after = html.slice(m.index);
        const tm = after.match(/<a [^>]*href="[^"]+"[^>]*>([\s\S]*?)<\/a>/);
        const linkText = tm ? tm[1].replace(/<[^>]+>/g, '').trim() : '';
        const ext = ((m[1].match(/\.([a-z0-9]+)(?:[?#]|$)/i)) || [])[1] || 'unknown';
        findings.push({ section, slug: post.slug, title: post.title, pattern: name, url: m[1], linkText, ext: ext.toLowerCase() });
      }
    }
  }
  return findings;
}

const all = [...surveyDir(IDEAS_DIR, 'ideas'), ...surveyDir(DOCS_DIR, 'docs')];

// Dedupe on (section, slug, url)
const seen = new Set();
const unique = all.filter(f => {
  const k = `${f.section}|${f.slug}|${f.url}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

const bySection = {}, byExt = {}, byPattern = {};
for (const f of unique) {
  bySection[f.section] = (bySection[f.section] || 0) + 1;
  byExt[f.ext]         = (byExt[f.ext]         || 0) + 1;
  byPattern[f.pattern] = (byPattern[f.pattern] || 0) + 1;
}

console.log('═══════════════════════════════════════════════');
console.log('  Attachment survey — read-only inventory');
console.log('═══════════════════════════════════════════════\n');
console.log(`Total attachment links:           ${unique.length}`);
console.log(`Distinct posts containing links:  ${new Set(unique.map(f => `${f.section}|${f.slug}`)).size}\n`);
console.log('By section:');
for (const [k, v] of Object.entries(bySection)) console.log(`  ${k.padEnd(8)} ${v}`);
console.log('\nBy file extension:');
for (const [k, v] of Object.entries(byExt).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(8)} ${v}`);
console.log('\nBy pattern type:');
for (const [k, v] of Object.entries(byPattern)) console.log(`  ${k.padEnd(32)} ${v}`);

const reportPath = path.join(SITE, 'scripts', 'attachment_survey.json');
fs.writeFileSync(reportPath, JSON.stringify({
  summary: { total: unique.length, bySection, byExt, byPattern },
  findings: unique,
}, null, 2));
console.log(`\nFull report saved: ${reportPath}`);

console.log('\nFirst 10 findings:');
unique.slice(0, 10).forEach((f, i) => {
  console.log(`  ${String(i + 1).padStart(2)}. [${f.section}] ${f.slug}`);
  console.log(`       text: "${f.linkText.slice(0, 70)}"`);
  console.log(`       url:  ${f.url}`);
});
