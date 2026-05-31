"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  updateBasicMatchConfig,
  type BasicMatchConfig,
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
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number | string;
  min?: number;
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
        className="h-7 w-20 text-right text-sm tabular-nums"
      />
      {suffix && (
        <span className="w-3 text-xs text-muted-foreground">{suffix}</span>
      )}
    </div>
  );
}

export default function BasicMatchConfigCard({
  config,
}: {
  config: BasicMatchConfig;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<BasicMatchConfig>(config);

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
      await updateBasicMatchConfig(draft);
      toast.success("BASIC 매칭 설정을 저장했습니다.");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      toast.error("저장에 실패했습니다.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof BasicMatchConfig>(
    key: K,
    value: BasicMatchConfig[K]
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
          <h2 className="text-sm font-semibold">BASIC 매칭 설정값</h2>
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

          <div className="grid grid-cols-1 gap-x-4 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            <Row label="재매칭 차단 기간" hint="같은 유저 재매칭 차단">
              {isEditing ? (
                <NumberInputCell
                  value={draft.beforeOpenDays}
                  onChange={(v) => update("beforeOpenDays", v)}
                  step={1}
                  min={0}
                  suffix="일"
                />
              ) : (
                <ValueText>{config.beforeOpenDays}일</ValueText>
              )}
            </Row>
            <Row label="나이 점수 가중치">
              {isEditing ? (
                <NumberInputCell
                  value={draft.ageWeight}
                  onChange={(v) => update("ageWeight", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.ageWeight.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="활동성 점수 가중치">
              {isEditing ? (
                <NumberInputCell
                  value={draft.activityWeight}
                  onChange={(v) => update("activityWeight", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.activityWeight.toFixed(2)}</ValueText>
              )}
            </Row>
            <Row label="거리 점수 가중치">
              {isEditing ? (
                <NumberInputCell
                  value={draft.locationWeight}
                  onChange={(v) => update("locationWeight", v)}
                  step={0.01}
                  min={0}
                />
              ) : (
                <ValueText>{config.locationWeight.toFixed(2)}</ValueText>
              )}
            </Row>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
