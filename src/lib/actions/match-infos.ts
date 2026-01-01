"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "../auth-options";
import { apiFetch, logger } from "../logger";
import { checkAuth } from "./auth";

// API 응답 타입 정의
interface PaymentInfoApi {
  imagePaid: boolean;
  acceptPaid: boolean;
  contactPaid: boolean;
}

interface MatchInfoApiResponse {
  id: number;
  date: string | null;
  matchType: string | null;
  user1MatchStatus: string | null;
  user2MatchStatus: string | null;
  createdAt: string | null;
  user1: {
    userId: number;
    nickname: string | null;
  } | null;
  user2: {
    userId: number;
    nickname: string | null;
  } | null;
  user1Payment: PaymentInfoApi | null;
  user2Payment: PaymentInfoApi | null;
}

interface PageApiResponse {
  content: MatchInfoApiResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

// 반환 타입 정의
export type MatchHistoryPagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PaymentInfo = {
  imagePaid: boolean;
  acceptPaid: boolean;
  contactPaid: boolean;
};

export type MatchHistoryRow = {
  id: bigint;
  date: Date | null;
  match_type: string | null;
  user_1_match_status: string | null;
  user_2_match_status: string | null;
  created_at: Date | null;
  user_table_match_info_user_1Touser_table: {
    user_id: bigint;
    profile: {
      nickname: string | null;
    } | null;
  } | null;
  user_table_match_info_user_2Touser_table: {
    user_id: bigint;
    profile: {
      nickname: string | null;
    } | null;
  } | null;
  // Payment 정보 추가
  user1Payment: PaymentInfo;
  user2Payment: PaymentInfo;
};

export type MatchHistoryResult = {
  data: MatchHistoryRow[];
  pagination: MatchHistoryPagination;
};

const defaultPayment: PaymentInfo = {
  imagePaid: false,
  acceptPaid: false,
  contactPaid: false,
};

function convertApiResponseToMatchHistoryRow(apiResponse: MatchInfoApiResponse): MatchHistoryRow {
  return {
    id: BigInt(apiResponse.id),
    date: apiResponse.date ? new Date(apiResponse.date) : null,
    match_type: apiResponse.matchType,
    user_1_match_status: apiResponse.user1MatchStatus,
    user_2_match_status: apiResponse.user2MatchStatus,
    created_at: apiResponse.createdAt ? new Date(apiResponse.createdAt) : null,
    user_table_match_info_user_1Touser_table: apiResponse.user1 ? {
      user_id: BigInt(apiResponse.user1.userId),
      profile: {
        nickname: apiResponse.user1.nickname,
      },
    } : null,
    user_table_match_info_user_2Touser_table: apiResponse.user2 ? {
      user_id: BigInt(apiResponse.user2.userId),
      profile: {
        nickname: apiResponse.user2.nickname,
      },
    } : null,
    user1Payment: apiResponse.user1Payment ?? defaultPayment,
    user2Payment: apiResponse.user2Payment ?? defaultPayment,
  };
}

export async function getMatchHistory({
  user1Id,
  user2Id,
  page = 1,
  pageSize = 10,
  matchType,
}: {
  user1Id?: bigint | number | string;
  user2Id?: bigint | number | string;
  page?: number;
  pageSize?: number;
  matchType?: "basic" | "paid";
}): Promise<MatchHistoryResult> {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      data: [],
      pagination: { total: 0, page: 1, pageSize, totalPages: 1 },
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("page", String(page - 1)); // API는 0-based
    params.append("size", String(pageSize));
    if (user1Id) params.append("user1Id", String(user1Id));
    if (user2Id) params.append("user2Id", String(user2Id));
    if (matchType) params.append("matchType", matchType);

    const response = await apiFetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/match-info?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return {
        data: [],
        pagination: { total: 0, page, pageSize, totalPages: 1 },
      };
    }

    const { data } = await response.json();
    const pageData = data as PageApiResponse;

    return {
      data: pageData.content.map(convertApiResponseToMatchHistoryRow),
      pagination: {
        total: pageData.totalElements,
        page: pageData.currentPage + 1, // 1-based로 변환
        pageSize: pageData.pageSize,
        totalPages: Math.max(1, pageData.totalPages),
      },
    };
  } catch (err) {
    logger.error("getMatchHistory", err);
    return {
      data: [],
      pagination: { total: 0, page, pageSize, totalPages: 1 },
    };
  }
}

export async function updateMatchInfoStatus(params: {
  id: bigint;
  user_1_match_status:
    | "ACCEPTED"
    | "BLOCKED"
    | "CHECKED"
    | "REFUSED"
    | "UNCHECKED"
    | null;
  user_2_match_status:
    | "ACCEPTED"
    | "BLOCKED"
    | "CHECKED"
    | "REFUSED"
    | "UNCHECKED"
    | null;
}) {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, user_1_match_status, user_2_match_status } = params;
  if (!id) throw new Error("id is required");

  try {
    const response = await apiFetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/match-info/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1MatchStatus: user_1_match_status,
          user2MatchStatus: user_2_match_status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update match status");
    }

    const { data } = await response.json();
    return convertApiResponseToMatchHistoryRow(data);
  } catch (err) {
    logger.error("updateMatchInfoStatus", err);
    throw err;
  }
}

// match id 받고 그 match id에 해당하는 행 삭제하는 함수
export async function deleteMatchInfo(matchId: bigint | number) {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!matchId) throw new Error("matchId is required");

  try {
    const response = await apiFetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/match-info/${matchId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete match");
    }

    revalidatePath("/match-action");
    return { success: true };
  } catch (err) {
    logger.error("deleteMatchInfo", err);
    throw err;
  }
}
