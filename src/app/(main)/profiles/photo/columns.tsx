"use client";

import { Button } from "@/components/ui/button";
import { UserProfileValidationResponse } from "@/lib/types";
import { formatPhoneNumber } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { submitDebug } from "@/lib/debugFlags";
import { updateProfileStatus } from "@/lib/server";
import { toast } from "sonner";
import PhotoDetailButton from "./_components/PhotoDetailButton";

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
    accessorKey: "photo",
    header: "사진 확인",
    cell: ({ row }) => {
      const id = row.original.userId as number;
      const nickname = row.original.nickname as string;

      return <PhotoDetailButton id={id} nickname={nickname} />;
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
    accessorKey: "rejectStatus",
    header: "사진 통과 여부",

    cell: () => {
      return <div></div>;
      // return (
      //   <RejectedStatusToggle
      //     profileStatus={profileStatus}
      //     rowData={row.original}
      //   />
      // );
    },
  },
  {
    accessorKey: "submit",
    header: "제출",
    cell: ({ row }) => {
      const id = row.original.userId as number;
      return <div></div>;
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
          disabled={!submitDebug && row.original.profileStatus === "통과"}
          variant={"submit"}
          className="h-[40px] md:h-[44px] w-full min-w-[80px]"
        >
          제출
        </Button>
      );
    },
  },
];
