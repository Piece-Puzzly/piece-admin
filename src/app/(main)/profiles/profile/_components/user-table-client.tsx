// /app/admin/users/user-table-client.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { CustomPagination } from "@/components/custom-pagination";
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

// 프로필 심사는 심사 대기(role=PENDING) 프로필 전용 큐다(/profiles/pending).
// 해당 API는 검색(userId/nickname)·상태 필터를 지원하지 않으므로 정렬·페이지네이션만 제공한다.
export function UserTableClient({ initialData }: { initialData: InitialData }) {
  const { users, totalCount, error } = initialData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      let shouldResetPage = false;
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (name !== "page") {
          shouldResetPage = true;
        }
        if (value === null || value === "") {
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

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder");
  const sortConfig = {
    key: isSortableKey(currentSortBy) ? currentSortBy : "user_id",
    direction: isSortDirection(currentSortOrder) ? currentSortOrder : "desc",
  };

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
            <TableHead>유저 상태</TableHead>
            <TableHead>프로필 상태</TableHead>
            <TableHead>부적격</TableHead>
            <TableHead>제출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => <UserTableRow key={user.user_id} user={user} />)
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
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
