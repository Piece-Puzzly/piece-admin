// /app/admin/users/user-table-row.tsx
"use client";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import ProfileImage from "@/components/profile-image";
import ProfileStatus from "@/components/profile-status";
import { Button } from "@/components/ui/button";
import { roleNameMap } from "@/lib/constants";
import { TableCell, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateProfileStatus } from "@/lib/server";
import { cn, toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { PendingImage, UserData } from "../types";

interface UserTableRowProps {
  user: UserData;
}

// 이미지 타입에 따른 라벨 생성
function getImageLabel(image: PendingImage, additionalIndex: number): string {
  if (image.type === "MAIN") {
    return "정면사진";
  }
  return `기본사진${additionalIndex}`;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const [isSaving, setIsSaving] = useState(false);
  const debug = useDebug((e) => e.debug);

  // 탈퇴 유저 판별
  const isWithdrawn = user.profile?.nickname?.startsWith("탈퇴_") ?? false;

  // pending_images 배열에서 라벨 포함된 목록 생성 (열람용)
  const pendingImagesWithLabel = useMemo(() => {
    const images = user.pending_images ?? [];
    let additionalIndex = 1;
    return images.map((img) => {
      const label = getImageLabel(img, additionalIndex);
      if (img.type === "ADDITIONAL") {
        additionalIndex++;
      }
      return { ...img, label };
    });
  }, [user.pending_images]);

  // 소개글 reject 상태 (가치관Talk)
  const [rejectDescription, setRejectDescription] = useState(false);

  // 데이터 변경 시 상태 초기화
  useEffect(() => {
    setRejectDescription(user.user_reject_history?.[0]?.reason_description ?? false);
  }, [user]);

  // 저장 핸들러 (가치관Talk만 처리)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileStatus(Number(user.user_id), rejectDescription);
      toast.success("저장되었습니다.");
    } catch (error) {
      console.error("API 호출 오류:", error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const isApproved = user.profile?.profile_status === "APPROVED";
  const hasPendingImages = pendingImagesWithLabel.length > 0;

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

      {/* 심사 대기 중인 이미지 미리보기 (열람용, 심사는 사진 심사 탭에서) */}
      <TableCell>
        <div className="flex gap-2 items-center">
          {hasPendingImages ? (
            pendingImagesWithLabel.map((img) => (
              <Tooltip key={img.profileImageId}>
                <TooltipTrigger>
                  <ProfileImage
                    src={img.imageUrl}
                    alt={img.label}
                    width={40}
                    height={40}
                    className="rounded-md object-cover w-10 h-10 shrink-0 border border-yellow-400"
                    fallback={
                      <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        ?
                      </div>
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>{img.label} (심사 대기)</TooltipContent>
              </Tooltip>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      </TableCell>

      {/* 가치관Talk 심사 */}
      <TableCell>
        <div className="flex gap-x-2 justify-center items-center">
          {user.profile && !isApproved ? (
            <Toggle
              pressed={rejectDescription}
              onPressedChange={setRejectDescription}
              disabled={!debug && isApproved}
              className="px-3 leading-6 min-w-[80px]"
            >
              가치관Talk
            </Toggle>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        {user.profile && !isApproved ? (
          <Button
            variant="submit"
            onClick={handleSave}
            disabled={isSaving || (!debug && isApproved)}
            className="w-full min-w-[80px]"
          >
            {isSaving ? <Loader className="animate-spin" /> : "저장"}
          </Button>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
