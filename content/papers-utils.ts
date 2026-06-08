import fs from 'fs';
import path from 'path';
import type { Paper } from './paper-types';

const INDEX_FILE = path.join(process.cwd(), 'content', 'papers_index.json');
const PDF_EXTRACTS_FILE = path.join(process.cwd(), 'content', 'pdf-extracts.json');

let _pdfExtractsCache: Record<string, string> | null = null;
function loadPdfExtracts(): Record<string, string> {
  if (_pdfExtractsCache) return _pdfExtractsCache;
  try {
    const raw = fs.readFileSync(PDF_EXTRACTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as { papers?: Record<string, string> };
    _pdfExtractsCache = parsed.papers ?? {};
  } catch {
    _pdfExtractsCache = {};
  }
  return _pdfExtractsCache;
}

export function getPdfText(slug: string): string {
  return loadPdfExtracts()[slug] ?? '';
}

export function getAllPapers(): Paper[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    const papers = JSON.parse(raw) as Paper[];
    return [...papers].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch {
    return [];
  }
}

export function getAllSeries(): string[] {
  const papers = getAllPapers();
  const set = new Set<string>();
  papers.forEach(p => p.series && set.add(p.series));
  return Array.from(set).sort();
}

export function getPapersBySeries(series?: string): Paper[] {
  const papers = getAllPapers();
  if (!series) return papers;
  return papers.filter(p =>
    p.series?.toLowerCase() === series.toLowerCase()
  );
}

// Format ISO date to "April 27, 2026"
export function formatPaperDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Strip inline citation markers: [1], [5, 6], [9, 10]
function stripFootnotes(s: string): string {
  return s.replace(/\s*\[\d+(?:\s*,\s*\d+)*\]/g, "");
}

export function formatPaperBody(raw: string): string {
  if (!raw) return "";

  // Lines, trimmed, page-chrome removed (blank lines kept = page-boundary breaks).
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => {
    if (/^©\s*\d{4}\s+lateralworks\s+Page\s+\d+/i.test(l)) return false;
    if (/^›/.test(l)) return false;
    if (/^--\s*\d+\s+of\s+\d+\s*--$/.test(l)) return false;
    if (/^(Prepared by|Date)\b/i.test(l)) return false;
    return true;
  });

  // Body start (real "Abstract"; fallback to first non-TOC numbered opener) + References.
  let startIdx = lines.findIndex((l) => /^abstract$/i.test(l));
  if (startIdx === -1) startIdx = lines.findIndex((l) => l.length <= 30 && /^\d{1,2}\s+[A-Z]/.test(l) && !/\d$/.test(l));
  if (startIdx === -1) startIdx = 0;
  let refIdx = lines.findIndex((l, i) => i > startIdx && /^references$/i.test(l));
  if (refIdx === -1) refIdx = lines.length;

  const body = lines.slice(startIdx, refIdx);
  const refs = lines.slice(refIdx + 1);

  const HEAD_WORD = /^(abstract|overview|introduction|conclusion|summary|appendix)$/i;
  const isOpener = (l: string) => l.length <= 30 && /^\d{1,2}\s+[A-Z]/.test(l) && !/[.!?]/.test(l);
  const isTitleLine = (l: string) =>
    l.length > 0 && l.length <= 45 && !/[.!?]/.test(l) && !HEAD_WORD.test(l) && !isOpener(l);

  const out: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      const text = stripFootnotes(para.join(" ").replace(/\s+/g, " ").trim());
      if (text) out.push(`<p>${escapeHtml(text)}</p>`);
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
      const kicker = line.replace(/^\d{1,2}\s+/, "").trim();
      const titleParts: string[] = [];
      let j = i + 1;
      while (j < body.length && isTitleLine(body[j])) { titleParts.push(body[j]); j++; }
      const title = titleParts.join(" ").replace(/\s+/g, " ").trim();
      out.push(`<h2>${escapeHtml(title ? `${kicker} — ${title}` : kicker)}</h2>`);
      i = j - 1;
      continue;
    }
    para.push(line);
  }
  flush();

  // References → clean numbered list (inline [N] already stripped from body).
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

  return out.join("\n");
}

export function getPaper(slug: string): (Paper & { contentHtml: string }) | null {
  const paper = getAllPapers().find((p) => p.slug === slug);
  if (!paper) return null;
  const raw = getPdfText(slug) || "";
  return { ...paper, contentHtml: formatPaperBody(typeof raw === "string" ? raw : String(raw || "")) };
}

export function getRelatedPapers(slug: string, limit = 3): Paper[] {
  const all = getAllPapers();
  const cur = all.find((p) => p.slug === slug);
  if (!cur) return [];
  const others = all.filter((p) => p.slug !== slug);
  const byDate = (a: Paper, b: Paper) => (b.date || "").localeCompare(a.date || "");
  const same = others.filter((p) => p.series === cur.series).sort(byDate);
  const rest = others.filter((p) => p.series !== cur.series).sort(byDate);
  return [...same, ...rest].slice(0, limit);
}
