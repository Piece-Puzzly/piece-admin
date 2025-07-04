import { getReportedDatas } from "@/lib/server";

import { ReportedUsersResponses } from "@/lib/types";
import { ReportTableStoreProvider } from "@/providers/report-table-provider";
import ReportDataTable from "./_components/report-data-table";
import ReportPagination from "./_components/report-pagination";
import ReportReasonDialog from "./_components/report-reason-dialog";

export default async function Page() {
  const res = (await getReportedDatas(0)) as ReportedUsersResponses;

  if (res.data == undefined) {
    return JSON.stringify(res);
  } else {
    const data = res.data;

    return (
      <div className="space-y-[44px] mb-[86px]">
        <ReportTableStoreProvider
          data={data.content}
          totalNum={res.data.totalElements}
        >
          <ReportReasonDialog />
          <ReportDataTable />
          <ReportPagination />
        </ReportTableStoreProvider>
      </div>
    );
  }
}
