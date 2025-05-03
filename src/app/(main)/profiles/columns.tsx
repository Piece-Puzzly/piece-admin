"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfileValidationResponse } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import ProfileDetailButton from "@/components/ProfileDetailButton";
import { summitDebug } from "@/lib/debugFlags";
import { updateProfileStatus } from "@/lib/server";
import { toast } from "sonner";
import RejectedStatusToggle from "./_components/RejectedStatusToggle";

export const columns: ColumnDef<UserProfileValidationResponse>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => {
      const id = row.original.userId as number;

      return id;
    },
  },
  {
    accessorKey: "nickname",
    header: "매칭 프로필",
    cell: ({ row }) => {
      const id = row.original.userId as number;
      const nickname = row.getValue("nickname") as string;

      return <ProfileDetailButton id={id} nickname={nickname} />;
    },
  },

  {
    accessorKey: "birthdate",
    header: "생년월일",
    cell: ({ row }) => {
      const birthDate = row.original.birthdate as string;

      return birthDate ? birthDate.replace(/-/g, ".").slice(2) : "-";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "전화번호",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber as string;

      return phoneNumber ? formatPhoneNumber(phoneNumber) : "-";
    },
  },
  {
    accessorKey: "joinDate",
    header: "가입일",
    cell: ({ row }) => {
      const joinDate = row.original.joinDate;

      return joinDate ? joinDate.replace(/-/g, ".").slice(2) : "-";
    },
  },
  {
    accessorKey: "profileStatus",
    header: "상태",
    cell: ({ row }) => {
      const profileStatus = row.original.profileStatus;

      const menu = [
        { value: "보류", name: "반려", color: "#FF3059" },
        { value: "미완료", name: "미완료", color: "#6F00FB" },
        { value: "수정 제출", name: "수정 제출", color: "#22CB52" },
        { value: "통과", name: "통과", color: "#CBD1D9" },
      ];
      return (
        <Select value={profileStatus}>
          <SelectTrigger className="w-full ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {menu.map(({ value, name, color }) => (
              <SelectItem key={value} value={value}>
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
      const profileStatus = row.original.profileStatus;

      return (
        <RejectedStatusToggle
          profileStatus={profileStatus}
          rowData={row.original}
        />
      );
    },
  },
  {
    accessorKey: "submit",
    header: "제출",
    cell: ({ row }) => {
      const id = row.original.userId as number;

      return (
        <Button
          onClick={async () => {
            const res = await updateProfileStatus(
              id,
              row.original.rejectImage,
              row.original.rejectDescription!
            );
            if (res.status !== "success") {
              toast.error(JSON.stringify(res));
            }
          }}
          disabled={!summitDebug && row.original.profileStatus === "통과"}
          variant={"summit"}
          className="h-[40px] md:h-[44px] w-full min-w-[80px]"
        >
          제출
        </Button>
      );
    },
  },
];
