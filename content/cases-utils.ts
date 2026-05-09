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
