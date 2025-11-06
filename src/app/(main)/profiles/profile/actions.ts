"use server";

import { checkAuth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma"; // prisma 클라이언트 경로는 프로젝트에 맞게 수정해주세요.
import { Prisma, profile_profile_status } from "@prisma/client";
import { InitialData } from "./types";

// GetUsersParams 타입 정의 (rejectFilter 제거)
interface GetUsersParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchId?: string;
  searchNickname?: string;
  statusFilter?: string[];
}

// profile_profile_status Enum 타입 가드

// orderBy 객체의 최상위 키를 위한 타입 및 타입 가드
type UserTableSortableKeys = "user_id" | "created_at";
function isUserTableSortableKey(key: string): key is UserTableSortableKeys {
  return ["user_id", "created_at"].includes(key);
}

export async function getUsers(params: GetUsersParams): Promise<InitialData> {
  await checkAuth();
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

    const where: Prisma.user_tableWhereInput = {};
    const conditions: Prisma.user_tableWhereInput[] = [];

    if (searchId) {
      if (!isNaN(Number(searchId))) {
        conditions.push({ user_id: BigInt(searchId) });
      }
    }
    if (searchNickname) {
      conditions.push({ profile: { nickname: { contains: searchNickname } } });
    }
    if (statusFilter.length > 0) {
      const prismaStatusQuery: profile_profile_status[] = [];
      let hasNullQuery = false;
      statusFilter.forEach((filter) => {
        switch (filter) {
          case "NORMAL":
            prismaStatusQuery.push("APPROVED");
            break;
          case "NEEDS_REVIEW":
            prismaStatusQuery.push("INCOMPLETE", "REVISED");
            break;
          case "REJECTED":
            prismaStatusQuery.push("REJECTED");
            break;
          case "NA":
            hasNullQuery = true;
            break;
        }
      });
      const statusConditions: Prisma.user_tableWhereInput[] = [];
      if (prismaStatusQuery.length > 0) {
        statusConditions.push({
          profile: { profile_status: { in: prismaStatusQuery } },
        });
      }
      if (hasNullQuery) {
        statusConditions.push({
          OR: [{ profile: null }, { profile: { profile_status: null } }],
        });
      }
      if (statusConditions.length > 0) {
        conditions.push({ OR: statusConditions });
      }
    }
    if (conditions.length > 0) {
      where.AND = conditions;
    }
    const orderBy: Prisma.user_tableOrderByWithRelationInput = {};
    if (["nickname", "birthdate", "profile_status"].includes(sortBy)) {
      orderBy.profile = { [sortBy]: sortOrder };
    } else if (isUserTableSortableKey(sortBy)) {
      orderBy[sortBy] = sortOrder;
    }

    const [users, totalCount] = await prisma.$transaction([
      prisma.user_table.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          user_id: true,
          phone: true,
          created_at: true,
          profile: {
            select: {
              nickname: true,
              birthdate: true,
              profile_status: true,
              profile_image: {
                select: { status: true },
                orderBy: { created_at: "desc" },
                take: 1,
              },
            },
          },
          user_reject_history: {
            select: {
              reason_image: true,
              reason_description: true,
            },
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      }),
      prisma.user_table.count({ where }),
    ]);

    const processedUsers = users.map((user) => {
      if (!user.profile) {
        return {
          ...user,
          user_reject_history: [
            { reason_image: false, reason_description: false },
          ],
          profileImageStatus: null,
        };
      }
      const isApproved = user.profile.profile_status === "APPROVED";
      const latestRejectHistory = user.user_reject_history[0];
      const initialReasonImage = latestRejectHistory?.reason_image ?? false;
      const initialReasonDescription =
        latestRejectHistory?.reason_description ?? false;
      const finalReasonImage = !isApproved && initialReasonImage;
      const finalReasonDescription = !isApproved && initialReasonDescription;
      const latestProfileImage = user.profile.profile_image[0];
      const profileImageStatus = latestProfileImage?.status ?? null;

      return {
        ...user,
        user_reject_history: [
          {
            reason_image: finalReasonImage,
            reason_description: finalReasonDescription,
          },
        ],
        profileImageStatus: profileImageStatus,
      };
    });

    // ⭐️ BigInt를 string으로 변환하는 로직을 제거했습니다.
    return {
      users: processedUsers, // 가공된 데이터를 BigInt 타입 그대로 반환합니다.
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
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
