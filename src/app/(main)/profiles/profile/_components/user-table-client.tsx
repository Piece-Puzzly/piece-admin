// /app/admin/users/user-table-client.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
// ⭐️ useEffect와 useCallback은 이제 검색 로직에 필요 없어 제거해도 됩니다.
import { KeyboardEvent, useCallback, useState } from "react";

// ... (Shadcn UI 컴포넌트 import 및 타입 정의는 이전과 동일)
import { CustomPagination } from "@/components/custom-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { InitialData, SortableKey } from "../types";
import { UserTableRow } from "./user-table-row";

const sortableKeys: SortableKey[] = [
  "user_id",
  "nickname",
  "birthdate",
  "created_at",
];

function isSortableKey(key: string | null): key is SortableKey {
  return sortableKeys.includes(key as SortableKey);
}
function isSortDirection(direction: string | null): direction is SortDirection {
  return direction === "asc" || direction === "desc";
}

export function UserTableClient({ initialData }: { initialData: InitialData }) {
  const { users, totalCount, error } = initialData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ⭐️ 디바운스 관련 훅과 state 제거
  const [searchId, setSearchId] = useState(searchParams.get("searchId") || "");
  const [searchNickname, setSearchNickname] = useState(
    searchParams.get("searchNickname") || ""
  );

  // createQueryString은 그대로 사용합니다.
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      let shouldResetPage = false;
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (name !== "page") {
          shouldResetPage = true;
        }
        if (
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(name);
        } else {
          params.set(name, String(value));
        }
      });
      if (shouldResetPage) {
        params.set("page", "1");
      }
      return params.toString();
    },
    [searchParams]
  );

  // ⭐️ useEffect를 사용한 자동 검색 로직 전체 제거

  // ⭐️ 1. 명시적인 검색 실행 함수 추가
  const handleSearch = () => {
    const newQueryString = createQueryString({
      searchId: searchId,
      searchNickname: searchNickname,
    });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  // ⭐️ 2. Enter 키 입력을 감지하는 핸들러 추가
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // --- 나머지 핸들러 및 상태 정의는 이전과 동일 ---
  const handlePageChange = (page: number) => {
    const newQueryString = createQueryString({ page });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };
  const handleSort = (key: SortableKey) => {
    const currentSortBy = searchParams.get("sortBy") || "user_id";
    const currentSortOrder = searchParams.get("sortOrder") || "desc";
    const newSortOrder =
      currentSortBy === key && currentSortOrder === "desc" ? "asc" : "desc";
    const newQueryString = createQueryString({
      sortBy: key,
      sortOrder: newSortOrder,
    });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };
  const handleFilterChange = (
    filterName: "status" | "reject",
    value: string
  ) => {
    const currentFilter = searchParams.get(filterName)?.split(",") || [];
    const newFilter = currentFilter.includes(value)
      ? currentFilter.filter((item) => item !== value)
      : [...currentFilter, value];
    const newQueryString = createQueryString({
      [filterName]: newFilter.join(",") || null,
    });
    router.push(`${pathname}?${newQueryString}`);
  };
  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder");
  const sortConfig = {
    key: isSortableKey(currentSortBy) ? currentSortBy : "user_id",
    direction: isSortDirection(currentSortOrder) ? currentSortOrder : "desc",
  };
  const profileStatusOptions = [
    { key: "NEEDS_REVIEW", label: "심사 필요" },
    { key: "NORMAL", label: "정상" },
    { key: "REJECTED", label: "반려" },
    { key: "NA", label: "미작성" },
  ];
  const statusFilter = searchParams.get("status")?.split(",") || [];

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentPageSize = Number(searchParams.get("pageSize")) || 10;

  const SortIndicator = ({ columnKey }: { columnKey: SortableKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* ⭐️ 3. 컨트롤 패널에 검색 버튼 추가 및 Input에 onKeyDown 연결 */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="User ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="닉네임"
            value={searchNickname}
            onChange={(e) => setSearchNickname(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 text-nowrap">
          <h4 className="font-medium">프로필 상태:</h4>
          <div className="flex flex-wrap gap-4">
            {profileStatusOptions.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Label htmlFor={key} className="cursor-pointer">
                  <Checkbox
                    id={key}
                    checked={statusFilter.includes(key)}
                    onCheckedChange={() => handleFilterChange("status", key)}
                  />

                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ... 데이터 테이블 및 페이지네이션 JSX는 이전과 동일 ... */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("user_id")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center">
                User ID
                <SortIndicator columnKey="user_id" />
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("nickname")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center">
                닉네임
                <SortIndicator columnKey="nickname" />
              </div>
            </TableHead>
            <TableHead
              onClick={() => handleSort("birthdate")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center">
                생년월일
                <SortIndicator columnKey="birthdate" />
              </div>
            </TableHead>
            <TableHead>전화번호</TableHead>
            <TableHead
              onClick={() => handleSort("created_at")}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-center">
                가입일
                <SortIndicator columnKey="created_at" />
              </div>
            </TableHead>
            <TableHead>프로필 상태</TableHead>
            <TableHead>부적격</TableHead>
            <TableHead>제출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => <UserTableRow key={user.user_id} user={user} />)
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                결과가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground text-nowrap">
          {totalCount}명
        </div>
        <CustomPagination
          num={totalCount}
          onChangePage={handlePageChange}
          currPage={currentPage}
          perPage={currentPageSize}
        />
      </div>
    </div>
  );
}
