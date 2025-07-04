"use client";

import { columns } from "@/app/(main)/profiles/photo/_components/photo-columns";
import { DataTable } from "@/components/data-table";
import { useProfileTableStore } from "@/providers/profile-table-provider";

export default function Page() {
  const data = useProfileTableStore((e) => e.data);
  return <DataTable columns={columns} data={data} />;
}
