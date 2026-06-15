import { getMarketingConsentedUsers } from "@/lib/actions/user-list";
import UserTableWithPagination from "../user-list/_components/user-table-with-pagination";
const USERS_PER_PAGE = 20;
export default async function MarketingConsentPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentPage = Number((await searchParams)?.page) || 1;
  const { users, totalCount } = await getMarketingConsentedUsers(
    currentPage,
    USERS_PER_PAGE
  );
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">마케팅 동의 유저</h1>
      <UserTableWithPagination
        users={users}
        totalCount={totalCount}
        currentPage={currentPage}
        perPage={USERS_PER_PAGE}
        roleName="마케팅 동의"
      />
    </div>
  );
}