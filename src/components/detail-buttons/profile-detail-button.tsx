"use client";

import { useDebug } from "@/app/hooks/use-debug";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserById } from "@/lib/server";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { roleNameMap } from "@/lib/constants";
import { ProfileDetail } from "@/lib/types";
import { cn, getImageSrc } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import QuestionCard from "../../app/(main)/profiles/profile/_components/question-card";
import UserInfoTrigger from "../user-info/user-info-trigger";

export default function ProfileDetailButton({
  userId,
  nickname,
  userRole,
  showId = false,
  className,
  ...props
}: {
  showId?: boolean;
  userId: number | null;
  nickname: string;
  userRole?: string | null;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const [content, setContent] = useState<ProfileDetail | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const debug = useDebug((e) => e.debug);

  const handleOpenChange = async (next: boolean) => {
    // 닫기
    if (!next) {
      setOpen(false);
      return;
    }
    // 열기 시도: 프로필이 존재할 때만 다이얼로그를 연다
    const res = await getUserById(userId as number);
    if (!res) {
      toast.error("존재하지 않는 프로필입니다.");
      return;
    }
    setContent(res);
    setPage(1);
    setOpen(true);
  };

  const questionComps = [
    content && (
      <PaginationButton
        key="0"
        isActive={page !== 1}
        onClick={() => {
          setPage(Math.max(page - 1, 1));
        }}
      >
        <ChevronLeft />
      </PaginationButton>
    ),
    content && <QuestionCard key="1" data={content.responses?.[page - 1]} />,
    content && (
      <PaginationButton
        key="2"
        isActive={page !== (content.responses?.length ?? 0)}
        onClick={() => {
          setPage(Math.min(page + 1, content.responses?.length ?? 1));
        }}
      >
        <ChevronRight />
      </PaginationButton>
    ),
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!debug && userId == null}
          className={cn("w-full flex justify-between  ", className)}
          {...props}
        >
          <div className="flex items-center gap-1">
            {showId && <div className="text-muted-foreground">[{userId}]</div>}
            <div>{nickname}</div>
          </div>
          <ChevronRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[860px] max-h-full overflow-y-auto md:max-w-[860px] md:px-[60px] md:pt-[80px] md:pb-[40px]">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {content ? (
          <div className="flex items-center justify-between flex-col md:flex-row gap-[20px] md:gap-0">
            <div className="flex flex-col-reverse md:flex-col gap-[20px] items-center ">
              <Image
                className="rounded-lg"
                src={getImageSrc(content.imageUrl)}
                height={220}
                width={220}
                alt="Profile"
              />
              <div className="flex flex-col gap-[8px] items-center">
                <div className="text-[14px] font-medium text-gray-black">
                  {content.description}
                </div>
                <div className="font-semibold text-[20px]">
                  {content.nickname}
                </div>
                {userRole && (
                  <div className="text-[14px] text-muted-foreground">
                    {roleNameMap[userRole] ?? userRole}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-[20px] w-full max-w-full justify-center">
              {isDesktop ? (
                questionComps
              ) : (
                <div className="space-y-4 w-full">
                  {questionComps[1]}
                  <div className="flex gap-2 justify-end">
                    {questionComps[0]} {questionComps[2]}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>loading</div>
        )}
        <DialogFooter>
          <UserInfoTrigger asChild userId={userId} nickname={nickname}>
            <Button variant={"outline"}>자세히 보기</Button>
          </UserInfoTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type PaginationButtonProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>;

function PaginationButton({
  className,
  isActive,
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <Button
      variant={"secondary"}
      size="icon"
      disabled={!isActive}
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "bg-muted text-muted-foreground disabled:opacity-100",
        {
          [buttonVariants({ variant: "light" })]: isActive,
        },
        "rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
