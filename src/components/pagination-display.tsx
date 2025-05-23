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
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function PaginationDisplay({
  num,
  queryKey = "page",
  className,
}: {
  num: number;
  queryKey?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const currPage =
    searchParams.get(queryKey) === null
      ? 1
      : parseInt(searchParams.get(queryKey) as string);

  return (
    <Pagination className={cn("mb-8 mt-[44px]", className)}>
      <PaginationContent className="gap-[6px]">
        <PaginationItem>
          <PaginationFirst
            href={pathname + "?" + createQueryString(queryKey, `1`)}
            isActive={currPage !== 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href={
              pathname +
              "?" +
              createQueryString(
                queryKey,
                `${currPage === 1 ? 1 : currPage - 1}`
              )
            }
            isActive={currPage !== 1}
          />
        </PaginationItem>
        <div className="gap-[4px] flex">
          {getPagesNumber(currPage, num, 10).map((e) => (
            <PaginationItem key={e}>
              <PaginationLink
                isNumber
                isActive={e === currPage}
                href={pathname + "?" + createQueryString(queryKey, `${e}`)}
              >
                {e}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>
        <PaginationItem>
          <PaginationNext
            href={
              pathname +
              "?" +
              createQueryString(
                queryKey,
                `${Math.ceil(num / 10) === currPage ? currPage : currPage + 1}`
              )
            }
            isActive={currPage !== Math.ceil(num / 10)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href={
              pathname +
              "?" +
              createQueryString(queryKey, `${Math.ceil(num / 10)}`)
            }
            isActive={currPage !== Math.ceil(num / 10)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
