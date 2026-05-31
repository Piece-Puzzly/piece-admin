"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  updateInstantMatchConfig,
  type InstantMatchConfig,
} from "@/lib/actions/match-config";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Loader,
  Pencil,
  Save,
  Settings2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// 한 줄 정의 리스트 행. hint는 label의 title attribute로 hover 노출.
function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5 text-sm">
      <span
        className="truncate text-xs text-muted-foreground"
        title={hint}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function ValueText({ children }: { children: React.ReactNode }) {
  return <span className="shrink-0 font-medium tabular-nums">{children}</span>;
}

function NumberInputCell({
  value,
  onChange,
  step,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number | string;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (Number.isFinite(v)) onChange(v);
        }}
        step={step ?? "any"}
        min={min}
        max={max}
        className="h-7 w-20 text-right text-sm tabular-nums"
      />
      {suffix && (
        <span className="w-3 text-xs text-muted-foreground">{suffix}</span>
      )}
    </div>
  );
}

export default function InstantMatchConfigCard({
  config,
}: {
  config: InstantMatchConfig;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<InstantMatchConfig>(config);

  const startEdit = () => {
    setDraft(config);
    setIsEditing(true);
    setOpen(true);
  };
  const cancelEdit = () => {
    setDraft(config);
    setIsEditing(false);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateInstantMatchConfig(draft);
      toast.success("즉시 매칭 설정을 저장했습니다.");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      toast.error("저장에 실패했습니다.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof InstantMatchConfig>(
    key: K,
    value: InstantMatchConfig[K]
  ) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded-lg border bg-background"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <h2 className="text-sm font-semibold">즉시 매칭 설정값</h2>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="space-y-2 px-4 pb-3">
          <div className="flex justify-end gap-1">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={startEdit}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Pencil className="h-3 w-3" />
                편집
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="h-7 gap-1 px-2 text-xs"
                >
                  <X className="h-3 w-3" />
                  취소
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-7 gap-1 px-2 text-xs"
                >
                  {saving ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  저장
                </Button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Row label="이전 매칭 허용 일수" hint="N일 이전 매칭부터 허용">
              {isEditing ? (
                <NumberInputCell
                  value={draft.allowDuplicateMatchDays}
                  onChange={(v) => update("allowDuplicateMatchDays", v)}
                  step={1}
                  min={0}
                  suffix="일"
                />
              ) : (
                <ValueText>{config.allowDuplicateMatchDays}일</ValueText>
              )}
            </Row>
            <Row label="이전 매칭 허용 횟수" hint="N회 이전 매칭부터 허용">
              {isEditing ? (
                <NumberInputCell
                  value={draft.allowDuplicateMatchCount}
                  onChange={(v) => update("allowDuplicateMatchCount", v)}
                  step={1}
                  min={0}
                  suffix="회"
                />
              ) : (
                <ValueText>{config.allowDuplicateMatchCount}회</ValueText>
              )}
            </Row>
            <Row label="거리 허용" hint="값이 클수록 멀어도 허용">
              {isEditing ? (
                <NumberInputCell
                  value={draft.distanceThreshold}
                  onChange={(v) => update("distanceThreshold", v)}
                  step={1}
                  min={0}
                />
              ) : (
                <ValueText>{config.distanceThreshold}</ValueText>
              )}
            </Row>
            <Row label="나이 차이 허용">
              {isEditing ? (
                <NumberInputCell
                  value={draft.ageGapThreshold}
                  onChange={(v) => update("ageGapThreshold", v)}
                  step={1}
                  min={0}
                  suffix="살"
                />
              ) : (
                <ValueText>{config.ageGapThreshold}살</ValueText>
              )}
            </Row>
            <Row label="가치관 유사도 기준" hint="0~1, 낮을수록 폭넓게 매칭">
              {isEditing ? (
                <NumberInputCell
                  value={draft.valueTalkSimilarity}
                  onChange={(v) => update("valueTalkSimilarity", v)}
                  step={0.01}
                  min={0}
                  max={1}
                />
              ) : (
                <ValueText>{config.valueTalkSimilarity.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="나이 차이 가중치">
              {isEditing ? (
                <NumberInputCell
                  value={draft.ageGapWeight}
                  onChange={(v) => update("ageGapWeight", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.ageGapWeight.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="거리 차이 가중치">
              {isEditing ? (
                <NumberInputCell
                  value={draft.localeDistanceWeight}
                  onChange={(v) => update("localeDistanceWeight", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.localeDistanceWeight.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="랜덤성 (temperature)" hint="높을수록 점수와 무관하게 무작위">
              {isEditing ? (
                <NumberInputCell
                  value={draft.randomTemperature}
                  onChange={(v) => update("randomTemperature", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.randomTemperature.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="총 후보 수집">
              {isEditing ? (
                <NumberInputCell
                  value={draft.totalCandidateCount}
                  onChange={(v) => update("totalCandidateCount", v)}
                  step={1}
                  min={0}
                  suffix="명"
                />
              ) : (
                <ValueText>{config.totalCandidateCount}명</ValueText>
              )}
            </Row>
            <Row label="가치관 유사 후보 조회">
              {isEditing ? (
                <NumberInputCell
                  value={draft.similarValueTalkCount}
                  onChange={(v) => update("similarValueTalkCount", v)}
                  step={1}
                  min={0}
                  suffix="명"
                />
              ) : (
                <ValueText>{config.similarValueTalkCount}명</ValueText>
              )}
            </Row>
            <Row label="캐시 저장 후보">
              {isEditing ? (
                <NumberInputCell
                  value={draft.cachedCandidateCount}
                  onChange={(v) => update("cachedCandidateCount", v)}
                  step={1}
                  min={0}
                  suffix="명"
                />
              ) : (
                <ValueText>{config.cachedCandidateCount}명</ValueText>
              )}
            </Row>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
