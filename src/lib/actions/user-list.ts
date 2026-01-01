// lib/actions/user-list.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";
import { checkAuth } from "./auth";

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
  user_id: number;
  created_at: Date | null;
  profile: {
    nickname: string | null;
    image_url: string | null;
  } | null;
}

export async function getUsersByRole(
  role: string,
  page: number,
  limit: number
): Promise<{
  users: UserWithProfile[];
  totalPages: number;
  totalCount: number;
}> {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { users: [], totalPages: 1, totalCount: 0 };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/users/by-role/${role}?page=${page - 1}&size=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getUsersByRole API error:", response.status);
      return { users: [], totalPages: 1, totalCount: 0 };
    }

    const { data } = await response.json();
    const pageData = data as PageResponse<ApiUserResponse>;

    const users: UserWithProfile[] = pageData.content.map((apiUser) => ({
      user_id: apiUser.userId,
      created_at: apiUser.joinDate ? new Date(apiUser.joinDate) : null,
      profile: apiUser.profileId ? {
        nickname: apiUser.nickname,
        image_url: null, // API에서 imageUrl이 없으면 null
      } : null,
    }));

    return {
      users,
      totalPages: Math.max(1, pageData.totalPages),
      totalCount: pageData.totalElements,
    };
  } catch (err) {
    console.error("getUsersByRole error:", err);
    return { users: [], totalPages: 1, totalCount: 0 };
  }
}
