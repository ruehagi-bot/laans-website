import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllReportSlugs, getReportBySlug } from "@/lib/notion";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllReportSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const report = await getReportBySlug(params.slug);
  if (!report) return {};
  return {
    title: `${report.title} — LAANS Consulting`,
    description: report.excerpt,
  };
}

export default async function ReportPage({ params }: Props) {
  const report = await getReportBySlug(params.slug);
  if (!report) notFound();

  const published = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="mb-10 text-xs text-stone-400">
        <Link href="/reports" className="hover:text-black transition-colors">
          Reports
        </Link>
        <span className="mx-2">›</span>
        <span className="text-stone-600">{report.title}</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mb-10 pb-10 border-b border-stone-200">
        {/* Topic tags */}
        {report.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {report.topics.map((t) => (
              <span
                key={t}
                className="text-xs font-medium tracking-wide uppercase text-stone-500 border border-stone-200 px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-black leading-tight mb-4">
          {report.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-stone-400 mb-8">
          {published && <span>{published}</span>}
          {report.readingTime && <span>{report.readingTime} min read</span>}
          {report.author && <span>{report.author}</span>}
          <span className="text-xs font-medium text-stone-600 bg-[#F0EAD6] px-2 py-0.5">
            LAANS Consulting
          </span>
        </div>

        {/* Gold rule */}
        <div className="w-12 h-px bg-[#C9B26A] mb-8" />

        {/* Excerpt */}
        <p className="font-serif text-lg md:text-xl text-stone-700 leading-relaxed">
          {report.excerpt}
        </p>
      </header>

      {/* ── Download CTA ───────────────────────────────────────────────────── */}
      <section className="bg-stone-50 border border-stone-200 p-8 mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
          Full Report
        </p>
        <p className="text-stone-600 leading-relaxed mb-6">
          The complete report is available as a PDF. It includes the full
          analysis, all sections, references, and data.
        </p>

        {report.pdfUrl ? (
          <a
            href={report.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white text-sm font-medium px-6 py-3 hover:bg-stone-800 transition-colors"
          >
            {/* Download icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download report (PDF)
          </a>
        ) : (
          <p className="text-sm text-stone-400 italic">
            PDF coming soon — check back shortly.
          </p>
        )}
      </section>

      {/* ── Back link ──────────────────────────────────────────────────────── */}
      <Link
        href="/reports"
        className="text-sm text-stone-500 hover:text-black transition-colors"
      >
        ← All reports
      </Link>
    </main>
  );
}
