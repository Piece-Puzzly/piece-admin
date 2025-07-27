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
