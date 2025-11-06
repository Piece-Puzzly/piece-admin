"use server";

import { getMatchHistory } from "@/lib/server";
import { MatchHistoryResponse } from "@/lib/types";
import { MatchCandidateStoreProvider } from "@/providers/match-candidate-provider";
import { MatchHistoryTableStoreProvider } from "@/providers/match-history-table-provider";
import MatchHistoryTable from "./_components/match-history-table";
import MatchHistoryTablePagination from "./_components/match-history-table-pagination";
import MatchingForm from "./_components/matching-form";

export default async function Page() {
  const res = (await getMatchHistory(0)) as MatchHistoryResponse;

  if (res.data === undefined) {
    return JSON.stringify(res);
  } else
    return (
      <div className="flex justify-center ">
        <div className="space-y-[40px] mb-[86px] max-w-[1100px] w-full">
          <MatchHistoryTableStoreProvider data={res.data}>
            <MatchCandidateStoreProvider>
              <MatchingForm />
            </MatchCandidateStoreProvider>
            <MatchHistoryTable />
            <MatchHistoryTablePagination />
          </MatchHistoryTableStoreProvider>
        </div>
      </div>
    );
}
