"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPagedUsers } from "@/lib/actions/user";
import { User } from "@/lib/types";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function MatchSearchForm({
  defaultUser1Id = "",
  defaultUser2Id = "",
  defaultPageSize = "10",
  basePath = "/match-action",
}: {
  defaultUser1Id?: string;
  defaultUser2Id?: string;
  defaultPageSize?: string;
  basePath?: string;
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

    router.push(`${basePath}?${params.toString()}`, { scroll });
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
          <UserSearchPopover
            onUserSelect={(user) => handleUserSelect(1, String(user.user_id))}
          >
            <Button
              variant="secondary"
              className="text-left py-3 px-4 h-auto w-[150px] justify-between"
            >
              {user1Id || (
                <div className="flex justify-between w-full items-center">
                  <span>계정 선택</span> <Search />
                </div>
              )}
            </Button>
          </UserSearchPopover>
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
          <UserSearchPopover
            onUserSelect={(user) => handleUserSelect(2, String(user.user_id))}
          >
            <Button
              variant="secondary"
              className="text-left py-3 px-4 h-auto w-[150px] justify-between"
            >
              {user2Id || (
                <div className="flex justify-between w-full items-center">
                  <span>계정 선택</span> <Search />
                </div>
              )}
            </Button>
          </UserSearchPopover>
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

function UserSearchPopover({
  onUserSelect,
  children,
}: {
  onUserSelect?: (user: User) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [userIdQuery, setUserIdQuery] = useState("");
  const [nicknameQuery, setNicknameQuery] = useState("");

  const [debouncedUserId] = useDebounce(userIdQuery, 300);
  const [debouncedNickname] = useDebounce(nicknameQuery, 300);

  useEffect(() => {
    if (!open) return;

    const loadUsers = async () => {
      const { users, totalPages } = await fetchPagedUsers({
        page,
        userId: debouncedUserId,
        nickname: debouncedNickname,
      });
      setUsers(users);
      setTotalPages(totalPages);
    };

    loadUsers();
  }, [page, open, debouncedUserId, debouncedNickname]);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setUserIdQuery(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setNicknameQuery(e.target.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex gap-2">
            <Input
              placeholder="ID"
              value={userIdQuery}
              onChange={handleUserIdChange}
              className="h-8"
            />
            <Input
              placeholder="닉네임"
              value={nicknameQuery}
              onChange={handleNicknameChange}
              className="h-8"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto divide-y">
          {users.map((user) => (
            <button
              key={user.user_id}
              onClick={() => {
                onUserSelect?.(user);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 py-2 px-3 hover:bg-muted text-left"
            >
              <Avatar className="w-7 h-7 rounded-md">
                <AvatarImage src={user.profile?.image_url ?? ""} />
                <AvatarFallback className="text-xs">
                  {user.profile?.nickname?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {user.profile?.nickname || (
                    <span className="text-muted-foreground italic">
                      닉네임 없음
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {user.user_id}
                </div>
              </div>
            </button>
          ))}

          {users.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              일치하는 유저가 없습니다.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <div className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
