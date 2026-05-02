export interface Paper {
  slug: string;
  title: string;
  subtitle: string;
  series: string;
  type: string;
  date: string;        // ISO YYYY-MM-DD
  pages: number;
  core_thesis: string;
  abstract: string;
  pdf: string;         // /papers/<slug>.pdf
  thumb: string;       // /papers/thumbs/<slug>.png
}
