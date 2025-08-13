"use client";

import { PaginationDisplay2 } from "@/components/pagination-display";
import { profile, user_table } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserTable from "./user-table";

type UserWithProfile = user_table & {
  profile?: profile | null;
};

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
      <PaginationDisplay2
        num={totalCount}
        onChangePage={handlePageChange}
        currPage={currentPage}
        perPage={perPage}
      />
    </div>
  );
}
