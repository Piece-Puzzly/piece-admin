"use client";

import { useDebug } from "@/app/hooks/use-debug";
import PhotoDetailButton from "@/components/detail-buttons/photo-detail-button";
import ProfileImage from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateProfileImageStatus } from "@/lib/server";
import { toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileImageData } from "../actions";

interface UserImageGroupRowProps {
  userId: bigint;
  nickname: string | null;
  images: ProfileImageData[];
}

// 이미지 타입에 따른 라벨 생성
function getImageLabel(image: ProfileImageData, index: number): string {
  // type 필드가 있으면 사용, 없으면 인덱스 기반
  return `사진${index + 1}`;
}

export function UserImageGroupRow({ userId, nickname, images }: UserImageGroupRowProps) {
  const debug = useDebug((e) => e.debug);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 각 이미지별 reject 상태 (profileImageId -> reject 여부)
  // true = 반려, false = 승인
  const [rejectMap, setRejectMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    images.forEach((img) => {
      initial[String(img.profile_image_id)] = false; // 기본값: 승인
    });
    return initial;
  });

  const handleToggle = (profileImageId: bigint, pressed: boolean) => {
    setRejectMap((prev) => ({
      ...prev,
      [String(profileImageId)]: pressed,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 각 이미지에 대해 API 호출
      await Promise.all(
        images.map((img) => {
          const reject = rejectMap[String(img.profile_image_id)] ?? false;
          return UpdateProfileImageStatus(
            Number(img.profile_image_id),
            !reject // accepted = !reject
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

      {/* 이미지 목록 (각각 토글 가능) */}
      <TableCell>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, index) => {
            const isRejected = rejectMap[String(img.profile_image_id)] ?? false;
            return (
              <div key={String(img.profile_image_id)} className="flex flex-col items-center gap-1">
                <ProfileImage
                  src={img.image_url}
                  alt={getImageLabel(img, index)}
                  width={64}
                  height={64}
                  className={`rounded-md object-cover w-16 h-16 shrink-0 border-2 ${
                    isRejected ? "border-red-500" : "border-green-500"
                  }`}
                  fallback={
                    <div className="flex w-16 h-16 shrink-0 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                      사진 없음
                    </div>
                  }
                />
                <Toggle
                  pressed={isRejected}
                  onPressedChange={(pressed) => handleToggle(img.profile_image_id, pressed)}
                  className="text-xs px-2 py-1 h-6"
                  disabled={!debug && img.status !== "PENDING"}
                >
                  {isRejected ? "반려" : "승인"}
                </Toggle>
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
          disabled={isSubmitting}
          className="min-w-[80px]"
        >
          {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : "제출"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
