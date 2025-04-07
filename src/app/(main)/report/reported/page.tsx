import PaginationDisplay from "@/components/PaginationDisplay";
import { getReportedDatas } from "@/lib/server";
import { ReportedResponseData } from "@/lib/types";

import { DataTable } from "@/components/data-table";
import ReportReasonDialog from "./_components/ReportReasonDialog";
import { columns } from "./columns";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; id?: string; reportpage?: string };
}) {
  const params = await searchParams;

  const { data }: { data: ReportedResponseData } = await getReportedDatas(
    params.page ? parseInt(params.page) - 1 : 0,
    10
  );

  return (
    <div className="space-y-[44px] mb-[86px]">
      <ReportReasonDialog />
      <DataTable columns={columns} data={data.content} />
      <PaginationDisplay num={data.totalElements} />
    </div>
  );
}
