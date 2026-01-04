// lib/actions/user.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";
import { User } from "../types";
import { checkAuth } from "./auth";

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
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { users: [], totalPages: 1 };
  }

  try {
    // API 쿼리 파라미터 구성
    const params = new URLSearchParams();
    params.append("page", String(page - 1)); // API는 0-based
    params.append("size", String(PAGE_SIZE));
    if (userId) params.append("userId", userId);
    if (nickname) params.append("nickname", nickname);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("fetchPagedUsers API error:", response.status);
      return { users: [], totalPages: 1 };
    }

    const { data } = await response.json();
    const pageData = data as PageResponse<ApiUserResponse>;

    const users = pageData.content.map(convertApiUserToUser);
    const totalPages = Math.max(1, pageData.totalPages);

    return { users, totalPages };
  } catch (err) {
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
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { users: [], totalCount: 0 };
  }

  try {
    const params = new URLSearchParams();
    params.append("page", String(page - 1)); // API는 0-based
    params.append("size", String(pageSize));
    if (userIdQuery) params.append("userId", userIdQuery);
    if (nicknameQuery) params.append("nickname", nicknameQuery);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getFilteredUsers API error:", response.status);
      return { users: [], totalCount: 0 };
    }

    const { data } = await response.json();
    const pageData = data as PageResponse<ApiUserResponse>;

    const users = pageData.content.map(convertApiUserToUser);

    return { users, totalCount: pageData.totalElements };
  } catch (err) {
    console.error("getFilteredUsers error:", err);
    return { users: [], totalCount: 0 };
  }
}
