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

export default function PuzzleManageCard({
  userId,
}: {
  userId: number | bigint;
}) {
  const id = Number(userId);
  const [info, setInfo] = useState<PuzzleInfo | null>(null);
  const [history, setHistory] = useState<RewardPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [granting, setGranting] = useState(false);

  const count = Number(amount);
  const isValid = Number.isInteger(count) && count > 0;

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
      await grantPuzzle(id, count);
      toast.success(`퍼즐 ${count}개를 지급했습니다.`);
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
          보유 퍼즐 · 이벤트 퍼즐 지급 이력 · 직접 지급
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
              <InfoCardTitle>이벤트 퍼즐</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {loading ? "…" : info?.eventPuzzleCount ?? 0}
            </InfoCardContent>
          </InfoCard>
        </div>

        {/* 직접 지급 */}
        <div className="space-y-2">
          <div className="text-sm font-medium">퍼즐 지급</div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="지급 수량"
              className="max-w-[200px]"
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
                    유저 #{id}에게 퍼즐 {count}개를 지급합니다. 진행할까요?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGrant}>
                    지급
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <p className="text-xs text-muted-foreground">
            ※ 지급 API는 BE 엔드포인트 확정 후 연결됩니다.
          </p>
        </div>

        {/* 이벤트 퍼즐 지급 이력 */}
        <div className="space-y-2">
          <div className="text-sm font-medium">이벤트 퍼즐 지급 이력</div>
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
