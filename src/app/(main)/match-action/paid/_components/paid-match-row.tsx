"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import { MatchHistoryRow } from "@/lib/actions/match-infos";
import { Loader } from "lucide-react";
import { useState } from "react";
import DeleteMatchButton from "../../_components/delete-match-button";
import StatusPillSelect, { StatusValue } from "./status-pill-select";
import StatusToggle from "./status-toggle";

interface PaidMatchRowProps {
  data: MatchHistoryRow;
}

export default function PaidMatchRow({ data: match }: PaidMatchRowProps) {
  const isTrial = match.match_type?.toUpperCase() === "TRIAL";
  const isPremium = match.match_type?.toUpperCase() === "PREMIUM";

  // 유저 1 상태
  const [user1Match, setUser1Match] = useState(true);
  const [user1Image, setUser1Image] = useState(false);
  const [user1Contact, setUser1Contact] = useState(false);

  // 유저 2 상태
  const [user2Match, setUser2Match] = useState(true);
  const [user2Image, setUser2Image] = useState(false);
  const [user2Contact, setUser2Contact] = useState(false);

  // 유저별 상태 (드롭다운)
  const [user1Status, setUser1Status] = useState<StatusValue>("UNCHECKED");
  const [user2Status, setUser2Status] = useState<StatusValue>("ACCEPTED"); // B는 기본 그린라이트

  // 로딩/제출 상태
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: 실제 업데이트 로직 구현
      console.log("Submit:", {
        matchId: match.id,
        user1: { match: user1Match, image: user1Image, contact: user1Contact, status: user1Status },
        user2: { match: user2Match, image: user2Image, contact: user2Contact, status: user2Status },
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow>
      <TableCell>{String(match.id)}</TableCell>

      {/* 프로필 A */}
      <TableCell>
        <UserInfoButton
          userId={Number(match.user_1!)}
          nickname={
            match.user_table_match_info_user_1Touser_table?.profile?.nickname ||
            "A"
          }
        />
      </TableCell>

      {/* 유저 1 토글들 */}
      <TableCell>
        {isTrial ? (
          <span className={submitted ? "text-gray-400 font-medium" : "font-medium"}>무료</span>
        ) : isPremium ? (
          <StatusToggle value={true} disabled={true} />
        ) : (
          <StatusToggle value={user1Match} onChange={setUser1Match} disabled={submitted} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Image} onChange={setUser1Image} disabled={submitted} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Contact} onChange={setUser1Contact} disabled={submitted} />
      </TableCell>

      {/* 상태 A */}
      <TableCell>
        <StatusPillSelect value={user1Status} onChange={setUser1Status} disabled={submitted} />
      </TableCell>

      {/* 프로필 B */}
      <TableCell>
        <UserInfoButton
          userId={Number(match.user_2!)}
          nickname={
            match.user_table_match_info_user_2Touser_table?.profile?.nickname ||
            "B"
          }
        />
      </TableCell>

      {/* 유저 2 토글들 */}
      <TableCell>
        {isTrial ? (
          <span className={submitted ? "text-gray-400 font-medium" : "font-medium"}>무료</span>
        ) : isPremium ? (
          <StatusToggle value={true} disabled={true} />
        ) : (
          <StatusToggle value={user2Match} onChange={setUser2Match} disabled={submitted} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Image} onChange={setUser2Image} disabled={submitted} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Contact} onChange={setUser2Contact} disabled={submitted} />
      </TableCell>

      {/* 상태 B */}
      <TableCell>
        <StatusPillSelect value={user2Status} onChange={setUser2Status} disabled={submitted} variant="B" />
      </TableCell>

      {/* 제출 */}
      <TableCell>
        <Button size="sm" onClick={handleSubmit} disabled={loading || submitted}>
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : submitted ? "완료" : "제출"}
        </Button>
      </TableCell>

      {/* 타입 */}
      <TableCell>
        <span className="capitalize">{match.match_type || "-"}</span>
      </TableCell>

      {/* 날짜 */}
      <TableCell>
        {match.created_at
          ? new Date(match.created_at).toLocaleString("ko-KR", {
              hour12: false,
            })
          : "-"}
      </TableCell>

      {/* 삭제 */}
      <TableCell>
        <DeleteMatchButton matchId={match.id} />
      </TableCell>
    </TableRow>
  );
}
