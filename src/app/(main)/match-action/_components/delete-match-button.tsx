import { Button } from "@/components/ui/button";
import { deleteMatchInfo } from "@/lib/actions/match-infos";
import { useState } from "react";

export default function DeleteMatchButton({
  matchId,
}: {
  matchId: number | bigint;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="h-full w-full text-destructive hover:text-destructive"
      variant={"ghost"}
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
  );
}
