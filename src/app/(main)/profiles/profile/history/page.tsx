import { ProfileHistoryClient } from "../_components/profile-history-client";
import { getProfileHistory } from "../actions";

interface ProfileHistoryPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    excludeWithdrawn?: string;
  }>;
}

// 심사 내역: 전체 프로필을 조회(조회 전용). 프로필 상태 필터 + 탈퇴 제외 옵션 지원.
export default async function ProfileHistoryPage({
  searchParams: searchParamsPromise,
}: ProfileHistoryPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "created_at";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";
  const statusFilter = searchParams.status?.split(",").filter(Boolean) || [];
  const excludeWithdrawn = searchParams.excludeWithdrawn === "1";

  const initialData = await getProfileHistory({
    page,
    pageSize,
    sortBy,
    sortOrder,
    statusFilter,
    excludeWithdrawn,
  });

  return <ProfileHistoryClient initialData={initialData} />;
}
