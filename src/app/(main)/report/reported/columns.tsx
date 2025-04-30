"use client";

import { Button } from "@/components/ui/button";
import { ReportedUser } from "@/lib/types";
import { createQueryString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileDetailButton from "../../../../components/ProfileDetailButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ReportedUser>[] = [
  {
    accessorKey: "nickName",
    header: "신고 당한 닉네임🚫",
    cell: ({ row }) => {
      const nickname = row.original.nickName as string;
      const id = row.original.userId as number;
      return <ProfileDetailButton id={id} nickname={nickname} />;
    },
  },

  {
    accessorKey: "birthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const birthdate = row.original.birthdate as string | undefined;

      return birthdate ? birthdate.replace(/-/g, ".").slice(2) : "-";
    },
  },
  {
    accessorKey: "totalReportedCnt",
    header: "누적 신고 수",
    cell: ({ row }) => {
      const totalReportedCnt = row.original.totalReportedCnt as number;

      return totalReportedCnt;
    },
  },
  {
    accessorKey: "latestReportedReason",
    header: "신고 사유",
    cell: ({ row }) => {
      const latestReportedReason = row.original.latestReportedReason as string;
      const id = row.original.userId as number;

      return (
        <ReportDetailButton
          id={id}
          latestReportedReason={latestReportedReason}
        />
      );
    },
  },
];

function ReportDetailButton({
  id,
  latestReportedReason,
}: {
  id: number;
  latestReportedReason: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Button
      onClick={() =>
        router.push(
          pathname +
            "?" +
            createQueryString(searchParams, [{ key: "id", value: `${id}` }])
        )
      }
      variant="outline"
      className="w-full flex justify-between h-[46px]"
    >
      {latestReportedReason}
      <ChevronRight />
    </Button>
  );
}
