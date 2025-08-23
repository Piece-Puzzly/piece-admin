// lib/actions/get-user.ts
"use server";

import prisma from "@/lib/prisma";
import { checkAuth } from "./auth";

export async function getUserInfo(userId: string | number | bigint) {
  await checkAuth();
  try {
    const user = await prisma.user_table.findUnique({
      where: { user_id: BigInt(userId) },
      include: { profile: true },
    })!;

    if (!user) {
      return null;
    }

    return {
      nickname: user.profile?.nickname ?? null,
      phone: user.phone,
      role: user.role,
      is_admin: user.is_admin,
      created_at: user.created_at?.toISOString(),
      profile: {
        nickname: user.profile?.nickname,
        birthdate: user.profile?.birthdate?.toISOString(),
        job: user.profile?.job,
        description: user.profile?.description,
      },
    };
  } catch (err) {
    console.error("getUserInfo error:", err);
    throw new Error("Server error");
  }
}

export async function getUserAllInfo(user_id: bigint | number) {
  // BigInt인 경우 대비해서 number도 받을 수 있게 처리
  const userIdBigInt = typeof user_id === "number" ? BigInt(user_id) : user_id;

  const user = await prisma.user_table.findUnique({
    where: { user_id: userIdBigInt },
    include: {
      profile: {
        include: {
          profile_image: true,
          profile_value_pick: {
            include: { value_pick: true },
          },
          profile_value_talk: {
            include: { value_talk: true },
          },
        },
      },
      term_agreement: {
        include: {
          term: true,
        },
      },
    },
    
  });

  return user;
}
