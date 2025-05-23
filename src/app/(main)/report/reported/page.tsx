import PaginationDisplay from "@/components/pagination-display";
import { getReportedDatas } from "@/lib/server";

import { columns } from "@/components/tables/report/columns";
import { ReportDataTable } from "@/components/tables/report/report-data-table";
import { ReportedUsersResponses } from "@/lib/types";
import ReportReasonDialog from "./_components/report-reason-dialog";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; id?: string; reportpage?: string }>;
}) {
  const params = await searchParams;

  const res = (await getReportedDatas(
    params.page ? parseInt(params.page) - 1 : 0,
    10
  )) as ReportedUsersResponses;

  if (res.data == undefined) {
    return JSON.stringify(res);
  } else {
    const data = res.data;
    return (
      <div className="space-y-[44px] mb-[86px]">
        <ReportReasonDialog />
        <ReportDataTable columns={columns} data={data.content} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
