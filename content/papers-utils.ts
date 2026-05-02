import fs from 'fs';
import path from 'path';
import type { Paper } from './paper-types';

const INDEX_FILE = path.join(process.cwd(), 'content', 'papers_index.json');

export function getAllPapers(): Paper[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(raw) as Paper[];
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
