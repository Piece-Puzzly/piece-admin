"use client";

import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { updateProfileStatus } from "@/lib/server";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useProfileTableStore } from "../../../../../providers/profile-table-provider";
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

      return <ProfileDetailButton userId={id} nickname={nickname} />;
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

      const profileStatusDetail = profileStatusInfo.find(
        (e) => e.value === profileStatus
      );

      return row.original.nickname ? (
        <div className="w-full justify-start bg-secondary px-[16px] py-[9px] md:py-[10px] rounded-md">
          <div className="flex items-center gap-[6px]">
            <div
              className="rounded-full h-[12px] w-[12px]"
              style={{
                backgroundColor: profileStatusDetail?.color,
              }}
            />
            {profileStatusDetail?.name}
          </div>
        </div>
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
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Button
      onClick={(e) => {
        form.handleSubmit(async () => {
          setLoading(true);
          const res = await updateProfileStatus(
            row.original.userId,
            form.getValues("rejectStatuses")[row.index].rejectImage,
            form.getValues("rejectStatuses")[row.index].rejectDescription
          );
          if (res.status !== "success") {
            toast.error(JSON.stringify(res));
          }
          setLoading(false);
          // 데이터 refetch
        })(e);
      }}
      disabled={loading || (!debug && row.original.profileStatus === "통과")}
      variant={"submit"}
      className="h-[40px] md:h-[44px] w-full min-w-[80px]"
    >
      {loading ? <Loader className="animate-spin" /> : "제출"}
    </Button>
  );
}
