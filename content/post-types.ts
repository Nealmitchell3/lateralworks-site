export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  author: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  imageCount: number;
}

export interface Post extends PostMeta {
  url: string;
  content: string;
  images: { src: string; alt: string }[];
  externalLinks: { text: string; href: string }[];
}
