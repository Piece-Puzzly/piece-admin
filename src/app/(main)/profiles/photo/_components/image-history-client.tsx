"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useCallback, useState } from "react";

// Shadcn UI 및 커스텀 컴포넌트 import
import { CustomPagination } from "@/components/custom-pagination"; // ⭐️ CustomPagination import
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
import { imageStatusOptions } from "@/lib/constants";
import { ImageTableRow } from "./image-table-row";

// 타입 정의 (이전과 동일)

export function ImageHistoryClient({
  initialData,
}: {
  initialData: InitialData;
}) {
  const { images, totalCount, error } = initialData;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchId, setSearchId] = useState(searchParams.get("searchId") || "");
  const [searchNickname, setSearchNickname] = useState(
    searchParams.get("searchNickname") || ""
  );

  // 핸들러 함수들 (이전과 동일)
  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value === null || value === "") {
          params.delete(name);
        } else {
          params.set(name, String(value));
        }
      });
      if (!("page" in paramsToUpdate)) {
        params.set("page", "1");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    const newQueryString = createQueryString({
      searchId: searchId,
      searchNickname: searchNickname,
    });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFilterChange = (value: string) => {
    const currentFilter = searchParams.get("status")?.split(",") || [];
    const newFilter = currentFilter.includes(value)
      ? currentFilter.filter((item) => item !== value)
      : [...currentFilter, value];
    const newQueryString = createQueryString({
      status: newFilter.join(",") || null,
    });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const newQueryString = createQueryString({ page });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  const statusFilter = searchParams.get("status")?.split(",") || [];
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentPageSize = Number(searchParams.get("pageSize")) || 10;

  return (
    <div className="w-full space-y-6">
      {/* 컨트롤 패널 (이전과 동일) */}
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
      <div className="flex items-center gap-4">
        <h4 className="font-medium">이미지 상태:</h4>
        <div className="flex flex-wrap gap-4">
          {imageStatusOptions.map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <Label htmlFor={key} className="cursor-pointer">
                <Checkbox
                  id={key}
                  checked={statusFilter.includes(key)}
                  onCheckedChange={() => handleFilterChange(key)}
                />

                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 테이블 (이전과 동일) */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이미지</TableHead>
            <TableHead>유저</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>심사</TableHead>
            <TableHead>제출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={7}>{error}</TableCell>
            </TableRow>
          ) : images.length > 0 ? (
            images.map((image) => (
              <ImageTableRow key={image.profile_image_id} image={image} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                결과가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ⭐️ 페이지네이션 UI 교체 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{totalCount}개</div>
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
