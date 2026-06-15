"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { CustomPagination } from "@/components/custom-pagination";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ProfileHistoryRow } from "./profile-history-row";

const sortableKeys: SortableKey[] = [
  "user_id",
  "nickname",
  "birthdate",
  "created_at",
];

// 프로필 상태 필터 옵션. key는 백엔드 status 파라미터, label은 실제 반환 상태 표시와 일치.
// 백엔드 매핑: NORMAL→APPROVED(통과), NEEDS_REVIEW→REVISED(수정 제출), REJECTED→REJECTED(반려)
const profileStatusOptions = [
  { key: "NORMAL", label: "통과" },
  { key: "NEEDS_REVIEW", label: "수정 제출" },
  { key: "REJECTED", label: "반려" },
];

function isSortableKey(key: string | null): key is SortableKey {
  return sortableKeys.includes(key as SortableKey);
}
function isSortDirection(direction: string | null): direction is SortDirection {
  return direction === "asc" || direction === "desc";
}

// 심사 내역: 전체 프로필을 상태 필터 없이 조회(조회 전용). 정렬·페이지네이션 + 탈퇴 제외 토글만 제공한다.
export function ProfileHistoryClient({
  initialData,
}: {
  initialData: InitialData;
}) {
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
    router.push(`${pathname}?${createQueryString({ page })}`, {
      scroll: false,
    });
  };
  const handleSort = (key: SortableKey) => {
    const currentSortBy = searchParams.get("sortBy") || "created_at";
    const currentSortOrder = searchParams.get("sortOrder") || "desc";
    const newSortOrder =
      currentSortBy === key && currentSortOrder === "desc" ? "asc" : "desc";
    router.push(
      `${pathname}?${createQueryString({ sortBy: key, sortOrder: newSortOrder })}`,
      { scroll: false }
    );
  };

  // 프로필 상태 필터: 선택한 상태만 조회한다(비어 있으면 전체). URL ?status=A,B
  const statusFilter =
    searchParams.get("status")?.split(",").filter(Boolean) || [];
  const handleStatusToggle = (key: string) => {
    const newFilter = statusFilter.includes(key)
      ? statusFilter.filter((s) => s !== key)
      : [...statusFilter, key];
    // 모두 해제하면 status 파라미터를 제거해 전체를 조회한다.
    router.push(
      `${pathname}?${createQueryString({ status: newFilter.join(",") || null })}`,
      { scroll: false }
    );
  };

  // '탈퇴 제외' 토글: 체크하면 role=DELETED 유저를 제외한다(URL ?excludeWithdrawn=1).
  const excludeWithdrawn = searchParams.get("excludeWithdrawn") === "1";
  const handleWithdrawnToggle = () => {
    router.push(
      `${pathname}?${createQueryString({
        excludeWithdrawn: excludeWithdrawn ? null : "1",
      })}`,
      { scroll: false }
    );
  };

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder");
  const sortConfig = {
    key: isSortableKey(currentSortBy) ? currentSortBy : "created_at",
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center gap-4 text-nowrap">
          <h4 className="font-medium">프로필 상태:</h4>
          <div className="flex flex-wrap gap-4">
            {profileStatusOptions.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Label
                  htmlFor={`status-${key}`}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    id={`status-${key}`}
                    checked={statusFilter.includes(key)}
                    onCheckedChange={() => handleStatusToggle(key)}
                  />
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Label
          htmlFor="excludeWithdrawn"
          className="flex cursor-pointer items-center gap-2"
        >
          <Checkbox
            id="excludeWithdrawn"
            checked={excludeWithdrawn}
            onCheckedChange={handleWithdrawnToggle}
          />
          탈퇴 제외
        </Label>
      </div>

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
            <TableHead>승인일</TableHead>
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
            users.map((user) => (
              <ProfileHistoryRow key={user.user_id} user={user} />
            ))
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
