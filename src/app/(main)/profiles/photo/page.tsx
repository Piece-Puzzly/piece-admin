import { columns } from "@/app/(main)/profiles/photo/_components/photo-columns";
import { DataTable } from "@/components/data-table";
import PaginationDisplay from "@/components/pagination-display";
import ProfileSearchBar from "@/components/profile-search-bar";

import { getProfiles } from "@/lib/server";
import { ProfilesResponse } from "@/lib/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const res = (await getProfiles(
    params.page ? parseInt(params.page) - 1 : 0
  )) as ProfilesResponse;

  const data = res.data;
  if (data.content === undefined) {
    return JSON.stringify(res);
  } else {
    return (
      <div className="space-y-[44px] mb-[86px]">
        <ProfileSearchBar />
        <DataTable columns={columns} data={data.content} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
