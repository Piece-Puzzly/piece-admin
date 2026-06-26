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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getBroadcastStats,
  grantPuzzleToAll,
  sendNotificationToAll,
  type BroadcastStats,
  type NotificationType,
  type PuzzleType,
} from "@/lib/actions/broadcast";
import { Loader, Send, Gift } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: "EVENT", label: "이벤트" },
  { value: "MATCH_NEW", label: "새로운 매칭" },
  { value: "MATCH_ACCEPTED", label: "매칭 수락" },
];

const EXPIRY_OPTIONS = [30, 60, 90, 120, 150] as const;

export default function BroadcastPage() {
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [loading, setLoading] = useState(true);

  // 푸시 알림 폼
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifType, setNotifType] = useState<NotificationType>("EVENT");
  const [sendingNotif, setSendingNotif] = useState(false);

  // 퍼즐 지급 폼
  const [puzzleType, setPuzzleType] = useState<PuzzleType>("REWARD");
  const [puzzleCount, setPuzzleCount] = useState("");
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [grantingPuzzle, setGrantingPuzzle] = useState(false);

  const count = Number(puzzleCount);
  const isPuzzleValid = Number.isInteger(count) && count > 0;
  const isNotifValid = notifTitle.trim() !== "" && notifBody.trim() !== "";

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBroadcastStats();
      setStats(data);
    } catch {
      toast.error("통계를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleSendNotification = async () => {
    setSendingNotif(true);
    try {
      await sendNotificationToAll(notifTitle, notifBody, notifType);
      toast.success("전체 유저에게 푸시 알림 발송을 시작했습니다.");
      setNotifTitle("");
      setNotifBody("");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "푸시 발송에 실패했습니다."
      );
    } finally {
      setSendingNotif(false);
    }
  };

  const handleGrantPuzzle = async () => {
    setGrantingPuzzle(true);
    try {
      const expiry = puzzleType === "REWARD" ? expiryDays : 0;
      await grantPuzzleToAll(puzzleType, count, expiry);
      toast.success("전체 유저에게 퍼즐 지급을 시작했습니다.");
      setPuzzleCount("");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "퍼즐 지급에 실패했습니다."
      );
    } finally {
      setGrantingPuzzle(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">전체 발송</h1>

      {/* 통계 카드 */}
      <div className="flex flex-wrap gap-4">
        <Card className="min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription>활성 유저 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.activeUserCount.toLocaleString() ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription>푸시 등록 유저 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : stats?.fcmRegisteredUserCount.toLocaleString() ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 푸시 알림 발송 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              전체 푸시 알림 발송
            </CardTitle>
            <CardDescription>
              FCM 토큰이 등록된 모든 유저에게 푸시 알림을 발송합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>알림 타입</Label>
              <Select
                value={notifType}
                onValueChange={(v) => setNotifType(v as NotificationType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>제목</Label>
              <Input
                placeholder="알림 제목"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>내용</Label>
              <Textarea
                placeholder="알림 내용"
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                rows={3}
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={!isNotifValid || sendingNotif}
                >
                  {sendingNotif ? (
                    <Loader className="animate-spin mr-2" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  전체 발송
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>전체 푸시 알림 발송 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>{stats?.fcmRegisteredUserCount ?? 0}명</strong>의
                    유저에게 푸시 알림을 발송합니다.
                    <br />
                    <br />
                    <strong>제목:</strong> {notifTitle}
                    <br />
                    <strong>내용:</strong> {notifBody}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSendNotification}>
                    발송
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* 전체 퍼즐 지급 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              전체 퍼즐 지급
            </CardTitle>
            <CardDescription>
              모든 활성 유저(USER 역할)에게 퍼즐을 지급합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>퍼즐 타입</Label>
              <Select
                value={puzzleType}
                onValueChange={(v) => setPuzzleType(v as PuzzleType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERIC">일반 퍼즐</SelectItem>
                  <SelectItem value="REWARD">보상 퍼즐</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>수량</Label>
              <Input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                placeholder="지급할 퍼즐 수"
                value={puzzleCount}
                onChange={(e) => setPuzzleCount(e.target.value)}
              />
            </div>
            {puzzleType === "REWARD" && (
              <div className="space-y-2">
                <Label>만료 기간</Label>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full"
                  disabled={!isPuzzleValid || grantingPuzzle}
                >
                  {grantingPuzzle ? (
                    <Loader className="animate-spin mr-2" />
                  ) : (
                    <Gift className="mr-2 h-4 w-4" />
                  )}
                  전체 지급
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>전체 퍼즐 지급 확인</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>{stats?.activeUserCount ?? 0}명</strong>의 활성
                    유저에게{" "}
                    <strong>
                      {puzzleType === "REWARD" ? "보상" : "일반"} 퍼즐 {count}개
                    </strong>
                    {puzzleType === "REWARD" && ` (만료 ${expiryDays}일)`}를
                    지급합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGrantPuzzle}>
                    지급
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
