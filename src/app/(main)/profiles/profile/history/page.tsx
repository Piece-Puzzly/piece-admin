import { ProfileHistoryClient } from "../_components/profile-history-client";
import { getProfileHistory } from "../actions";

interface ProfileHistoryPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    excludeWithdrawn?: string;
  }>;
}

// 심사 내역: 전체 프로필을 상태 필터 없이 조회(조회 전용). 탈퇴 제외 옵션 지원.
export default async function ProfileHistoryPage({
  searchParams: searchParamsPromise,
}: ProfileHistoryPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "created_at";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";
  const excludeWithdrawn = searchParams.excludeWithdrawn === "1";

  const initialData = await getProfileHistory({
    page,
    pageSize,
    sortBy,
    sortOrder,
    excludeWithdrawn,
  });

  return <ProfileHistoryClient initialData={initialData} />;
}
