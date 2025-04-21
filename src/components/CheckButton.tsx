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
      className={cn("w-[20px] h-[20px] rounded-full bg-primary", {
        "hover:bg-[#CBD1D9]/70 bg-[#CBD1D9]": isChecked,
      })}
    >
      {isChecked ? (
        <X className="size-3.5 stroke-3" />
      ) : (
        <Check className="size-3.5 stroke-3" />
      )}
    </Button>
  );
}
