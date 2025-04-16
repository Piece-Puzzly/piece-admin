"use client";

import { MatchingProfile } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<MatchingProfile>[] = [
  {
    accessorKey: "profileA",
    header: "매칭 프로필A",
    cell: ({ row }) => {
      const profile = row.getValue("profileA") as MatchingProfile["profileA"];

      return <div>{profile}</div>;
    },
  },
  {
    accessorKey: "profileB",
    header: "매칭 프로필B",
    cell: ({ row }) => {
      const profile = row.getValue("profileB") as MatchingProfile["profileB"];

      return <div>{profile}</div>;
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
];
