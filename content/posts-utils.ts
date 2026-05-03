import fs from 'fs';
import path from 'path';
import type { Post, PostMeta } from './post-types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const INDEX_FILE = path.join(process.cwd(), 'content', 'posts_index.json');

// Read the index — fast (no full content). Returned newest-first by dateISO,
// so listing pages don't depend on file insertion order.
export function getAllPostMeta(): PostMeta[] {
  if (!fs.existsSync(INDEX_FILE)) return [];
  try {
    const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
    const posts = JSON.parse(raw) as PostMeta[];
    return [...posts].sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));
  } catch {
    return [];
  }
}

// Read a single full post
export function getPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Post;
  } catch {
    return null;
  }
}

// All slugs (for static generation)
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}

// Unique categories
export function getAllCategories(): string[] {
  const posts = getAllPostMeta();
  const cats = new Set<string>();
  posts.forEach((p) => p.categories?.forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}

// Unique tags
export function getAllTags(): string[] {
  const posts = getAllPostMeta();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export const POSTS_PER_PAGE = 20;

export function getPostsByPage(
  page: number,
  category?: string,
  tag?: string
): { posts: PostMeta[]; totalPages: number; total: number } {
  let posts = getAllPostMeta();
  if (category) {
    posts = posts.filter((p) =>
      p.categories?.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }
  if (tag) {
    posts = posts.filter((p) =>
      p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }
  const total = posts.length;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  return { posts: posts.slice(start, start + POSTS_PER_PAGE), totalPages, total };
}

// Related posts — same category, exclude current
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPost(slug);
  if (!current) return [];
  const all = getAllPostMeta();
  return all
    .filter(
      (p) =>
        p.slug !== slug &&
        p.categories?.some((c) => current.categories?.includes(c))
    )
    .slice(0, limit);
}
