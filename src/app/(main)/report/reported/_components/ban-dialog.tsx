import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { banUsers } from "@/lib/server";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

export default function BanDialog({
  userId,
  nickName,
  className,
}: {
  userId: number;
  nickName: string;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="submit"
          className={cn(
            "px-[12px] py-[10px] leading-[24px] h-[44px]",
            className
          )}
        >
          영구 정지
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[312px] break-normal">
        <DialogHeader className="pt-[40px] px-[20px] pb-[12px] items-center flex flex-col break-normal">
          <DialogTitle className="items-center flex flex-col gap-y-[8px]">
            <Image
              src={"/icons/Notice.svg"}
              height={40}
              width={40}
              alt="Notice"
            />
            <p className="text-[20px] font-semibold break-normal">
              {nickName}님을 영구 정지하시겠습니까?
            </p>
          </DialogTitle>
          <DialogDescription className="text-[14px] font-medium">
            영구 정지 버튼을 누르시면 바로 적용됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 pt-[12px] pb-[20px] px-[20px]">
          <DialogClose asChild>
            <Button
              className="h-[52px]"
              variant={"primary-outline"}
            >
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="h-[52px]"
              variant="default"
              onClick={async () => {
                const res = await banUsers(userId);
                if (res.status !== "success") {
                  toast.error(JSON.stringify(res));
                }
              }}
            >
              영구 정지
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
