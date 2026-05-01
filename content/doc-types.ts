export interface DocMeta {
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

export interface Doc extends DocMeta {
  url: string;
  content: string;
  images: { src: string; alt: string }[];
  externalLinks: { text: string; href: string }[];
}
