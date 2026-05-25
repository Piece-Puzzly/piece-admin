"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PuzzleManageCard from "@/components/user-info/puzzle-manage-card";
import { KeyboardEvent, useState } from "react";

export default function PuzzleManagementPage() {
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const submit = () => {
    const n = Number(input);
    if (Number.isInteger(n) && n > 0) {
      setUserId(n);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">퍼즐 관리</h1>

      <div className="flex items-center gap-2 max-w-sm">
        <Input
          placeholder="User ID로 조회"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          inputMode="numeric"
        />
        <Button onClick={submit}>조회</Button>
      </div>

      {userId != null ? (
        <PuzzleManageCard key={userId} userId={userId} />
      ) : (
        <p className="text-muted-foreground">
          User ID를 입력해 해당 유저의 퍼즐 정보를 조회하세요.
        </p>
      )}
    </div>
  );
}
