"use client";

import ReactMarkdown from "react-markdown";

export default function ReportBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-stone prose-lg max-w-none
      prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-3
      prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-base
      prose-blockquote:border-l-4 prose-blockquote:border-[#F0EAD6] prose-blockquote:pl-5 prose-blockquote:not-italic prose-blockquote:text-stone-600
      prose-strong:text-black prose-strong:font-semibold
      prose-a:text-black prose-a:underline prose-a:underline-offset-2
      prose-ol:text-stone-700 prose-ul:text-stone-700
      prose-hr:border-stone-200">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
