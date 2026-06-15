"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface StatusToggleProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  alreadyPurchased?: boolean; // 이미 구매된 상태인지
}

export default function StatusToggle({
  value,
  onChange,
  disabled = false,
  alreadyPurchased = false,
}: StatusToggleProps) {
  // 이미 구매된 경우 회색으로 표시
  const isGray = alreadyPurchased && value;

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!value)}
      disabled={disabled}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : isGray
            ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
            : value
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
      )}
    >
      {value ? (
        <Check className="w-4 h-4 stroke-[3]" />
      ) : (
        <X className="w-4 h-4 stroke-[3]" />
      )}
    </button>
  );
}
