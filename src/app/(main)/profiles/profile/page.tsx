import { UserTableClient } from "./_components/user-table-client";
import { getPendingUsers } from "./actions";

// 페이지 컴포넌트가 URL로부터 받을 수 있는 searchParams의 타입을 정의합니다.
interface UserAdminPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}

// 프로필 심사: 심사 대기(role=PENDING) 프로필만 /profiles/pending API로 조회한다.
export default async function UserAdminPage({
  searchParams: searchParamsPromise,
}: UserAdminPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "user_id";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";

  const initialData = await getPendingUsers({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  return <UserTableClient initialData={initialData} />;
}
