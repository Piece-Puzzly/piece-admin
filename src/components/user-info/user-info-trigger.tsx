"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import UserInfo from "./user-info";
export default function UserInfoTrigger({
  userId,
  ...props
}: {
  userId: number | null | bigint;
  nickname: string | undefined;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <Dialog>
      <DialogTrigger asChild {...props} />
      <DialogContent className="md:w-screen-xl max-h-9/10 overflow-y-auto md:max-w-screen-xl md:px-[60px] md:pt-[80px] md:pb-[40px]">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="">{userId !== null && <UserInfo id={userId} />}</div>
      </DialogContent>
    </Dialog>
  );
}
