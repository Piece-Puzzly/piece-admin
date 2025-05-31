import { DataTable } from "@/components/data-table";
import PaginationDisplay from "@/components/pagination-display";
import { columns } from "@/app/(main)/report/blocked/_components/block-columns";
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
        <DataTable
          columns={columns}
          data={data.content}
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
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
