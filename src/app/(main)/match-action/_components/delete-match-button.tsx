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
import { deleteMatchInfo } from "@/lib/actions/match-infos";
import { useState } from "react";

export default function DeleteMatchButton({
  matchId,
}: {
  matchId: number | bigint;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-full w-full text-destructive hover:text-destructive"
          variant={"ghost"}
        >
          {"삭제"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">취소</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={async () => {
              setLoading(true);
              try {
                await deleteMatchInfo(matchId);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
