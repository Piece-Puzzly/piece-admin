import { getUsersByRole } from "@/lib/actions/user-list";
import UserTableWithPagination from "../_components/user-table-with-pagination";

const USERS_PER_PAGE = 20;

export default async function UserPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const currentPage = Number(sp?.page) || 1;
  const searchType: "nickname" | "id" = sp?.searchType === "id" ? "id" : "nickname";
  const searchValueRaw = sp?.searchValue;
  const searchValue =
    typeof searchValueRaw === "string" ? searchValueRaw : "";
  const search = searchValue ? { type: searchType, value: searchValue } : undefined;

  const { users, totalCount } = await getUsersByRole("USER", currentPage, USERS_PER_PAGE, search);

  return (
    <UserTableWithPagination
      users={users}
      totalCount={totalCount}
      currentPage={currentPage}
      perPage={USERS_PER_PAGE}
      roleName="일반 사용자"
    />
  );
}
