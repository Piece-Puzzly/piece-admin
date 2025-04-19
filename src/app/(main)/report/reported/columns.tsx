"use client";

import { Button } from "@/components/ui/button";
import { ReportedUser } from "@/lib/types";
import { createQueryString } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileDialog from "../../profiles/_components/ProfileDialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ReportedUser>[] = [
  {
    accessorKey: "nickName",
    header: "닉네임",
    cell: ({ row }) => {
      // const id = row.original.blockedUserId as number;
      const nickname = row.getValue("nickName") as string;
      const id = row.getValue("userId") as number;
      return <ProfileDialog id={id} nickname={nickname} />;
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
      className="w-full flex justify-between text-lg h-[48px]"
    >
      <div className="text-[#484B4D]">{latestReportedReason}</div>
      <ChevronRight />
    </Button>
  );
}
