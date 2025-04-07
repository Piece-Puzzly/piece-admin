"use client";

import PaginationDisplay from "@/components/PaginationDisplay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getReportDetail } from "@/lib/server";
import { ReportDetail, ReportedDetailResponseData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ReportDataTable } from "./report-data-table";
export default function ReportReasonDialog({
  id,
  nickName,
  latestReportedReason,
}: {
  id: number;
  nickName: string;
  latestReportedReason: string;
}) {
  const [data, setData] = useState<ReportedDetailResponseData | undefined>(
    undefined
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (query: { key: string; value?: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const { key, value } of query) {
        if (value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );
  const router = useRouter();
  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const { data }: { data: ReportedDetailResponseData } =
            await getReportDetail(id as number, 0, 10);

          setData(data);
        } else {
          router.push(
            pathname +
              "?" +
              createQueryString([{ key: "id", value: undefined }])
          );
        }
      }}
      open={parseInt(searchParams.get("id") as string) === id}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() =>
            router.push(
              pathname +
                "?" +
                createQueryString([{ key: "id", value: `${id}` }])
            )
          }
          variant="outline"
          className="w-full flex justify-between text-lg h-[48px]"
        >
          <div>{latestReportedReason}</div>
          <ChevronRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 w-[860px] lg:max-w-[860px] px-[40px] pt-[76px] pb-[40px]">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="text-[24px] font-semibold pb-[16px]">{nickName}</div>
        {data ? (
          <>
            <ReportDataTable columns={columns} data={data.content} />
            <PaginationDisplay queryKey = {"reportpage"} num={data.totalElements} />
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
