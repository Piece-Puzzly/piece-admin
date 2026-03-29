"use server";

import { InitialData, UserData } from "./types.d";
import { apiClient } from "@/lib/api-client";

interface GetUsersParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchId?: string;
  searchNickname?: string;
  statusFilter?: string[];
}

interface ProfileListApiResponse {
  userId: number;
  phone: string | null;
  createdAt: string | null;
  profile: {
    nickname: string | null;
    birthdate: string | null;
    profileStatus: string | null;
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
    phone: apiResponse.phone,
    created_at: apiResponse.createdAt ? new Date(apiResponse.createdAt) : null,
    profile: apiResponse.profile ? {
      nickname: apiResponse.profile.nickname ?? "",
      birthdate: apiResponse.profile.birthdate ? new Date(apiResponse.profile.birthdate) : null,
      profile_status: apiResponse.profile.profileStatus,
    } : null,
    user_reject_history: [{
      reason_image: apiResponse.rejectHistory.reasonImage,
      reason_description: apiResponse.rejectHistory.reasonDescription,
    }],
  };
}

export async function getUsers(params: GetUsersParams): Promise<InitialData> {

    const {
      page = 1,
      pageSize = 10,
      sortBy = "user_id",
      sortOrder = "desc",
      searchId,
      searchNickname,
      statusFilter = [],
    } = params;


    const pageData = await apiClient.get<PageApiResponse>(
      `/profiles`, 
      {
        page: page - 1, // API는 0-based
        size: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder,
        userId: searchId,       // 값이 없으면 apiClient가 알아서 제외
        nickname: searchNickname, // 값이 없으면 apiClient가 알아서 제외
        // 배열 파라미터 처리: 요소가 있을 때만 'A,B' 형태로 결합
        status: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
      }
    );

    // 2. 데이터가 비어있거나 예상치 못한 응답 방어 로직
    if (!pageData || !pageData.content) {
      return {
        users: [],
        totalCount: 0,
        totalPages: 1,
        error: "데이터를 불러오는 데 실패했습니다.",
      };
    }

    // 3. 기존 매핑 및 반환 로직 유지
    return {
      users: pageData.content.map(convertApiResponseToUserData),
      totalCount: pageData.totalElements,
      totalPages: Math.max(1, pageData.totalPages),
    };
}
