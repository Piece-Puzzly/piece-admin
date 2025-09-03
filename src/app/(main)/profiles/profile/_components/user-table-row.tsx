// /app/admin/users/user-table-row.tsx
"use client";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import ProfileStatus from "@/components/profile-status";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateProfileStatus } from "@/lib/server";
import { toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserData } from "../types";

// 필요한 타입들을 정의하거나 공유 파일에서 import 합니다.

interface UserTableRowProps {
  user: UserData;
}

const rejectionStatusInfo = [
  { label: "사진", key: "reason_image" as const },
  { label: "소개글", key: "reason_description" as const },
];

export function UserTableRow({ user }: UserTableRowProps) {
  const [isSaving, setIsSaving] = useState(false);
  const debug = useDebug((e) => e.debug);

  // 1. 서버에서 받은 초기 상태를 저장
  const initialStatus = {
    reason_image: user.user_reject_history?.[0]?.reason_image ?? false,
    reason_description:
      user.user_reject_history?.[0]?.reason_description ?? false,
  };

  // 2. Row 컴포넌트가 직접 자신의 토글 상태를 관리
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  // 3. 부모 컴포넌트의 데이터가 바뀔 때(예: 페이지 이동) 상태를 리셋
  useEffect(() => {
    setCurrentStatus({
      reason_image: user.user_reject_history?.[0]?.reason_image ?? false,
      reason_description:
        user.user_reject_history?.[0]?.reason_description ?? false,
    });
  }, [user]);

  // 4. 토글 상태를 변경하는 핸들러
  const handleToggleChange = (
    key: "reason_image" | "reason_description",
    pressed: boolean
  ) => {
    setCurrentStatus((prev) => ({ ...prev, [key]: pressed }));
  };

  // 5. 이 Row의 변경 사항을 외부 API로 제출하는 핸들러
  const handleSave = async () => {
    setIsSaving(true);

    try {
      //   if (!response.ok) throw new Error("API 서버 응답 오류");
      await updateProfileStatus(
        Number(user.user_id),
        currentStatus.reason_image,
        currentStatus.reason_description
      );
    } catch (error) {
      console.error("API 호출 오류:", error);
      toast("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TableRow key={user.user_id}>
      <TableCell className="font-medium">{user.user_id}</TableCell>
      <TableCell>
        <ProfileDetailButton
          userId={Number(user.user_id)}
          nickname={user.profile?.nickname || ""}
        />
      </TableCell>
      <TableCell>
        {user.profile?.birthdate
          ? toLocaleDateString(user.profile.birthdate)
          : "-"}
      </TableCell>
      <TableCell>{user.phone ?? "-"}</TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            {user.created_at ? toLocaleDateString(user.created_at) : "-"}
          </TooltipTrigger>
          <TooltipContent>
            {user.created_at ? toLocaleString(user.created_at) : "-"}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        {user.profile?.profile_status ? (
          <ProfileStatus status={user.profile?.profile_status} />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-x-2 justify-center items-center">
          {user.profile
            ? rejectionStatusInfo.map(({ label, key }) => (
                <Toggle
                  key={key}
                  pressed={currentStatus[key]}
                  onPressedChange={(pressed) =>
                    handleToggleChange(key, pressed)
                  }
                  disabled={
                    user.profile?.profile_status === "APPROVED" && !debug
                  }
                  className="px-3 leading-6 min-w-[80px]"
                >
                  {label}
                </Toggle>
              ))
            : "-"}
        </div>
      </TableCell>
      {/* 7. Row마다 제출 버튼을 위한 새로운 Cell 추가 */}
      <TableCell className="text-center">
        {user.profile ? (
          <Button
            variant="submit"
            onClick={handleSave}
            disabled={
              isSaving ||
              (!debug && user.profile?.profile_status === "APPROVED")
            }
            className="w-full min-w-[80px]"
          >
            {isSaving ? <Loader className="animate-spin" /> : "저장"}
          </Button>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
