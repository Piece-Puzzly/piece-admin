"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getReportDetail, getUserById } from "@/lib/server";

import { columns } from "@/app/(main)/report/reported/_components/report-detail-columns";

import { DataTable } from "@/components/data-table";
import { ProfileDetail, ReportDetailsResponses } from "@/lib/types";
import { createQueryString } from "@/lib/utils";
import { ReportDetailTableStoreProvider } from "@/providers/report-detail-table-provider";
import { useReportTableStore } from "@/providers/report-table-provider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BanButton from "./ban-button";
import ReportReasonPagination from "./report-reason-pagination";

export default function ReportReasonDialog() {
  const [data, setData] = useState<ReportDetailsResponses | undefined>(
    undefined
  );
  const [nickName, setNickName] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const reportTableData = useReportTableStore((e) => e.data);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      (async () => {
        const res_report = (await getReportDetail(
          parseInt(id as string) as number,
          0,
          10
        )) as ReportDetailsResponses;
        const res_profile: ProfileDetail | null = await getUserById(
          parseInt(id)
        );

        if (!res_report.content) {
          toast.error(JSON.stringify(res_report));
        }

        setData(res_report);

        if (!res_profile) {
          toast.error("존재하지 않는 프로필입니다.");
          return;
        }

        setNickName(res_profile.nickname);
      })();
    }
  }, [searchParams]);
  const userId = parseInt(searchParams.get("id") as string) as number;

  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const data = (await getReportDetail(
            userId,
            0,
            10
          )) as ReportDetailsResponses;
          setData(data);
        } else {
          router.push(
            pathname +
              "?" +
              createQueryString(searchParams, [
                { key: "id", value: undefined },
                { key: "reportpage", value: undefined },
              ])
          );
        }
      }}
      open={searchParams.get("id") !== null}
    >
      <DialogTrigger asChild>
        <button className="absolute hidden" />
      </DialogTrigger>
      <DialogContent className="gap-0  md:px-[40px] md:pt-[76px] md:pb-[49px] md:w-[860px]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {nickName ? (
          <div className="flex gap-[20px] items-center pb-[16px]">
            <div className="text-[24px] font-semibold ">{nickName}</div>
            <BanButton
              nickName={nickName}
              userId={userId}
              disabled={
                reportTableData.find((e) => e.userId === userId)?.userRole ===
                "BANNED"
              }
            />
          </div>
        ) : (
          <div>loading</div>
        )}

        {data ? (
          <ReportDetailTableStoreProvider
            id={Number(searchParams.get("id"))}
            data={data.content}
            totalNum={data.totalElements}
          >
            <DataTable
              variant="secondary"
              columns={columns}
              data={data.content}
            />
            <ReportReasonPagination />
          </ReportDetailTableStoreProvider>
        ) : (
          <div>loading</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
