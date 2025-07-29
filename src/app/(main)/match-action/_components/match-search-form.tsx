"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserSearchDialogTrigger from "@/components/user-search-dialog/user-search-dialog-trigger";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

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
  const [, startTransition] = useTransition();

  const updateUrl = (
    user1Id: string,
    user2Id: string,
    pageSize: string,
    scroll = true
  ) => {
    const params = new URLSearchParams();
    if (user1Id) params.set("user1Id", user1Id);
    if (user2Id) params.set("user2Id", user2Id);
    params.set("page", "1");
    params.set("pageSize", pageSize);

    router.push(`/match-action?${params.toString()}`, { scroll });
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(value);
    updateUrl(user1Id, user2Id, value, false);
  };

  const handleUserSelect = (index: 1 | 2, userId: string) => {
    if (index === 1) setUser1Id(userId);
    else setUser2Id(userId);
    startTransition(() => {
      updateUrl(
        index === 1 ? userId : user1Id,
        index === 2 ? userId : user2Id,
        pageSize
      );
    });
  };

  const clearUser = (index: 1 | 2) => {
    if (index === 1) setUser1Id("");
    else setUser2Id("");
    startTransition(() => {
      updateUrl(
        index === 1 ? "" : user1Id,
        index === 2 ? "" : user2Id,
        pageSize
      );
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateUrl(user1Id, user2Id, pageSize);
      }}
      className="flex items-center gap-4 justify-between"
    >
      <div className="flex items-center gap-2">
        {/* User 1 */}
        <div className="relative">
          <UserSearchDialogTrigger
            onUserSelect={(user) => handleUserSelect(1, String(user.user_id))}
          >
            <Button
              variant="secondary"
              className="text-left py-[14px] px-4 h-auto w-[150px] justify-between"
            >
              {user1Id || (
                <div className="flex justify-between w-full items-center">
                  <span>계정 선택</span> <Search />
                </div>
              )}
            </Button>
          </UserSearchDialogTrigger>
          {user1Id && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                clearUser(1);
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* User 2 */}
        <div className="relative">
          <UserSearchDialogTrigger
            onUserSelect={(user) => handleUserSelect(2, String(user.user_id))}
          >
            <Button
              variant="secondary"
              className="text-left py-[14px] px-4 h-auto w-[150px] justify-between"
            >
              {user2Id || (
                <div className="flex justify-between w-full items-center">
                  <span>계정 선택</span> <Search />
                </div>
              )}
            </Button>
          </UserSearchDialogTrigger>
          {user2Id && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                clearUser(2);
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
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
