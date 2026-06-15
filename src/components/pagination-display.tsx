"use client";

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { cn, getPagesNumber } from "@/lib/utils";
import { useState } from "react";

export default function PaginationDisplay({
  num,
  onChangePage,
  className,
  currPage = 1,
  perPage = 10, // ✅ 기본값 10
}: {
  num: number;
  onChangePage: (page: number) => void;
  className?: string;
  currPage?: number;
  perPage?: number; // ✅ perPage prop 추가
}) {
  const [currPage_, setCurrPage] = useState<number>(currPage);
  const totalPages = Math.ceil(num / perPage); // ✅ perPage 반영

  return (
    <Pagination className={cn("mb-8 mt-[44px]", className)}>
      <PaginationContent className="gap-[6px]">
        <PaginationItem>
          <PaginationFirst
            onClick={() => {
              setCurrPage(1);
              onChangePage(1);
            }}
            isActive={currPage_ !== 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              const prev = currPage_ === 1 ? 1 : currPage_ - 1;
              setCurrPage(prev);
              onChangePage(prev);
            }}
            isActive={currPage_ !== 1}
          />
        </PaginationItem>

        <div className="gap-[4px] flex">
          {getPagesNumber(currPage_, num, perPage).map((e) => (
            <PaginationItem key={e}>
              <PaginationLink
                isNumber
                isActive={e === currPage_}
                onClick={() => {
                  setCurrPage(e);
                  onChangePage(e);
                }}
              >
                {e}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              const next = currPage_ === totalPages ? currPage_ : currPage_ + 1;
              setCurrPage(next);
              onChangePage(next);
            }}
            isActive={currPage_ !== totalPages}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => {
              setCurrPage(totalPages);
              onChangePage(totalPages);
            }}
            isActive={currPage_ !== totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// 내부 state(useState)를 제거하고 모든 것을 props로 받습니다.
export function PaginationDisplay2({
  num,
  onChangePage,
  className,
  currPage = 1,
  perPage = 10,
}: {
  num: number;
  onChangePage: (page: number) => void;
  className?: string;
  currPage?: number;
  perPage?: number;
}) {
  const totalPages = Math.ceil(num / perPage);

  // totalPages가 1 이하면 페이지네이션을 표시하지 않음
  if (totalPages <= 1) return null;

  return (
    <Pagination className={cn("mb-8 mt-[44px]", className)}>
      <PaginationContent className="gap-[6px]">
        <PaginationItem>
          <PaginationFirst
            onClick={() => onChangePage(1)}
            isActive={currPage !== 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              const prev = currPage === 1 ? 1 : currPage - 1;
              onChangePage(prev);
            }}
            isActive={currPage !== 1}
          />
        </PaginationItem>

        <div className="gap-[4px] flex">
          {getPagesNumber(currPage, num, perPage).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isNumber
                isActive={pageNumber === currPage}
                onClick={() => onChangePage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              const next = currPage === totalPages ? currPage : currPage + 1;
              onChangePage(next);
            }}
            isActive={currPage !== totalPages}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => onChangePage(totalPages)}
            isActive={currPage !== totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
