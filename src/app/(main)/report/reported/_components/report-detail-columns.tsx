"use client";

import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import { ReportDetail } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ReportDetail>[] = [
  {
    accessorKey: "cnt",
    header: "횟수",
    cell: ({ row }) => {
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
  {
    accessorKey: "reporterNickname",
    header: "신고한 유저 닉네임",
    cell: ({ row }) => {
      const reporterNickName = row.original.reporterNickName;
      const reporterUserId = row.original.reporterUserId;

      return (
        <ProfileDetailButton
          nickname={reporterNickName}
          userId={reporterUserId}
          disabled={true}
        />
      );
    },
  },
];
