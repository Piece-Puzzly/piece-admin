"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfileStatus } from "@/lib/server";
import { Profile } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ProfileDialog from "./_components/ProfileDialog";
import RejectedStatusToggle from "./_components/RejectedStatusToggle";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: "nickname",
    header: "매칭 프로필",
    cell: ({ row }) => {
      const id = row.original.userId as number;
      const nickname = row.getValue("nickname") as string;

      return <ProfileDialog id={id} nickname={nickname} />;
    },
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => {
      // const id = row.original.userId;
      const name = row.getValue("name") as string;
      return name || "-";
    },
  },
  {
    accessorKey: "birthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const birthDate = row.getValue("birthdate") as string;

      return birthDate ? birthDate.replace(/-/g, ".") : "-";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "전화번호",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string;

      return phoneNumber ? formatPhoneNumber(phoneNumber) : "-";
    },
  },
  {
    accessorKey: "joinDate",
    header: "가입일",
    cell: ({ row }) => {
      const joinDate = row.getValue("joinDate") as Profile["joinDate"];

      return joinDate ? joinDate.replace(/-/g, ".") : "-";
    },
  },
  {
    accessorKey: "profileStatus",
    header: "상태",
    cell: ({ row }) => {
      const profileStatus = row.getValue(
        "profileStatus"
      ) as Profile["profileStatus"];

      const menu = [
        { name: "보류", color: "#FF3059" },
        { name: "미완료", color: "#6F00FB" },
        { name: "수정 제출", color: "#22CB52" },
        { name: "통과", color: "#CBD1D9" },
      ];
      return (
        <Select value={profileStatus}>
          <SelectTrigger className="w-full !h-[46px] text-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {menu.map(({ name, color }) => (
              <SelectItem key={name} value={name}>
                <div
                  className="rounded-full h-[12px] w-[12px]"
                  style={{ backgroundColor: color }}
                />
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "rejectStatus",
    header: "부적격",
    cell: ({ row }) => {
      const rejectStatus: { [key: string]: boolean } = row.getValue(
        "rejectStatus"
      ) as Profile["rejectStatus"];
      const profileStatus = row.getValue(
        "profileStatus"
      ) as Profile["profileStatus"];
      // const profileStatus: boolean = row.getValue("profileStatus");

      return (
        <RejectedStatusToggle
          profileStatus={profileStatus}
          rejectStatus={rejectStatus}
        />
      );
    },
  },
  {
    accessorKey: "submit",
    header: "제출",
    cell: ({ row }) => {
      const submit = row.getValue("submit") as Profile["submit"];
      const rejectStatus = row.getValue(
        "rejectStatus"
      ) as Profile["rejectStatus"];
      const id = row.original.userId as number;

      return (
        <Button
          onClick={async () => {
            await updateProfileStatus(
              id,
              rejectStatus.image!,
              rejectStatus.description!
            );
          }}
          disabled={submit}
          variant={"outline"}
          className="h-[46px] w-full text-lg border-foreground disabled:bg-[#CBD1D9] disabled:border-0"
        >
          제출
        </Button>
      );
    },
  },
];
