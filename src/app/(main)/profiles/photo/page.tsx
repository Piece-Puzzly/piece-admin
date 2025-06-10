import { columns } from "@/app/(main)/profiles/photo/_components/photo-columns";
import { DataTable } from "@/components/data-table";
import PaginationDisplay from "@/components/pagination-display";

import { getProfiles } from "@/lib/server";
import { ProfilesResponse } from "@/lib/types";
import { PhotoTableStoreProvider } from "@/providers/photo-table-provider";
import PhotoSearchBar from "./_components/photo-search-bar";

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
      <div>
        <PhotoTableStoreProvider data={data.content} key={Math.random()}>
          <PhotoSearchBar className="mb-[20px]" />
          <div className="space-y-[44px] mb-[86px]">
            <DataTable columns={columns} data={data.content} />
            <PaginationDisplay num={data.totalElements} />
          </div>
        </PhotoTableStoreProvider>
      </div>
    );
  }
}
