"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getUserReferralCodeInfo,
  type UserReferralCodeInfo,
} from "@/lib/actions/referral-code";
import { KeyboardEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-medium">{value}</span>
    </div>
  );
}

export default function ReferralCodePage() {
  const [input, setInput] = useState("");
  const [info, setInfo] = useState<UserReferralCodeInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const id = Number(input);
    if (!Number.isInteger(id) || id <= 0) return;
    setLoading(true);
    setSearched(true);
    try {
      setInfo(await getUserReferralCodeInfo(id));
    } catch {
      toast.error("추천인 코드 정보를 불러오지 못했습니다.");
      setInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">추천인 코드 조회</h1>

      <div className="flex items-center gap-2 max-w-sm">
        <Input
          placeholder="User ID로 조회"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          inputMode="numeric"
        />
        <Button onClick={search}>조회</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">불러오는 중…</p>
      ) : !searched ? (
        <p className="text-muted-foreground">
          User ID를 입력해 해당 유저의 추천인 코드 정보를 조회하세요.
        </p>
      ) : info ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>추천인 코드 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="추천인 코드" value={info.referralCode ?? "-"} />
            <Field label="초대 인원" value={info.inviteCount ?? 0} />
            <Field label="보상 퍼즐 수" value={info.rewardPuzzleCount ?? 0} />
            <Field label="코드 만료" value={info.expired ? "만료됨" : "유효"} />
            <Field
              label="이미 초대받음"
              value={info.alreadyInvited ? "예" : "아니오"}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">추천인 코드 정보가 없습니다.</p>
      )}
    </div>
  );
}
