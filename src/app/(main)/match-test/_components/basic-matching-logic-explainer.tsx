"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Activity,
  Calculator,
  ChevronDown,
  ExternalLink,
  FlaskConical,
  HeartHandshake,
  Layers,
  Target,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";

const MATCHING_LOGIC_DOC_URL =
  "https://yapp25app3.atlassian.net/wiki/spaces/APP3/pages/120225797";

// BASIC 매칭 로직 6단계 (+ Step 0).
const phases: {
  icon: typeof Users;
  step: string;
  title: string;
  accent: string;
  ring: string;
  bullet: string;
  summary: string;
  points: string[];
}[] = [
  {
    icon: FlaskConical,
    step: "00",
    title: "테스트 계정 매칭",
    accent: "text-slate-600",
    ring: "ring-slate-200 bg-slate-50",
    bullet: "bg-slate-500",
    summary: "본 매칭 전에 테스트 계정끼리 먼저 매칭해 흐름을 검증한다.",
    points: [],
  },
  {
    icon: Users,
    step: "01",
    title: "후보군 모으기",
    accent: "text-sky-600",
    ring: "ring-sky-200 bg-sky-50",
    bullet: "bg-sky-500",
    summary:
      "프로필 p1에 대해 나머지 모든 프로필 중 유효한 프로필을 모은다 — p1: [p2, p3, p4, …].",
    points: [
      "탈퇴/휴면 유저는 pass",
      "N회·N일 이내 매칭된 유저는 pass (즉시 매칭과 동일한 룰을 적용)",
      "직접 차단한 유저는 pass",
      "지인 차단된 유저는 pass",
      "나이 조건이 안 맞으면 pass — 단, 후보가 전체의 1/5도 안 모이면 2살씩 확장해 추가 수집",
      "위 필터를 모두 통과하면 후보로 추가",
    ],
  },
  {
    icon: Activity,
    step: "02",
    title: "활동성 점수 계산",
    accent: "text-emerald-600",
    ring: "ring-emerald-200 bg-emerald-50",
    bullet: "bg-emerald-500",
    summary: "후보 각각의 활동성 점수를 계산한다.",
    points: [
      "프로필 완성도: 사진 10 / 한줄 소개 10 / 가치관 픽 10",
      "옵션 데이터 입력 여부: value talk 2개 응답(각 5점) / 키·몸무게·직업·흡연·SNS 입력(각 2점)",
      "최근 매칭 응답률: 전체 매칭 중 카드 확인 비율 (사실상 출석체크 지표, 최대 50점)",
      "최근 활동: 최근 7일 내 시도한 매칭 개수 (trial / 즉시 매칭)",
    ],
  },
  {
    icon: Calculator,
    step: "03",
    title: "점수 계산 및 정렬",
    accent: "text-violet-600",
    ring: "ring-violet-200 bg-violet-50",
    bullet: "bg-violet-500",
    summary:
      "p1의 후보들과 쌍 (p1,p2), (p1,p3), … 을 만들어 최종 점수를 산출한다.",
    points: [
      "나이 차이: 20년 이상 0점, 그 외 점수 = 100 − (차이 × 5)",
      "지역 차이: 같은 지역 100 / 같은 권역 50 / 다른 권역 0",
      "권역 구분: 수도권(서울·경기·인천) / 강원권 / 충청권(대전·세종·충북·충남) / 호남권(광주·전북·전남) / 영남권(부산·대구·울산·경북·경남) / 제주권 / 기타",
      "활동성 유사도: 두 후보의 활동성 점수가 서로 비슷할수록 높은 점수 (높을수록 좋음 아님)",
      "최종 점수 = 나이차 + 지역차 + 활동성 유사도 (각 0~100, 합 최대 300)",
      "지역 가중치 적용: 8/10",
    ],
  },
  {
    icon: Target,
    step: "04",
    title: "Greedy 매칭 실행",
    accent: "text-amber-600",
    ring: "ring-amber-200 bg-amber-50",
    bullet: "bg-amber-500",
    summary: "최종 점수가 높은 쌍부터 순서대로 매칭을 확정한다.",
    points: [
      "점수가 가장 높은 쌍부터 매칭 확정",
      "이미 다른 곳에서 매칭된 유저가 포함된 쌍은 pass",
    ],
  },
  {
    icon: HeartHandshake,
    step: "05",
    title: "미매칭 유저 보상 매칭",
    accent: "text-rose-600",
    ring: "ring-rose-200 bg-rose-50",
    bullet: "bg-rose-500",
    summary: "4단계에서 매칭되지 못한 유저를 후보 풀에서 재매칭한다.",
    points: [
      "미매칭 유저의 후보 중에서 다시 매칭 시도",
      "이미 매칭된 후보라도, 이 유저와의 매칭 점수가 기존보다 더 좋으면 swap",
      "그래서 '1명 : 2명' 매칭 상황이 발생할 수 있음",
    ],
  },
  {
    icon: UserX,
    step: "06",
    title: "미매칭 유저",
    accent: "text-zinc-600",
    ring: "ring-zinc-200 bg-zinc-50",
    bullet: "bg-zinc-500",
    summary: "5단계까지 거쳤는데도 매칭되지 못한 유저는 최종 미매칭 처리된다.",
    points: [],
  },
];

export default function BasicMatchingLogicExplainer() {
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
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold">BASIC 매칭 로직 흐름</h2>
            <p className="text-sm text-muted-foreground">
              후보 수집 → 활동성 점수 → 점수·정렬 → Greedy 매칭 → 보상 매칭. 클릭해서 펼쳐보세요.
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
                  {phase.points.length > 0 && (
                    <ul className="space-y-1.5">
                      {phase.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 text-xs leading-relaxed text-foreground/80"
                        >
                          <span
                            className={cn(
                              "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                              phase.bullet
                            )}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
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
