export interface Case {
  slug: string;
  title: string;
  subtitle: string;
  practice: string;
  type: string;
  date: string;          // ISO YYYY-MM-DD
  sector: string;        // e.g. "Semiconductor / AI data-center"
  engagement?: string;
  outcome?: string;
  pages: number;
  core_thesis: string;
  abstract: string;
  pdf: string;           // /cases/<slug>.pdf
  thumb: string;         // /cases/thumbs/<slug>.png
}
