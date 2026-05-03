#!/usr/bin/env node
/**
 * Empty-date survey.
 *
 * Scans every post in content/ideas (or content/posts) and content/docs
 * looking for posts where the date field is empty/missing.
 *
 * Read-only. Produces scripts/empty_dates_survey.json plus console summary.
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

function isEmpty(v) {
  return v === undefined || v === null || v === '' || (typeof v === 'string' && v.trim() === '');
}

function scanDir(dir, section) {
  if (!fs.existsSync(dir)) return [];
  const findings = [];
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const post = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
    const dateEmpty    = isEmpty(post.date);
    const dateISOEmpty = isEmpty(post.dateISO);
    if (!dateEmpty && !dateISOEmpty) continue;
    findings.push({
      section,
      slug: post.slug,
      title: post.title,
      url: post.url || null,
      date: post.date,
      dateISO: post.dateISO,
      dateEmpty,
      dateISOEmpty,
    });
  }
  return findings;
}

const ideas = scanDir(IDEAS_DIR, 'ideas');
const docs  = scanDir(DOCS_DIR,  'docs');
const all   = [...ideas, ...docs];

console.log('═══════════════════════════════════════════════');
console.log('  Empty-date survey');
console.log('═══════════════════════════════════════════════\n');
console.log(`Posts with empty/missing date or dateISO: ${all.length}`);
console.log(`  ideas: ${ideas.length}`);
console.log(`  docs:  ${docs.length}\n`);

if (all.length > 0) {
  console.log('Findings:');
  all.forEach((f, i) => {
    console.log(`\n  ${i + 1}. [${f.section}] ${f.slug}`);
    console.log(`      title:       ${f.title}`);
    console.log(`      url:         ${f.url || '(none)'}`);
    console.log(`      date:        ${JSON.stringify(f.date)}${f.dateEmpty ? '   ← EMPTY' : ''}`);
    console.log(`      dateISO:     ${JSON.stringify(f.dateISO)}${f.dateISOEmpty ? '   ← EMPTY' : ''}`);
  });
}

fs.writeFileSync(
  path.join(SITE, 'scripts', 'empty_dates_survey.json'),
  JSON.stringify({ summary: { total: all.length, ideas: ideas.length, docs: docs.length }, findings: all }, null, 2),
);
console.log('\nReport saved: scripts/empty_dates_survey.json');
