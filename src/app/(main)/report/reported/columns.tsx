"use client";

import { ColumnDef } from "@tanstack/react-table";
import ReportReasonDialog from "./_components/ReportReasonDialog";

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

export const columns: ColumnDef<ReportedUser>[] = [
  {
    accessorKey: "nickName",
    header: "닉네임",
    cell: ({ row }) => {
      // const id = row.original.blockedUserId as number;
      const nickname = row.getValue("nickName");

      return nickname || "-";
    },
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return name || "-";
    },
  },
  {
    accessorKey: "birthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const birthdate = row.getValue("birthdate") as string | undefined;

      return birthdate ? birthdate.replace(/-/g, ".") : "-";
    },
  },
  {
    accessorKey: "totalReportedCnt",
    header: "누적 신고 수",
    cell: ({ row }) => {
      const totalReportedCnt = row.getValue("totalReportedCnt") as string;

      return totalReportedCnt;
    },
  },
  {
    accessorKey: "latestReportedReason",
    header: "신고 사유",
    cell: ({ row }) => {
      const latestReportedReason = row.getValue(
        "latestReportedReason"
      ) as string;
      const id = row.original.userId as number;
      const nickName = row.getValue("nickName") as string;
      return (
        <ReportReasonDialog
          id={id}
          nickName={nickName}
          latestReportedReason={latestReportedReason}
        />
      );
    },
  },
];
