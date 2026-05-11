import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How lateralworks collects, uses, and protects your information.",
};

const html = fs.readFileSync(
  path.join(process.cwd(), "content/legal/privacy.html"),
  "utf-8"
);

export default function PrivacyPage() {
  return (
    <article className="legal-content max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
