"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface BlockedUser {
  blockedUserId: number; // 차단된 사용자 ID
  blockedUserNickname: string; // 차단된 사용자 닉네임
  blockedUserName: string; // 차단된 사용자 이름
  blockedUserBirthdate: string; // 차단된 사용자의 생년월일 (yyyy-MM-dd 형식)

  blockingUserId: number; // 차단한 사용자 ID
  blockingUserNickname: string; // 차단한 사용자 닉네임
  blockingUserName: string; // 차단한 사용자 이름

  blockedDate: string; // 차단된 날짜 (yyyy-MM-dd 형식)
}

export const columns: ColumnDef<BlockedUser>[] = [
  {
    accessorKey: "blockedUserNickname",
    header: "닉네임",
    cell: ({ row }) => {
      // const id = row.original.blockedUserId as number;
      const nickname = row.getValue("blockedUserNickname");

      return nickname || "-";
    },
  },
  {
    accessorKey: "blockedUserName",
    header: "이름",
    cell: ({ row }) => {
      const name = row.getValue("blockedUserName") as string;
      return name || "-";
    },
  },
  {
    accessorKey: "blockedUserBirthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const joinDate = row.getValue("blockedUserBirthdate") as
        | string
        | undefined;

      return joinDate ? joinDate.replace(/-/g, ".") : "-";
    },
  },
  {
    accessorKey: "blockingUserNickname",
    header: "차단한 유저 닉네임",
    cell: ({ row }) => {
      const nickname = row.getValue("blockingUserNickname") as string;

      return nickname || "-";
    },
  },
  {
    accessorKey: "blockingUserName",
    header: "차단한 유저 이름",
    cell: ({ row }) => {
      const blockingUserName = row.getValue("blockingUserName") as string;

      return blockingUserName || "-";
    },
  },

  {
    accessorKey: "blockedDate",
    header: "차단 날짜",
    cell: ({ row }) => {
      const blockedDate = row.getValue("blockedDate") as string | undefined;

      return blockedDate ? blockedDate.replace(/-/g, ".") : "-";
    },
  },
];
