"use server";

import { InitialData, UserData } from "./types.d";
import { apiClient } from "@/lib/api-client";

interface ProfileListApiResponse {
  userId: number;
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

// 심사 대기(role=PENDING) 프로필만 조회한다.
// /profiles/pending 엔드포인트는 검색(userId/nickname)·상태 필터를 지원하지 않고
// 페이지·정렬 파라미터만 받는다. 응답 형태는 /profiles와 동일하다.
export async function getPendingUsers(
  params: GetPendingUsersParams
): Promise<InitialData> {
  const {
    page = 1,
    pageSize = 10,
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  const pageData = await apiClient.get<PageApiResponse>("/profiles/pending", {
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
