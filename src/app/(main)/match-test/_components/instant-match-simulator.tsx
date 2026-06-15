"use client";

import ProfileImage from "@/components/profile-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserAllInfo,
  type UserFullInfoResponse,
} from "@/lib/actions/get-user";
import { testInstantMatch } from "@/lib/actions/match-test";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Briefcase,
  Cake,
  Heart,
  HeartCrack,
  MapPin,
  Ruler,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 시뮬레이션 도넛이 최소 이 시간만큼은 돌도록 보장(장난감처럼 빙글 도는 연출).
const MIN_SPIN_MS = 1000;

// MatchFailReason enum → 한글 라벨 + 설명
const reasonInfo: Record<string, { label: string; desc: string }> = {
  SUCCESS: { label: "매칭 성공", desc: "모든 필터를 통과했습니다." },
  NO_PROFILE: { label: "프로필 미존재", desc: "대상 유저의 프로필이 없습니다." },
  NO_SETTING: { label: "매칭 세팅 미존재", desc: "매칭 설정 정보가 없습니다." },
  DELETED: { label: "탈퇴한 유저", desc: "탈퇴한 계정입니다." },
  DORMANT: { label: "휴면 계정", desc: "휴면 상태의 계정입니다." },
  TEST: { label: "테스트 계정", desc: "테스트 계정은 매칭 대상이 아닙니다." },
  ADMIN: { label: "관리자 계정", desc: "관리자 계정은 매칭 대상이 아닙니다." },
  DIRECT_BLOCKED: { label: "직접 차단", desc: "직접 차단한 유저입니다." },
  ALLOWED_N_DAYS: {
    label: "N일 이내 매칭",
    desc: "허용 기간(allow_duplicate_match_days) 안에 이미 매칭된 유저입니다.",
  },
  ALLOWED_N_COUNTS: {
    label: "N회 이내 매칭",
    desc: "허용 횟수(allow_duplicate_match_count) 안에 이미 매칭된 유저입니다.",
  },
  ACQUAINTANCE_BLOCKED: {
    label: "지인 차단",
    desc: "지인 차단 설정에 의해 걸러진 유저입니다.",
  },
  AGE_GAP: { label: "나이 차이", desc: "선호 나이 범위를 벗어났습니다." },
  LOCALE_GAP: {
    label: "지역 차이",
    desc: "거리 차이가 허용 임계값(allow_distance_threshold)을 초과했습니다.",
  },
};

type Profile = UserFullInfoResponse | null;

interface SimulationState {
  reason: string;
  requester: Profile;
  target: Profile;
}

function calcAge(birthdate: string | null | undefined): number | null {
  if (!birthdate) return null;
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const monthDiff = now.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < b.getDate())) age--;
  return age >= 0 ? age : null;
}

async function loadProfile(userId: number): Promise<Profile> {
  const res = await getUserAllInfo(userId);
  return res.status === "ok" ? res.data : null;
}

const DONUT_R = 52;
const DONUT_C = 2 * Math.PI * DONUT_R;

