"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchHistoryResult } from "@/lib/actions/match-infos";
import MatchPagination from "../../_components/match-pagination";
import PaidMatchRow from "./paid-match-row";

interface PaidMatchTableProps {
  data: MatchHistoryResult["data"];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export default function PaidMatchTable({
  data,
  pagination,
}: PaidMatchTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>매치 ID</TableHead>
            <TableHead>프로필 A</TableHead>
            <TableHead>매칭</TableHead>
            <TableHead>이미지</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>제출</TableHead>
            <TableHead>프로필 B</TableHead>
            <TableHead>매칭</TableHead>
            <TableHead>이미지</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>제출</TableHead>
            <TableHead>타입</TableHead>
            <TableHead>날짜</TableHead>
            <TableHead>삭제</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <td colSpan={14} className="text-center py-8 text-muted-foreground">
                유료 매칭 데이터가 없습니다.
              </td>
            </TableRow>
          ) : (
            data.map((match) => (
              <PaidMatchRow key={String(match.id)} data={match} />
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <MatchPagination
          total={pagination.total}
          currentPage={pagination.page}
          perPage={pagination.pageSize}
        />
      </div>
    </div>
  );
}
