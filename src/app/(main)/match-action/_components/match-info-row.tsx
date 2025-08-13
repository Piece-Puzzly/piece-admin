import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import { MatchHistoryRow, updateMatchInfoStatus } from "@/lib/match-infos";

import {
  match_info_user_1_match_status,
  match_info_user_2_match_status,
} from "@prisma/client";
import { useState } from "react";

const matchStatusOptions = [
  "UNCHECKED",
  "CHECKED",
  "ACCEPTED",
  "REFUSED",
  "BLOCKED",
] as const;

const matchSatatusName = {
  ACCEPTED: "수락",
  UNCHECKED: "확인 안 함",
  CHECKED: "확인함",
  BLOCKED: "차단",
  REFUSED: "거절",
};

export default function MatchInfoRow({
  data: match,
}: {
  data: MatchHistoryRow;
}) {
  const [user1Status, setUser1Status] =
    useState<match_info_user_1_match_status | null>(match.user_1_match_status);
  const [user2Status, setUser2Status] =
    useState<match_info_user_1_match_status | null>(match.user_2_match_status);

  const [loading, setLoading] = useState(false);
  return (
    <TableRow key={match.id}>
      <TableCell>{match.id}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserInfoButton
            userId={Number(match.user_1!)}
            nickname={
              match.user_table_match_info_user_1Touser_table!.profile!.nickname!
            }
          />
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={user1Status ?? undefined}
          onValueChange={(value) =>
            setUser1Status(value as match_info_user_1_match_status)
          }
        >
          <SelectTrigger className="w-full h-[36px]!">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {matchStatusOptions.map((e) => (
              <SelectItem value={e} key={e}>
                {matchSatatusName[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserInfoButton
            userId={Number(match.user_2!)}
            nickname={
              match.user_table_match_info_user_2Touser_table!.profile!.nickname!
            }
          />
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={user2Status ?? undefined}
          onValueChange={(value) =>
            setUser2Status(value as match_info_user_2_match_status)
          }
        >
          <SelectTrigger className="w-full h-[36px]!">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            {matchStatusOptions.map((e) => (
              <SelectItem value={e} key={e}>
                {matchSatatusName[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {match.date
          ? new Date(match.date).toLocaleString("ko-KR", {
              timeZone: "Asia/Seoul",
            })
          : "-"}
      </TableCell>
      <TableCell>
        <Button
          className="h-full w-full"
          onClick={async () => {
            setLoading(true);
            try {
              await updateMatchInfoStatus({
                id: match.id,
                user_1_match_status: user1Status,
                user_2_match_status: user2Status,
              });
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? "제출 중..." : "제출"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
