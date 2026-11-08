import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.CMS_API_KEY ?? process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const REPORTS_DB_ID =
  process.env.NOTION_REPORTS_DB_ID ?? "0d030d1e-b838-45d3-a7c4-50a92d07e312";

export interface Report {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
  topics: string[];
  readingTime: number | null;
  status: string;
  notionUrl: string;
  pdfUrl: string | null;
  author: string | null;
}

export interface ReportWithMarkdown extends Report {
  markdown: string;
}

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

export async function getPublishedReports(): Promise<Report[]> {
  if (!process.env.CMS_API_KEY && !process.env.NOTION_TOKEN) return [];
  try {
    const res = await notion.databases.query({
      database_id: REPORTS_DB_ID,
      filter: {
        property: "Status",
        status: { equals: "Published" },
      },
      sorts: [{ property: "Published", direction: "descending" }],
    });
    return (res.results as PageObjectResponse[]).map(pageToReport);
  } catch {
    return [];
  }
}

export async function getReportBySlug(slug: string): Promise<Report | null> {
  if (!process.env.CMS_API_KEY && !process.env.NOTION_TOKEN) return null;
  try {
    const res = await notion.databases.query({
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
    return pageToReport(res.results[0] as PageObjectResponse);
  } catch {
    return null;
  }
}

export async function getReportMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdBlocks).parent;
}

export async function getAllReportSlugs(): Promise<string[]> {
  const reports = await getPublishedReports();
  return reports.map((r) => r.slug).filter(Boolean);
}
