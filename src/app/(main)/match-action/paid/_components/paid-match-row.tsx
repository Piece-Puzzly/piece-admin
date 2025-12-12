"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import { MatchHistoryRow } from "@/lib/actions/match-infos";
import { Loader } from "lucide-react";
import { useState } from "react";
import DeleteMatchButton from "../../_components/delete-match-button";
import StatusToggle from "./status-toggle";

interface PaidMatchRowProps {
  data: MatchHistoryRow;
}

export default function PaidMatchRow({ data: match }: PaidMatchRowProps) {
  const isTrial = match.match_type?.toUpperCase() === "TRIAL";

  // 유저 1 상태
  const [user1Match, setUser1Match] = useState(true);
  const [user1Image, setUser1Image] = useState(false);
  const [user1Contact, setUser1Contact] = useState(false);

  // 유저 2 상태
  const [user2Match, setUser2Match] = useState(true);
  const [user2Image, setUser2Image] = useState(false);
  const [user2Contact, setUser2Contact] = useState(false);

  // 각 프로필별 로딩/제출 상태
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [submittedA, setSubmittedA] = useState(false);
  const [submittedB, setSubmittedB] = useState(false);

  const handleSubmitA = async () => {
    setLoadingA(true);
    try {
      // TODO: 실제 업데이트 로직 구현
      console.log("Submit A:", {
        matchId: match.id,
        user1: { match: user1Match, image: user1Image, contact: user1Contact },
      });
      setSubmittedA(true);
    } finally {
      setLoadingA(false);
    }
  };

  const handleSubmitB = async () => {
    setLoadingB(true);
    try {
      // TODO: 실제 업데이트 로직 구현
      console.log("Submit B:", {
        matchId: match.id,
        user2: { match: user2Match, image: user2Image, contact: user2Contact },
      });
      setSubmittedB(true);
    } finally {
      setLoadingB(false);
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
          <span className={submittedA ? "text-gray-400 font-medium" : "text-green-600 font-medium"}>무료</span>
        ) : (
          <StatusToggle value={user1Match} onChange={setUser1Match} disabled={submittedA} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Image} onChange={setUser1Image} disabled={submittedA} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user1Contact} onChange={setUser1Contact} disabled={submittedA} />
      </TableCell>

      {/* 제출 A */}
      <TableCell>
        <Button size="sm" onClick={handleSubmitA} disabled={loadingA || submittedA}>
          {loadingA ? <Loader className="w-4 h-4 animate-spin" /> : submittedA ? "완료" : "제출"}
        </Button>
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
          <span className={submittedB ? "text-gray-400 font-medium" : "text-green-600 font-medium"}>무료</span>
        ) : (
          <StatusToggle value={user2Match} onChange={setUser2Match} disabled={submittedB} />
        )}
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Image} onChange={setUser2Image} disabled={submittedB} />
      </TableCell>
      <TableCell>
        <StatusToggle value={user2Contact} onChange={setUser2Contact} disabled={submittedB} />
      </TableCell>

      {/* 제출 B */}
      <TableCell>
        <Button size="sm" onClick={handleSubmitB} disabled={loadingB || submittedB}>
          {loadingB ? <Loader className="w-4 h-4 animate-spin" /> : submittedB ? "완료" : "제출"}
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
