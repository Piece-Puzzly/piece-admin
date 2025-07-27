"use server";

import { match_info, user_table } from "@prisma/client";
import prisma from "./prisma";

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
}: {
  user1Id?: bigint | number | string;
  user2Id?: bigint | number | string;
  page?: number;
  pageSize?: number;
}): Promise<MatchHistoryResult> {
  const skip = (page - 1) * pageSize;

  // 공통 where 조건 설정
  const where =
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
          : {}; // 전체 매치

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
