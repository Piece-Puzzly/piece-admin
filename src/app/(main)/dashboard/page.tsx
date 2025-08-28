import { DailyUsersChart } from "./_components/daily-users-chart";
import { IncompleteProfilesCard } from "./_components/incomplete-profiles-card";
import { RecentReportsCard } from "./_components/recent-report-card";
import {
  getDailyStats,
  getIncompleteProfiles,
  getRecentReports,
} from "./actions";

export default async function DashboardPage() {
  const [
    { data: dailyStats, error: dailyStatsError },
    { data: reports },
    { data: incompleteProfiles },
  ] = await Promise.all([
    getDailyStats(),
    getRecentReports(),
    getIncompleteProfiles(),
  ]);
  return (
    <div className="container mx-auto grid grid-cols-2 gap-4">
      <DailyUsersChart chartData={dailyStats} error={dailyStatsError} />
      <IncompleteProfilesCard profiles={incompleteProfiles} />
      <RecentReportsCard reports={reports} />
    </div>
  );
}
