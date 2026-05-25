"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPuzzleInfo,
  getRewardPuzzleHistory,
  grantPuzzle,
  type PuzzleInfo,
  type PuzzleType,
  type RewardPuzzle,
} from "@/lib/actions/puzzle";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "./info-card";

const formatDateTime = (value: string | null) =>
  value ? new Date(value).toLocaleString("ko-KR", { timeZone: "UTC" }) : "-";

// 보상 퍼즐 만료 옵션 (일)
const EXPIRY_OPTIONS = [30, 60, 90] as const;

export default function PuzzleManageCard({
  userId,
}: {
  userId: number | bigint;
}) {
  const id = Number(userId);
  const [info, setInfo] = useState<PuzzleInfo | null>(null);
  const [history, setHistory] = useState<RewardPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  // 지급 폼 상태
  const [puzzleType, setPuzzleType] = useState<PuzzleType>("GENERIC");
  const [amount, setAmount] = useState("");
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [granting, setGranting] = useState(false);

  const count = Number(amount);
  const isValid = Number.isInteger(count) && count > 0;
  const isReward = puzzleType === "REWARD";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [puzzleInfo, rewardHistory] = await Promise.all([
        getPuzzleInfo(id),
        getRewardPuzzleHistory(id),
      ]);
      setInfo(puzzleInfo);
      setHistory(rewardHistory);
    } catch {
      toast.error("퍼즐 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleGrant = async () => {
    setGranting(true);
    try {
      // 일반 퍼즐은 만료 없음(0), 보상 퍼즐은 30/60/90일 중 선택값
      const expiryDate = isReward ? expiryDays : 0;
      await grantPuzzle(id, puzzleType, count, expiryDate);
      toast.success(
        `${isReward ? "보상" : "일반"} 퍼즐 ${count}개를 지급했습니다.`
      );
      setAmount("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "퍼즐 지급에 실패했습니다.");
    } finally {
      setGranting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>퍼즐 관리</CardTitle>
        <CardDescription>
          보유 퍼즐 · 보상 퍼즐 지급 이력 · 직접 지급
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 보유 퍼즐 */}
        <div className="flex flex-wrap gap-2">
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>일반 퍼즐</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {loading ? "…" : info?.generalPuzzleCount ?? 0}
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>보상 퍼즐</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {loading ? "…" : info?.eventPuzzleCount ?? 0}
            </InfoCardContent>
          </InfoCard>
        </div>

        {/* 직접 지급 */}
        <div className="space-y-3">
          <div className="text-sm font-medium">퍼즐 지급</div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={puzzleType}
              onValueChange={(v) => setPuzzleType(v as PuzzleType)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERIC">일반 퍼즐</SelectItem>
                <SelectItem value="REWARD">보상 퍼즐</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="수량"
              className="max-w-[120px]"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!isValid || granting}>
                  {granting ? <Loader className="animate-spin" /> : "지급"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>퍼즐 지급 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    유저 #{id}에게 {isReward ? "보상" : "일반"} 퍼즐 {count}개
                    {isReward && ` (만료 ${expiryDays}일)`}를 지급합니다.
                    진행할까요?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGrant}>지급</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* 보상 퍼즐: 만료 기간 토글 (30/60/90일) */}
          {isReward && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">만료 기간</span>
              <div className="flex gap-1">
                {EXPIRY_OPTIONS.map((days) => (
                  <Button
                    key={days}
                    type="button"
                    size="sm"
                    variant={expiryDays === days ? "default" : "outline"}
                    onClick={() => setExpiryDays(days)}
                  >
                    {days}일
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 보상 퍼즐 지급 이력 */}
        <div className="space-y-2">
          <div className="text-sm font-medium">보상 퍼즐 지급 이력</div>
          {loading ? (
            <p className="text-sm text-muted-foreground">불러오는 중…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">지급 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>유형</TableHead>
                  <TableHead>지급일</TableHead>
                  <TableHead>잔여</TableHead>
                  <TableHead>만료일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((reward, index) => (
                  <TableRow key={index}>
                    <TableCell>{reward.puzzleType ?? "-"}</TableCell>
                    <TableCell>{formatDateTime(reward.createdAt)}</TableCell>
                    <TableCell>{reward.remainingCount ?? "-"}</TableCell>
                    <TableCell>{formatDateTime(reward.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
