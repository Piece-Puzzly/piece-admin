"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import { MatchHistoryRow } from "@/lib/actions/match-infos";
import { setPaidMatchStatus } from "@/lib/server";
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

  // 유저 1 상태 - API 응답값으로 초기화
  const [user1Match, setUser1Match] = useState(match.user1Payment.acceptPaid);
  const [user1Image, setUser1Image] = useState(match.user1Payment.imagePaid);
  const [user1Contact, setUser1Contact] = useState(match.user1Payment.contactPaid);

  // 유저 2 상태 - API 응답값으로 초기화
  const [user2Match, setUser2Match] = useState(match.user2Payment.acceptPaid);
  const [user2Image, setUser2Image] = useState(match.user2Payment.imagePaid);
  const [user2Contact, setUser2Contact] = useState(match.user2Payment.contactPaid);

  // 유저별 상태 (드롭다운) - API 응답값으로 초기화
  const [user1Status, setUser1Status] = useState<StatusValue>(
    (match.user_1_match_status as StatusValue) ?? "UNCHECKED"
  );
  const [user2Status, setUser2Status] = useState<StatusValue>(
    (match.user_2_match_status as StatusValue) ?? "UNCHECKED"
  );

  // 이미 제출되었는지 판단 (payment 정보 중 하나라도 true이면 제출된 것으로 간주)
  const isAlreadySubmitted =
    match.user1Payment.imagePaid ||
    match.user1Payment.contactPaid ||
    match.user2Payment.imagePaid ||
    match.user2Payment.contactPaid;

  // 로딩/제출 상태
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(isAlreadySubmitted);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await setPaidMatchStatus({
        matchId: Number(match.id),
        user1Id: Number(match.user_table_match_info_user_1Touser_table?.user_id ?? 0),
        user2Id: Number(match.user_table_match_info_user_2Touser_table?.user_id ?? 0),
        user1Status: user1Status,
        user2Status: user2Status,
        user1AcceptPaid: isTrial ? false : isPremium ? true : user1Match,
        user1ImagePaid: user1Image,
        user1ContactPaid: user1Contact,
        user2AcceptPaid: isTrial ? false : isPremium ? true : user2Match,
        user2ImagePaid: user2Image,
        user2ContactPaid: user2Contact,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("API Error:", error);
      alert(error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.");
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
          userId={Number(match.user_table_match_info_user_1Touser_table?.user_id ?? 0)}
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
          <StatusToggle value={user1Match} onChange={setUser1Match} disabled={submitted} alreadyPurchased={match.user1Payment.acceptPaid} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Image} onChange={setUser1Image} disabled={submitted} alreadyPurchased={match.user1Payment.imagePaid} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Contact} onChange={setUser1Contact} disabled={submitted} alreadyPurchased={match.user1Payment.contactPaid} />
      </TableCell>

      {/* 상태 A */}
      <TableCell>
        <StatusPillSelect value={user1Status} onChange={setUser1Status} disabled={submitted} />
      </TableCell>

      {/* 프로필 B */}
      <TableCell>
        <UserInfoButton
          userId={Number(match.user_table_match_info_user_2Touser_table?.user_id ?? 0)}
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
          <StatusToggle value={user2Match} onChange={setUser2Match} disabled={submitted} alreadyPurchased={match.user2Payment.acceptPaid} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Image} onChange={setUser2Image} disabled={submitted} alreadyPurchased={match.user2Payment.imagePaid} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Contact} onChange={setUser2Contact} disabled={submitted} alreadyPurchased={match.user2Payment.contactPaid} />
      </TableCell>

      {/* 상태 B */}
      <TableCell>
        <StatusPillSelect value={user2Status} onChange={setUser2Status} disabled={submitted} />
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
      <TableCell suppressHydrationWarning>
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
