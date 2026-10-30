/**
 * LAANS Consulting — PDF Report Generator
 * ----------------------------------------
 * Fetches a report from Notion, renders it to a multi-page PDF, and stamps
 * every page with a diagonal watermark that is embedded as vector content —
 * not a removable layer, not a CSS overlay.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-pdf.ts <slug>
 *
 * Output:
 *   public/reports/<slug>.pdf
 *
 * After generating, upload the PDF wherever you want to host it (e.g. Vercel
 * Blob, Google Drive, S3), then paste the public URL into the Notion report's
 * "PDF URL" field.
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
  degrees,
  PageSizes,
} from "pdf-lib";
import { getPublishedReports, getReportMarkdown } from "../src/lib/notion";

// ── Config ──────────────────────────────────────────────────────────────────

const WATERMARK_TEXT = "LAANS Consulting — laans.consulting";
const WATERMARK_OPACITY = 0.08; // very subtle, but vector — not removable
const WATERMARK_REPEATS = 6; // number of diagonal copies per page

const MARGIN = 72; // 1 inch in points
const FONT_SIZE_TITLE = 24;
const FONT_SIZE_BODY = 11;
const FONT_SIZE_HEADING = 14;
const LINE_HEIGHT_BODY = 17;
const LINE_HEIGHT_HEADING = 22;
const PAGE_WIDTH = PageSizes.A4[0]; // 595.28 pt
const PAGE_HEIGHT = PageSizes.A4[1]; // 841.89 pt
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// ── Watermark ───────────────────────────────────────────────────────────────

async function stampWatermark(
  doc: PDFDocument,
  font: Awaited<ReturnType<typeof doc.embedFont>>,
  page: ReturnType<typeof doc.getPage>
) {
  const { width, height } = page.getSize();
  const textSize = 26;
  const textWidth = font.widthOfTextAtSize(WATERMARK_TEXT, textSize);
  const diag = Math.sqrt(width * width + height * height);
  const count = Math.ceil(diag / (textWidth + 80));

  // Stamp multiple copies diagonally — each is a separate drawText call,
  // which means no "layer" to toggle off, no object to delete in Acrobat
  for (let i = -count; i <= count * 2; i++) {
    page.drawText(WATERMARK_TEXT, {
      x: -textWidth / 2 + i * (textWidth + 60),
      y: height / 2 - 40,
      size: textSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: WATERMARK_OPACITY,
      rotate: degrees(40),
    });
  }
}

// ── Text layout ─────────────────────────────────────────────────────────────

interface DrawState {
  doc: PDFDocument;
  pages: PDFPage[];
  fontRegular: PDFFont;
  fontBold: PDFFont;
  fontItalic: PDFFont;
  watermarkFont: PDFFont;
  x: number;
  y: number;
}

function currentPage(state: DrawState) {
  return state.pages[state.pages.length - 1];
}

async function newPage(state: DrawState) {
  const page = state.doc.addPage(PageSizes.A4);
  await stampWatermark(state.doc, state.watermarkFont, page);
  state.pages.push(page);
  state.y = PAGE_HEIGHT - MARGIN;
  return page;
}

function ensureSpace(state: DrawState, needed: number) {
  if (state.y - needed < MARGIN) {
    void newPage(state); // will be awaited at call sites via ensureSpaceAsync
    return true;
  }
  return false;
}

async function ensureSpaceAsync(state: DrawState, needed: number) {
  if (state.y - needed < MARGIN) {
    await newPage(state);
  }
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function drawWrappedText(
  state: DrawState,
  text: string,
  opts: {
    font: PDFFont;
    size: number;
    lineHeight: number;
    color?: ReturnType<typeof rgb>;
    indent?: number;
    spaceBefore?: number;
  }
) {
  const {
    font,
    size,
    lineHeight,
    color = rgb(0.05, 0.05, 0.05),
    indent = 0,
    spaceBefore = 0,
  } = opts;

  state.y -= spaceBefore;

  const maxW = CONTENT_WIDTH - indent;
  const lines = wrapText(text, font, size, maxW);

  for (const line of lines) {
    await ensureSpaceAsync(state, lineHeight);
    currentPage(state).drawText(line, {
      x: MARGIN + indent,
      y: state.y,
      size,
      font,
      color,
    });
    state.y -= lineHeight;
  }
}

// ── Markdown → draw calls ───────────────────────────────────────────────────

async function renderMarkdown(state: DrawState, markdown: string) {
  const lines = markdown.split("\n");

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Heading 1
    if (line.startsWith("# ")) {
      await drawWrappedText(state, line.slice(2), {
        font: state.fontBold,
        size: FONT_SIZE_HEADING + 4,
        lineHeight: LINE_HEIGHT_HEADING + 4,
        spaceBefore: 16,
      });
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      await drawWrappedText(state, line.slice(3), {
        font: state.fontBold,
        size: FONT_SIZE_HEADING,
        lineHeight: LINE_HEIGHT_HEADING,
        spaceBefore: 14,
        color: rgb(0.1, 0.1, 0.1),
      });
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      await drawWrappedText(state, line.slice(4), {
        font: state.fontBold,
        size: FONT_SIZE_BODY + 1,
        lineHeight: LINE_HEIGHT_BODY + 2,
        spaceBefore: 10,
        color: rgb(0.2, 0.2, 0.2),
      });
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      await drawWrappedText(state, line.slice(2), {
        font: state.fontItalic,
        size: FONT_SIZE_BODY,
        lineHeight: LINE_HEIGHT_BODY,
        spaceBefore: 8,
        indent: 16,
        color: rgb(0.3, 0.3, 0.3),
      });
      continue;
    }

    // Bullet
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const bullet = "• " + line.slice(2);
      await drawWrappedText(state, bullet, {
        font: state.fontRegular,
        size: FONT_SIZE_BODY,
        lineHeight: LINE_HEIGHT_BODY,
        spaceBefore: 4,
        indent: 12,
      });
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "___") {
      await ensureSpaceAsync(state, 20);
      currentPage(state).drawLine({
        start: { x: MARGIN, y: state.y },
        end: { x: PAGE_WIDTH - MARGIN, y: state.y },
        thickness: 0.5,
        color: rgb(0.7, 0.7, 0.7),
      });
      state.y -= 16;
      continue;
    }

    // Empty line — paragraph break
    if (line === "") {
      state.y -= 8;
      continue;
    }

    // Strip inline markdown (bold **text**, italic *text*, code `text`)
    const clean = line
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1");

    await drawWrappedText(state, clean, {
      font: state.fontRegular,
      size: FONT_SIZE_BODY,
      lineHeight: LINE_HEIGHT_BODY,
      spaceBefore: 2,
    });
  }
}

// ── Cover page ───────────────────────────────────────────────────────────────

async function drawCoverPage(
  state: DrawState,
  title: string,
  excerpt: string,
  publishedAt: string | null,
  topics: string[]
) {
  const page = currentPage(state);

  // Gold rule at top
  page.drawLine({
    start: { x: MARGIN, y: PAGE_HEIGHT - 60 },
    end: { x: MARGIN + 48, y: PAGE_HEIGHT - 60 },
    thickness: 2,
    color: rgb(0.788, 0.698, 0.416), // #C9B26A
  });

  // LAANS Consulting label
  page.drawText("LAANS Consulting", {
    x: MARGIN,
    y: PAGE_HEIGHT - 80,
    size: 9,
    font: state.fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Title
  const titleLines = wrapText(title, state.fontBold, FONT_SIZE_TITLE, CONTENT_WIDTH);
  let ty = PAGE_HEIGHT - 160;
  for (const tl of titleLines) {
    page.drawText(tl, {
      x: MARGIN,
      y: ty,
      size: FONT_SIZE_TITLE,
      font: state.fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });
    ty -= 34;
  }

  // Divider
  page.drawLine({
    start: { x: MARGIN, y: ty - 10 },
    end: { x: PAGE_WIDTH - MARGIN, y: ty - 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  ty -= 30;

  // Excerpt
  const excerptLines = wrapText(excerpt, state.fontItalic, FONT_SIZE_BODY + 1, CONTENT_WIDTH);
  for (const el of excerptLines) {
    page.drawText(el, {
      x: MARGIN,
      y: ty,
      size: FONT_SIZE_BODY + 1,
      font: state.fontItalic,
      color: rgb(0.25, 0.25, 0.25),
    });
    ty -= LINE_HEIGHT_BODY + 2;
  }

  // Topics + date at bottom
  const metaParts: string[] = [];
  if (publishedAt) {
    metaParts.push(
      new Date(publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }
  if (topics.length) metaParts.push(topics.join(" · "));

  if (metaParts.length) {
    page.drawText(metaParts.join("   |   "), {
      x: MARGIN,
      y: MARGIN + 20,
      size: 9,
      font: state.fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Copyright line
  page.drawText(`© ${new Date().getFullYear()} LAANS Consulting. All rights reserved.`, {
    x: MARGIN,
    y: MARGIN,
    size: 8,
    font: state.fontRegular,
    color: rgb(0.6, 0.6, 0.6),
  });
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npx ts-node scripts/generate-pdf.ts <slug>");
    process.exit(1);
  }

  console.log(`Fetching report: ${slug}`);
  const reports = await getPublishedReports();
  const report = reports.find((r) => r.slug === slug);

  if (!report) {
    console.error(`No published report found with slug: ${slug}`);
    process.exit(1);
  }

  console.log(`Found: "${report.title}"`);
  console.log("Fetching full content from Notion…");
  const markdown = await getReportMarkdown(report.id);

  console.log("Building PDF…");
  const doc = await PDFDocument.create();

  // Embed fonts
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);
  // Watermark uses a slightly different font for visual variety
  const watermarkFont = await doc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Cover page
  const coverPage = doc.addPage(PageSizes.A4);
  await stampWatermark(doc, watermarkFont, coverPage);
  const pages = [coverPage];

  const state: DrawState = {
    doc,
    pages,
    fontRegular,
    fontBold,
    fontItalic,
    watermarkFont,
    x: MARGIN,
    y: PAGE_HEIGHT - MARGIN,
  };

  await drawCoverPage(
    state,
    report.title,
    report.excerpt,
    report.publishedAt,
    report.topics
  );

  // Content pages — start a fresh page
  await newPage(state);
  await renderMarkdown(state, markdown);

  // Add page numbers
  const allPages = doc.getPages();
  allPages.forEach((p, i) => {
    if (i === 0) return; // skip cover
    p.drawText(`${i} / ${allPages.length - 1}`, {
      x: PAGE_WIDTH / 2 - 20,
      y: MARGIN / 2,
      size: 8,
      font: fontRegular,
      color: rgb(0.6, 0.6, 0.6),
    });
  });

  // Save
  const outDir = path.join(process.cwd(), "public", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.pdf`);
  const pdfBytes = await doc.save();
  fs.writeFileSync(outPath, pdfBytes);

  console.log(`\n✓ Saved: public/reports/${slug}.pdf`);
  console.log(
    `\nNext: upload this file somewhere permanent and paste the URL into\n` +
    `the Notion database row for "${report.title}" in the "PDF URL" field.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
