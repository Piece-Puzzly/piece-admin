"use client";

import { DataTable } from "@/components/data-table";
import { useMatchHistoryTableStore } from "@/providers/match-history-table-provider";
import { columns } from "./match-history-column";

export default function MatchHistoryTable() {
  const data = useMatchHistoryTableStore((e) => e.data);

  return <DataTable columns={columns} data={data} />;
}
