// app/dashboard/page.tsx

import { IncompleteProfilesCard } from "./_components/incomplete-profiles-card";
import { RecentReportsCard } from "./_components/recent-report-card";
// 새로 만든 컴포넌트와 액션을 import 합니다.
import { ChangedImageCard } from "./_components/changed-image-card";

import { KpiHistoryTable } from "./_components/kpi-history-table";
import {
  getIncompleteProfiles,
  getProfilesWithPendingImages,
  getRecentKpiHistory, // 새로 만든 액션
  getRecentReports,
} from "./actions";

export default async function DashboardPage() {
  // Promise.all에 새로운 액션 호출을 추가합니다.
  const [
    { data: reports },
    { data: incompleteProfiles },
    { data: changedImageProfiles }, // 결과를 받을 변수 추가
    { data: kpiData }, // 결과를 받을 변수 추가
  ] = await Promise.all([
    getRecentReports(),
    getIncompleteProfiles(),
    getProfilesWithPendingImages(),
    getRecentKpiHistory(), // 액션 호출
  ]);

  return (
    // 새로운 카드를 위해 grid 레이아웃을 조정할 수 있습니다 (예: lg:grid-cols-3)
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2  gap-4">
      <KpiHistoryTable history={kpiData} />
      <IncompleteProfilesCard profiles={incompleteProfiles} />
      <ChangedImageCard profiles={changedImageProfiles} />
      <RecentReportsCard reports={reports} />
    </div>
  );
}
