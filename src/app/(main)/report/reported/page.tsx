import PaginationDisplay from "@/components/PaginationDisplay";
import { getReportedDatas } from "@/lib/server";
import { ReportedValidationResponses } from "@/lib/types";

import ReportReasonDialog from "./_components/ReportReasonDialog";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; id?: string; reportpage?: string }>;
}) {
  const params = await searchParams;

  const res = (await getReportedDatas(
    params.page ? parseInt(params.page) - 1 : 0,
    10
  )) as ReportedValidationResponses;

  if (res.data == undefined) {
    return JSON.stringify(res);
  } else {
    const data = res.data;
    return (
      <div className="space-y-[44px] mb-[86px]">
        <ReportReasonDialog />
        <DataTable columns={columns} data={data.content} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
