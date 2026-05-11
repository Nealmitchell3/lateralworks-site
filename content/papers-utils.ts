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
