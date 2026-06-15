"use server";

import { apiClient } from "@/lib/api-client";

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

    const pageData = await apiClient.get<PageApiResponse>("/profiles/images", {
      page: page - 1,
      size: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
      searchId: searchId,
      searchNickname: searchNickname,
      status: statusFilter.length > 0 ? statusFilter.join(",") : undefined,
    });

    if (!pageData || !pageData.content) {
      return {
        images: [],
        totalCount: 0,
        totalPages: 1,
        error: "데이터를 불러오는 데 실패했습니다.",
      };
    }

    return {
      images: pageData.content.map(convertApiResponseToProfileImageData),
      totalCount: pageData.totalElements,
      totalPages: Math.max(1, pageData.totalPages),
    };

   
  } catch {
    return {
      images: [],
      totalCount: 0,
      totalPages: 1,
      error: "데이터를 불러오는 데 실패했습니다.",
    };
  }
}
