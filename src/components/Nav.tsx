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
          <div className="max-w-5xl mx-auto px-10 h-22 flex items-center justify-between" style={{ height: "88px", paddingLeft: "16px", paddingRight: "16px" }}>
            <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, textDecoration: "none" }} onClick={() => setOpen(false)}>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.75rem", letterSpacing: "0.04em", color: "#1a1a1a", lineHeight: 1 }}>LAANS</span>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.3em", color: "#5a5a5a", textTransform: "uppercase", marginTop: "3px" }}>Consulting</span>
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "7px", width: "48px", height: "48px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
              <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
              <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
            </button>
          </div>
        </header>

        {/* Bottom: thick + gap + thin */}
        <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
        <div style={{ height: "2px", backgroundColor: "#ffffff" }} />
        <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />

        {open && (
          <div style={{ backgroundColor: "#fff" }}>
            <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "36px", padding: "60px 24px" }}>
              <Link href="/reports" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2rem", color: "#1a1a1a", textDecoration: "none" }}>Reports</Link>
              <Link href="/about" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2rem", color: "#1a1a1a", textDecoration: "none" }}>About</Link>
              <Link href="/contact" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2rem", color: "#1a1a1a", textDecoration: "none" }}>Contact us</Link>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
