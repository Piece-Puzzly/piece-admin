import PaginationDisplay from "@/components/PaginationDisplay";

import { getProfiles } from "@/lib/server";

import { UserProfileValidationResponses } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const res = (await getProfiles(
    params.page ? parseInt(params.page) - 1 : 0
  )) as UserProfileValidationResponses;

  const data = res.data;
  if (data.content === undefined) {
    return JSON.stringify(res);
  } else {
    return (
      <div className="space-y-[44px] mb-[86px]">
        <DataTable columns={columns} data={data.content} key={Math.random()} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    );
  }
}
