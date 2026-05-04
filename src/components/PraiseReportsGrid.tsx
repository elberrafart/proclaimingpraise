import type { PraiseReport } from "@/types/database";

export function PraiseReportsGrid({ reports }: { reports: PraiseReport[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {reports.map((report) => (
        <div key={report.id} className="bg-white p-8 rounded-2xl shadow-sm flex flex-col">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gold text-lg">&#9733;</span>
            ))}
          </div>
          <p className="text-charcoal/70 leading-relaxed mb-6 italic flex-1">
            &ldquo;{report.quote}&rdquo;
          </p>
          <div>
            <p className="font-semibold text-charcoal">{report.name}</p>
            <p className="text-sm text-charcoal/50">{report.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
