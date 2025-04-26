"use client";

import { Button } from "@/components/ui/button";
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
import QuestionCard from "../app/(main)/profiles/_components/QuestionCard";
export default function ProfileDetailButton({
  id,
  nickname,
}: {
  id: number;
  nickname: string;
}) {
  const [content, setContent] = useState<UserProfileDetailResponse | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const { data }: { data: UserProfileDetailResponse } =
            await getUserById(id as number);
          setContent(data);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-between py-[10px] px-[12px] h-[46px]"
        >
          <div>{nickname}</div>
          <ChevronRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[860px] lg:max-w-[860px] px-[60px] pt-[80px] pb-[40px]">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {content ? (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-[20px] items-center">
              <Image
                className="rounded-lg"
                src={content?.imageUrl}
                height={220}
                width={220}
                alt="Profile"
              />
              <div className="font-semibold">{content.nickname}</div>
            </div>
            <div className="flex items-center gap-x-[20px]">
              <Button
                variant={"secondary"}
                size="icon"
                disabled={page === 1}
                onClick={() => {
                  setPage(Math.max(page - 1, 1));
                }}
                className={cn(
                  "rounded-full bg-muted text-muted-foreground disabled:opacity-100",
                  {
                    "bg-[#F6EFFF] text-primary hover:bg-[#F6EFFF] hover:text-primary":
                      page !== 1,
                  }
                )}
              >
                <ChevronLeft />
              </Button>
              <QuestionCard data={content.responses[page - 1]} />
              <Button
                variant={"secondary"}
                size="icon"
                disabled={page === content.responses.length}
                onClick={() => {
                  setPage(Math.min(page + 1, content.responses.length));
                }}
                className={cn(
                  "rounded-full bg-muted text-muted-foreground disabled:opacity-100",
                  {
                    "bg-[#F6EFFF] text-primary hover:bg-[#F6EFFF] hover:text-primary":
                      page !== content.responses.length,
                  }
                )}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        ) : (
          <div>loading</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
