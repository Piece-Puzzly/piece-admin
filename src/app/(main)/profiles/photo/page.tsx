import { ImageHistoryClient } from "./_components/image-history-client";
import { getProfileImages } from "./actions";

interface ProfileImagesPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    searchId?: string;
    searchNickname?: string;
  }>;
}

export default async function ProfileImagesPage({
  searchParams: searchParamsPromise,
}: ProfileImagesPageProps) {
  const searchParams = await searchParamsPromise;
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy || "created_at";
  const sortOrder = searchParams.sortOrder === "asc" ? "asc" : "desc";
  const searchId = searchParams.searchId;
  const searchNickname = searchParams.searchNickname;
  // 사진 심사는 PENDING(심사 필요) 전용 큐다. 상태는 항상 PENDING으로 고정해 조회한다.
  const statusFilter = ["PENDING"];

  const initialData = await getProfileImages({
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchId,
    searchNickname,
    statusFilter,
  });

  return <ImageHistoryClient initialData={initialData} />;
}
