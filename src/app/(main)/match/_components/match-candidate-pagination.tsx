"use client";
import SimplePagination from "@/components/ui/simple-pagination";
import { useMatchCandidateStore } from "@/providers/match-candidate-provider";

export default function MatchCandidatePagination() {
  const page = useMatchCandidateStore((e) => e.page);
  const update = useMatchCandidateStore((e) => e.update);
  return <SimplePagination page={page} onPageChange={(e) => update(e)} />;
}
