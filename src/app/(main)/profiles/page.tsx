import PaginationDisplay from "@/components/PaginationDisplay";
import { columns } from "./columns";

import { DataTable } from "@/components/data-table";
import { getProfiles } from "@/lib/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const data = await getProfiles(params.page ? parseInt(params.page) - 1 : 0);
  return (
    <div className="space-y-[44px] mb-[86px]">
      <DataTable columns={columns} data={data.content} />
      <PaginationDisplay num={data.totalElements} />
    </div>
  );
}
