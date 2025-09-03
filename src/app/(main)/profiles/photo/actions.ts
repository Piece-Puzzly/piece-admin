"use server";

import prisma from "@/lib/prisma";
import { Prisma, profile_image_status } from "@prisma/client";

// GetProfileImagesParams 타입 정의 (변경 없음)
interface GetProfileImagesParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchId?: string;
  searchNickname?: string;
  statusFilter?: string[];
}

// profile_image_status Enum 타입 가드 (변경 없음)
const imageStatusValues = Object.values(profile_image_status);
function isImageStatus(value: string): value is profile_image_status {
  return (imageStatusValues as string[]).includes(value);
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

    const where: Prisma.profile_imageWhereInput = {};
    const conditions: Prisma.profile_imageWhereInput[] = [];
    if (searchId && !isNaN(Number(searchId))) {
      conditions.push({
        profile: { user_table: { user_id: BigInt(searchId) } },
      });
    }
    if (searchNickname) {
      conditions.push({
        profile: { nickname: { contains: searchNickname } },
      });
    }
    if (statusFilter.length > 0) {
      const validStatuses = statusFilter.filter(isImageStatus);
      if (validStatuses.length > 0) {
        conditions.push({ status: { in: validStatuses } });
      }
    }
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const latestImageGroups = await prisma.profile_image.groupBy({
      by: ["profile_id"],
      _max: {
        profile_image_id: true,
      },
      where,
    });

    const latestImageIds = latestImageGroups
      .map((group) => group._max.profile_image_id)
      .filter((id): id is bigint => id !== null);

    const totalCount = latestImageIds.length;

    // ⭐️ 최종 데이터를 조회하는 부분을 `include` 대신 `select`로 수정
    const images = await prisma.profile_image.findMany({
      where: {
        profile_image_id: {
          in: latestImageIds,
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      // `ProfileImageData` 타입에 맞춰 필요한 필드만 선택
      select: {
        profile_image_id: true,
        created_at: true,
        updated_at: true,
        image_url: true,
        status: true,
        profile: {
          select: {
            nickname: true,
            user_table: {
              select: {
                user_id: true,
              },
            },
          },
        },
      },
    });

    return {
      images: images,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
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
