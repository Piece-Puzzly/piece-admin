"use client";

import PaginationDisplay from "@/components/pagination-display";

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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BanDialog from "./ban-dialog";

export default function ReportReasonDialog() {
  const [data, setData] = useState<ReportDetailsResponses["data"] | undefined>(
    undefined
  );
  const [nickName, setNickName] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      (async () => {
        const res_report = (await getReportDetail(
          parseInt(id as string) as number,
          0,
          10
        )) as ReportDetailsResponses;
        const res_profile: { data: ProfileDetail } = await getUserById(
          parseInt(id)
        );
        if (!res_report.data) {
          toast.error(JSON.stringify(res_report));
        }
        if (!res_profile.data) {
          toast.error(JSON.stringify(res_profile));
        }
        setData(res_report.data);
        setNickName(res_profile.data.nickname);
      })();
    }
  }, [searchParams]);
  const userId = parseInt(searchParams.get("id") as string) as number;
  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const { data } = (await getReportDetail(
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
            <BanDialog nickName={nickName} userId={userId} />
          </div>
        ) : (
          <div>loading</div>
        )}

        {data ? (
          <>
            <DataTable
              variant="secondary"
              columns={columns}
              data={data.content}
            />
            <PaginationDisplay
              queryKey={"reportpage"}
              num={data.totalElements}
              className="mt-[20px] mb-0"
            />
          </>
        ) : (
          <div>loading</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
