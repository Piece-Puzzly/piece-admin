import PaginationDisplay from "@/components/pagination-display";

import { getProfiles } from "@/lib/server";

import { columns } from "@/app/(main)/profiles/profile/_components/profile-columns";
import { DataTable } from "@/components/data-table";
import { ProfilesResponse } from "@/lib/types";
import { ProfileTableStoreProvider } from "@/providers/profile-table-provider";

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
          <DataTable columns={columns} data={data.content} />
        </ProfileTableStoreProvider>
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
