"use client";

import { CustomPagination } from "@/components/custom-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useState } from "react";
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

type SearchType = "nickname" | "id";

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

  // 검색 타입(닉네임/ID)과 검색어는 URL을 초기값으로 사용한다.
  const [searchType, setSearchType] = useState<SearchType>(
    searchParams.get("searchType") === "id" ? "id" : "nickname"
  );
  const [searchValue, setSearchValue] = useState(
    searchParams.get("searchValue") || ""
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // 검색 시 첫 페이지로
    const trimmed = searchValue.trim();
    if (trimmed) {
      params.set("searchType", searchType);
      params.set("searchValue", trimmed);
    } else {
      params.delete("searchType");
      params.delete("searchValue");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* 검색 기준 토글: 닉네임 / ID */}
        <div className="flex items-center gap-1">
          <Toggle
            variant="outline"
            size="sm"
            pressed={searchType === "nickname"}
            onPressedChange={() => setSearchType("nickname")}
          >
            닉네임
          </Toggle>
          <Toggle
            variant="outline"
            size="sm"
            pressed={searchType === "id"}
            onPressedChange={() => setSearchType("id")}
          >
            ID
          </Toggle>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            inputMode={searchType === "id" ? "numeric" : "text"}
            placeholder={searchType === "id" ? "User ID" : "닉네임"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>

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
