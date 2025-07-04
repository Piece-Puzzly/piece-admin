"use client";

import PaginationDisplay from "@/components/pagination-display";
import { useReportTableStore } from "@/providers/report-table-provider";

export default function ReportPagination() {
  const total = useReportTableStore((e) => e.totalNum);
  const update = useReportTableStore((e) => e.update);

  return <PaginationDisplay num={total} onChangePage={(e) => update(e)} />;
}
