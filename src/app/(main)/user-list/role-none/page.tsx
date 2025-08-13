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
  const whereClause = { role: "NONE" };

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user_table.findMany({
      where: whereClause,
      skip: (currentPage - 1) * USERS_PER_PAGE,
      take: USERS_PER_PAGE,
      orderBy: { created_at: "desc" },
    }),
    prisma.user_table.count({ where: whereClause }),
  ]);

  return (
    <UserTableWithPagination
      users={users}
      totalCount={totalUsers}
      currentPage={currentPage}
      perPage={USERS_PER_PAGE}
      roleName="정상 사용자"
    />
  );
}
