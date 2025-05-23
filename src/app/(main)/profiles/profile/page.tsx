import PaginationDisplay from "@/components/pagination-display";

import { getProfiles } from "@/lib/server";

import { columns } from "@/components/tables/profile/columns";
import { ProfileDataTable } from "@/components/tables/profile/profile-data-table";
import { ProfileTableStoreProvider } from "@/components/tables/profile/profile-table-provider";
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
        <ProfileTableStoreProvider data={data.content} key={Math.random()}>
          <ProfileDataTable columns={columns} data={data.content} />
        </ProfileTableStoreProvider>
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
