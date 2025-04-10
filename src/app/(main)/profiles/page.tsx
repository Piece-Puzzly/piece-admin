import PaginationDisplay from "@/components/PaginationDisplay";

import { getProfiles } from "@/lib/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const data = await getProfiles(params.page ? parseInt(params.page) - 1 : 0);

  return (
    <div className="space-y-[44px] mb-[86px]">
      <DataTable columns={columns} data={data.content} />;
      <PaginationDisplay num={data.totalElements} />
    </div>
  );
}
