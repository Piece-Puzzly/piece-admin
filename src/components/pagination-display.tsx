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
}: {
  num: number;
  onChangePage: (page: number) => void;
  className?: string;
}) {
  const [currPage, setCurrPage] = useState<number>(1);

  return (
    <Pagination className={cn("mb-8 mt-[44px]", className)}>
      <PaginationContent className="gap-[6px]">
        <PaginationItem>
          <PaginationFirst
            onClick={() => {
              setCurrPage(1);
              onChangePage(1);
            }}
            isActive={currPage !== 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              setCurrPage(currPage === 1 ? 1 : currPage - 1);
              onChangePage(currPage === 1 ? 1 : currPage - 1);
            }}
            isActive={currPage !== 1}
          />
        </PaginationItem>
        <div className="gap-[4px] flex">
          {getPagesNumber(currPage, num, 10).map((e) => (
            <PaginationItem key={e}>
              <PaginationLink
                isNumber
                isActive={e === currPage}
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
              setCurrPage(
                Math.ceil(num / 10) === currPage ? currPage : currPage + 1
              );
              onChangePage(
                Math.ceil(num / 10) === currPage ? currPage : currPage + 1
              );
            }}
            isActive={currPage !== Math.ceil(num / 10)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => {
              setCurrPage(Math.ceil(num / 10));
              onChangePage(Math.ceil(num / 10));
            }}
            isActive={currPage !== Math.ceil(num / 10)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
