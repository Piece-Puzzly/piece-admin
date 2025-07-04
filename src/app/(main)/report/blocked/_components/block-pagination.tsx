"use client";

import PaginationDisplay from "@/components/pagination-display";
import { useBlockTableStore } from "@/providers/block-table-provider";

export default function BlockPagination() {
  const total = useBlockTableStore((e) => e.totalNum);
  const update = useBlockTableStore((e) => e.update);

  return <PaginationDisplay num={total} onChangePage={(e) => update(e)} />;
}
