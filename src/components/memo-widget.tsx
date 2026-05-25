"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StickyNote, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Memo {
  id: string;
  text: string;
  createdAt: number;
  done: boolean;
}

const STORAGE_KEY = "piece-admin:memos";

function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Memo[]) : [];
  } catch {
    return [];
  }
}

function createId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// 우측 상단 플로팅 메모 위젯 — 수정할 점을 바로바로 기록 (localStorage 저장)
export default function MemoWidget() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMemos(loadMemos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  }, [memos, loaded]);

  const addMemo = () => {
    const text = input.trim();
    if (!text) return;
    setMemos((prev) => [
      { id: createId(), text, createdAt: Date.now(), done: false },
      ...prev,
    ]);
    setInput("");
  };

  const toggleDone = (id: string) =>
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );

  const removeMemo = (id: string) =>
    setMemos((prev) => prev.filter((m) => m.id !== id));

  const pendingCount = memos.filter((m) => !m.done).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="메모 열기"
          className="fixed right-4 top-20 z-40 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90"
        >
          <StickyNote className="size-5" />
          {pendingCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]"
            >
              {pendingCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">메모 · 수정 요청</span>
          <span className="text-xs text-muted-foreground">{memos.length}건</span>
        </div>

        <div className="flex gap-2 p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                addMemo();
              }
            }}
            rows={2}
            placeholder="수정할 점을 기록 (⌘/Ctrl+Enter 추가)"
            className="flex-1 resize-none rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button size="sm" onClick={addMemo} disabled={!input.trim()}>
            추가
          </Button>
        </div>

        <ul className="max-h-[50vh] divide-y overflow-auto">
          {memos.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              기록된 메모가 없습니다.
            </li>
          ) : (
            memos.map((memo) => (
              <li key={memo.id} className="flex items-start gap-2 px-3 py-2">
                <Checkbox
                  checked={memo.done}
                  onCheckedChange={() => toggleDone(memo.id)}
                  className="mt-0.5"
                />
                <span
                  className={cn(
                    "flex-1 whitespace-pre-wrap break-words text-sm",
                    memo.done && "text-muted-foreground line-through"
                  )}
                >
                  {memo.text}
                </span>
                <button
                  type="button"
                  aria-label="메모 삭제"
                  onClick={() => removeMemo(memo.id)}
                  className="mt-0.5 text-muted-foreground transition hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
