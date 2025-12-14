// app/match-action/paid/page.tsx

import { getMatchHistory } from "@/lib/actions/match-infos";
import { MatchSearchForm } from "../_components/match-search-form";
import PaidMatchTable from "./_components/paid-match-table";

export default async function PaidMatchPage({
  searchParams: searchParams_,
}: {
  searchParams: Promise<{
    page?: string;
    user1Id?: string;
    user2Id?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await searchParams_;
  const page = Number(searchParams.page || 1);
  const user1Id = searchParams.user1Id;
  const user2Id = searchParams.user2Id;
  const pageSize = Number(searchParams.pageSize || 10);

  const result = await getMatchHistory({
    page,
    pageSize,
    user1Id,
    user2Id,
    matchType: "paid",
  });

  return (
    <div className="space-y-6">
      <MatchSearchForm
        defaultUser1Id={user1Id}
        defaultUser2Id={user2Id}
        defaultPageSize={String(pageSize)}
        basePath="/match-action/paid"
      />
      <PaidMatchTable data={result.data} pagination={result.pagination} />
    </div>
  );
}
