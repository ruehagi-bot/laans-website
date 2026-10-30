import { getPublishedReports } from "@/lib/notion";
import ReportCard from "@/components/ReportCard";

export const revalidate = 3600; // ISR: re-fetch every hour

export default async function ReportsPage() {
  const reports = await getPublishedReports();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-black mb-2">Reports</h1>
      <p className="text-stone-500 text-base mb-12 border-b border-stone-200 pb-8">
        Evidence-based research on planetary boundaries, climate justice, and
        policy pathways for the Global South.
      </p>

      {reports.length === 0 ? (
        <p className="text-stone-400">No published reports yet.</p>
      ) : (
        <ul className="space-y-10">
          {reports.map((report) => (
            <li key={report.id}>
              <ReportCard report={report} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
