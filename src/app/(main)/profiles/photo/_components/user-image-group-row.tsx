"use client";

import { useDebug } from "@/app/hooks/use-debug";
import PhotoDetailButton from "@/components/detail-buttons/photo-detail-button";
import ProfileImage from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateProfileImageStatus } from "@/lib/server";
import { cn, toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Check, Loader, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileImageData } from "../actions";

interface UserImageGroupRowProps {
  userId: bigint;
  nickname: string | null;
  images: ProfileImageData[];
}

type Decision = "ACCEPTED" | "REJECTED" | null;

export function UserImageGroupRow({ userId, nickname, images }: UserImageGroupRowProps) {
  const debug = useDebug((e) => e.debug);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 각 이미지별 심사 결정 (profileImageId -> decision)
  const [decisionMap, setDecisionMap] = useState<Record<string, Decision>>(() => {
    const initial: Record<string, Decision> = {};
    images.forEach((img) => {
      initial[String(img.profile_image_id)] = null; // 기본값: 미선택
    });
    return initial;
  });

  const handleDecision = (profileImageId: bigint, decision: Decision) => {
    setDecisionMap((prev) => ({
      ...prev,
      [String(profileImageId)]: decision,
    }));
  };

  const handleSubmit = async () => {
    // 모든 PENDING 이미지에 대해 결정이 내려졌는지 확인
    const pendingImages = images.filter((img) => img.status === "PENDING");
    const allDecided = pendingImages.every(
      (img) => decisionMap[String(img.profile_image_id)] !== null
    );

    if (!allDecided) {
      toast.error("모든 이미지에 대해 승인/반려를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 결정이 내려진 이미지만 API 호출
      await Promise.all(
        pendingImages.map((img) => {
          const decision = decisionMap[String(img.profile_image_id)];
          return UpdateProfileImageStatus(
            Number(img.profile_image_id),
            decision === "ACCEPTED"
          );
        })
      );
      toast.success("저장되었습니다.");
    } catch (error) {
      console.error("API 호출 오류:", error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 가장 최근 생성일
  const latestCreatedAt = images.reduce((latest, img) => {
    if (!img.created_at) return latest;
    if (!latest) return img.created_at;
    return img.created_at > latest ? img.created_at : latest;
  }, null as Date | null);

  // PENDING 이미지가 있는지 확인
  const hasPendingImages = images.some((img) => img.status === "PENDING");

  return (
    <TableRow>
      {/* 유저 정보 */}
      <TableCell>
        <PhotoDetailButton
          id={Number(userId)}
          nickname={nickname}
        />
      </TableCell>

      {/* 생성일 (가장 최근) */}
      <TableCell>
        {latestCreatedAt ? (
          <Tooltip>
            <TooltipTrigger>
              {toLocaleDateString(latestCreatedAt)}
            </TooltipTrigger>
            <TooltipContent>{toLocaleString(latestCreatedAt)}</TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </TableCell>

      {/* 이미지 목록 (각각 승인/반려 버튼) */}
      <TableCell>
        <div className="flex gap-4 flex-wrap">
          {images.map((img) => {
            const decision = decisionMap[String(img.profile_image_id)];
            const isPending = img.status === "PENDING";
            const isDisabled = !isPending && !debug;

            return (
              <div key={String(img.profile_image_id)} className="flex flex-col items-center gap-2">
                {/* 이미지 */}
                <div className="relative">
                  <ProfileImage
                    src={img.image_url}
                    alt="프로필 이미지"
                    width={80}
                    height={80}
                    className={cn(
                      "rounded-md object-cover w-20 h-20 shrink-0 border-2",
                      decision === "ACCEPTED" && "border-green-500",
                      decision === "REJECTED" && "border-red-500",
                      decision === null && isPending && "border-yellow-400",
                      !isPending && "border-gray-300 opacity-50"
                    )}
                    fallback={
                      <div className="flex w-20 h-20 shrink-0 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        사진 없음
                      </div>
                    }
                  />
                  {/* 이미 처리된 상태 표시 */}
                  {!isPending && (
                    <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs px-1 rounded">
                      {img.status === "ACCEPTED" ? "승인됨" : img.status === "REJECTED" ? "반려됨" : img.status}
                    </div>
                  )}
                </div>

                {/* 승인/반려 버튼 */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={decision === "ACCEPTED" ? "default" : "outline"}
                    className={cn(
                      "h-7 px-2",
                      decision === "ACCEPTED" && "bg-green-600 hover:bg-green-700"
                    )}
                    onClick={() => handleDecision(img.profile_image_id, "ACCEPTED")}
                    disabled={isDisabled}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    승인
                  </Button>
                  <Button
                    size="sm"
                    variant={decision === "REJECTED" ? "default" : "outline"}
                    className={cn(
                      "h-7 px-2",
                      decision === "REJECTED" && "bg-red-600 hover:bg-red-700"
                    )}
                    onClick={() => handleDecision(img.profile_image_id, "REJECTED")}
                    disabled={isDisabled}
                  >
                    <X className="h-3 w-3 mr-1" />
                    반려
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </TableCell>

      {/* 제출 버튼 */}
      <TableCell>
        <Button
          variant="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || !hasPendingImages}
          className="min-w-[80px]"
        >
          {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : "제출"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
