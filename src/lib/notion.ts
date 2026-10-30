import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// ---------------------------------------------------------------------------
// Client setup
// ---------------------------------------------------------------------------

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const REPORTS_DB_ID =
  process.env.NOTION_REPORTS_DB_ID ?? "0d030d1e-b838-45d3-a7c4-50a92d07e312";

// This client uses dataSources.query() rather than databases.query()
// (Notion MCP-flavoured SDK)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ds = (notion as any).dataSources;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Report {
  id: string;
  title: string;
  slug: string;
  /** Short excerpt shown on the website (2–4 sentences). Full text is PDF-only. */
  excerpt: string;
  publishedAt: string | null;
  topics: string[];
  readingTime: number | null;
  status: string;
  notionUrl: string;
  /** Direct URL to the watermarked PDF (stored in Notion "PDF URL" field). */
  pdfUrl: string | null;
  /** Author name (stored in Notion "Author" text field). */
  author: string | null;
}

export interface ReportWithMarkdown extends Report {
  /** Full Notion page content as Markdown — used only by the PDF generator, never rendered on the site. */
  markdown: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractText(
  prop: PageObjectResponse["properties"][string]
): string {
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function pageToReport(page: PageObjectResponse): Report {
  const p = page.properties;
  return {
    id: page.id,
    title: extractText(p["Title"]),
    slug: extractText(p["Slug"]),
    excerpt: extractText(p["Excerpt"]),
    publishedAt:
      p["Published"]?.type === "date"
        ? p["Published"].date?.start ?? null
        : null,
    topics:
      p["Topics"]?.type === "multi_select"
        ? p["Topics"].multi_select.map((t) => t.name)
        : [],
    readingTime:
      p["Reading Time"]?.type === "number"
        ? p["Reading Time"].number
        : null,
    status:
      p["Status"]?.type === "status"
        ? p["Status"].status?.name ?? "Draft"
        : "Draft",
    notionUrl: page.url,
    pdfUrl:
      p["PDF URL"]?.type === "url" ? p["PDF URL"].url ?? null : null,
    author:
      p["Author"]?.type === "rich_text"
        ? p["Author"].rich_text.map((t) => t.plain_text).join("") || null
        : null,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** All published reports, newest first */
export async function getPublishedReports(): Promise<Report[]> {
  const res = await ds.query({
    database_id: REPORTS_DB_ID,
    filter: {
      property: "Status",
      status: { equals: "Published" },
    },
    sorts: [{ property: "Published", direction: "descending" }],
  });

  return (res.results as PageObjectResponse[]).map(pageToReport);
}

/** Single report by slug — returns excerpt + pdfUrl; no full markdown */
export async function getReportBySlug(
  slug: string
): Promise<Report | null> {
  const res = await ds.query({
    database_id: REPORTS_DB_ID,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Status", status: { equals: "Published" } },
      ],
    },
    page_size: 1,
  });

  if (!res.results.length) return null;

  const page = res.results[0] as PageObjectResponse;
  return pageToReport(page);
}

/**
 * Fetch full Notion page content as Markdown.
 * Used ONLY by the offline PDF generator (scripts/generate-pdf.ts).
 * Never call this from a Next.js page or component.
 */
export async function getReportMarkdown(
  pageId: string
): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdBlocks).parent;
}

/** All slugs (for generateStaticParams) */
export async function getAllReportSlugs(): Promise<string[]> {
  const reports = await getPublishedReports();
  return reports.map((r) => r.slug).filter(Boolean);
}
