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
import { useReportTableStore } from "@/providers/report-table-provider";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BanButton({
  userId,
  nickName,
  className,
  ...props
}: {
  userId: number;
  nickName: string;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const [loading, setLoading] = useState<boolean>(false);
  const update = useReportTableStore((e) => e.update);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="submit"
          className={cn(
            "px-[12px] py-[10px] leading-[24px] h-[44px]",
            className
          )}
          {...props}
        >
          영구 정지
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 w-[312px] sm:max-w-[312px] break-normal">
        <DialogHeader className="pt-[40px] px-[20px] pb-[12px] items-center flex flex-col break-normal">
          <DialogTitle className="items-center flex flex-col gap-y-[8px]">
            <Image
              src={"/icons/Notice.svg"}
              height={40}
              width={40}
              alt="Notice"
            />
            <p className="text-[20px] font-semibold text-center break-words whitespace-normal break-keep leading-[24px]">
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
              className="h-[52px] font-semibold"
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
                setLoading(true);
                const res = await banUsers(userId);
                if (res.status !== "success") {
                  toast.error(JSON.stringify(res));
                }
                setLoading(false);
                await update();
                router.replace(pathname);
              }}
            >
              {loading ? <Loader className="animate-spin" /> : "영구 정지"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
