"use client";

import { useDebug } from "@/app/hooks/use-debug";
import PhotoDetailButton from "@/components/detail-buttons/photo-detail-button";
import ImageStatus from "@/components/image-status";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateProfileImageStatus } from "@/lib/server";
import { toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UpdateProfileImageToggles } from "./update-profile-image-toggles";

// 타입 정의

export function ImageTableRow({ image }: { image: ProfileImageData }) {
  // 1. Row 내부에서 심사 상태와 제출 로딩 상태를 관리
  const [reviewStatus, setReviewStatus] = useState(image.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debug = useDebug((e) => e.debug);
  // 부모 데이터 변경 시 내부 상태 동기화
  useEffect(() => {
    setReviewStatus(image.status);
  }, [image.status]);

  // 2. 제출 핸들러
  const handleSubmit = async () => {
    if (reviewStatus === "PENDING") {
      toast.error("승인 또는 반려를 선택해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    const result = await UpdateProfileImageStatus(
      Number(image.profile_image_id),
      reviewStatus === "ACCEPTED"
    );

    if (result.status === "success") {
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  // 심사 컨트롤은 PENDING 상태일 때만 활성화
  const isReviewable = image.status === "PENDING";

  return (
    <TableRow key={image.profile_image_id}>
      <TableCell className="flex justify-center">
        {image.image_url ? (
          <Image
            src={image.image_url}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-md object-cover w-16 h-16 shrink-0"
          />
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell>
        {image.profile?.user_table?.user_id ? (
          <PhotoDetailButton
            id={Number(image.profile?.user_table.user_id)}
            nickname={image.profile?.nickname}
          />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        {image.created_at ? (
          <Tooltip>
            <TooltipTrigger>
              {toLocaleDateString(image.created_at)}
            </TooltipTrigger>
            <TooltipContent>{toLocaleString(image.created_at)}</TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="">
        <ImageStatus status={image.status} />
      </TableCell>

      {/* 3. '심사' 컬럼: 승인/반려 버튼 그룹 */}
      <TableCell>
        <UpdateProfileImageToggles
          currentStatus={reviewStatus}
          onStatusChange={setReviewStatus}
          disabled={!isReviewable && !debug}
        />
      </TableCell>

      {/* 4. '제출' 컬럼: 제출 버튼 */}
      <TableCell>
        <Button
          variant={"submit"}
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            (!debug &&
              (image.status !== "PENDING" || reviewStatus === "PENDING"))
          }
          className="max-w-[300px] w-full"
        >
          {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : "제출"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
