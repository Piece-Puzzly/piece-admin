import { UserTableClient } from "./_components/user-table-client";
import { getUsers } from "./actions";

// 페이지 컴포넌트가 URL로부터 받을 수 있는 searchParams의 타입을 정의합니다.
interface UserAdminPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    searchId?: string;
    searchNickname?: string;
    status?: string;
    reject?: string;
  }>;
}

// page.tsx는 기본적으로 서버 컴포넌트입니다.
export default async function UserAdminPage({
  searchParams: searchParamsPromise,
}: UserAdminPageProps) {
  // 1. URL searchParams를 파싱하여 서버 액션에 전달할 인자를 준비합니다.
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "user_id";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";
  const searchId = searchParams.searchId;
  const searchNickname = searchParams.searchNickname;
  const statusFilter = searchParams.status?.split(",") || [];

  // 2. 서버 컴포넌트에서 직접 서버 액션을 호출하여 데이터를 가져옵니다.
  const initialData = await getUsers({
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchId,
    searchNickname,
    statusFilter,
  });

  // 3. 가져온 초기 데이터를 클라이언트 컴포넌트에 props로 전달합니다.
  return <UserTableClient initialData={initialData} />;
}
