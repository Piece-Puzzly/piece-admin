import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

export default function SimplePagination({
  page,
  onPageChange,
}: {
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Button
        variant={"secondary"}
        disabled={page === 1}
        onClick={() => {
          if (page === 1) {
            return;
          } else {
            onPageChange(page - 1);
          }
        }}
      >
        <ArrowLeft />
      </Button>
      <div className="size-8 font-medium flex justify-center items-center">
        {page}
      </div>
      <Button
        variant={"secondary"}
        onClick={() => {
          onPageChange(page + 1);
        }}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
