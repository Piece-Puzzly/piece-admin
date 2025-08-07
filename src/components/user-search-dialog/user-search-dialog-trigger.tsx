"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchPagedUsers } from "@/lib/actions/user";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; // 추가

export default function UserSearchDialogTrigger({
  onUserSelect,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogTrigger> & {
  onUserSelect?: (user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [userIdQuery, setUserIdQuery] = useState("");
  const [nicknameQuery, setNicknameQuery] = useState("");

  // 디바운스된 값
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild {...props} />
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>유저 선택</DialogTitle>
          <DialogDescription>
            ID 또는 닉네임으로 유저를 검색하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-2">
          <Input
            placeholder="ID"
            value={userIdQuery}
            onChange={handleUserIdChange}
          />
          <Input
            placeholder="닉네임"
            value={nicknameQuery}
            onChange={handleNicknameChange}
          />
        </div>

        <div className="max-h-80 overflow-y-auto divide-y mt-4">
          {users.map((user) => (
            <button
              key={user.user_id}
              onClick={() => {
                onUserSelect?.(user);
                setOpen(false);
              }}
              className="w-full flex items-center gap-4 py-3 hover:bg-muted px-2 text-left"
            >
              <Avatar className="w-8 h-8 rounded-md">
                <AvatarImage src={user.profile?.image_url ?? ""} />
                <AvatarFallback>
                  {user.profile?.nickname?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">
                  {user.profile?.nickname || (
                    <div className="text-muted-foreground italic">
                      닉네임 없음
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {user.user_id}
                </div>
              </div>
            </button>
          ))}

          {users.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-6">
              일치하는 유저가 없습니다.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <div className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
