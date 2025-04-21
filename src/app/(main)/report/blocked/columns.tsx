"use client";

import ProfileDetailButton from "@/components/ProfileDetailButton";
import { BlockedUser } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<BlockedUser>[] = [
  {
    accessorKey: "BlockedUserNickname",
    header: "닉네임",
    cell: ({ row }) => {
      // const id = row.original.blockedUserId as number;
      const nickname = row.getValue("BlockedUserNickname") as string;
      const id = row.original.blockedUserId as number;
      return <ProfileDetailButton id={id} nickname={nickname} />;
    },
  },

  {
    accessorKey: "blockedUserBirthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const joinDate = row.getValue("blockedUserBirthdate") as
        | string
        | undefined;

      return joinDate ? joinDate.replace(/-/g, ".").slice(2) : "-";
    },
  },
  {
    accessorKey: "blockingUserNickname",
    header: "차단한 유저 닉네임",
    cell: ({ row }) => {
      const nickname = row.getValue("blockingUserNickname") as string;
      const id = row.original.blockingUserId as number;
      return <ProfileDetailButton id={id} nickname={nickname} />;
    },
  },
  {
    accessorKey: "BlockedDate",
    header: "차단 날짜",
    cell: ({ row }) => {
      const blockedDate = row.getValue("BlockedDate") as string | undefined;

      return blockedDate ? blockedDate.replace(/-/g, ".") : "-";
    },
  },
];
