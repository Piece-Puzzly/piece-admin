"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/profile-detail-button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { updateProfileStatus } from "@/lib/server";
import { toast } from "sonner";
import { useProfileTableStore } from "./profile-table-provider";
const profileStatusInfo = [
  { value: "보류", name: "반려", color: "#FF3059" },
  { value: "미완료", name: "미완료", color: "#6F00FB" },
  { value: "수정 제출", name: "수정 제출", color: "#22CB52" },
  { value: "통과", name: "통과", color: "#CBD1D9" },
];
export const columns: ColumnDef<Profile>[] = [
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

      return (
        <ProfileDetailButton
          id={id}
          nickname={nickname}
          description={row.original.description}
        />
      );
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

      return row.original.nickname ? (
        <Select value={profileStatus}>
          <SelectTrigger className="w-full ">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {profileStatusInfo.map(({ value, name, color }) => (
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
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "rejectStatus",
    header: "부적격",

    cell: ({ row }) => {
      return row.original.nickname ? (
        <RejectStatusToggleGroup row={row} />
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "submit",
    header: "제출",
    cell: ({ row }) =>
      row.original.nickname ? <SubmitButton row={row} /> : "-",
  },
];

const rejectionStatusInfo: {
  label: "사진" | "소개글";
  key: "rejectImage" | "rejectDescription";
}[] = [
  { label: "사진", key: "rejectImage" },
  { label: "소개글", key: "rejectDescription" },
];

function RejectStatusToggleGroup({ row }: { row: Row<Profile> }) {
  const debug = useDebug((e) => e.debug);
  const form = useProfileTableStore((e) => e.form);
  return (
    <div className="grid grid-cols-2 gap-x-2 h-[46px] min-w-[180px] items-center">
      {rejectionStatusInfo.map(({ label, key }) => (
        <FormField
          key={key}
          control={form.control}
          name={`rejectStatuses.${row.index}.${key}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Toggle
                  onPressedChange={field.onChange}
                  pressed={field.value}
                  disabled={!debug && row.original.profileStatus === "통과"}
                  className="h-[40px] md:h-[44px] px-3 py-[10px] leading-6 min-w-[80px]"
                >
                  {label}
                </Toggle>
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}

function SubmitButton({ row }: { row: Row<Profile> }) {
  const debug = useDebug((e) => e.debug);
  const form = useProfileTableStore((e) => e.form);

  return (
    <Button
      onClick={form.handleSubmit(async () => {
        const res = await updateProfileStatus(
          row.original.userId,
          form.getValues("rejectStatuses")[row.index].rejectImage,
          form.getValues("rejectStatuses")[row.index].rejectDescription
        );
        if (res.status !== "success") {
          toast.error(JSON.stringify(res));
        }

        // 데이터 refetch
      })}
      disabled={!debug && row.original.profileStatus === "통과"}
      variant={"submit"}
      className="h-[40px] md:h-[44px] w-full min-w-[80px]"
    >
      제출
    </Button>
  );
}
