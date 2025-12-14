"use server";

import { match_info, user_table } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

// lib/actions/match-info.ts
export type MatchHistoryPagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type MatchHistoryRow = match_info & {
  user_table_match_info_user_1Touser_table:
    | (user_table & {
        profile: {
          nickname: string | null;
        } | null;
      })
    | null;
  user_table_match_info_user_2Touser_table:
    | (user_table & {
        profile: {
          nickname: string | null;
        } | null;
      })
    | null;
};

export type MatchHistoryResult = {
  data: MatchHistoryRow[];
  pagination: MatchHistoryPagination;
};

export async function getMatchHistory({
  user1Id,
  user2Id,
  page = 1,
  pageSize = 10,
  matchType,
}: {
  user1Id?: bigint | number | string;
  user2Id?: bigint | number | string;
  page?: number;
  pageSize?: number;
  matchType?: "basic" | "paid";
}): Promise<MatchHistoryResult> {
  const skip = (page - 1) * pageSize;

  // 유저 필터 조건
  const userFilter =
    user1Id && user2Id
      ? {
          OR: [
            { user_1: BigInt(user1Id), user_2: BigInt(user2Id) },
            { user_1: BigInt(user2Id), user_2: BigInt(user1Id) },
          ],
        }
      : user1Id
        ? {
            OR: [{ user_1: BigInt(user1Id) }, { user_2: BigInt(user1Id) }],
          }
        : user2Id
          ? {
              OR: [{ user_1: BigInt(user2Id) }, { user_2: BigInt(user2Id) }],
            }
          : null;

  // matchType 필터 조건
  const typeFilter =
    matchType === "basic"
      ? { OR: [{ match_type: "BASIC" }, { match_type: null }] }
      : matchType === "paid"
        ? { match_type: { in: ["TRIAL", "PREMIUM"] } }
        : null;

  // where 조건 조합
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = {};
  if (userFilter && typeFilter) {
    where = { AND: [userFilter, typeFilter] };
  } else if (userFilter) {
    where = userFilter;
  } else if (typeFilter) {
    where = typeFilter;
  }

  const result = await prisma.match_info.findMany({
    where,
    orderBy: {
      date: "desc",
    },
    skip,
    take: pageSize,
    include: {
      user_table_match_info_user_1Touser_table: {
        include: {
          profile: {
            select: { nickname: true },
          },
        },
      },
      user_table_match_info_user_2Touser_table: {
        include: {
          profile: {
            select: { nickname: true },
          },
        },
      },
    },
  });
  const totalCount = await prisma.match_info.count({ where });

  return {
    data: result,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

export async function updateMatchInfoStatus(params: {
  id: bigint;
  user_1_match_status:
    | "ACCEPTED"
    | "BLOCKED"
    | "CHECKED"
    | "REFUSED"
    | "UNCHECKED"
    | null;
  user_2_match_status:
    | "ACCEPTED"
    | "BLOCKED"
    | "CHECKED"
    | "REFUSED"
    | "UNCHECKED"
    | null;
}) {
  const { id, user_1_match_status, user_2_match_status } = params;

  if (!id) throw new Error("id is required");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {};
  if (user_1_match_status) updateData.user_1_match_status = user_1_match_status;
  if (user_2_match_status) updateData.user_2_match_status = user_2_match_status;

  const updated = await prisma.match_info.update({
    where: { id },
    data: updateData,
  });

  return updated;
}

// match id 받고 그 match id에 해당하는 행 삭제하는 함수
export async function deleteMatchInfo(matchId: bigint | number) {
  if (!matchId) throw new Error("matchId is required");

  const deleted = await prisma.match_info.delete({
    where: { id: matchId },
  });
  revalidatePath("/match-action");
  return deleted;
}
