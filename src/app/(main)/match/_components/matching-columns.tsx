"use client";

import CheckButton from "@/components/check-button";
import ProfileDetailButton from "@/components/profile-detail-button";
import { MatchingProfile } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MatchingProfile>[] = [
  {
    header: "매칭 프로필A",
    cell: ({ row }) => {
      const id = row.original.idA as MatchingProfile["idA"];
      const nickname = row.original.nicknameA as MatchingProfile["nicknameA"];

      return (
        <div className="items-center gap-[10px] flex ">
          <div className="w-[60px] text-right">{id}</div>

          <div className="flex-1">
            <ProfileDetailButton userId={id} nickname={nickname} />
          </div>
        </div>
      );
    },
  },
  {
    header: "매칭 프로필B",
    cell: ({ row }) => {
      const id = row.original.idB as MatchingProfile["idB"];
      const nickname = row.original.nicknameB as MatchingProfile["nicknameB"];

      return (
        <div className="items-center gap-[10px] flex ">
          <div className="w-[60px] text-right">{id}</div>
          <div className="flex-1">
            <ProfileDetailButton userId={id} nickname={nickname} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "매칭 날짜",
    cell: ({ row }) => {
      const date = row.getValue("date") as MatchingProfile["date"];

      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "매칭 시간",
    cell: ({ row }) => {
      const time = row.getValue("time") as MatchingProfile["time"];

      return <div>{time}시</div>;
    },
  },
  {
    accessorKey: "isMatched",
    header: "",
    cell: ({ row }) => {
      const isMatched = row.getValue(
        "isMatched"
      ) as MatchingProfile["isMatched"];

      return <CheckButton isChecked={isMatched} />;
    },
  },
];
