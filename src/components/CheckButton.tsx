import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";

export default function CheckButton({
  isChecked,
}: { isChecked: boolean } & React.ComponentProps<"button">) {
  return (
    <Button
      // variant={isChecked ? "secondary" : "default"}
      size="icon"
      className={cn(
        "w-[20px] h-[20px] rounded-full bg-primary flex justify-center items-center",
        {
          "hover:bg-gray-light-1 bg-gray-light-1": isChecked,
        }
      )}
    >
      {isChecked ? (
        <X className="size-3.5 stroke-3" />
      ) : (
        <Check className="size-3.5 stroke-3" />
      )}
    </Button>
  );
}
