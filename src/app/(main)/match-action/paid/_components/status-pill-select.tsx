"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 프로필 A용 옵션 (5개)
const statusOptionsA = [
  { value: "UNCHECKED", label: "미확인" },
  { value: "CHECKED", label: "확인" },
  { value: "ACCEPTED", label: "수락" },
  { value: "REFUSED", label: "거절" },
  { value: "BLOCKED", label: "차단" },
] as const;

// 프로필 B용 옵션 (3개)
const statusOptionsB = [
  { value: "ACCEPTED", label: "그린라이트" },
  { value: "REFUSED", label: "거절" },
  { value: "BLOCKED", label: "차단" },
] as const;

export type StatusValueA = (typeof statusOptionsA)[number]["value"];
export type StatusValueB = (typeof statusOptionsB)[number]["value"];
export type StatusValue = StatusValueA | StatusValueB;

interface StatusPillSelectProps {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
  disabled?: boolean;
  variant?: "A" | "B";
}

export default function StatusPillSelect({
  value,
  onChange,
  disabled = false,
  variant = "A",
}: StatusPillSelectProps) {
  const options = variant === "A" ? statusOptionsA : statusOptionsB;
  const width = variant === "A" ? "w-[70px]" : "w-[85px]";

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          width,
          "h-8 px-1 border-none bg-transparent text-sm font-medium gap-0",
          "focus:ring-0 focus:ring-offset-0 [&>svg]:hidden",
          disabled ? "text-gray-400 cursor-not-allowed" : ""
        )}
      >
        <SelectValue />
        <ChevronDown className="w-3 h-3 shrink-0 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
