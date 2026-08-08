"use client";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import ProfileStatus from "@/components/profile-status";
import { Button } from "@/components/ui/button";
import { roleNameMap } from "@/lib/constants";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, toLocaleDateString, toLocaleString } from "@/lib/utils";
import { UserData } from "../types";
import { ReviewSessionDialog } from "./review-session-dialog";

interface UserTableRowProps {
  user: UserData;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const debug = useDebug((e) => e.debug);

  // 탈퇴 유저: 닉네임이 "_d_"로 시작하는지로 판별
  const isWithdrawn = user.profile?.nickname?.startsWith("_d_") ?? false;

  // 심사 가능 조건:
  // 1. 프로필이 있고 탈퇴하지 않음
  // 2. role=PENDING (신규 심사) 또는 PENDING 이미지가 있음 (사진 변경 심사)
  const hasPendingImages = (user.pendingImages?.length ?? 0) > 0;
  const isInitialReview = user.role === "PENDING";
  const canReview =
    user.profile !== null && !isWithdrawn && (isInitialReview || hasPendingImages);

  return (
    <TableRow
      key={user.user_id}
      className={cn(isWithdrawn && "bg-destructive/5 hover:bg-destructive/10")}
    >
      <TableCell className="font-medium">{user.user_id}</TableCell>
      <TableCell>
        <ProfileDetailButton
          userId={Number(user.user_id)}
          nickname={user.profile?.nickname || ""}
          userRole={user.role}
        />
      </TableCell>
      <TableCell>
        {user.profile?.birthdate
          ? toLocaleDateString(user.profile.birthdate)
          : "-"}
      </TableCell>
      <TableCell>{user.phone ?? "-"}</TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            {user.created_at ? toLocaleDateString(user.created_at) : "-"}
          </TooltipTrigger>
          <TooltipContent>
            {user.created_at ? toLocaleString(user.created_at) : "-"}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        {user.role ? roleNameMap[user.role] ?? user.role : "-"}
      </TableCell>
      <TableCell>
        {user.profile?.profile_status ? (
          <ProfileStatus status={user.profile?.profile_status} />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-center">
        {user.profile && user.profile_id ? (
          <ReviewSessionDialog
            profileId={Number(user.profile_id)}
            userId={Number(user.user_id)}
            nickname={user.profile.nickname}
            role={user.role ?? ""}
            pendingImages={user.pendingImages ?? []}
          >
            <Button
              variant="submit"
              disabled={!canReview && !debug}
              className="min-w-[80px]"
            >
              심사
            </Button>
          </ReviewSessionDialog>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
