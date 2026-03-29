import { getBlockDatas } from "@/lib/server";
import { BlockedUsersResponses } from "@/lib/types";
import { BlockTableStoreProvider } from "@/providers/block-table-provider";
import BlockDataTable from "./_components/block-data-table";
import BlockPagination from "./_components/block-pagination";

export default async function Page() {
  const res = (await getBlockDatas(0)) as BlockedUsersResponses;
  console.log("res: " , res);
  if (res.content == undefined) {
    return JSON.stringify(res);
  } else {
    return (
      <div className="space-y-[44px] mb-[86px]">
        <BlockTableStoreProvider
          data={res.content}
          totalNum={res.totalElements}
        >
          <BlockDataTable />
          <BlockPagination />
        </BlockTableStoreProvider>
      </div>
    );
  }
}
