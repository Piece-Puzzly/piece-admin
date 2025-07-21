"use client";

import SimplePagination from "@/components/ui/simple-pagination";
import { useMatchHistoryTableStore } from "@/providers/match-history-table-provider";

export default function MatchHistoryTablePagination() {
  const page = useMatchHistoryTableStore((e) => e.page);
  const update = useMatchHistoryTableStore((e) => e.update);
  return (
    <div className="flex gap-2 items-center justify-center">
      <SimplePagination page={page} onPageChange={(page) => update(page)} />
    </div>
  );
}
