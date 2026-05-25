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
import { grantPuzzle } from "@/lib/actions/puzzle";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PuzzleGrantCard({
  userId,
}: {
  userId: number | bigint;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const count = Number(amount);
  const isValid = Number.isInteger(count) && count > 0;

  const handleGrant = async () => {
    setLoading(true);
    try {
      await grantPuzzle(Number(userId), count);
      toast.success(`퍼즐 ${count}개를 지급했습니다.`);
      setAmount("");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "퍼즐 지급에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>퍼즐 지급</CardTitle>
        <CardDescription>
          운영 보상·버그 제보 대응 등으로 이 유저에게 퍼즐을 즉시 지급합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
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
            <Button disabled={!isValid || loading}>
              {loading ? <Loader className="animate-spin" /> : "지급"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>퍼즐 지급 확인</AlertDialogTitle>
              <AlertDialogDescription>
                유저 #{String(userId)}에게 퍼즐 {count}개를 지급합니다. 진행할까요?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleGrant}>지급</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
