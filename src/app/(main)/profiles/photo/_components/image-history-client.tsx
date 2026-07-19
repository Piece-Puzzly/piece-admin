"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";

import { CustomPagination } from "@/components/custom-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProfileImageData } from "../actions";
import { UserImageGroupRow } from "./user-image-group-row";

interface InitialData {
  images: ProfileImageData[];
  totalCount: number;
  totalPages: number;
  error?: string;
}

// 이미지를 userId로 그루핑
function groupImagesByUser(images: ProfileImageData[]) {
  const groups = new Map<string, {
    userId: bigint;
    nickname: string | null;
    images: ProfileImageData[];
  }>();

  for (const image of images) {
    const userId = image.profile?.user_table?.user_id;
    if (!userId) continue;

    const key = String(userId);
    if (!groups.has(key)) {
      groups.set(key, {
        userId,
        nickname: image.profile?.nickname ?? null,
        images: [],
      });
    }
    groups.get(key)!.images.push(image);
  }

  return Array.from(groups.values());
}

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

  // 이미지를 userId로 그루핑
  const userGroups = useMemo(() => groupImagesByUser(images), [images]);

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

  const handlePageChange = (page: number) => {
    const newQueryString = createQueryString({ page });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentPageSize = Number(searchParams.get("pageSize")) || 10;

  return (
    <div className="w-full space-y-6">
      {/* 검색 패널 */}
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

      {/* 데이터 테이블 (userId 그루핑) */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>유저</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>이미지 심사</TableHead>
            <TableHead>제출</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : userGroups.length > 0 ? (
            userGroups.map((group) => (
              <UserImageGroupRow
                key={String(group.userId)}
                userId={group.userId}
                nickname={group.nickname}
                images={group.images}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                결과가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {userGroups.length}명 / 이미지 {totalCount}개
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
