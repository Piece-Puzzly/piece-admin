"use client";

import PaginationDisplay from "@/components/PaginationDisplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getReportDetail, getUserById } from "@/lib/server";
import {
  ReportDetail,
  ReportedDetailResponseData,
  UserProfileDetailResponse,
} from "@/lib/types";
import { createQueryString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReportDataTable } from "./report-data-table";

export default function ReportReasonDialog() {
  const [data, setData] = useState<ReportedDetailResponseData | undefined>(
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
        const res_report: { data: ReportedDetailResponseData } =
          await getReportDetail(parseInt(id as string) as number, 0, 10);
        const res_profile: { data: UserProfileDetailResponse } =
          await getUserById(parseInt(id));
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

  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const { data }: { data: ReportedDetailResponseData } =
            await getReportDetail(
              parseInt(searchParams.get("id") as string) as number,
              0,
              10
            );
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
      <DialogContent className="gap-0 w-[860px] lg:max-w-[860px] px-[40px] pt-[76px] pb-[49px]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {nickName ? (
          <div className="text-[24px] font-semibold pb-[16px]">{nickName}</div>
        ) : (
          <div>loading</div>
        )}
        {data ? (
          <>
            <ReportDataTable columns={columns} data={data.content} />
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface ReportedUser {
  userId: number; // 유저 ID
  nickName: string; // 유저 닉네임
  name: string; // 유저 이름
  birthdate: string; // 유저 생년월일 (yyyy-MM-dd 형식)
  totalReportedCnt: number; // 유저가 리포트된 총 횟수
  latestReportedReason: string; // 가장 최근에 리포트된 이유
}

export const columns: ColumnDef<ReportDetail>[] = [
  {
    accessorKey: "cnt",
    header: "횟수",
    cell: ({ row }) => {
      // const id = row.original.blockedUserId as number;
      const cnt = row.getValue("cnt") as number;

      return <span className="text-[14px] text-muted-foreground">{cnt}</span>;
    },
  },
  {
    accessorKey: "reason",
    header: "신고 사유",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return reason || "-";
    },
  },
  {
    accessorKey: "reportedDate",
    header: "신고 날짜",
    cell: ({ row }) => {
      const reportedDate = row.getValue("reportedDate") as string | undefined;

      return reportedDate ? reportedDate.replace(/-/g, ".") : "-";
    },
  },
];
