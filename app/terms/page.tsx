import fs from "fs";
import path from "path";
import { siteOpenGraphDefaults } from "@/content/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using lateralworks Services.",
  alternates: { canonical: "/terms" },
  openGraph: { ...siteOpenGraphDefaults, url: "/terms" },
};

const html = fs.readFileSync(
  path.join(process.cwd(), "content/legal/terms.html"),
  "utf-8"
);

export default function TermsPage() {
  return (
    <article className="legal-content max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
