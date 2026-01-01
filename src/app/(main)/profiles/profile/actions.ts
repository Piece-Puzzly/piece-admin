"use server";

import { checkAuth } from "@/lib/actions/auth";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { InitialData, UserData } from "./types.d";

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
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      users: [],
      totalCount: 0,
      totalPages: 1,
      error: "Unauthorized",
    };
  }

  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "user_id",
      sortOrder = "desc",
      searchId,
      searchNickname,
      statusFilter = [],
    } = params;

    const urlParams = new URLSearchParams();
    urlParams.append("page", String(page - 1)); // API is 0-based
    urlParams.append("size", String(pageSize));
    urlParams.append("sortBy", sortBy);
    urlParams.append("sortOrder", sortOrder);
    if (searchId) urlParams.append("userId", searchId);
    if (searchNickname) urlParams.append("nickname", searchNickname);
    if (statusFilter.length > 0) {
      statusFilter.forEach((s) => urlParams.append("status", s));
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/profiles?${urlParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getUsers API error:", response.status);
      return {
        users: [],
        totalCount: 0,
        totalPages: 1,
        error: "데이터를 불러오는 데 실패했습니다.",
      };
    }

    const { data } = await response.json();
    const pageData = data as PageApiResponse;

    return {
      users: pageData.content.map(convertApiResponseToUserData),
      totalCount: pageData.totalElements,
      totalPages: Math.max(1, pageData.totalPages),
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {
      users: [],
      totalCount: 0,
      totalPages: 1,
      error: "데이터를 불러오는 데 실패했습니다.",
    };
  }
}
