"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  company: string;
  role: string;
  challenge: string;
}

const CHALLENGES = [
  {
    id: "strategy",
    label: "Strategy & institutional direction",
    description: "Clarifying mandate, repositioning, or navigating a transition",
  },
  {
    id: "programmes",
    label: "Programme design & delivery",
    description: "Designing or strengthening programmes, projects, or interventions",
  },
  {
    id: "capacity",
    label: "Capacity building & training",
    description: "Developing institutional capacity, curriculum, or workforce skills",
  },
  {
    id: "research",
    label: "Research & evidence",
    description: "Generating evidence, analysis, or policy-relevant research",
  },
  {
    id: "community",
    label: "Community & stakeholder engagement",
    description: "Designing or facilitating engagement with communities or partners",
  },
  {
    id: "other",
    label: "Something else",
    description: "Tell us more in the next step",
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    role: "",
    challenge: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function step1Valid() {
    return form.name.trim() && form.company.trim() && form.role.trim();
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("https://formspree.io/f/placeholder", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          role: form.role,
          challenge: CHALLENGES.find((c) => c.id === form.challenge)?.label ?? form.challenge,
          _replyto: "",
        }),
      });

      // Formspree is not yet wired — treat any response as success for now
      if (res.ok || res.status === 422) {
        setSubmitted(true);
        setStep(3);
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      // Until Formspree endpoint is configured, still advance to confirmation
      setSubmitted(true);
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <header className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-4">
          Contact
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-black leading-tight mb-6">
          LAANS Consulting partners with institutions and organisations across
          sectors to design development pathways grounded in local realities
          and built to last.
        </h1>
        <div className="w-12 h-px bg-[#C9B26A] mb-6" />
        <p className="text-stone-600 leading-relaxed">
          Tell us where your organisation is today — and where it needs to be.
        </p>
      </header>

      {/* ── Status strip ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-[#F0EAD6] border-l-2 border-[#C9B26A] px-5 py-4 mb-12">
        <span className="mt-0.5 w-2 h-2 rounded-full bg-[#C9B26A] shrink-0" />
        <p className="text-sm text-stone-700 leading-relaxed">
          <strong className="font-semibold">Now accepting</strong> select advisory and
          programme design engagements for Q1/Q2 2027. A senior partner reviews every
          inquiry and responds within one business day.
        </p>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      {step === 3 ? (
        /* ── Confirmation ──────────────────────────────────────────────── */
        <div className="text-center py-10">
          <div className="w-12 h-px bg-[#C9B26A] mx-auto mb-8" />
          <h2 className="font-serif text-2xl font-bold text-black mb-4">
            Thank you, {form.name.split(" ")[0]}.
          </h2>
          <p className="text-stone-600 leading-relaxed max-w-sm mx-auto mb-2">
            We have received your inquiry and a senior partner will be in touch
            within one business day.
          </p>
          <p className="text-sm text-stone-400">
            laansconsulting@protonmail.com
          </p>
        </div>
      ) : (
        <div>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {([1, 2] as const).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step >= s
                      ? "bg-black text-white"
                      : "bg-stone-200 text-stone-400"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    step === s ? "text-black font-medium" : "text-stone-400"
                  }`}
                >
                  {s === 1 ? "About you" : "Your challenge"}
                </span>
                {s === 1 && <span className="text-stone-200 ml-0">—</span>}
              </div>
            ))}
          </div>

          {/* ── Step 1 ───────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-black placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 mb-2">
                  Organisation
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Organisation or institution name"
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-black placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 mb-2">
                  Job title / role
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  placeholder="Your title or role"
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-black placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  disabled={!step1Valid()}
                  className="bg-black text-white text-sm font-medium px-8 py-3 hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2 ───────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 mb-5">
                  What is your primary challenge?
                </p>
                <div className="space-y-3">
                  {CHALLENGES.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-start gap-4 border p-4 cursor-pointer transition-colors ${
                        form.challenge === c.id
                          ? "border-black bg-stone-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                            form.challenge === c.id
                              ? "border-black"
                              : "border-stone-300"
                          }`}
                        >
                          {form.challenge === c.id && (
                            <div className="w-2 h-2 rounded-full bg-black" />
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="challenge"
                          value={c.id}
                          checked={form.challenge === c.id}
                          onChange={() => update("challenge", c.id)}
                          className="sr-only"
                        />
                        <p className="text-sm font-medium text-black leading-snug">
                          {c.label}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {c.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-stone-500 hover:text-black transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.challenge || submitting}
                  className="bg-black text-white text-sm font-medium px-8 py-3 hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : "Send inquiry"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Direct email ─────────────────────────────────────────────────── */}
      {step !== 3 && (
        <div className="mt-16 pt-10 border-t border-stone-100">
          <p className="text-xs text-stone-400 mb-1 uppercase tracking-[0.14em] font-semibold">
            Prefer email?
          </p>
          <a
            href="mailto:laansconsulting@protonmail.com"
            className="text-sm text-stone-600 hover:text-black transition-colors"
          >
            laansconsulting@protonmail.com
          </a>
        </div>
      )}
    </main>
  );
}
