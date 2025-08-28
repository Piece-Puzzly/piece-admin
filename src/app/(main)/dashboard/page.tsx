import { IncompleteProfilesCard } from "./_components/incomplete-profiles-card";
import { RecentReportsCard } from "./_components/recent-report-card";
import { getIncompleteProfiles, getRecentReports } from "./actions";

export default async function DashboardPage() {
  const [{ data: reports }, { data: incompleteProfiles }] = await Promise.all([
    getRecentReports(),
    getIncompleteProfiles(),
  ]);
  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <IncompleteProfilesCard profiles={incompleteProfiles} />
      <RecentReportsCard reports={reports} />
    </div>
  );
}
