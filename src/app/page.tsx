import Link from "next/link";
import { getPublishedReports } from "@/lib/notion";
import ReportCard from "@/components/ReportCard";

export const revalidate = 3600;

export default async function Home() {
  // Fetch latest reports for the feed below the fold; fall back gracefully
  let reports: Awaited<ReturnType<typeof getPublishedReports>> = [];
  try {
    reports = await getPublishedReports();
  } catch {
    // Notion env vars not set yet (local dev without .env.local)
  }

  const latest = reports[0] ?? null;

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-stone-200 overflow-hidden">
        {/* Map silhouette — CSS mask, no external image */}
        <div
          aria-hidden
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 90% at 80% 50%, #E8E8D8 0%, transparent 70%)",
            opacity: 0.5,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-40">
          {/* Motto — large italic serif, the brand's voice */}
          <p className="font-serif text-3xl md:text-5xl italic text-black leading-tight mb-6 max-w-xl text-balance">
            The world, the right way up.
          </p>

          {/* Gold rule — matches logo */}
          <div className="w-12 h-px bg-[#C9B26A] mb-8" />

          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
            Global South Research & Policy
          </p>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-xl mb-10">
            Six of nine planetary boundaries have been transgressed. The regions
            least responsible bear the severest exposure. LAANS Consulting
            documents the inequity and charts evidence-based pathways forward.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 hover:bg-stone-800 transition-colors"
            >
              Read our reports
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#F0EAD6] text-black text-sm font-medium px-6 py-3 hover:bg-[#DDD5BB] transition-colors"
            >
              About LAANS
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MISSION STRIP ────────────────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
              Our Mission
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug text-black text-balance">
              Sustainability that adds no further debt to the Global North.
            </h2>
          </div>
          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              LAANS Consulting is a team of Global South–based specialists in
              environmental management, international law, business management,
              psychology, and education — working across English, Arabic, French,
              and Somali.
            </p>
            <p>
              We define sustainability as growth that replicates none of the
              industrial, environmental, or public-health failures of the North.
              Our work centres the voices, priorities, and lived experience of
              communities most exposed to global ecological and economic crises.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FEATURED CALLOUT — planetary boundaries snapshot ─────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="border-l-4 border-[#F0EAD6] pl-6 md:pl-8 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
              The Science
            </p>
            <p className="font-serif text-xl md:text-2xl font-semibold leading-snug text-black max-w-3xl mb-4">
              High-income nations (16% of global population) are responsible for
              74% of excess resource extraction beyond sustainable levels — while
              low-income nations bear 85% of the negative health impacts.
            </p>
            <p className="text-sm text-stone-500">
              Planetary Boundaries framework — Rockström et al., 2009; Steffen
              et al., 2015; Richardson et al., 2023
            </p>
          </div>
        </div>
      </section>

      {/* ─── REPORTS FEED ─────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-stone-200 pb-4">
            <h2 className="font-serif text-2xl font-bold text-black">
              Latest Research
            </h2>
            <Link
              href="/reports"
              className="text-sm text-stone-500 hover:text-black transition-colors"
            >
              All reports →
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            /* Placeholder shown when Notion is not yet wired */
            <div className="border border-dashed border-stone-200 rounded p-12 text-center text-stone-400 text-sm">
              Reports will appear here once the Notion database is connected.
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-stone-50 border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif font-bold text-black text-sm tracking-tight">
              LAANS{" "}
              <span className="font-normal text-stone-500 tracking-widest text-xs uppercase">
                Consulting
              </span>
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Research and policy for the Global South.
            </p>
          </div>
          <nav className="flex gap-6 text-xs text-stone-500">
            <Link href="/reports" className="hover:text-black transition-colors">
              Reports
            </Link>
            <Link href="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-black transition-colors">
              Contact
            </Link>
          </nav>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} LAANS Consulting
          </p>
        </div>
      </footer>
    </>
  );
}
