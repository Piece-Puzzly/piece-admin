import { UserTableClient } from "../profile/_components/user-table-client";
import { getUsers } from "../profile/actions";

// 메인 프로필 페이지와 동일한 searchParams 구조를 사용합니다.
interface DeletedProfilePageProps {
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

// 탈퇴(DELETED) 유저만 보여주는 탭.
export default async function DeletedProfilePage({
  searchParams: searchParamsPromise,
}: DeletedProfilePageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "user_id";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";
  const searchId = searchParams.searchId;
  const searchNickname = searchParams.searchNickname;
  const statusFilter = searchParams.status?.split(",") || [];

  const initialData = await getUsers({
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchId,
    searchNickname,
    statusFilter,
    withdrawnFilter: "only", // 탈퇴 유저(닉네임 "탈퇴_")만 조회
  });

  return <UserTableClient initialData={initialData} />;
}
