"use client";

import { DataTable } from "@/components/data-table";
import { useReportTableStore } from "@/providers/report-table-provider";
import { columns } from "./report-columns";

export default function ReportDataTable() {
  const data = useReportTableStore((e) => e.data);
  return (
    <DataTable
      columns={columns}
      data={data}
      columnOptions={{
        ban: { tableHead: "bg-gray-light-3 border-gray-light-2" },
      }}
    />
  );
}
