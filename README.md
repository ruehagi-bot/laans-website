# LAANS Consulting

Research and policy for the Global South, by the Global South.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Notion as CMS.

---

## Local development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd my-portfolio
npm install
```

### 2. Create a Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **New integration** → give it a name (e.g. "LAANS Site")
3. Copy the **Internal Integration Token**

### 3. Share the Reports database with the integration

1. Open the **Reports** database in your Notion workspace
2. Click **···** (top right) → **Connections** → add your integration

### 4. Set environment variables

Create `.env.local` in the project root (already gitignored):

```
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_REPORTS_DB_ID=0d030d1e-b838-45d3-a7c4-50a92d07e312
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

### Option A — Vercel CLI (quickest)

```bash
npm i -g vercel
vercel
```

When prompted, add environment variables:
- `NOTION_TOKEN` → your integration token
- `NOTION_REPORTS_DB_ID` → `0d030d1e-b838-45d3-a7c4-50a92d07e312`

### Option B — Vercel dashboard

1. Push this repo to GitHub (or GitLab / Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo
3. Under **Environment Variables**, add:
   - `NOTION_TOKEN`
   - `NOTION_REPORTS_DB_ID`
4. Click **Deploy**

---

## Adding a new report

1. Open the **Reports** database in Notion
2. Click **New** and fill in:
   | Field | Notes |
   |---|---|
   | **Title** | The report title |
   | **Slug** | URL-safe slug, e.g. `water-scarcity-jeddah` |
   | **Excerpt** | Two sentences shown on the homepage card |
   | **Published** | Publication date |
   | **Topics** | Multi-select tags |
   | **Reading Time** | Estimated minutes (number) |
   | **Status** | Set to **Published** when ready to go live |
3. Write the full report as the page body using Notion blocks
4. The site revalidates every hour (ISR). To force an immediate update, trigger a redeploy from the Vercel dashboard or run `vercel --prod`.

---

## Project structure

```
src/
  app/
    layout.tsx          # Root layout — Nav, fonts, metadata
    page.tsx            # Homepage
    reports/
      page.tsx          # Reports index
      [slug]/
        page.tsx        # Individual report page
  components/
    Nav.tsx             # Sticky header
    ReportCard.tsx      # Card used on the reports index
    ReportBody.tsx      # Markdown renderer (Tailwind prose)
  lib/
    notion.ts           # Notion API helpers (typed)
```
