// lib/getUsersByRole.ts
import prisma from "@/lib/prisma";

export async function getUsersByRole(
  role: string,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user_table.findMany({
      where: { role },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        profile: {
          select: { nickname: true, image_url: true },
        },
      },
    }),
    prisma.user_table.count({ where: { role } }),
  ]);

  return {
    users,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}
