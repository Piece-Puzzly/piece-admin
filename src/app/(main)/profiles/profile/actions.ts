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
  // 탈퇴 유저 필터링. user role이 "DELETED"인지로 판별한다.
  // "only" = 탈퇴 유저만, "exclude" = 탈퇴 유저 제외
  withdrawnFilter?: "only" | "exclude";
}

interface ProfileListApiResponse {
  userId: number;
  role: string | null;
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
    role: apiResponse.role,
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

// 탈퇴 유저 판별: user role이 "DELETED"인지로 구분한다.
const DELETED_ROLE = "DELETED";

function isWithdrawnUser(user: UserData): boolean {
  return user.role === DELETED_ROLE;
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
      withdrawnFilter,
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
        // 탈퇴 필터는 백엔드에 보내지 않고 아래에서 프론트 필터링으로 처리
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

    // 3. 매핑 후, withdrawnFilter에 따라 프론트에서 탈퇴 유저를 필터링한다.
    //    (user role이 "DELETED"인지로 판별)
    const allUsers = pageData.content.map(convertApiResponseToUserData);
    const users =
      withdrawnFilter === "only"
        ? allUsers.filter(isWithdrawnUser)
        : withdrawnFilter === "exclude"
          ? allUsers.filter((user) => !isWithdrawnUser(user))
          : allUsers;

    // 주의: 서버 사이드 페이지네이션이므로 totalCount/totalPages에는
    // 필터링으로 제외된 유저도 포함되어, 페이지당 행 수가 줄거나 카운트가 다소 부정확할 수 있음.
    return {
      users,
      totalCount: pageData.totalElements,
      totalPages: Math.max(1, pageData.totalPages),
    };
}
