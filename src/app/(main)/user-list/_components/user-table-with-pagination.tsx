"use client";

import { CustomPagination } from "@/components/custom-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserTable from "./user-table";

// 서버에서 select 해온 필드만 반영
export interface UserWithProfile {
  user_id: bigint;
  phone: string | null;
  created_at: Date | null;
  profile?: {
    nickname?: string | null;
  } | null;
}

interface Props {
  users: UserWithProfile[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  roleName: string;
}

export default function UserTableWithPagination({
  users,
  totalCount,
  currentPage,
  perPage,
  roleName,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <UserTable users={users} roleName={roleName} />
      <CustomPagination
        num={totalCount}
        onChangePage={handlePageChange}
        currPage={currentPage}
        perPage={perPage}
      />
    </div>
  );
}
