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
