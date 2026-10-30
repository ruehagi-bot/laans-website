import Link from "next/link";
import type { Report } from "@/lib/notion";

export default function ReportCard({ report }: { report: Report }) {
  return (
    <article className="group">
      <Link href={`/reports/${report.slug}`} className="block">
        <div className="flex flex-wrap gap-2 mb-3">
          {report.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs font-medium tracking-wide uppercase text-stone-500 border border-stone-200 px-2 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
        <h2 className="font-serif text-2xl font-bold text-black group-hover:underline underline-offset-4 decoration-stone-300 mb-2 leading-snug">
          {report.title}
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed mb-4 max-w-xl">
          {report.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-stone-400">
          {report.publishedAt && (
            <span>
              {new Date(report.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {report.readingTime && <span>{report.readingTime} min read</span>}
          {report.author && <span>{report.author}</span>}
          <span className="text-xs font-medium text-black bg-[#F0EAD6] px-2 py-0.5">
            Read report →
          </span>
        </div>
      </Link>
    </article>
  );
}
