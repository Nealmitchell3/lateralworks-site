import fs from 'fs';
import path from 'path';
import type { Case } from './case-types';

const INDEX_FILE = path.join(process.cwd(), 'content', 'cases_index.json');

export function getAllCases(): Case[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    return JSON.parse(raw) as Case[];
  } catch {
    return [];
  }
}

export function getAllCaseSeries(): string[] {
  const cases = getAllCases();
  const set = new Set<string>();
  cases.forEach(c => c.series && set.add(c.series));
  return Array.from(set).sort();
}

export function getCasesBySeries(series?: string): Case[] {
  const cases = getAllCases();
  if (!series) return cases;
  return cases.filter(c =>
    c.series?.toLowerCase() === series.toLowerCase()
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
