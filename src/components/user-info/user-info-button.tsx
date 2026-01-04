"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import UserInfoTrigger from "./user-info-trigger";
export default function UserInfoButton({
  userId,
  nickname,
  className,
  ...props
}: {
  userId: number | bigint | null | undefined;
  nickname: string | null | undefined;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <UserInfoTrigger userId={userId} nickname={nickname} asChild>
      <Button
        variant="outline"
        disabled={userId == null}
        className={cn("w-full flex justify-between  ", className)}
        {...props}
      >
        <div className="flex items-center gap-1">
          <div className="text-muted-foreground">[{userId ?? "X"}]</div>
          <div>
            {nickname ?? (
              <span className="text-muted-foreground italic">닉네임 없음</span>
            )}
          </div>
        </div>
        <ChevronRight />
      </Button>
    </UserInfoTrigger>
  );
}
