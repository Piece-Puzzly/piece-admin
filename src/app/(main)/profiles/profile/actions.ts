"use server";

import { InitialData, UserData, ReviewSession, ReviewDecision } from "./types.d";
import { apiClient } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

interface ProfileListApiResponse {
  userId: number;
  profileId: number | null;
  role: string | null;
  phone: string | null;
  createdAt: string | null;
  // 백엔드 응답 필드명은 profileInfo (profile 아님)
  profileInfo: {
    nickname: string | null;
    birthdate: string | null;
    profileStatus: string | null;
    imageUrl: string | null;
    approvedAt: string | null;
  } | null;
  rejectHistory: {
    reasonImage: boolean;
    reasonDescription: boolean;
  };
  profileImageStatus: string | null;
}

interface PageApiResponse {
  content: ProfileListApiResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

function convertApiResponseToUserData(apiResponse: ProfileListApiResponse): UserData {
  return {
    user_id: BigInt(apiResponse.userId),
    profile_id: apiResponse.profileId ? BigInt(apiResponse.profileId) : null,
    role: apiResponse.role,
    phone: apiResponse.phone,
    created_at: apiResponse.createdAt ? new Date(apiResponse.createdAt) : null,
    profile: apiResponse.profileInfo ? {
      nickname: apiResponse.profileInfo.nickname ?? "",
      birthdate: apiResponse.profileInfo.birthdate ? new Date(apiResponse.profileInfo.birthdate) : null,
      profile_status: apiResponse.profileInfo.profileStatus,
      // 사진 보유 여부 판정용. null이면 사진 미제출 → 사진 심사 버튼 비활성
      image_url: apiResponse.profileInfo.imageUrl,
      // 승인 일시. 미승인이면 null.
      approved_at: apiResponse.profileInfo.approvedAt ? new Date(apiResponse.profileInfo.approvedAt) : null,
    } : null,
    user_reject_history: [{
      reason_image: apiResponse.rejectHistory.reasonImage,
      reason_description: apiResponse.rejectHistory.reasonDescription,
    }],
  };
}

interface GetPendingUsersParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 심사 대기 전체 조회 (신규 유저 + 기존 유저 사진 변경)
// /profiles/needs-review 엔드포인트:
// - role=PENDING 유저 (신규)
// - role=USER이면서 PENDING 이미지가 있는 유저 (기존 유저 사진 변경)
export async function getPendingUsers(
  params: GetPendingUsersParams
): Promise<InitialData> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  const pageData = await apiClient.get<PageApiResponse>("/profiles/needs-review", {
    page: page - 1, // API는 0-based
    size: pageSize,
    sortBy,
    sortOrder,
  });

  if (!pageData || !pageData.content) {
    return {
      users: [],
      totalCount: 0,
      totalPages: 1,
      error: "데이터를 불러오는 데 실패했습니다.",
    };
  }

  const users = pageData.content.map(convertApiResponseToUserData);

  return {
    users,
    totalCount: pageData.totalElements,
    totalPages: Math.max(1, pageData.totalPages),
  };
}

// 탈퇴 유저 판별: user role이 "DELETED"인지로 구분한다.
const DELETED_ROLE = "DELETED";

interface GetProfileHistoryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // 프로필 상태 필터 (REJECTED, INCOMPLETE, REVISED, APPROVED). 비어 있으면 전체 조회.
  statusFilter?: string[];
  // true면 탈퇴 유저(role === "DELETED")를 제외한다.
  excludeWithdrawn?: boolean;
}

// 심사 내역: 전체 프로필을 조회한다(조회 전용). 상태 필터를 넘기면 해당 상태만 조회한다.
// excludeWithdrawn이 true면 탈퇴 유저(role=DELETED)를 프론트에서 제외한다.
// 주의: 서버 사이드 페이지네이션이라 제외 시 페이지당 행 수/카운트가 다소 어긋날 수 있다.
export async function getProfileHistory(
  params: GetProfileHistoryParams
): Promise<InitialData> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortOrder = "desc",
    statusFilter = [],
    excludeWithdrawn = false,
  } = params;

  const pageData = await apiClient.get<PageApiResponse>("/profiles", {
    page: page - 1, // API는 0-based
    size: pageSize,
    sortBy,
    sortOrder,
    // 배열 파라미터: 요소가 있을 때만 'A,B' 형태로 결합해 List<String>으로 전달
    status: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
  });

  if (!pageData || !pageData.content) {
    return {
      users: [],
      totalCount: 0,
      totalPages: 1,
      error: "데이터를 불러오는 데 실패했습니다.",
    };
  }

  const allUsers = pageData.content.map(convertApiResponseToUserData);
  const users = excludeWithdrawn
    ? allUsers.filter((user) => user.role !== DELETED_ROLE)
    : allUsers;

  return {
    users,
    totalCount: pageData.totalElements,
    totalPages: Math.max(1, pageData.totalPages),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// ReviewSession API
// ═══════════════════════════════════════════════════════════════════════════

// 심사 세션 생성 (세션 타입은 서버에서 자동 판단)
export async function createReviewSession(profileId: number): Promise<ReviewSession> {
  const response = await apiClient.post<ReviewSession>("/review-sessions", {
    profileId,
  });
  return response;
}

// 프로필의 현재 열린 세션 조회
export async function getOpenSession(profileId: number): Promise<ReviewSession | null> {
  try {
    const response = await apiClient.get<ReviewSession>(
      `/review-sessions/profile/${profileId}`
    );
    return response;
  } catch {
    return null;
  }
}

// 세션 조회
export async function getReviewSession(sessionId: number): Promise<ReviewSession | null> {
  try {
    const response = await apiClient.get<ReviewSession>(
      `/review-sessions/${sessionId}`
    );
    return response;
  } catch {
    return null;
  }
}

// 항목 심사 (이미지 또는 가치관톡)
export async function reviewItem(
  sessionId: number,
  sessionImageId: number,
  decision: ReviewDecision
): Promise<void> {
  await apiClient.patch<void>(
    `/review-sessions/${sessionId}/items/${sessionImageId}`,
    { decision }
  );
}

// 세션 커밋 (최종 저장)
export async function commitReviewSession(sessionId: number): Promise<ReviewSession> {
  const response = await apiClient.post<ReviewSession>(
    `/review-sessions/${sessionId}/commit`
  );
  revalidatePath("/profiles/profile");
  return response;
}
