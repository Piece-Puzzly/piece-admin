// app/match-info/match-info-table.tsx
"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MatchHistoryResult } from "@/lib/match-infos";
import MatchInfoRow from "./match-info-row";
import MatchPagination from "./match-pagination";

export function MatchInfoTable({
  data,
  pagination,
}: {
  data: MatchHistoryResult["data"];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>매치 ID</TableHead>
            <TableHead>유저 1</TableHead>
            <TableHead>상태 1</TableHead>
            <TableHead>유저 2</TableHead>

            <TableHead>상태 2</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead>제출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((match) => (
            <MatchInfoRow data={match} key={match.id} />
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <MatchPagination
          total={pagination.total}
          currentPage={pagination.page}
          perPage={pagination.pageSize}
        />
      </div>
    </div>
  );
}
