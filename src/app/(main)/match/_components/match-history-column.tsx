"use client";

import { Button } from "@/components/ui/button";
import UserInfoButton from "@/components/user-info/user-info-button";
import { cancelMatch } from "@/lib/server";
import { MatchHistory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMatchHistoryTableStore } from "@/providers/match-history-table-provider";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Loader, X } from "lucide-react";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MatchHistory>[] = [
  {
    header: "매칭 프로필A",
    cell: ({ row }) => {
      const id = row.original.user1Id;
      const nickname = row.original.user1Nickname;

      return (
        <div className="items-center gap-[10px] flex ">
          <div className="w-[60px] text-right">{id}</div>
          <div className="flex-1">
            <UserInfoButton userId={id} nickname={nickname} />
          </div>
        </div>
      );
    },
  },
  {
    header: "매칭 프로필B",
    cell: ({ row }) => {
      const id = row.original.user2Id;
      const nickname = row.original.user2Nickname;

      return (
        <div className="items-center gap-[10px] flex ">
          <div className="w-[60px] text-right">{id}</div>
          <div className="flex-1">
            <UserInfoButton userId={id} nickname={nickname} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "매칭 날짜",
    cell: ({ row }) => {
      const date = row.original.matchDateTime.split("T")[0].replace("-", ".");

      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "매칭 시간",
    cell: ({ row }) => {
      const time = row.original.matchDateTime.split("T")[1];
      const [hour, minute, second] = time.split(":");

      return <div>{`${hour}시 ${minute}분 ${second}초`}</div>;
    },
  },
  {
    accessorKey: "isMatched",
    header: "",
    cell: ({ row }) => {
      const isMatched = row.original.isMatched;

      return (
        <CheckButton
          matchId={row.original.manualMatchId}
          isMatched={isMatched}
          // disabled={isMatched}
        />
      );
    },
  },
];

function CheckButton({
  isMatched,
  matchId,
  ...props
}: { matchId: number; isMatched: boolean } & React.ComponentProps<"button">) {
  const [loading, setLoading] = useState<boolean>(false);
  const reload = useMatchHistoryTableStore((e) => e.reload);
  return (
    <Button
      disabled={loading}
      size="icon"
      className={cn(
        "w-[20px] h-[20px] rounded-full bg-primary flex justify-center items-center",
        {
          "hover:bg-gray-light-1 bg-gray-light-1": !isMatched,
          "cursor-not-allowed": isMatched,
        }
      )}
      onClick={async () => {
        if (!isMatched) {
          setLoading(true);
          await cancelMatch(matchId);
          await reload();
          setLoading(false);
        }
      }}
      {...props}
    >
      {loading ? (
        <Loader className="size-3.5 stroke-3 animate-spin" />
      ) : !isMatched ? (
        <X className="size-3.5 stroke-3" />
      ) : (
        <Check className="size-3.5 stroke-3" />
      )}
    </Button>
  );
}
