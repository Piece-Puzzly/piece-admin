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
        className={cn(
          "w-full flex justify-between py-[10px] px-[12px] h-[42px] md:h-[46px]",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1">
          <div className="text-muted-foreground">[{userId}]</div>
          <div>{nickname}</div>
        </div>
        <ChevronRight />
      </Button>
    </UserInfoTrigger>
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button
    //       variant="outline"
    //       disabled={userId == null}
    //       className={cn(
    //         "w-full flex justify-between py-[10px] px-[12px] h-[42px] md:h-[46px]",
    //         className
    //       )}
    //       {...props}
    //     >
    //       <div className="flex items-center gap-1">
    //         <div className="text-muted-foreground">[{userId}]</div>
    //         <div>{nickname}</div>
    //       </div>
    //       <ChevronRight />
    //     </Button>
    //   </DialogTrigger>
    //   <DialogContent className="md:w-screen-xl max-h-9/10 overflow-y-auto md:max-w-screen-xl md:px-[60px] md:pt-[80px] md:pb-[40px]">
    //     <DialogHeader className="hidden">
    //       <DialogTitle />
    //       <DialogDescription />
    //     </DialogHeader>
    //     {userId !== null && <UserInfo id={userId} />}
    //   </DialogContent>
    // </Dialog>
  );
}
