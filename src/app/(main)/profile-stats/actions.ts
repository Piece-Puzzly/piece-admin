"use server";

import { checkAuth } from "@/lib/actions/auth";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { apiClient } from "@/lib/api-client";

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

  try {
    const stats : ProfileStatsApiResponse = await apiClient.get<ProfileStatsApiResponse>("/stats/profiles");
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
    return { totalProfiles: 0 };
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

  const { category, value, page = 1, perPage = 10 } = options;

  try {

    const pageData = await apiClient.get<PageApiResponse>("/stats/profiles/users", {
      category: category,
      value: value,
      page: String(page - 1),
      size: String(perPage),
    });

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
