import { getUsersByRole } from "@/lib/actions/user-list";
import UserTableWithPagination from "../_components/user-table-with-pagination";

const USERS_PER_PAGE = 20;

export default async function UserPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentPage = Number((await searchParams)?.page) || 1;

  const { users, totalCount } = await getUsersByRole("NONE", currentPage, USERS_PER_PAGE);

  return (
    <UserTableWithPagination
      users={users}
      totalCount={totalCount}
      currentPage={currentPage}
      perPage={USERS_PER_PAGE}
      roleName="정상 사용자"
    />
  );
}
