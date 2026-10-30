import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — LAANS Consulting",
  description:
    "LAANS Consulting is a multidisciplinary collective of experts established in the Global South, attuned to its realities, and committed to its future.",
};

export default function AboutPage() {
  return (
    <>
      {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-5">
            About
          </p>
          {/* Motto in the brand voice — large italic serif */}
          <h1 className="font-serif text-3xl md:text-5xl italic leading-tight text-black max-w-2xl text-balance mb-4">
            The world, the right way up.
          </h1>
          {/* Gold rule — echoes logo */}
          <div className="w-12 h-px bg-[#C9B26A] mb-6" />
          <p className="text-lg text-stone-500 max-w-xl leading-relaxed">
            A multidisciplinary collective of experts established in the Global
            South, attuned to its realities, and committed to its future.
          </p>
        </div>
      </section>

      {/* ─── LOGO + OPENING ───────────────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/laans-logo.png"
              alt="LAANS Consulting"
              width={400}
              height={237}
              className="w-full max-w-xs md:max-w-sm h-auto"
              priority
            />
          </div>
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              LAANS Consulting is a multidisciplinary collective of experts
              established in the Global South, attuned to its realities, and
              committed to its future.
            </p>
            <p>
              The Global South has a profound opportunity to leapfrog the
              industrial, economic, environmental, and public health crises the
              Global North is now struggling to mitigate — not by repeating its
              path, but by forging its own.
            </p>
          </div>
        </div>
      </section>

      {/* ─── APPROACH ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-6">
              Our Approach
            </p>

            <div className="border-l-4 border-[#F0EAD6] pl-6 mb-10">
              <p className="font-serif text-xl md:text-2xl font-semibold leading-snug text-black">
                We approach problems through the lens of adaptive management: a
                structured, iterative process for making sound decisions when
                the path ahead is uncertain.
              </p>
            </div>

            <div className="space-y-5 text-stone-600 leading-relaxed text-[1.0625rem]">
              <p>
                At LAANS Consulting, constraints are not obstacles — they are
                the starting point for smarter solutions. Drawing on experience
                with governments, multinational companies, development agencies,
                and NGOs across the Global South as well as Western institutions,
                we design policies, strategies, and training programmes that work
                with the resources available and deliver results that last.
              </p>
              <p>
                Our goal is simple: to prevent tomorrow's crises today and build
                institutions strong enough to stand on their own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-8">
            The Team
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Disciplines */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-black mb-4">
                Expertise
              </h3>
              <p className="text-stone-600 leading-relaxed mb-5">
                The LAANS team of seasoned professionals brings decades of
                experience across five core disciplines — allowing us to address
                both the technical and the human dimensions of development.
              </p>
              <ul className="space-y-2">
                {[
                  "Environmental Management",
                  "International Law",
                  "Business Management",
                  "Psychology & Education",
                ].map((d) => (
                  <li key={d} className="flex items-center gap-3 text-stone-700 text-sm">
                    <span
                      aria-hidden
                      className="inline-block w-2 h-2 bg-[#C9B26A] flex-shrink-0"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Work areas */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-black mb-4">
                What We Do
              </h3>
              <p className="text-stone-600 leading-relaxed mb-5">
                Our work spans the full development cycle, from strategy and
                policy design through to implementation and evaluation.
              </p>
              <ul className="space-y-2">
                {[
                  "Institutional capacity building",
                  "Curriculum and training design",
                  "Community engagement",
                  "Psychosocial approaches to change",
                ].map((d) => (
                  <li key={d} className="flex items-center gap-3 text-stone-700 text-sm">
                    <span
                      aria-hidden
                      className="inline-block w-2 h-2 bg-[#C9B26A] flex-shrink-0"
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MISSION STATEMENT ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-6">
              Our Commitment
            </p>
            <p className="font-serif text-xl md:text-2xl font-semibold leading-snug text-black mb-8 text-balance">
              We partner with governments, organisations, and communities to
              design and implement development pathways that advance the
              economic, social, legal, cultural, and environmental interests of
              the Global South — without incurring further debt to the Global
              North, whether financial, ecological, or social.
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-px bg-[#C9B26A]" />
              <p className="font-serif text-lg italic text-stone-500">
                The world, the right way up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
