export interface Case {
  slug: string;
  title: string;
  subtitle: string;
  series: string;
  type: string;
  date: string;          // ISO YYYY-MM-DD
  sector: string;        // e.g. "Semiconductor / AI data-center"
  pages: number;
  core_thesis: string;
  abstract: string;
  pdf: string;           // /cases/<slug>.pdf
  thumb: string;         // /cases/thumbs/<slug>.png
}
