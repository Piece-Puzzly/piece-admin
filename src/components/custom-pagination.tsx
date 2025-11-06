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

export function CustomPagination({
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
