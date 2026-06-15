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
import { MatchHistoryRow } from "@/lib/actions/match-infos";
import { setFreeMatchStatus } from "@/lib/server";

import { Loader } from "lucide-react";
import { useState } from "react";
import DeleteMatchButton from "./delete-match-button";

type MatchStatus = "UNCHECKED" | "CHECKED" | "ACCEPTED" | "REFUSED" | "BLOCKED";

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
    useState<MatchStatus | null>(match.user_1_match_status as MatchStatus | null);
  const [user2Status, setUser2Status] =
    useState<MatchStatus | null>(match.user_2_match_status as MatchStatus | null);

  const [loading, setLoading] = useState(false);
  return (
    <TableRow key={match.id}>
      <TableCell>{match.id}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserInfoButton
            userId={Number(match.user_table_match_info_user_1Touser_table?.user_id ?? 0)}
            nickname={
              match.user_table_match_info_user_1Touser_table?.profile?.nickname ?? "-"
            }
          />
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={user1Status ?? undefined}
          onValueChange={(value) =>
            setUser1Status(value as MatchStatus)
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
            userId={Number(match.user_table_match_info_user_2Touser_table?.user_id ?? 0)}
            nickname={
              match.user_table_match_info_user_2Touser_table?.profile?.nickname ?? "-"
            }
          />
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={user2Status ?? undefined}
          onValueChange={(value) =>
            setUser2Status(value as MatchStatus)
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
        <span className="capitalize">{match.match_type ?? "-"}</span>
      </TableCell>
      <TableCell suppressHydrationWarning>
        {match.created_at
          ? new Date(match.created_at).toLocaleString("ko-KR", {
              hour12: false,
            })
          : "-"}
      </TableCell>
      <TableCell>
        <Button
          className="h-full w-full"
          onClick={async () => {
            setLoading(true);
            try {
              await setFreeMatchStatus({
                matchId: Number(match.id),
                user1Id: Number(match.user_table_match_info_user_1Touser_table?.user_id ?? 0),
                user2Id: Number(match.user_table_match_info_user_2Touser_table?.user_id ?? 0),
                user1Status: user1Status ?? "UNCHECKED",
                user2Status: user2Status ?? "UNCHECKED",
              });
            } catch (error) {
              console.error("API Error:", error);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" /> : "제출"}
        </Button>
      </TableCell>
      <TableCell>
        <DeleteMatchButton matchId={match.id} />
      </TableCell>
    </TableRow>
  );
}
