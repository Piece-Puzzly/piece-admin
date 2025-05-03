import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { banUsers } from "@/lib/server";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BanDialog({
  userId,
  className,
}: {
  userId: number;
  className?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="submit"
          className={cn(
            "px-[12px] py-[10px] leading-[24px] h-[44px]",
            className
          )}
        >
          영구 정지
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>영구 차단 하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={async () => {
                const res = await banUsers(userId);
                if (res.status !== "success") {
                  toast.error(JSON.stringify(res));
                }
              }}
            >
              확인
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
