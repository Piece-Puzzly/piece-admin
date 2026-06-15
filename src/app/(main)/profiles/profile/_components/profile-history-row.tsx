"use client";

import ProfileDetailButton from "@/components/detail-buttons/profile-detail-button";
import ProfileStatus from "@/components/profile-status";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { roleNameMap } from "@/lib/constants";
import { cn, toLocaleDateString, toLocaleString } from "@/lib/utils";
import { UserData } from "../types";

const DELETED_ROLE = "DELETED";

const rejectionLabels: {
  label: string;
  key: "reason_image" | "reason_description";
}[] = [
  { label: "사진", key: "reason_image" },
  { label: "소개글", key: "reason_description" },
];

// 심사 내역의 조회 전용 행. 제출/심사 컨트롤 없이 결과만 보여준다.
export function ProfileHistoryRow({ user }: { user: UserData }) {
  const isWithdrawn = user.role === DELETED_ROLE;
  const reject = user.user_reject_history?.[0];
  const flaggedReasons = reject
    ? rejectionLabels.filter(({ key }) => reject[key]).map(({ label }) => label)
    : [];

  return (
    <TableRow
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
          <ProfileStatus status={user.profile.profile_status} />
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="text-center">
        {flaggedReasons.length > 0 ? flaggedReasons.join(", ") : "-"}
      </TableCell>
      <TableCell className="text-center">
        {/* approvedAt이 null이면 표시하지 않는다. */}
        {user.profile?.approved_at ? (
          <Tooltip>
            <TooltipTrigger>
              {toLocaleDateString(user.profile.approved_at)}
            </TooltipTrigger>
            <TooltipContent>
              {toLocaleString(user.profile.approved_at)}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
