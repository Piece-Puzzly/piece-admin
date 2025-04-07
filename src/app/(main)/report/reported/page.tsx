import PaginationDisplay from "@/components/PaginationDisplay";
import { getReportedDatas } from "@/lib/server";
import { ReportedResponseData } from "@/lib/types";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const params = await searchParams;

  const { data }: { data: ReportedResponseData } = await getReportedDatas(
    parseInt(params.page) - 1 || 0,
    10
  );
  console.log(data);
  return (
    <div className="space-y-[44px] mb-[86px]">
      <DataTable columns={columns} data={data.content} />
      <PaginationDisplay num={data.totalElements} />
    </div>
  );
}
