"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { updateProfileStatus } from "@/lib/server";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ProfileDialog from "./_components/ProfileDialog";
import SubmitToggle from "./_components/SubmitToggle";
export type Profile = {
  userId?: number;
  nickname?: string;
  name?: string;
  birthdate?: string;
  phoneNumber?: string;
  joinDate?: string;
  profileStatus?: string;
  rejectStatus: { image?: boolean; description?: boolean };
  submit?: boolean;
};

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
      const id: number = row.original.userId!;
      const rejectStatus: { [key: string]: boolean } = row.getValue(
        "rejectStatus"
      ) as Profile["rejectStatus"];
      const rejectionType = [
        { name: "사진", key: "image" },
        { name: "소개글", key: "description" },
      ];

      return (
        <div className="grid grid-cols-2 gap-x-2 h-[46px]">
          {rejectionType.map(({ name }, i) => (
            <Toggle
              onClick={async () => {
                const a = {
                  [rejectionType[i].key]: !rejectStatus[rejectionType[i].key],
                  [rejectionType[i].key === "image" ? "description" : "image"]:
                    rejectStatus[
                      rejectionType[i].key === "image" ? "description" : "image"
                    ],
                };
                
                await updateProfileStatus(id, a.image, a.description);
              }}
              key={name}
              pressed={rejectStatus[rejectionType[i].key]}
              className="h-full  text-lg"
            >
              {name}
            </Toggle>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "submit",
    header: "제출",
    cell: ({ row }) => {
      const submit = row.getValue("submit") as Profile["submit"];
      return <SubmitToggle submit={submit as boolean} />;
    },
  },
];
