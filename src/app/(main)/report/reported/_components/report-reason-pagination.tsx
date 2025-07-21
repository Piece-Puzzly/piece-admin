"use client";

import PaginationDisplay from "@/components/pagination-display";
import { useReportDetailTableStore } from "@/providers/report-detail-table-provider";

export default function ReportReasonPagination() {
  const total = useReportDetailTableStore((e) => e.totalNum);
  const update = useReportDetailTableStore((e) => e.update);

  return (
    <PaginationDisplay
      num={total}
      onChangePage={(e) => {
        update(e);
      }}
      className="mt-[20px] mb-0"
    />
  );
}
