"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  testBasicMatch,
  type BasicFilterTestResult,
} from "@/lib/actions/match-test";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 기본 매칭 필터 테스트: userIds 콤마 구분 입력 → 각 user별 매칭 가능 프로필 ID 표시
export default function BasicFilterTest() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BasicFilterTestResult | null>(null);

  const parseUserIds = (raw: string): number[] =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0);

  const handleTest = async () => {
    const ids = parseUserIds(input);
    if (ids.length === 0) {
      toast.error("유효한 User ID를 콤마로 구분해 입력하세요. (예: 1, 2, 3)");
      return;
    }
    setLoading(true);
    try {
      const res = await testBasicMatch(ids);
      setResult(res);
    } catch (err) {
      toast.error("기본 필터 테스트에 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const entries = result ? Object.entries(result.allowedProfilesById) : [];

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div>
        <h3 className="font-semibold">기본 필터 테스트</h3>
        <p className="text-sm text-muted-foreground">
          여러 User ID에 대해 매칭 가능한 프로필 ID 집합을 조회합니다.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="User ID 콤마 구분 (예: 1, 2, 3)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTest();
          }}
        />
        <Button onClick={handleTest} disabled={loading} className="min-w-[80px]">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : "테스트"}
        </Button>
      </div>

      {result && (
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="text-sm text-muted-foreground">결과 없음</div>
          ) : (
            entries.map(([userId, profileIds]) => (
              <div key={userId} className="rounded border p-2 text-sm">
                <div className="font-medium">User {userId}</div>
                <div className="text-muted-foreground">
                  매칭 가능 프로필:{" "}
                  {profileIds.length > 0 ? profileIds.join(", ") : "(없음)"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
