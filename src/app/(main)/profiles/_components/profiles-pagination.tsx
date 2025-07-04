"use client";

import PaginationDisplay from "@/components/pagination-display";
import { useProfileTableStore } from "@/providers/profile-table-provider";

export default function ProfilesPagination() {
  const total = useProfileTableStore((e) => e.totalNum);
  const update = useProfileTableStore((e) => e.update);

  return (
    <PaginationDisplay
      num={total}
      onChangePage={(e) => update({ type: "all", page: e })}
    />
  );
}