// 가운데 도넛 프로그레스. 대기/회전(매칭 확인 중)/결과 상태를 장난감처럼 표현한다.
function MatchDonut({
  state,
  isSuccess,
}: {
  state: "idle" | "running" | "done";
  isSuccess: boolean;
}) {
  const running = state === "running";
  const done = state === "done";

  const color = !done ? "#6F00FB" : isSuccess ? "#22CB52" : "#FF3059";

  return (
    <div className="relative h-36 w-36">
      <svg
        width={144}
        height={144}
        viewBox="0 0 144 144"
        className={running ? "animate-spin" : "transition-transform"}
        style={running ? { animationDuration: "1s" } : undefined}
      >
        {/* 트랙 */}
        <circle
          cx={72}
          cy={72}
          r={DONUT_R}
          fill="none"
          stroke="#F1ECFE"
          strokeWidth={14}
        />
        {/* 진행 호: 회전 중엔 일부만, 완료 시 꽉 참 */}
        <circle
          cx={72}
          cy={72}
          r={DONUT_R}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={DONUT_C}
          strokeDashoffset={running ? DONUT_C * 0.72 : done ? 0 : DONUT_C}
          transform="rotate(-90 72 72)"
          style={{ transition: running ? "none" : "stroke-dashoffset 0.4s ease" }}
        />
      </svg>

      {/* 중앙 하트 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {done && !isSuccess ? (
          <HeartCrack className="h-10 w-10 text-[#FF3059]" />
        ) : (
          <Heart
            className={cn(
              "h-10 w-10",
              done
                ? "fill-[#22CB52] text-[#22CB52]"
                : running
                  ? "animate-pulse fill-[#6F00FB]/20 text-[#6F00FB]"
                  : "text-muted-foreground/40"
            )}
          />
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon: Icon, value }: { icon: typeof MapPin; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

// 결과 후 각 프로필 상세 카드.
function ProfileCard({
  role,
  userId,
  profile,
  tone,
}: {
  role: string;
  userId: number;
  profile: Profile;
  tone: "request" | "target";
}) {
  const p = profile?.profile;
  const age = calcAge(p?.birthdate);

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5">
      <span
        className={cn(
          "mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          tone === "request"
            ? "bg-violet-100 text-violet-700"
            : "bg-rose-100 text-rose-700"
        )}
      >
        {role} · #{userId}
      </span>

      {!profile ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
          프로필을 불러올 수 없습니다.
        </div>
      ) : (
        <div className="flex gap-4">
          <ProfileImage
            src={p?.imageUrl}
            alt={p?.nickname ?? "프로필"}
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold">
              {p?.nickname ?? "(닉네임 없음)"}
            </div>
            {p?.description && (
              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                {p.description}
              </p>
            )}
            <div className="space-y-1">
              <MetaRow
                icon={Cake}
                value={age != null ? `만 ${age}세` : "나이 정보 없음"}
              />
              {p?.job && <MetaRow icon={Briefcase} value={p.job} />}
              {p?.location && <MetaRow icon={MapPin} value={p.location} />}
              {p?.height != null && (
                <MetaRow
                  icon={Ruler}
                  value={`${p.height}cm${p.weight != null ? ` · ${p.weight}kg` : ""}`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {profile && profile.valueTalks.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
            가치관 톡
          </p>
          <div className="space-y-1.5">
            {profile.valueTalks.slice(0, 3).map((talk) => (
              <div key={talk.id} className="text-sm">
                <span className="font-medium">{talk.category}</span>
                {(talk.summary || talk.answer) && (
                  <span className="text-muted-foreground">
                    {" · "}
                    {talk.summary || talk.answer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 즉시 매칭 시뮬레이터: 요청→대상 방향 매칭 가부를 판정하고 결과 후 두 프로필을 보여준다.
export default function InstantMatchSimulator() {
  const [requestUserId, setRequestUserId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sim, setSim] = useState<SimulationState | null>(null);

  const handleRun = async () => {
    const rid = Number(requestUserId);
    const tid = Number(targetUserId);
    if (!Number.isFinite(rid) || rid <= 0 || !Number.isFinite(tid) || tid <= 0) {
      toast.error("요청/대상 User ID를 모두 입력하세요.");
      return;
    }
    if (rid === tid) {
      toast.error("서로 다른 User ID를 입력하세요.");
      return;
    }

    setLoading(true);
    setSim(null);
    try {
      // 매칭 판정·두 프로필 조회와 함께 최소 회전 시간을 보장한다.
      const [matchRes, requester, target] = await Promise.all([
        testInstantMatch(rid, tid),
        loadProfile(rid),
        loadProfile(tid),
        new Promise((resolve) => setTimeout(resolve, MIN_SPIN_MS)),
      ]);
      setSim({ reason: matchRes.reason, requester, target });
    } catch (err) {
      toast.error("즉시 매칭 시뮬레이션에 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const rid = Number(requestUserId) || 0;
  const tid = Number(targetUserId) || 0;
  const donutState = loading ? "running" : sim ? "done" : "idle";
  const isSuccess = sim?.reason === "SUCCESS";
  const info = sim ? (reasonInfo[sim.reason] ?? { label: sim.reason, desc: "" }) : null;

  return (
    <section className="space-y-5 rounded-xl border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">즉시 매칭 시뮬레이터</h2>
        <p className="text-sm text-muted-foreground">
          요청 유저가 대상 유저를 매칭할 수 있는지 판정합니다. 실제 매칭/알림은
          발생하지 않습니다.
        </p>
      </div>

      {/* 입력 */}
      <div className="flex flex-col items-end gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="requestUserId">요청 유저 ID</Label>
          <Input
            id="requestUserId"
            inputMode="numeric"
            placeholder="매칭을 요청하는 유저"
            value={requestUserId}
            onChange={(e) => setRequestUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
          />
        </div>
        <ArrowRight className="mb-2.5 hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="targetUserId">대상 유저 ID</Label>
          <Input
            id="targetUserId"
            inputMode="numeric"
            placeholder="매칭 대상이 되는 유저"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
          />
        </div>
        <Button
          onClick={handleRun}
          disabled={loading}
          className="w-full min-w-[120px] sm:w-auto"
        >
          {loading ? "확인 중…" : "시뮬레이션 실행"}
        </Button>
      </div>

      {/* 무대: 도넛 + 판정 */}
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 py-8">
        <MatchDonut state={donutState} isSuccess={!!isSuccess} />

        {donutState === "idle" && (
          <p className="text-sm text-muted-foreground">
            두 유저 ID를 입력하고 시뮬레이션을 실행하세요.
          </p>
        )}
        {donutState === "running" && (
          <p className="text-sm font-medium text-[#6F00FB]">매칭 확인 중…</p>
        )}
        {donutState === "done" && info && (
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "text-lg font-bold",
                isSuccess ? "text-[#22CB52]" : "text-[#FF3059]"
              )}
            >
              {isSuccess ? "매칭 가능" : "매칭 불가"}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                isSuccess
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              )}
            >
              {info.label}
              <span className="ml-1 opacity-60">({sim?.reason})</span>
            </span>
            {info.desc && (
              <p className="max-w-xs text-center text-xs text-muted-foreground">
                {info.desc}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 결과 후 프로필 상세 */}
      {sim && (
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileCard
            role="요청 유저"
            userId={rid}
            profile={sim.requester}
            tone="request"
          />
          <ProfileCard
            role="대상 유저"
            userId={tid}
            profile={sim.target}
            tone="target"
          />
        </div>
      )}
    </section>
  );
}
