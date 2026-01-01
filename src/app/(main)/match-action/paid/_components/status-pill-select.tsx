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

// 프로필 A/B 공통 옵션 (5개)
const statusOptions = [
  { value: "UNCHECKED", label: "미확인" },
  { value: "CHECKED", label: "확인" },
  { value: "ACCEPTED", label: "수락" },
  { value: "REFUSED", label: "거절" },
  { value: "BLOCKED", label: "차단" },
] as const;

export type StatusValue = (typeof statusOptions)[number]["value"];

interface StatusPillSelectProps {
  value: StatusValue;
  onChange: (value: StatusValue) => void;
  disabled?: boolean;
}

export default function StatusPillSelect({
  value,
  onChange,
  disabled = false,
}: StatusPillSelectProps) {

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "w-[70px]",
          "h-8 px-1 border-none bg-transparent text-sm font-medium gap-0",
          "focus:ring-0 focus:ring-offset-0 [&>svg]:hidden",
          disabled ? "text-gray-400 cursor-not-allowed" : ""
        )}
      >
        <SelectValue />
        <ChevronDown className="w-3 h-3 shrink-0 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
