"use client";

import ProfileDetailButton from "@/components/profile-detail-button";
import { BlockedUser } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<BlockedUser>[] = [
  {
    accessorKey: "BlockedUserNickname",
    header: "차단 당한 닉네임🚫",
    cell: ({ row }) => {
      const nickname = row.original.BlockedUserNickname as string;
      const id = row.original.blockedUserId as number;
      return <ProfileDetailButton userId={id} nickname={nickname} />;
    },
  },

  {
    size: 150,
    accessorKey: "blockedUserBirthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const joinDate = row.original.blockedUserBirthdate as string | undefined;

      return joinDate ? joinDate.replace(/-/g, ".").slice(2) : "-";
    },
  },
  {
    accessorKey: "blockingUserNickname",
    header: "차단한 유저 닉네임",
    cell: ({ row }) => {
      const nickname = row.original.blockingUserNickname as string;
      const id = row.original.blockingUserId as number;
      return <ProfileDetailButton userId={id} nickname={nickname} />;
    },
  },
  {
    accessorKey: "BlockedDate",
    header: "차단 날짜",
    cell: ({ row }) => {
      const blockedDate = row.original.BlockedDate as string | undefined;

      return blockedDate ? blockedDate.replace(/-/g, ".") : "-";
    },
  },
];
