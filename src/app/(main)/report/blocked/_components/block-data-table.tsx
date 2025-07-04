"use client";

import { DataTable } from "@/components/data-table";
import { useBlockTableStore } from "@/providers/block-table-provider";
import { columns } from "./block-columns";

export default function BlockDataTable() {
  const data = useBlockTableStore((e) => e.data);
  return (
    <DataTable
      columns={columns}
      data={data}
      columnOptions={{
        default: {
          tableHead: "w-[150px]",
        },
        blockingUserNickname: {
          tableHead: "bg-gray-light-3 border-gray-light-2",
        },
        BlockedDate: {
          tableHead: "bg-gray-light-3 border-gray-light-2",
        },
      }}
    />
  );
}
