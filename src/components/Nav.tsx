"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Full-screen overlay menu */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "#ebebeb", display: "flex", flexDirection: "column" }}>
          {/* Top bar inside overlay */}
          <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />
          <div style={{ height: "2px", backgroundColor: "#ebebeb" }} />
          <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
          <div style={{ height: "88px", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ebebeb" }}>
            <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, textDecoration: "none" }} onClick={() => setOpen(false)}>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.75rem", letterSpacing: "0.04em", color: "#1a1a1a", lineHeight: 1 }}>LAANS</span>
              <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.3em", color: "#5a5a5a", textTransform: "uppercase", marginTop: "3px" }}>Consulting</span>
            </Link>
            {/* ✕ close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "2rem", color: "#1a1a1a", lineHeight: 1 }}>✕</span>
            </button>
          </div>
          <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
          <div style={{ height: "2px", backgroundColor: "#ebebeb" }} />
          <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />
          {/* Centered links */}
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "36px" }}>
            <Link href="/reports" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.5rem", color: "#1a1a1a", textDecoration: "none" }}>Reports</Link>
            <Link href="/about" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.5rem", color: "#1a1a1a", textDecoration: "none" }}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.5rem", color: "#1a1a1a", textDecoration: "none" }}>Contact us</Link>
          </nav>
        </div>
      )}

      {/* Sticky navbar (hidden when overlay is open) */}
      {!open && (
        <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />
          <div style={{ height: "2px", backgroundColor: "#ffffff" }} />
          <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
          <header style={{ backgroundColor: "#fff" }}>
            <div style={{ height: "88px", paddingLeft: "16px", paddingRight: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, textDecoration: "none" }}>
                <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "2.75rem", letterSpacing: "0.04em", color: "#1a1a1a", lineHeight: 1 }}>LAANS</span>
                <span style={{ fontFamily: "'Gloock', Georgia, serif", fontSize: "0.75rem", letterSpacing: "0.3em", color: "#5a5a5a", textTransform: "uppercase", marginTop: "3px" }}>Consulting</span>
              </Link>
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "7px", width: "48px", height: "48px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
                <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
                <span style={{ display: "block", width: "34px", height: "2px", backgroundColor: "#1a1a1a" }} />
              </button>
            </div>
          </header>
          <div style={{ height: "5px", backgroundColor: "#1a1a1a" }} />
          <div style={{ height: "2px", backgroundColor: "#ffffff" }} />
          <div style={{ height: "2px", backgroundColor: "#1a1a1a", opacity: 0.4 }} />
        </div>
      )}
    </>
  );
}
