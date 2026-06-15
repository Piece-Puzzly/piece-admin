"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Dices,
  ExternalLink,
  Filter,
  Search,
  Zap,
} from "lucide-react";
import { useState } from "react";

const MATCHING_LOGIC_DOC_URL =
  "https://yapp25app3.atlassian.net/wiki/spaces/APP3/pages/120225797";

// 매칭 로직 4단계. 각 단계는 색/아이콘으로 구분해 흐름을 한눈에 보이게 한다.
const phases = [
  {
    icon: Zap,
    step: "01",
    title: "캐시 우선 조회 (Fast Track)",
    accent: "text-amber-600",
    ring: "ring-amber-200 bg-amber-50",
    summary: "Redis 큐에 저장된 예비 후보를 먼저 꺼내 즉시 응답을 시도한다.",
    points: [
      "이전 요청에서 저장한 candidate pool을 가장 먼저 확인",
      "캐시는 오래됐을 수 있어 현재 설정 기준으로 1회 재필터링",
      "탈퇴·차단·N일/M회 매칭·나이·지인 차단·거리 조건 재검증",
      "통과하면 즉시 반환 → 이후 모든 단계 스킵",
    ],
  },
  {
    icon: Search,
    step: "02",
    title: "후보 수집 (Qdrant 벡터 검색)",
    accent: "text-sky-600",
    ring: "ring-sky-200 bg-sky-50",
    summary: "캐시에 유효 후보가 없으면 value_talk 벡터 유사도로 후보를 모은다.",
    points: [
      "1차: 지역 필터 ON / 실패 시 2차: 지역 필터 OFF(거리 완화)",
      "total_candidate_count × 2 (현재 40명)까지 수집",
      "모일 때까지 유사도를 0.1씩 낮춤 (초기값 0.7)",
      "이 단계의 목적은 '많이 모으는 것'",
    ],
  },
  {
    icon: Filter,
    step: "03",
    title: "심층 필터링 + 나이 완화",
    accent: "text-violet-600",
    ring: "ring-violet-200 bg-violet-50",
    summary: "반드시 지켜야 할 룰을 적용하되 매칭 실패는 최대한 방지한다.",
    points: [
      "Hard Filter: 탈퇴·차단·N일/M회·나이·지인 차단·거리 중 하나라도 실패 시 탈락",
      "0명이면 선호 나이 ±2살씩 완화하며 재수행",
      "그래도 0명이면 지역 필터 OFF로 2단계부터 재수행",
    ],
  },
  {
    icon: Dices,
    step: "04",
    title: "스코어링 & 확률 선택",
    accent: "text-emerald-600",
    ring: "ring-emerald-200 bg-emerald-50",
    summary: "점수를 매긴 뒤 Softmax 확률 샘플링으로 다양성을 확보한다.",
    points: [
      "score = value_talk + value_pick − (age_gap·w) − (distance·w)",
      "value_pick: 1~10번 중 겹치는 개수 × 가중치",
      "random_temperature 적용 — 점수 높을수록 선택 확률↑",
      "1순위는 반환, 나머지 예비 후보는 Redis 큐에 저장",
    ],
  },
];

export default function MatchingLogicExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded-xl border bg-gradient-to-b from-muted/40 to-background"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Zap className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold">즉시 매칭 로직 흐름</h2>
            <p className="text-sm text-muted-foreground">
              캐시 우선 → 벡터 검색 → 심층 필터링 → 확률 선택. 클릭해서 펼쳐보세요.
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-3 px-5 pb-5">
          <div className="grid gap-3 md:grid-cols-2">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.step}
                  className="relative rounded-lg border bg-background p-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
                        phase.ring,
                        phase.accent
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "text-xs font-bold tabular-nums",
                          phase.accent
                        )}
                      >
                        {phase.step}
                      </span>
                      <h3 className="text-sm font-semibold">{phase.title}</h3>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {phase.summary}
                  </p>
                  <ul className="space-y-1.5">
                    {phase.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-xs leading-relaxed text-foreground/80"
                      >
                        <span
                          className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", {
                            "bg-amber-500": phase.accent.includes("amber"),
                            "bg-sky-500": phase.accent.includes("sky"),
                            "bg-violet-500": phase.accent.includes("violet"),
                            "bg-emerald-500": phase.accent.includes("emerald"),
                          })}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <a
            href={MATCHING_LOGIC_DOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            매칭 로직 흐름 문서 (Confluence)
          </a>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
