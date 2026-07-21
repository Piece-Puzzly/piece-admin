"use client";

import { useEffect, useState } from "react";
import { Check, Loader, X, RefreshCw } from "lucide-react";
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
import {
  ReviewSession,
  ReviewSessionImage,
  ReviewDecision,
} from "../types.d";
import {
  createReviewSession,
  getOpenSession,
  reviewItem,
  commitReviewSession,
} from "../actions";

interface ReviewSessionDialogProps {
  profileId: number;
  userId: number;
  nickname: string;
  children: React.ReactNode;
}

type LocalDecision = "ACCEPT" | "REJECT" | null;

export function ReviewSessionDialog({
  profileId,
  userId,
  nickname,
  children,
}: ReviewSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로컬 결정 상태 (sessionImageId -> decision)
  const [decisionMap, setDecisionMap] = useState<Record<number, LocalDecision>>({});

  // 다이얼로그 열릴 때 세션 로드/생성
  const loadSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 먼저 열린 세션이 있는지 확인
      let existingSession = await getOpenSession(profileId);

      if (!existingSession) {
        // 없으면 새 세션 생성
        existingSession = await createReviewSession(profileId);
      }

      setSession(existingSession);

      // 기존 결정 상태 복원
      const initialDecisions: Record<number, LocalDecision> = {};
      existingSession.items.forEach((item) => {
        initialDecisions[item.id] =
          item.decision === "PENDING" ? null : (item.decision as LocalDecision);
      });
      setDecisionMap(initialDecisions);
    } catch (err) {
      console.error("세션 로드 실패:", err);
      setError("심사 세션을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadSession();
    } else {
      // 다이얼로그 닫힐 때 상태 초기화
      setSession(null);
      setDecisionMap({});
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profileId]);

  // 항목 결정 변경
  const handleDecision = async (sessionImageId: number, decision: LocalDecision) => {
    if (!session || !decision) return;

    const prevDecision = decisionMap[sessionImageId];
    setDecisionMap((prev) => ({
      ...prev,
      [sessionImageId]: decision,
    }));

    try {
      await reviewItem(session.sessionId, sessionImageId, decision);
    } catch (err) {
      console.error("결정 저장 실패:", err);
      toast.error("결정 저장에 실패했습니다.");
      // 롤백
      setDecisionMap((prev) => ({
        ...prev,
        [sessionImageId]: prevDecision,
      }));
    }
  };

  // 최종 저장 (커밋)
  const handleCommit = async () => {
    if (!session) return;

    // 모든 항목에 결정이 내려졌는지 확인
    const allDecided = session.items.every(
      (item) => decisionMap[item.id] !== null
    );

    if (!allDecided) {
      toast.error("모든 항목에 대해 승인/반려를 선택해주세요.");
      return;
    }

    setIsCommitting(true);
    try {
      await commitReviewSession(session.sessionId);
      toast.success("심사가 완료되었습니다.");
      setOpen(false);
    } catch (err) {
      console.error("커밋 실패:", err);
      toast.error("최종 저장에 실패했습니다.");
    } finally {
      setIsCommitting(false);
    }
  };

  // 이미지 항목과 가치관톡 항목 분리
  const imageItems = session?.items.filter((item) => item.itemType !== "VALUE_TALK") || [];
  const valueTalkItem = session?.items.find((item) => item.itemType === "VALUE_TALK");

  // 세션 타입 라벨
  const sessionTypeLabel = session?.sessionType === "INITIAL" ? "신규 심사" : "사진 변경 심사";

  // 모든 항목 결정 완료 여부
  const allDecided = session?.items.every((item) => decisionMap[item.id] !== null) ?? false;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:w-[700px] max-h-[90vh] overflow-y-auto md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{nickname}</span>
            {session && (
              <Badge variant={session.sessionType === "INITIAL" ? "default" : "secondary"}>
                {sessionTypeLabel}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            각 항목을 승인 또는 반려한 후 최종 저장을 눌러주세요.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={loadSession}>
              <RefreshCw className="h-4 w-4 mr-2" />
              다시 시도
            </Button>
          </div>
        ) : session ? (
          <div className="space-y-6">
            {/* 이미지 심사 */}
            {imageItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  이미지 ({imageItems.length}개)
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {imageItems.map((item) => (
                    <ReviewItemCard
                      key={item.id}
                      item={item}
                      decision={decisionMap[item.id]}
                      onDecision={(decision) => handleDecision(item.id, decision)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 가치관톡 심사 */}
            {valueTalkItem && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">가치관톡</h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <span className="text-sm">소개글 심사</span>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant={decisionMap[valueTalkItem.id] === "ACCEPT" ? "default" : "secondary"}
                      className={cn(
                        decisionMap[valueTalkItem.id] === "ACCEPT" && "bg-green-600 hover:bg-green-700"
                      )}
                      onClick={() => handleDecision(valueTalkItem.id, "ACCEPT")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant={decisionMap[valueTalkItem.id] === "REJECT" ? "default" : "secondary"}
                      className={cn(
                        decisionMap[valueTalkItem.id] === "REJECT" && "bg-red-600 hover:bg-red-700"
                      )}
                      onClick={() => handleDecision(valueTalkItem.id, "REJECT")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      반려
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            onClick={handleCommit}
            disabled={isCommitting || !allDecided || !session}
          >
            {isCommitting ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            최종 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 개별 항목 카드 컴포넌트
function ReviewItemCard({
  item,
  decision,
  onDecision,
}: {
  item: ReviewSessionImage;
  decision: LocalDecision;
  onDecision: (decision: LocalDecision) => void;
}) {
  const typeLabel = item.itemType === "MAIN_IMAGE" ? "메인" : "추가";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ProfileImage
          src={item.imageUrl}
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
