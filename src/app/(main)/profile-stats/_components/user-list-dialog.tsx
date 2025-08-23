"use client";

import { PaginationDisplay2 } from "@/components/pagination-display";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserInfoButton from "@/components/user-info/user-info-button";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { getUsersInStatCategory, UserIdentifier } from "../actions";

interface UserListDialogProps {
  category: string;
  value: string;
  title: string;
  trigger: React.ReactNode;
}

const PER_PAGE = 10; // 한 페이지에 보여줄 사용자 수

export function UserListDialog({
  category,
  value,
  title,
  trigger,
}: UserListDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserIdentifier[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 특정 페이지의 사용자 목록을 불러오는 함수
  const fetchUsers = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const { users: fetchedUsers, totalCount } =
          await getUsersInStatCategory({
            category,
            value,
            page,
            perPage: PER_PAGE,
          });

        setUsers(fetchedUsers);
        setTotalUsers(totalCount);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [category, value]
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // 다이얼로그가 열릴 때 첫 페이지 데이터를 불러옵니다.
    if (open && totalUsers === 0) {
      fetchUsers(1);
    }
  };

  // 페이지네이션 컴포넌트에서 페이지 변경 시 호출될 함수
  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[500px]">
          <div className="flex-grow min-h-0">
            <ScrollArea className="h-full w-full p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user, i) => (
                    <UserInfoButton
                      key={user.nickname + `${i}`}
                      userId={user.userId}
                      nickname={user.nickname}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    해당하는 사용자가 없습니다.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
          {/* 페이지네이션 컴포넌트 추가 */}
          <PaginationDisplay2
            num={totalUsers}
            onChangePage={handlePageChange}
            currPage={currentPage}
            perPage={PER_PAGE}
            className="mt-4 mb-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
