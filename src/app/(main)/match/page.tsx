import { DataTable } from "@/components/data-table";
import { columns } from "./_components/matching-columns";
import MatchingForm from "./_components/matching-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  console.log(params);

  const data = {
    content: [
      {
        idA: 108,
        nicknameA: "닉네임 1",
        idB: 100,
        nicknameB: "닉네임 2",
        date: "2025.04.23",
        time: 22,
        isMatched: true,
      },

      {
        idA: 63,
        nicknameA: "닉네임 3",
        idB: 56,
        nicknameB: "닉네임 4",
        date: "2025.04.23",
        time: 22,
        isMatched: false,
      },
    ],
    totalElements: 0,
  };

  return (
    <div className="flex justify-center mt-[40px]">
      <div className="space-y-[40px] mb-[86px] max-w-[1100px] w-full">
        <MatchingForm
          data={[
            { id: 1, nickname: "닉네임1", disabled: false },
            { id: 2, nickname: "닉네임2", disabled: true },
          ]}
        />
        <DataTable columns={columns} data={data.content} />
        {/* <PaginationDisplay num={data.totalElements} /> */}
      </div>
    </div>
  );
}
