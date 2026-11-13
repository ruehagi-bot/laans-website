"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        {/* Top: thin + gap + thick */}
        <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />
        <div style={{ height: "2px", backgroundColor: "#ffffff" }} />
        <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />

        <header style={{ backgroundColor: "#fff" }}>
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, textDecoration: "none" }} onClick={() => setOpen(false)}>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#1a1a1a", lineHeight: 1 }}>LAANS</span>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#5a5a5a", textTransform: "uppercase", marginTop: "2px" }}>Consulting</span>
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "5px", width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span style={{ display: "block", width: "24px", height: "1.5px", backgroundColor: "#1a1a1a" }} />
              <span style={{ display: "block", width: "24px", height: "1.5px", backgroundColor: "#1a1a1a" }} />
              <span style={{ display: "block", width: "24px", height: "1.5px", backgroundColor: "#1a1a1a" }} />
            </button>
          </div>
        </header>

        {/* Bottom: thick + gap + thin */}
        <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
        <div style={{ height: "2px", backgroundColor: "#ffffff" }} />
        <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />

        {open && (
          <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e7e5e4" }}>
            <nav className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
              <Link href="/reports" className="text-sm text-stone-600 hover:text-black transition-colors" onClick={() => setOpen(false)}>Reports</Link>
              <Link href="/about" className="text-sm text-stone-600 hover:text-black transition-colors" onClick={() => setOpen(false)}>About</Link>
              <Link href="/contact" className="text-sm font-medium text-black hover:text-stone-600 transition-colors" onClick={() => setOpen(false)}>Contact us</Link>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
