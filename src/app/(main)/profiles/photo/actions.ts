"use server";

import { checkAuth } from "@/lib/actions/auth";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

interface GetProfileImagesParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchId?: string;
  searchNickname?: string;
  statusFilter?: string[];
}

interface ProfileImageApiResponse {
  profileImageId: number;
  createdAt: string | null;
  updatedAt: string | null;
  imageUrl: string | null;
  status: string | null;
  profile: {
    nickname: string | null;
    userId: number | null;
  };
}

interface PageApiResponse {
  content: ProfileImageApiResponse[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export type ProfileImageData = {
  profile_image_id: bigint;
  created_at: Date | null;
  updated_at: Date | null;
  image_url: string | null;
  status: string | null;
  profile: {
    nickname: string | null;
    user_table: {
      user_id: bigint;
    } | null;
  } | null;
};

function convertApiResponseToProfileImageData(apiResponse: ProfileImageApiResponse): ProfileImageData {
  return {
    profile_image_id: BigInt(apiResponse.profileImageId),
    created_at: apiResponse.createdAt ? new Date(apiResponse.createdAt) : null,
    updated_at: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : null,
    image_url: apiResponse.imageUrl,
    status: apiResponse.status,
    profile: apiResponse.profile ? {
      nickname: apiResponse.profile.nickname,
      user_table: apiResponse.profile.userId ? {
        user_id: BigInt(apiResponse.profile.userId),
      } : null,
    } : null,
  };
}

export async function getProfileImages(params: GetProfileImagesParams) {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      images: [],
      totalCount: 0,
      totalPages: 1,
      error: "Unauthorized",
    };
  }

  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
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
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/profiles/images?${urlParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getProfileImages API error:", response.status);
      return {
        images: [],
        totalCount: 0,
        totalPages: 1,
        error: "이미지 기록을 불러오는 데 실패했습니다.",
      };
    }

    const { data } = await response.json();
    const pageData = data as PageApiResponse;

    return {
      images: pageData.content.map(convertApiResponseToProfileImageData),
      totalCount: pageData.totalElements,
      totalPages: Math.max(1, pageData.totalPages),
    };
  } catch (error) {
    console.error("Failed to fetch profile images:", error);
    return {
      images: [],
      totalCount: 0,
      totalPages: 1,
      error: "이미지 기록을 불러오는 데 실패했습니다.",
    };
  }
}
