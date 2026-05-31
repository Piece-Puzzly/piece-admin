import { ReferralHistoryClient } from "./_components/referral-history-client";
import {
  searchReferralHistories,
  type ReferralRewardStatus,
  type ReferralSortBy,
  type SortOrder,
} from "@/lib/actions/referral-history";

const PAGE_SIZE = 10;
const VALID_STATUSES: ReferralRewardStatus[] = [
  "PENDING",
  "REWARDED",
  "CANCELLED",
];
const VALID_SORT_BY: ReferralSortBy[] = ["created_at", "rewarded_at", "id"];

interface ReferralHistoryPageProps {
  searchParams: Promise<{
    page?: string;
    invitingUserId?: string;
    invitedUserId?: string;
    userId?: string;
    referralCode?: string;
    status?: string;
    // 보상 월 슬라이더 시작/종료(yyyy-MM). 페이지에서 첫일/말일로 환산해 백엔드에 전달.
    rewardStartMonth?: string;
    rewardEndMonth?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

// 슬라이더 시작/종료 월(yyyy-MM) → 연속 범위(yyyy-MM-dd 첫일·말일)로 변환.
// 둘 중 하나라도 비어 있거나 형식 불일치면 미적용(undefined).
function monthRangeBounds(
  rewardStartMonth: string | undefined,
  rewardEndMonth: string | undefined
): { startDate: string; endDate: string } | undefined {
  if (!rewardStartMonth || !rewardEndMonth) return undefined;
  const s = /^(\d{4})-(\d{2})$/.exec(rewardStartMonth);
  const e = /^(\d{4})-(\d{2})$/.exec(rewardEndMonth);
  if (!s || !e) return undefined;
  const startYear = Number(s[1]);
  const startMonth = Number(s[2]);
  const endYear = Number(e[1]);
  const endMonth = Number(e[2]);
  if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
    return undefined;
  }
  // new Date(y, m, 0) → 해당 월의 마지막 날 (m은 1-based, 익월의 0일=전월 말일)
  const lastDay = new Date(endYear, endMonth, 0).getDate();
  return {
    startDate: `${startYear}-${String(startMonth).padStart(2, "0")}-01`,
    endDate: `${endYear}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
  };
}

// 초대 이력 조회: 다양한 조건으로 추천인 코드 초대 이력을 검색한다(조회 전용).
export default async function ReferralHistoryPage({
  searchParams: searchParamsPromise,
}: ReferralHistoryPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const status = VALID_STATUSES.includes(
    searchParams.status as ReferralRewardStatus
  )
    ? (searchParams.status as ReferralRewardStatus)
    : undefined;
  const sortBy = VALID_SORT_BY.includes(searchParams.sortBy as ReferralSortBy)
    ? (searchParams.sortBy as ReferralSortBy)
    : "created_at";
  const sortOrder: SortOrder =
    searchParams.sortOrder === "asc" ? "asc" : "desc";

  const bounds = monthRangeBounds(
    searchParams.rewardStartMonth,
    searchParams.rewardEndMonth
  );

  const initialData = await searchReferralHistories({
    page,
    size: PAGE_SIZE,
    invitingUserId: searchParams.invitingUserId,
    invitedUserId: searchParams.invitedUserId,
    userId: searchParams.userId,
    referralCode: searchParams.referralCode,
    status,
    startDate: bounds?.startDate,
    endDate: bounds?.endDate,
    sortBy,
    sortOrder,
  });

  return <ReferralHistoryClient initialData={initialData} />;
}
