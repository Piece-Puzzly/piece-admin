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
  userId: number | null;
  nickname: string;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <UserInfoTrigger userId={userId} nickname={nickname} asChild>
      <Button
        variant="outline"
        disabled={userId == null}
        className={cn("w-full flex justify-between  h-[42px] ", className)}
        {...props}
      >
        <div className="flex items-center gap-1">
          <div className="text-muted-foreground">[{userId}]</div>
          <div>{nickname}</div>
        </div>
        <ChevronRight />
      </Button>
    </UserInfoTrigger>
  );
}
