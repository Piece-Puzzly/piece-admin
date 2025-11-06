"use client";

import PaginationDisplay from "@/components/pagination-display";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  total: number;
  currentPage: number;
  perPage?: number;
}

interface Props {
  total: number;
  currentPage: number;
  perPage?: number;
}

export default function MatchPagination({
  total,
  currentPage,
  perPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/match-action?${params.toString()}`, { scroll: false });
  };

  return (
    <PaginationDisplay
      currPage={currentPage}
      num={total}
      perPage={perPage}
      onChangePage={(e) => handlePageChange(e)}
    />
  );
}
