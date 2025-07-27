// app/match-info/page.tsx

import { getMatchHistory } from "@/lib/match-infos";
import { MatchInfoTable } from "./_components/match-info-table";
import { MatchSearchForm } from "./_components/match-search-form";
export default async function MatchInfoPage({
  searchParams: searchParams_,
}: {
  searchParams: Promise<{
    page?: string;
    user1Id?: string;
    user2Id?: string;
    pageSize?: string; // 추가
  }>;
}) {
  const searchParams = await searchParams_;
  const page = Number(searchParams.page || 1);
  const user1Id = searchParams.user1Id;
  const user2Id = searchParams.user2Id;
  const pageSize = Number(searchParams.pageSize || 10); // 기본 10

  const result = await getMatchHistory({
    page,
    pageSize,
    user1Id,
    user2Id,
  });

  return (
    <div className="p-6 space-y-6">
      <MatchSearchForm
        defaultUser1Id={user1Id}
        defaultUser2Id={user2Id}
        defaultPageSize={String(pageSize)} // string으로 넘김
      />
      <MatchInfoTable data={result.data} pagination={result.pagination} />
    </div>
  );
}
