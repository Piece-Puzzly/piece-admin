"use server";

import { apiClient } from "../api-client";

// 보상 상태. 백엔드 ReferralRewardStatus enum과 일치한다.
export type ReferralRewardStatus = "PENDING" | "REWARDED" | "CANCELLED";

// GET /referral/histories 응답의 단일 이력 항목
export interface ReferralHistory {
  id: number;
  invitingUserId: number | null;
  invitingNickname: string | null;
  invitedUserId: number | null;
  invitedNickname: string | null;
  invitedUserIdentifier: string | null;
  referralCode: string | null;
  status: ReferralRewardStatus | null;
  invitingRewardPuzzleCount: number | null;
  invitedRewardPuzzleCount: number | null;
  rewardedAt: string | null;
  createdAt: string | null;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export type ReferralSortBy = "created_at" | "rewarded_at" | "id";
export type SortOrder = "asc" | "desc";

export interface ReferralHistorySearch {
  page: number; // 1부터 시작(UI 기준)
  size: number;
  invitingUserId?: string;
  invitedUserId?: string;
  userId?: string;
  referralCode?: string;
  status?: ReferralRewardStatus;
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  sortBy?: ReferralSortBy;
  sortOrder?: SortOrder;
}

export interface ReferralHistoryResult {
  histories: ReferralHistory[];
  totalPages: number;
  totalCount: number;
}

// GET /referral/histories (API_BASE_URL이 /admin/v1 포함). 백엔드 page는 0부터 시작.
export async function searchReferralHistories(
  search: ReferralHistorySearch
): Promise<ReferralHistoryResult> {
  const pageData = await apiClient.get<PageResponse<ReferralHistory>>(
    "/referral/histories",
    {
      page: search.page - 1,
      size: search.size,
      invitingUserId: search.invitingUserId,
      invitedUserId: search.invitedUserId,
      userId: search.userId,
      referralCode: search.referralCode,
      status: search.status,
      startDate: search.startDate,
      endDate: search.endDate,
      sortBy: search.sortBy ?? "created_at",
      sortOrder: search.sortOrder ?? "desc",
    }
  );

  if (!pageData || !pageData.content) {
    return { histories: [], totalPages: 1, totalCount: 0 };
  }

  return {
    histories: pageData.content,
    totalPages: Math.max(1, pageData.totalPages),
    totalCount: pageData.totalElements,
  };
}
