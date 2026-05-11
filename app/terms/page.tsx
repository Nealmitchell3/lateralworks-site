import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using lateralworks Services.",
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
