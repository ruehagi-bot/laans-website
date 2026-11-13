"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span style={{ fontFamily: "var(--font-gloock)", fontSize: "1rem", letterSpacing: "0.08em", color: "#1a1a1a" }}>
            LAANS
          </span>
          <span style={{ fontFamily: "var(--font-gloock)", fontSize: "1rem", letterSpacing: "0.08em", color: "#5a5a5a", textTransform: "uppercase" }}>
            Consulting
          </span>
        </Link>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="flex flex-col justify-center items-center gap-[5px] w-8 h-8"
        >
          <span className="block w-6 h-px bg-stone-800" />
          <span className="block w-6 h-px bg-stone-800" />
          <span className="block w-6 h-px bg-stone-800" />
        </button>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="bg-white border-b border-stone-200">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link href="/reports" className="text-sm text-stone-600 hover:text-black transition-colors" onClick={() => setOpen(false)}>
              Reports
            </Link>
            <Link href="/about" className="text-sm text-stone-600 hover:text-black transition-colors" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-black hover:text-stone-600 transition-colors" onClick={() => setOpen(false)}>
              Contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
