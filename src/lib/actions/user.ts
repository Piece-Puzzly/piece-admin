// lib/actions/user.ts
"use server";

import { User } from "../types";
import { apiClient } from "../api-client";

const PAGE_SIZE = 10;

type FetchPagedUsersParams = {
  page: number;
  userId?: string;
  nickname?: string;
};

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

// API 응답을 기존 User 타입으로 변환
function convertApiUserToUser(apiUser: ApiUserResponse): User {
  return {
    user_id: apiUser.userId,
    phone: apiUser.phoneNumber,
    created_at: apiUser.joinDate ? new Date(apiUser.joinDate) : null,
    profile: apiUser.profileId ? {
      profile_id: BigInt(apiUser.profileId),
      nickname: apiUser.nickname,
      birthdate: apiUser.birthdate ? new Date(apiUser.birthdate) : null,
      description: apiUser.description,
      profile_status: apiUser.profileStatus,
    } : null,
  } as User;
}

export async function fetchPagedUsers({
  page,
  userId,
  nickname,
}: FetchPagedUsersParams): Promise<{
  users: User[];
  totalPages: number;
}> {

  try {

    const pageData = await apiClient.get<PageResponse<ApiUserResponse>>(
      `/users`, // 원래 `/users` 였지만, 백엔드 라우팅 확인 후 맞춰주세요.
      {
        page: page - 1,      // API는 0-based
        size: PAGE_SIZE,
        userId: userId,      // 값이 없으면 알아서 빠짐
        nickname: nickname,  // 값이 없으면 알아서 빠짐
      }
    );

    // 방어 로직 (데이터가 없거나 예상치 못한 구조일 때)
    if (!pageData || !pageData.content) {
      return { users: [], totalPages: 1 };
    }

    const users = pageData.content.map(convertApiUserToUser);
    const totalPages = Math.max(1, pageData.totalPages);

    return { users, totalPages };

  } catch (err) {
    // API 에러(404 등) 발생 시 apiClient가 던진 에러를 캐치
    console.error("fetchPagedUsers error:", err);
    return { users: [], totalPages: 1 };
  }
}

export async function getFilteredUsers({
  page,
  pageSize,
  userIdQuery,
  nicknameQuery,
}: {
  page: number;
  pageSize: number;
  userIdQuery?: string;
  nicknameQuery?: string;
}): Promise<{ users: User[]; totalCount: number }> {

  try {
    const pageData = await apiClient.get<PageResponse<ApiUserResponse>>(
      `/users`,
      {
        page: page - 1,
        size: pageSize,
        userId: userIdQuery,
        nickname: nicknameQuery,
      }
    );

    if (!pageData || !pageData.content) {
      return { users: [], totalCount: 0 };
    }

    const users = pageData.content.map(convertApiUserToUser);
    const totalCount = pageData.totalElements;
    return { users, totalCount };
  } catch (err) {
    console.error("getFilteredUsers error:", err);
    return { users: [], totalCount: 0 };
  }
}
