"use server";

import { checkAuth } from "@/lib/actions/auth";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

interface ProfileStatsApiResponse {
  totalProfiles: number;
  ageDistribution: Record<string, number>;
  heightDistribution: Record<string, number>;
  weightDistribution: Record<string, number>;
  jobDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  smokingStatusDistribution: Record<string, number>;
  snsLevelDistribution: Record<string, number>;
}

export async function getProfileStats() {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { totalProfiles: 0 };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/stats/profiles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getProfileStats API error:", response.status);
      return { totalProfiles: 0 };
    }

    const { data } = await response.json();
    const stats = data as ProfileStatsApiResponse;

    return {
      totalProfiles: stats.totalProfiles,
      ageDistribution: stats.ageDistribution || {},
      heightDistribution: stats.heightDistribution || {},
      weightDistribution: stats.weightDistribution || {},
      jobDistribution: stats.jobDistribution || {},
      locationDistribution: stats.locationDistribution || {},
      smokingStatusDistribution: stats.smokingStatusDistribution || {},
      snsLevelDistribution: stats.snsLevelDistribution || {},
    };
  } catch (error) {
    console.error("Failed to fetch profile stats:", error);
    throw new Error("프로필 통계를 가져오는 데 실패했습니다.");
  }
}

export type UserIdentifier = {
  userId?: bigint;
  nickname: string;
};

export type PaginatedUsersResponse = {
  users: UserIdentifier[];
  totalCount: number;
};

interface UserInCategoryApiResponse {
  userId: number | null;
  nickname: string | null;
}

interface PageApiResponse {
  content: UserInCategoryApiResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export async function getUsersInStatCategory(options: {
  category: string;
  value: string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedUsersResponse> {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return { users: [], totalCount: 0 };
  }

  const { category, value, page = 1, perPage = 10 } = options;

  try {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("value", value);
    params.append("page", String(page - 1)); // API is 0-based
    params.append("size", String(perPage));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/stats/profiles/users?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getUsersInStatCategory API error:", response.status);
      return { users: [], totalCount: 0 };
    }

    const { data } = await response.json();
    const pageData = data as PageApiResponse;

    const users = pageData.content.map((user) => ({
      userId: user.userId ? BigInt(user.userId) : undefined,
      nickname: user.nickname ?? "",
    }));

    return { users, totalCount: pageData.totalElements };
  } catch (error) {
    console.error("Failed to fetch users in stat category:", error);
    return { users: [], totalCount: 0 };
  }
}
