import fs from 'fs';
import path from 'path';
import type { Doc, DocMeta } from './doc-types';

const DOCS_DIR = path.join(process.cwd(), 'content', 'docs');
const INDEX_FILE = path.join(process.cwd(), 'content', 'docs_index.json');

// Returned newest-first by dateISO, so listing pages don't depend on file
// insertion order.
export function getAllDocMeta(): DocMeta[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    const docs = JSON.parse(raw) as DocMeta[];
    return [...docs].sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));
  } catch {
    return [];
  }
}

export function getDoc(slug: string): Doc | null {
  const filePath = path.join(DOCS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Doc;
  } catch {
    return null;
  }
}

export function getAllDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

export function getAllDocCategories(): string[] {
  const docs = getAllDocMeta();
  const cats = new Set<string>();
  docs.forEach(d => d.categories?.forEach(c => cats.add(c)));
  return Array.from(cats).sort();
}

export function getAllDocTags(): string[] {
  const docs = getAllDocMeta();
  const tags = new Set<string>();
  docs.forEach(d => d.tags?.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

export const DOCS_PER_PAGE = 20;

export function getDocsByPage(
  page: number,
  category?: string,
  tag?: string
): { docs: DocMeta[]; totalPages: number; total: number } {
  let docs = getAllDocMeta();
  if (category) {
    docs = docs.filter(d =>
      d.categories?.some(c => c.toLowerCase() === category.toLowerCase())
    );
  }
  if (tag) {
    docs = docs.filter(d =>
      d.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
  const total = docs.length;
  const totalPages = Math.ceil(total / DOCS_PER_PAGE);
  const start = (page - 1) * DOCS_PER_PAGE;
  return { docs: docs.slice(start, start + DOCS_PER_PAGE), totalPages, total };
}

export function getRelatedDocs(slug: string, limit = 3): DocMeta[] {
  const current = getDoc(slug);
  if (!current) return [];
  const all = getAllDocMeta();
  return all
    .filter(d =>
      d.slug !== slug &&
      d.categories?.some(c => current.categories?.includes(c))
    )
    .slice(0, limit);
}
