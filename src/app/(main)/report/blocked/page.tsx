import PaginationDisplay from "@/components/PaginationDisplay";
import { getBlockDatas } from "@/lib/server";
import { BlockedValidationResponses } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  // console.log(params);
  const { data } = (await getBlockDatas(
    parseInt(params.page) - 1 || 0
  )) as BlockedValidationResponses;

  return (
    <div className="space-y-[44px] mb-[86px]">
      <DataTable columns={columns} data={data.content} />
      <PaginationDisplay num={data.totalElements} />
    </div>
  );
}
