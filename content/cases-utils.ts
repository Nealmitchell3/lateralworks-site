import fs from 'fs';
import path from 'path';
import type { Case } from './case-types';

const INDEX_FILE = path.join(process.cwd(), 'content', 'cases_index.json');
const PDF_EXTRACTS_FILE = path.join(process.cwd(), 'content', 'pdf-extracts.json');

let _pdfExtractsCache: Record<string, string> | null = null;
function loadPdfExtracts(): Record<string, string> {
  if (_pdfExtractsCache) return _pdfExtractsCache;
  try {
    const raw = fs.readFileSync(PDF_EXTRACTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as { cases?: Record<string, string> };
    _pdfExtractsCache = parsed.cases ?? {};
  } catch {
    _pdfExtractsCache = {};
  }
  return _pdfExtractsCache;
}

export function getPdfText(slug: string): string {
  return loadPdfExtracts()[slug] ?? '';
}

export function getAllCases(): Case[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    const cases = JSON.parse(raw) as Case[];
    return [...cases].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch {
    return [];
  }
}

export function getAllCasePractices(): string[] {
  const cases = getAllCases();
  const set = new Set<string>();
  cases.forEach(c => c.practice && set.add(c.practice));
  return Array.from(set).sort();
}

export function getCasesByPractice(practice?: string): Case[] {
  const cases = getAllCases();
  if (!practice) return cases;
  return cases.filter(c =>
    c.practice?.toLowerCase() === practice.toLowerCase()
  );
}

export function getRecentCases(n: number): Case[] {
  return getAllCases().slice(0, n);
}

export function formatCaseDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
}

// ── PDF body → HTML. Mirrors papers-utils formatPaperBody, tuned for the
//    magazine-style case layout: zero-padded "01".."10" section openers
//    (avoids un-padded table rows like "1 Leadership"), optional em-dash
//    before the section title. ──────────────────────────────────────────
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripFootnotes(s: string): string {
  return s.replace(/\s*\[\d+(?:\s*,\s*\d+)*\]/g, "");
}

export function formatCaseBody(raw: string): string {
  if (!raw) return "";

  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => {
    if (/^©\s*\d{4}\s+lateralworks\s+Page\s+\d+/i.test(l)) return false;
    if (/^›/.test(l)) return false;
    if (/^--\s*\d+\s+of\s+\d+\s*--$/.test(l)) return false;
    if (/^(Prepared by|Date)\b/i.test(l)) return false;
    if (/^#/.test(l)) return false;              // mangled table-header artifact
    if (/^Sources$/i.test(l)) return false;      // two-tier kicker above References
    return true;
  });

  let startIdx = lines.findIndex((l) => /^(abstract|overview)$/i.test(l));
  if (startIdx === -1) startIdx = lines.findIndex((l) => /^(0[1-9]|10)\s+[—–]\s*[A-Z]/.test(l));
  if (startIdx === -1) startIdx = 0;
  let refIdx = lines.findIndex((l, i) => i > startIdx && /^references$/i.test(l));
  if (refIdx === -1) refIdx = lines.length;

  const body = lines.slice(startIdx, refIdx);
  const refs = lines.slice(refIdx + 1);

  const HEAD_WORD = /^(abstract|overview|introduction|conclusion|summary|references|appendix)$/i;
  const isOpener = (l: string) => {
    if (/[.!?]/.test(l)) return false;
    if (l.length <= 70 && /^(0[1-9]|10)\s+[—–]\s*[A-Z]/.test(l)) return true;       // em-dash style, any 01–10
    if (l.length <= 30 && /^(0[1-9]|10)\s+Section\s+\w+$/i.test(l)) return true;    // "NN Section ten" opener page (Rubicon)
    if (l.length <= 30 && /^0[1-9]\s+[A-Z]/.test(l)) return true;                   // short kicker, 01–09 (fab-8)
    return false;
  };
  const isTitleLine = (l: string) =>
    l.length > 0 && l.length <= 45 && !/[.!?]/.test(l) && !HEAD_WORD.test(l) && !isOpener(l);

  const out: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      const text = stripFootnotes(para.join(" ").replace(/\s+/g, " ").trim());
      if (text && !/^(Figure|Table)\s+\d+[.:]/.test(text)) out.push(`<p>${escapeHtml(text)}</p>`);
      para = [];
    }
  };

  for (let i = 0; i < body.length; i++) {
    const line = body[i];
    if (line === "") { flush(); continue; }
    if (HEAD_WORD.test(line)) {
      flush();
      out.push(`<h2>${escapeHtml(line.charAt(0).toUpperCase() + line.slice(1).toLowerCase())}</h2>`);
      continue;
    }
    if (isOpener(line)) {
      flush();
      let kicker = line.replace(/^(0[1-9]|10)\s*[—–-]?\s*/, "").trim();
      if (/^section\s+\w+$/i.test(kicker)) kicker = "";   // generic "Section one" adds nothing
      const titleParts: string[] = [];
      let j = i + 1;
      while (j < body.length && isTitleLine(body[j])) { titleParts.push(body[j]); j++; }
      const title = titleParts.join(" ").replace(/\s+/g, " ").trim();
      const heading = kicker && title ? `${kicker} — ${title}` : (kicker || title);
      if (heading) out.push(`<h2>${escapeHtml(heading)}</h2>`);
      i = j - 1;
      continue;
    }
    para.push(line);
  }
  flush();

  if (refs.length) {
    const joined = refs.join(" ").replace(/\s+/g, " ").trim();
    const entries = joined.split(/(?=\[\d+\]\s)/).map((s) => s.trim()).filter(Boolean);
    if (entries.length) {
      out.push("<h2>References</h2>");
      out.push("<ol>");
      for (const e of entries) out.push(`<li>${escapeHtml(e.replace(/^\[\d+\]\s*/, "").trim())}</li>`);
      out.push("</ol>");
    }
  }

  const deduped: string[] = [];
  for (const el of out) {
    if (el.startsWith("<h2>") && deduped.length && deduped[deduped.length - 1] === el) continue;
    deduped.push(el);
  }
  return deduped.join("\n");
}

export function getCase(slug: string): (Case & { contentHtml: string }) | null {
  const c = getAllCases().find((x) => x.slug === slug);
  if (!c) return null;
  const raw = getPdfText(slug) || "";
  return { ...c, contentHtml: formatCaseBody(typeof raw === "string" ? raw : String(raw || "")) };
}

export function getRelatedCases(slug: string, limit = 3): Case[] {
  const all = getAllCases();
  const cur = all.find((c) => c.slug === slug);
  if (!cur) return [];
  const others = all.filter((c) => c.slug !== slug);
  const byDate = (a: Case, b: Case) => (b.date || "").localeCompare(a.date || "");
  const same = others.filter((c) => c.practice === cur.practice).sort(byDate);
  const rest = others.filter((c) => c.practice !== cur.practice).sort(byDate);
  return [...same, ...rest].slice(0, limit);
}
