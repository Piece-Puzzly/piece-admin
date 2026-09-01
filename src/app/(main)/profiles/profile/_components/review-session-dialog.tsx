"use client";

import { useEffect, useState } from "react";
import { Check, Loader, X, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import ProfileImage from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUserById } from "@/lib/server";
import { ProfileDetail } from "@/lib/types";
import {
  PendingImageInfo,
  ReviewDecision,
  ReviewType,
  ImageDecision,
} from "../types.d";
import { reviewProfile } from "../actions";
import QuestionCard from "./question-card";

interface ReviewSessionDialogProps {
  profileId: number;
  userId: number;
  nickname: string;
  role: string;
  pendingImages: PendingImageInfo[];
  children: React.ReactNode;
}

type LocalDecision = ReviewDecision | null;

export function ReviewSessionDialog({
  profileId,
  userId,
  nickname,
  role,
  pendingImages,
  children,
}: ReviewSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 프로필 상세 (가치관톡 조회용)
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(null);

  // 로컬 결정 상태 (profileImageId -> decision)
  const [imageDecisionMap, setImageDecisionMap] = useState<Record<number, LocalDecision>>({});
  // 가치관톡 결정 (INITIAL만)
  const [valueTalkDecision, setValueTalkDecision] = useState<LocalDecision>(null);

  // 심사 타입 판단 (role 기반)
  const reviewType: ReviewType = role === "PENDING" ? "INITIAL" : "UPDATE";
  const isInitial = reviewType === "INITIAL";

  // 세션 타입 라벨
  const sessionTypeLabel = isInitial ? "신규 심사" : "사진 변경 심사";

  // 다이얼로그 열릴 때 초기화 및 프로필 상세 로드
  useEffect(() => {
    if (open) {
      // 결정 상태 초기화
      const initialDecisions: Record<number, LocalDecision> = {};
      pendingImages.forEach((img) => {
        initialDecisions[img.profileImageId] = null;
      });
      setImageDecisionMap(initialDecisions);
      setValueTalkDecision(null);

      // INITIAL 심사면 프로필 상세 로드 (가치관톡 표시용)
      if (isInitial && userId) {
        setIsLoading(true);
        getUserById(userId)
          .then((detail) => setProfileDetail(detail))
          .catch((err) => {
            console.error("프로필 상세 로드 실패:", err);
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      // 다이얼로그 닫힐 때 상태 초기화
      setImageDecisionMap({});
      setValueTalkDecision(null);
      setProfileDetail(null);
    }
  }, [open, pendingImages, isInitial, userId]);

  // 이미지 결정 변경 (로컬 상태만 변경, API 호출 없음)
  const handleImageDecision = (profileImageId: number, decision: LocalDecision) => {
    setImageDecisionMap((prev) => ({
      ...prev,
      [profileImageId]: decision,
    }));
  };

  // 가치관톡 결정 변경 (로컬 상태만 변경)
  const handleValueTalkDecision = (decision: LocalDecision) => {
    setValueTalkDecision(decision);
  };

  // 모든 항목 결정 완료 여부
  const allImagesDecided = pendingImages.every(
    (img) => imageDecisionMap[img.profileImageId] !== null
  );
  const valueTalkDecided = !isInitial || valueTalkDecision !== null;
  const allDecided = allImagesDecided && valueTalkDecided;

  // 최종 저장 (단일 API 호출)
  const handleSubmit = async () => {
    if (!allDecided) {
      toast.error("모든 항목에 대해 승인/반려를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 이미지 결정 배열 생성
      const imageDecisions: ImageDecision[] = pendingImages.map((img) => ({
        profileImageId: img.profileImageId,
        decision: imageDecisionMap[img.profileImageId] as ReviewDecision,
      }));

      // API 호출
      await reviewProfile(profileId, {
        imageDecisions,
        valueTalkDecision: isInitial ? (valueTalkDecision as ReviewDecision) : undefined,
      });

      toast.success("심사가 완료되었습니다.");
      setOpen(false);
    } catch (err) {
      console.error("심사 실패:", err);
      toast.error("심사 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 타입별로 분류 (MAIN 먼저, 그다음 ADDITIONAL을 displayOrder 순으로)
  const sortedImages = [...pendingImages].sort((a, b) => {
    if (a.type === "MAIN" && b.type !== "MAIN") return -1;
    if (a.type !== "MAIN" && b.type === "MAIN") return 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:w-[700px] max-h-[90vh] overflow-y-auto md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{nickname}</span>
            <Badge variant={isInitial ? "default" : "secondary"}>
              {sessionTypeLabel}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            각 항목을 승인 또는 반려한 후 최종 저장을 눌러주세요.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 이미지 심사 */}
            {sortedImages.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  이미지 ({sortedImages.length}개)
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {sortedImages.map((img) => (
                    <ReviewImageCard
                      key={img.profileImageId}
                      image={img}
                      decision={imageDecisionMap[img.profileImageId]}
                      onDecision={(decision) =>
                        handleImageDecision(img.profileImageId, decision)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 가치관톡 심사 (INITIAL만) */}
            {isInitial && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">가치관톡</h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm p-0 h-auto hover:underline"
                      >
                        소개글 보기
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="md:w-[500px] md:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{nickname}의 가치관톡</DialogTitle>
                        <DialogDescription>
                          유저가 작성한 가치관톡 응답입니다.
                        </DialogDescription>
                      </DialogHeader>
                      <ValueTalkViewer responses={profileDetail?.responses} />
                    </DialogContent>
                  </Dialog>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant={valueTalkDecision === "ACCEPT" ? "default" : "secondary"}
                      className={cn(
                        valueTalkDecision === "ACCEPT" && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => handleValueTalkDecision("ACCEPT")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant={valueTalkDecision === "REJECT" ? "default" : "secondary"}
                      className={cn(
                        valueTalkDecision === "REJECT" && "bg-red-600 hover:bg-red-700"
                      )}
                      onClick={() => handleValueTalkDecision("REJECT")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      반려
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !allDecided || (!isInitial && pendingImages.length === 0)}
          >
            {isSubmitting ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            최종 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 가치관톡 뷰어 컴포넌트
function ValueTalkViewer({
  responses,
}: {
  responses?: { title: string; category: string; answer: string }[];
}) {
  const [page, setPage] = useState(1);
  const totalPages = responses?.length ?? 0;

  if (!responses || responses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        등록된 가치관톡이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <QuestionCard data={responses[page - 1]} />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// 개별 이미지 카드 컴포넌트
function ReviewImageCard({
  image,
  decision,
  onDecision,
}: {
  image: PendingImageInfo;
  decision: LocalDecision;
  onDecision: (decision: LocalDecision) => void;
}) {
  const typeLabel = image.type === "MAIN" ? "메인" : "추가";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ProfileImage
          src={image.imageUrl}
          alt="프로필 이미지"
          width={100}
          height={100}
          className={cn(
            "rounded-lg object-cover w-[100px] h-[100px] border-2",
            decision === "ACCEPT" && "border-green-500",
            decision === "REJECT" && "border-red-500",
            decision === null && "border-muted"
          )}
          fallback={
            <div className="flex w-[100px] h-[100px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              사진 없음
            </div>
          }
        />
        <div className="absolute -top-1 -left-1 bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded">
          {typeLabel}
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="sm"
          variant={decision === "ACCEPT" ? "default" : "secondary"}
          className={cn(
            "h-7 px-2",
            decision === "ACCEPT" && "bg-green-600 hover:bg-green-700"
          )}
          onClick={() => onDecision("ACCEPT")}
        >
          <Check className="h-3 w-3 mr-1" />
          승인
        </Button>
        <Button
          size="sm"
          variant={decision === "REJECT" ? "default" : "secondary"}
          className={cn(
            "h-7 px-2",
            decision === "REJECT" && "bg-red-600 hover:bg-red-700"
          )}
          onClick={() => onDecision("REJECT")}
        >
          <X className="h-3 w-3 mr-1" />
          반려
        </Button>
      </div>
    </div>
  );
}