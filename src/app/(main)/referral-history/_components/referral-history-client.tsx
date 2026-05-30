"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { CustomPagination } from "@/components/custom-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toLocaleString } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight } from "lucide-react";
import {
  type ReferralHistory,
  type ReferralHistoryResult,
  type ReferralRewardStatus,
  type ReferralSortBy,
} from "@/lib/actions/referral-history";

const PAGE_SIZE = 10;

const statusMeta: Record<
  ReferralRewardStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "대기", variant: "secondary" },
  REWARDED: { label: "보상 완료", variant: "default" },
  CANCELLED: { label: "취소", variant: "destructive" },
};

const sortableColumns: { key: ReferralSortBy; label: string }[] = [
  { key: "rewarded_at", label: "보상일" },
];

// 보상 연/월 버튼용: 올해부터 5년 전까지
// 보상 월 슬라이더: 올해 ~ 5년 전까지 총 72개월을 0..71 인덱스로 매핑한다.
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 5;
const MAX_YEAR = CURRENT_YEAR;
const TOTAL_MONTHS = (MAX_YEAR - MIN_YEAR + 1) * 12;

function indexToYearMonth(idx: number): string {
  const year = MIN_YEAR + Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function yearMonthToIndex(yyyymm: string): number | null {
  const m = /^(\d{4})-(\d{2})$/.exec(yyyymm);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (y < MIN_YEAR || y > MAX_YEAR || mo < 1 || mo > 12) return null;
  return (y - MIN_YEAR) * 12 + (mo - 1);
}

function StatusBadge({ status }: { status: ReferralRewardStatus | null }) {
  if (!status) return <span className="text-muted-foreground">-</span>;
  const meta = statusMeta[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

function UserCell({
  id,
  nickname,
}: {
  id: number | null;
  nickname: string | null;
}) {
  if (id == null) return <span className="text-muted-foreground">-</span>;
  return (
    <div className="flex flex-col">
      <span className="font-medium">{nickname || "(닉네임 없음)"}</span>
      <span className="text-xs text-muted-foreground">#{id}</span>
    </div>
  );
}

// 식별자(이메일·핸들·해시 등) 셀: 기본은 접혀 있고 토글로 펼쳐서 본다.
function IdentifierCell({ value }: { value: string | null }) {
  const [open, setOpen] = useState(false);
  if (!value) return <span className="text-muted-foreground">-</span>;
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="inline-flex max-w-full items-start gap-1 text-left text-xs text-muted-foreground hover:text-foreground"
    >
      {open ? (
        <ChevronDown className="mt-[2px] h-3 w-3 shrink-0" />
      ) : (
        <ChevronRight className="mt-[2px] h-3 w-3 shrink-0" />
      )}
      {open ? (
        <span className="break-all font-mono text-foreground">{value}</span>
      ) : (
        <span>보기</span>
      )}
    </button>
  );
}

export function ReferralHistoryClient({
  initialData,
}: {
  initialData: ReferralHistoryResult;
}) {
  const { histories, totalCount } = initialData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 입력 필드 로컬 상태(검색 버튼을 눌러야 URL에 반영). URL 값으로 초기화한다.
  const [invitingUserId, setInvitingUserId] = useState(
    searchParams.get("invitingUserId") ?? ""
  );
  const [invitedUserId, setInvitedUserId] = useState(
    searchParams.get("invitedUserId") ?? ""
  );
  const [userId, setUserId] = useState(searchParams.get("userId") ?? "");
  const [referralCode, setReferralCode] = useState(
    searchParams.get("referralCode") ?? ""
  );
  // 보상 월 범위: 시작·종료 슬라이더 두 개로 yyyy-MM 범위를 조절한다.
  // URL은 rewardStartMonth / rewardEndMonth (yyyy-MM) 형태로 보관한다.
  const initialStartIdx = (() => {
    const v = searchParams.get("rewardStartMonth");
    return v ? yearMonthToIndex(v) ?? 0 : 0;
  })();
  const initialEndIdx = (() => {
    const v = searchParams.get("rewardEndMonth");
    return v ? yearMonthToIndex(v) ?? TOTAL_MONTHS - 1 : TOTAL_MONTHS - 1;
  })();
  const [startIdx, setStartIdx] = useState<number>(initialStartIdx);
  const [endIdx, setEndIdx] = useState<number>(initialEndIdx);
  const isFullRange = startIdx === 0 && endIdx === TOTAL_MONTHS - 1;

  const statusValue = searchParams.get("status") ?? "ALL";

  const pushWith = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      if (resetPage) params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleSearch = () => {
    // 슬라이더가 전체 범위면 필터 미적용(파라미터 제거).
    const startMonth = isFullRange ? null : indexToYearMonth(startIdx);
    const endMonth = isFullRange ? null : indexToYearMonth(endIdx);
    pushWith({
      invitingUserId: invitingUserId.trim(),
      invitedUserId: invitedUserId.trim(),
      userId: userId.trim(),
      referralCode: referralCode.trim(),
      rewardStartMonth: startMonth,
      rewardEndMonth: endMonth,
      // 이전 다중선택 파라미터(있다면) 정리
      rewardYears: null,
      rewardMonths: null,
      rewardMonth: null,
      startDate: null,
      endDate: null,
    });
  };

  const handleReset = () => {
    setInvitingUserId("");
    setInvitedUserId("");
    setUserId("");
    setReferralCode("");
    setStartIdx(0);
    setEndIdx(TOTAL_MONTHS - 1);
    router.push(pathname, { scroll: false });
  };

  const handleStatusChange = (value: string) => {
    pushWith({ status: value === "ALL" ? null : value });
  };

  const handleSort = (key: ReferralSortBy) => {
    const currentSortBy = searchParams.get("sortBy") || "created_at";
    const currentSortOrder = searchParams.get("sortOrder") || "desc";
    const nextOrder =
      currentSortBy === key && currentSortOrder === "desc" ? "asc" : "desc";
    pushWith({ sortBy: key, sortOrder: nextOrder }, false);
  };

  const handlePageChange = (page: number) => {
    pushWith({ page: String(page) }, false);
  };

  const currentSortBy = searchParams.get("sortBy") || "created_at";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentPage = Number(searchParams.get("page")) || 1;

  const SortIndicator = ({ columnKey }: { columnKey: ReferralSortBy }) => {
    if (currentSortBy !== columnKey) return null;
    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  const SortableHead = ({ columnKey }: { columnKey: ReferralSortBy }) => {
    const label = sortableColumns.find((c) => c.key === columnKey)?.label;
    return (
      <TableHead
        onClick={() => handleSort(columnKey)}
        className="cursor-pointer select-none"
      >
        <div className="flex items-center">
          {label}
          <SortIndicator columnKey={columnKey} />
        </div>
      </TableHead>
    );
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">초대 이력 조회</h1>

      {/* 검색 필터 */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invitingUserId">초대한 사람 ID</Label>
          <Input
            id="invitingUserId"
            placeholder="코드 소유자 User ID"
            value={invitingUserId}
            onChange={(e) => setInvitingUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="invitedUserId">초대받은 사람 ID</Label>
          <Input
            id="invitedUserId"
            placeholder="초대받은 User ID"
            value={invitedUserId}
            onChange={(e) => setInvitedUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="userId">본인 ID (양쪽 중 일치)</Label>
          <Input
            id="userId"
            placeholder="초대한/받은 사람 어느 쪽이든"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="referralCode">추천인 코드</Label>
          <Input
            id="referralCode"
            placeholder="추천인 코드"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      {/* 보상 월 범위: 단일 트랙 + 두 핸들의 range slider. 트랙·핸들 색은 theme(primary/secondary). */}
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <Label>보상 월 범위 (슬라이더로 조절)</Label>
        <div className="flex items-center justify-between text-sm">
          <span>
            시작: <b className="tabular-nums">{indexToYearMonth(startIdx)}</b>
          </span>
          <span>
            종료: <b className="tabular-nums">{indexToYearMonth(endIdx)}</b>
          </span>
        </div>
        {(() => {
          const startPct = (startIdx / (TOTAL_MONTHS - 1)) * 100;
          const endPct = (endIdx / (TOTAL_MONTHS - 1)) * 100;
          // 두 input[type=range]를 동일 좌표에 겹쳐 한 트랙처럼 보이게 한다.
          // 입력 요소 자체는 pointer-events:none이고 핸들(thumb)만 auto로 받아서 트랙 클릭은 무시.
          const sliderClass =
            "pointer-events-none absolute inset-0 m-0 h-6 w-full appearance-none bg-transparent " +
            // WebKit
            "[&::-webkit-slider-runnable-track]:bg-transparent " +
            "[&::-webkit-slider-thumb]:pointer-events-auto " +
            "[&::-webkit-slider-thumb]:appearance-none " +
            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
            "[&::-webkit-slider-thumb]:rounded-full " +
            "[&::-webkit-slider-thumb]:bg-primary " +
            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background " +
            "[&::-webkit-slider-thumb]:shadow-sm " +
            "[&::-webkit-slider-thumb]:cursor-pointer " +
            // Mozilla
            "[&::-moz-range-track]:bg-transparent " +
            "[&::-moz-range-thumb]:pointer-events-auto " +
            "[&::-moz-range-thumb]:appearance-none " +
            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
            "[&::-moz-range-thumb]:rounded-full " +
            "[&::-moz-range-thumb]:bg-primary " +
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background " +
            "[&::-moz-range-thumb]:cursor-pointer";
          return (
            <div className="relative h-6 w-full">
              {/* 트랙 배경 */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-secondary" />
              {/* 선택 구간 강조 */}
              <div
                className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
                style={{
                  left: `${startPct}%`,
                  width: `${endPct - startPct}%`,
                }}
              />
              <input
                aria-label="시작 월"
                type="range"
                min={0}
                max={TOTAL_MONTHS - 1}
                value={startIdx}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setStartIdx(v);
                  if (v > endIdx) setEndIdx(v);
                }}
                className={sliderClass}
              />
              <input
                aria-label="종료 월"
                type="range"
                min={0}
                max={TOTAL_MONTHS - 1}
                value={endIdx}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setEndIdx(v);
                  if (v < startIdx) setStartIdx(v);
                }}
                className={sliderClass}
              />
            </div>
          );
        })()}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{indexToYearMonth(0)}</span>
          <span>{indexToYearMonth(TOTAL_MONTHS - 1)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {isFullRange
            ? "전체 범위입니다(필터 미적용). 슬라이더를 움직여 범위를 좁힐 수 있어요."
            : `적용 범위: ${indexToYearMonth(startIdx)} ~ ${indexToYearMonth(endIdx)}`}
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>보상 상태</Label>
          <Select value={statusValue} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              <SelectItem value="PENDING">대기</SelectItem>
              <SelectItem value="REWARDED">보상 완료</SelectItem>
              <SelectItem value="CANCELLED">취소</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            초기화
          </Button>
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        총 {totalCount.toLocaleString("ko-KR")}건
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>초대한 사람</TableHead>
            <TableHead>초대받은 사람</TableHead>
            <TableHead>추천인 코드</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-center">보상 퍼즐 (초대/피초대)</TableHead>
            <SortableHead columnKey="rewarded_at" />
            <TableHead>초대받은 사람 식별자</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {histories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                조회된 초대 이력이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            histories.map((history: ReferralHistory) => (
              <TableRow key={history.id}>
                <TableCell>
                  <UserCell
                    id={history.invitingUserId}
                    nickname={history.invitingNickname}
                  />
                </TableCell>
                <TableCell>
                  <UserCell
                    id={history.invitedUserId}
                    nickname={history.invitedNickname}
                  />
                </TableCell>
                <TableCell className="font-mono">
                  {history.referralCode || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={history.status} />
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {history.invitingRewardPuzzleCount ?? 0} /{" "}
                  {history.invitedRewardPuzzleCount ?? 0}
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {history.rewardedAt ? (
                    toLocaleString(history.rewardedAt)
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <IdentifierCell value={history.invitedUserIdentifier} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <CustomPagination
        num={totalCount}
        onChangePage={handlePageChange}
        currPage={currentPage}
        perPage={PAGE_SIZE}
      />
    </div>
  );
}
