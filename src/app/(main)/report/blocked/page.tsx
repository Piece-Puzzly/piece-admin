import PaginationDisplay from "@/components/pagination-display";
import { BlockDataTable } from "@/components/tables/block/block-data-table";
import { columns } from "@/components/tables/block/columns";
import { getBlockDatas } from "@/lib/server";
import { BlockedUsersResponses } from "@/lib/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;

  const res = (await getBlockDatas(
    parseInt(params.page) - 1 || 0
  )) as BlockedUsersResponses;

  if (res.data == undefined) {
    return JSON.stringify(res);
  } else {
    const data = res.data;
    return (
      <div className="space-y-[44px] mb-[86px]">
        <BlockDataTable columns={columns} data={data.content} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
