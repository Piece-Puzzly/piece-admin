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
    status?: string;
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
  const statusFilter = searchParams.status?.split(",") || [];

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
