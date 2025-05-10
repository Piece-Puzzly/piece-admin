"use client";

import { useMediaQuery } from "@/app/hooks/use-media-query";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserById } from "@/lib/server";
import { UserProfileDetailResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import QuestionCard from "../app/(main)/profiles/profile/_components/QuestionCard";

export default function ProfileDetailButton({
  id,
  nickname,
}: {
  id: number | null;
  nickname: string;
}) {
  const [content, setContent] = useState<UserProfileDetailResponse | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
    content && <QuestionCard key="1" data={content.responses[page - 1]} />,
    content && (
      <PaginationButton
        key="2"
        isActive={page !== content.responses.length}
        onClick={() => {
          setPage(Math.min(page + 1, content.responses.length));
        }}
      >
        <ChevronRight />
      </PaginationButton>
    ),
  ];

  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const res = await getUserById(id as number);

          if (!res.data) {
            toast.error(JSON.stringify(res));
          }

          setContent(res.data);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={id == null}
          className="w-full flex justify-between py-[10px] px-[12px] h-[42px] md:h-[46px] "
        >
          <div>{nickname}</div>
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
                src={content.imageUrl}
                height={220}
                width={220}
                alt="Profile"
              />
              <div className="font-semibold text-[20px]">
                {content.nickname}
              </div>
            </div>
            <div className="flex items-center gap-x-[20px] w-full max-w-full">
              {isDesktop ? (
                questionComps
              ) : (
                <div className="space-y-4">
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
