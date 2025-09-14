import { checkAuth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import UserTableWithPagination from "../_components/user-table-with-pagination";

const USERS_PER_PAGE = 20;

export default async function UserPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await checkAuth();
  const currentPage = Number((await searchParams)?.page) || 1;
  const whereClause = { role: "REGISTER" };

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user_table.findMany({
      where: whereClause,
      skip: (currentPage - 1) * USERS_PER_PAGE,
      take: USERS_PER_PAGE,

      orderBy: { created_at: "desc" },
      select: {
        user_id: true,
        phone: true,
        created_at: true,
        profile: {
          select: {
            nickname: true,
          },
        },
      },
    }),
    prisma.user_table.count({ where: whereClause }),
  ]);

  return (
    <UserTableWithPagination
      users={users}
      totalCount={totalUsers}
      currentPage={currentPage}
      perPage={USERS_PER_PAGE}
      roleName="가입 신청 사용자"
    />
  );
}
