"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MatchSearchForm({
  defaultUser1Id = "",
  defaultUser2Id = "",
  defaultPageSize = "10",
}: {
  defaultUser1Id?: string;
  defaultUser2Id?: string;
  defaultPageSize?: string;
}) {
  const router = useRouter();
  const [user1Id, setUser1Id] = useState(defaultUser1Id);
  const [user2Id, setUser2Id] = useState(defaultUser2Id);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (user1Id) params.set("user1Id", user1Id);
    if (user2Id) params.set("user2Id", user2Id);
    params.set("page", "1");
    params.set("pageSize", pageSize);

    router.push(`/match-action?${params.toString()}`);
  };
  const handlePageSizeChange = (value: string) => {
    setPageSize(value);
    const params = new URLSearchParams();
    if (user1Id) params.set("user1Id", user1Id);
    if (user2Id) params.set("user2Id", user2Id);
    params.set("page", "1");
    params.set("pageSize", value);

    router.push(`/match-action?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-4 justify-between"
    >
      <div className="flex items-center gap-2">
        <Input
          placeholder="아이디"
          value={user1Id}
          onChange={(e) => setUser1Id(e.target.value)}
          className="w-[150px]"
        />
        <Input
          placeholder="상대방 아이디"
          value={user2Id}
          onChange={(e) => setUser2Id(e.target.value)}
          className="w-[150px]"
        />

        <Button
          type="submit"
          variant="default"
          className="py-[14px] px-[32px] h-auto"
        >
          검색
        </Button>
      </div>
      <div>
        <Select value={pageSize} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="개수 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5개씩 보기</SelectItem>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
