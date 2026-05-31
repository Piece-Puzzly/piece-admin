// lib/actions/user-list.ts
"use server";
import { apiClient } from "../api-client";

// API 응답 타입
interface ApiUserResponse {
  userId: number;
  profileId: number | null;
  description: string | null;
  nickname: string | null;
  name: string | null;
  birthdate: string | null;
  phoneNumber: string | null;
  joinDate: string | null;
  profileStatus: string | null;
  profileImageStatus: string | null;
  rejectImage: boolean;
  rejectDescription: boolean;
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

// 반환 타입 정의
interface UserWithProfile {
  user_id: bigint;
  phone: string | null;
  created_at: Date | null;
  profile: {
    nickname: string | null;
    image_url: string | null;
  } | null;
}

// 유저 조회 검색: 닉네임 또는 user id 중 하나로 검색한다.
export type UserSearch = { type: "nickname" | "id"; value: string };

export async function getUsersByRole(
  role: string,
  page: number,
  limit: number,
  search?: UserSearch
): Promise<{
  users: UserWithProfile[];
  totalPages: number;
  totalCount: number;
}> {
    // 백엔드 분리:
    // - /users/by-role/{role}: page/size만 받음 (검색 파라미터 미지원)
    // - /users: role + userId + nickname 모두 받음 (검색 가능)
    // 따라서 검색값이 있을 때만 /users로 분기하고, 없으면 기존 by-role 엔드포인트를 그대로 쓴다.
    const hasSearch = !!search?.value;
    const pageData = hasSearch
      ? await apiClient.get<PageResponse<ApiUserResponse>>("/users", {
          page: page - 1,
          size: limit,
          role,
          userId: search!.type === "id" ? search!.value : undefined,
          nickname: search!.type === "nickname" ? search!.value : undefined,
        })
      : await apiClient.get<PageResponse<ApiUserResponse>>(
          `/users/by-role/${role}`,
          {
            page: page - 1,
            size: limit,
          }
        );

    // 2. 데이터가 없는 경우의 방어 로직
    if (!pageData || !pageData.content) {
      return { users: [], totalPages: 1, totalCount: 0 };
    }

    // 3. 기존에 잘 작성해두셨던 매핑 로직은 그대로 유지!
    const users: UserWithProfile[] = pageData.content.map((apiUser) => ({
      user_id: BigInt(apiUser.userId),
      phone: apiUser.phoneNumber,
      created_at: apiUser.joinDate ? new Date(apiUser.joinDate) : null,
      profile: apiUser.profileId
        ? {
            nickname: apiUser.nickname,
            image_url: null, // API에서 imageUrl이 없으면 null
          }
        : null,
    }));

    return {
      users,
      totalPages: Math.max(1, pageData.totalPages),
      totalCount: pageData.totalElements,
    };
}

export async function getMarketingConsentedUsers(
  page: number,
  limit: number
): Promise<{
  users: UserWithProfile[];
  totalPages: number;
  totalCount: number;
}> {
    // 1. 기존의 checkAuth, getServerSession, apiFetch, headers 주입, json 파싱을 
    // 모두 apiClient 하나로 대체합니다. 
    // 서버 로그에서 확인한 /admin/v1 경로를 적용합니다.
    const pageData = await apiClient.get<PageResponse<ApiUserResponse>>(
      `/users/marketing-consent`,
      {
        page: page - 1,
        size: limit,
      }
    );

    // 2. 데이터가 없는 경우의 방어 로직
    if (!pageData || !pageData.content) {
      return { users: [], totalPages: 1, totalCount: 0 };
    }

    // 3. 기존에 잘 작성해두셨던 매핑 로직은 그대로 유지!
    const users: UserWithProfile[] = pageData.content.map((apiUser) => ({
      user_id: BigInt(apiUser.userId),
      phone: apiUser.phoneNumber,
      created_at: apiUser.joinDate ? new Date(apiUser.joinDate) : null,
      profile: apiUser.profileId
        ? {
            nickname: apiUser.nickname,
            image_url: null, // API에서 imageUrl이 없으면 null
          }
        : null,
    }));

    return {
      users,
      totalPages: Math.max(1, pageData.totalPages),
      totalCount: pageData.totalElements,
    };
}

export type UserCountsByRole = {
  NONE: number;
  REGISTER: number;
  PENDING: number;
  USER: number;
};

export async function getUserCountsByRole(): Promise<UserCountsByRole> {
  return apiClient.get<UserCountsByRole>("/users/counts-by-role");
}
