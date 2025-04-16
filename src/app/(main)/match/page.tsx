import PaginationDisplay from "@/components/PaginationDisplay";

import MatchingForm from "./_components/MatchingForm";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  console.log(params);
  const data = { content: [], totalElements: 0 };

  return (
    <div className="flex justify-center mt-[60px]">
      <div className="space-y-[40px] mb-[86px] max-w-[934px] w-full">
        <MatchingForm
          data={[
            { profile: "[1] test", disabled: false },
            { profile: "[2] test", disabled: true },
          ]}
        />
        <DataTable columns={columns} data={data.content} key={Math.random()} />
        <PaginationDisplay num={data.totalElements} />
      </div>
    </div>
  );
}
