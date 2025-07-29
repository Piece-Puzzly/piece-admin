// lib/actions/user.ts
"use server";

import prisma from "../prisma";
import { User } from "../types";

const PAGE_SIZE = 10;

type FetchPagedUsersParams = {
  page: number;
  userId?: string;
  nickname?: string;
};

export async function fetchPagedUsers({
  page,
  userId,
  nickname,
}: FetchPagedUsersParams): Promise<{
  users: User[];
  totalPages: number;
}> {
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(userId && !isNaN(Number(userId)) && { user_id: Number(userId) }),
    ...(nickname && {
      profile: {
        nickname: {
          contains: nickname,
        },
      },
    }),
  };

  const [users, totalCount] = await Promise.all([
    prisma.user_table
      .findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { user_id: "desc" },
        where,
        include: { profile: true },
      })
      .then((users) =>
        users.map((user) => ({ ...user, user_id: Number(user.user_id) }))
      ),
    prisma.user_table.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return { users, totalPages };
}
export async function getFilteredUsers({
  page,
  pageSize,
  userIdQuery,
  nicknameQuery,
}: {
  page: number;
  pageSize: number;
  userIdQuery?: string;
  nicknameQuery?: string;
}) {
  const where = {
    AND: [
      userIdQuery
        ? { user_id: { equals: Number(userIdQuery) || -1 } }
        : undefined,
      nicknameQuery
        ? { profile: { nickname: { contains: nicknameQuery } } }
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].filter(Boolean) as any,
  };

  const users = await prisma.user_table.findMany({
    where,
    include: { profile: true },
    orderBy: { user_id: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalCount = await prisma.user_table.count({ where });

  return { users, totalCount };
}
