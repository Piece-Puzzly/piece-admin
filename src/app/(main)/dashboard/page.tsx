// app/dashboard/page.tsx

import { RecentReportsCard } from "./_components/recent-report-card";
import { KpiHistoryTable } from "./_components/kpi-history-table";
import { getRecentKpiHistory, getRecentReports } from "./actions";

export default async function DashboardPage() {
  const [
    { data: reports, error: reportsError },
    { data: kpiData },
  ] = await Promise.all([getRecentReports(), getRecentKpiHistory()]);

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <KpiHistoryTable history={kpiData} />
      <RecentReportsCard reports={reports} reportsError={reportsError} />
    </div>
  );
}
