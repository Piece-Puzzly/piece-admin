"use client";

import { Toggle } from "@/components/ui/toggle";

export type ProfileImageStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// 토글 버튼의 타입과 내용을 정의합니다.
const reviewTypes = [
  { name: "반려", key: "REJECTED" as const },
  { name: "승인", key: "ACCEPTED" as const }, // '통과'를 '승인'으로 사용합니다.
];

interface ReviewStatusTogglesProps {
  // 현재 선택된 상태 (부모 컴포넌트로부터 받음)
  currentStatus: ProfileImageStatus | null;
  // 상태 변경 시 부모 컴포넌트에 알릴 콜백 함수
  onStatusChange: (newStatus: ProfileImageStatus) => void;
  // 비활성화 여부
  disabled?: boolean;
}

export function UpdateProfileImageToggles({
  currentStatus,
  onStatusChange,
  disabled,
}: ReviewStatusTogglesProps) {
  return (
    <div className="flex gap-x-2 min-w-[180px] items-center">
      {reviewTypes.map(({ name, key }) => (
        <Toggle
          key={key}
          pressed={currentStatus === key}
          onPressedChange={(isPressed) => {
            if (isPressed) {
              // 토글을 누르면 해당 상태로 변경
              onStatusChange(key);
            } else {
              // 눌려있던 토글을 다시 누르면 'PENDING' 상태로 복귀
              onStatusChange("PENDING");
            }
          }}
          disabled={disabled}
          className="h-[40px] px-3 py-[10px] leading-6 w-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {name}
        </Toggle>
      ))}
    </div>
  );
}
