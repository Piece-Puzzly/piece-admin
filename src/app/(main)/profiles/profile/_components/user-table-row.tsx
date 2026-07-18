// /app/admin/users/user-table-row.tsx
"use client";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
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

  // pending_images 배열에서 라벨 포함된 목록 생성
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

  // 각 이미지별 reject 상태 (profileImageId -> reject)
  const [imageRejectMap, setImageRejectMap] = useState<Record<number, boolean>>({});
  // 소개글 reject 상태
  const [rejectDescription, setRejectDescription] = useState(false);

  // 데이터 변경 시 상태 초기화
  useEffect(() => {
    // 이전 반려 이력 기반 초기화 (새 심사는 모두 false)
    const initialMap: Record<number, boolean> = {};
    for (const img of user.pending_images ?? []) {
      initialMap[img.profileImageId] = false;
    }
    setImageRejectMap(initialMap);
    setRejectDescription(user.user_reject_history?.[0]?.reason_description ?? false);
  }, [user]);

  // 이미지 토글 핸들러
  const handleImageToggle = (profileImageId: number, pressed: boolean) => {
    setImageRejectMap((prev) => ({ ...prev, [profileImageId]: pressed }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const imageDecisions = (user.pending_images ?? []).map((img) => ({
        profileImageId: img.profileImageId,
        reject: imageRejectMap[img.profileImageId] ?? false,
      }));

      await updateProfileStatus(
        Number(user.user_id),
        imageDecisions,
        rejectDescription
      );
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
      <TableCell>
        <div className="flex gap-x-2 justify-center items-center flex-wrap">
          {user.profile ? (
            <>
              {/* 이미지별 버튼 (pending_images 순회) */}
              {pendingImagesWithLabel.map((img) => (
                <Toggle
                  key={img.profileImageId}
                  pressed={imageRejectMap[img.profileImageId] ?? false}
                  onPressedChange={(pressed) =>
                    handleImageToggle(img.profileImageId, pressed)
                  }
                  disabled={!debug && isApproved}
                  className="px-3 leading-6 min-w-[80px]"
                >
                  {img.label}
                </Toggle>
              ))}
              {/* 소개글 버튼 (항상 표시, 신규 심사에서만 활성) */}
              {!isApproved && (
                <Toggle
                  pressed={rejectDescription}
                  onPressedChange={setRejectDescription}
                  disabled={!debug && isApproved}
                  className="px-3 leading-6 min-w-[80px]"
                >
                  소개글
                </Toggle>
              )}
              {/* 심사 대상 없음 표시 */}
              {!hasPendingImages && isApproved && (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </>
          ) : (
            "-"
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {user.profile ? (
          <Button
            variant="submit"
            onClick={handleSave}
            disabled={
              isSaving ||
              (!debug && isApproved && !hasPendingImages)
            }
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
