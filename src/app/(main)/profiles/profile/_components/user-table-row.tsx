// /app/admin/users/user-table-row.tsx
"use client";

import { useDebug } from "@/app/hooks/use-debug";
import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import ProfileStatus from "@/components/profile-status";
import { Button } from "@/components/ui/button";
import { roleNameMap } from "@/lib/constants";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateProfileStatus } from "@/lib/server";
import { cn, toLocaleDateString, toLocaleString } from "@/lib/utils";
import { Check, Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserData } from "../types";

interface UserTableRowProps {
  user: UserData;
}

type Decision = "APPROVED" | "REJECTED" | null;

export function UserTableRow({ user }: UserTableRowProps) {
  const [isSaving, setIsSaving] = useState(false);
  const debug = useDebug((e) => e.debug);

  // 탈퇴 유저: 닉네임이 "_d_"로 시작하는지로 판별
  const isWithdrawn = user.profile?.nickname?.startsWith("_d_") ?? false;

  // 가치관Talk 심사 결정 상태
  const [decision, setDecision] = useState<Decision>(null);

  // 부모 컴포넌트의 데이터가 바뀔 때 상태 리셋
  useEffect(() => {
    setDecision(null);
  }, [user]);

  // 제출 핸들러
  const handleSave = async () => {
    if (decision === null) {
      toast.error("승인 또는 반려를 선택해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfileStatus(Number(user.user_id), decision === "REJECTED");
      toast.success("저장되었습니다.");
    } catch (error) {
      console.error("API 호출 오류:", error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const isApproved = user.profile?.profile_status === "APPROVED";
  const isDisabled = !debug && isApproved;

  return (
    <TableRow
      key={user.user_id}
      className={cn(isWithdrawn && "bg-destructive/5 hover:bg-destructive/10")}
    >
      <TableCell className="font-medium">{user.user_id}</TableCell>
      <TableCell>
        <ProfileDetailButton
          userId={Number(user.user_id)}
          nickname={user.profile?.nickname || ""}
          userRole={user.role}
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
        {user.role ? roleNameMap[user.role] ?? user.role : "-"}
      </TableCell>
      <TableCell>
        {user.profile?.profile_status ? (
          <ProfileStatus status={user.profile?.profile_status} />
        ) : (
          "-"
        )}
      </TableCell>
      {/* 가치관Talk 승인/반려 버튼 */}
      <TableCell>
        <div className="flex gap-1 justify-center items-center">
          {user.profile && !isApproved ? (
            <>
              <Button
                size="sm"
                variant={decision === "APPROVED" ? "default" : "secondary"}
                className="h-7 px-2"
                onClick={() => setDecision("APPROVED")}
                disabled={isDisabled}
              >
                <Check className="h-3 w-3 mr-1" />
                승인
              </Button>
              <Button
                size="sm"
                variant={decision === "REJECTED" ? "default" : "secondary"}
                className="h-7 px-2"
                onClick={() => setDecision("REJECTED")}
                disabled={isDisabled}
              >
                <X className="h-3 w-3 mr-1" />
                반려
              </Button>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center">
        {user.profile && !isApproved ? (
          <Button
            variant="submit"
            onClick={handleSave}
            disabled={isSaving || isDisabled || decision === null}
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
