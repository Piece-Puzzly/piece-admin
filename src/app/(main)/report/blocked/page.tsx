import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  console.log(params);
  // const { data } = (await getBlockDatas(
  //   parseInt(params.page) - 1 || 0
  // )) as BlockedValidationResponses;

  return (
    <div className="space-y-[44px] mb-[86px]">
      <DataTable
        columns={columns}
        data={[
          {
            BlockedDate: "2025-04-19",
            BlockedUserName: null,
            BlockedUserNickname: "힘",
            blockedUserBirthdate: "2004-12-13",
            blockedUserId: 136,
            blockingUserId: 132,
            blockingUserName: null,
            blockingUserNickname: "INTJ",
          },
          {
            BlockedDate: "2025-04-18",
            BlockedUserName: null,
            BlockedUserNickname: "ㄷㄷㄷㄷㄷ",
            blockedUserBirthdate: "1990-12-03",
            blockedUserId: 139,
            blockingUserId: 132,
            blockingUserName: null,
            blockingUserNickname: "INTJ",
          },
          {
            BlockedDate: "2025-04-16",
            BlockedUserName: null,
            BlockedUserNickname: "hee",
            blockedUserBirthdate: "1997-12-08",
            blockedUserId: 122,
            blockingUserId: 132,
            blockingUserName: null,
            blockingUserNickname: "INTJ",
          },
        ]}
      />
      {/* <PaginationDisplay num={data.totalElements} /> */}
    </div>
  );
}
