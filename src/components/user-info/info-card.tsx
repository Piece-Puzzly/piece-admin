import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "../ui/card";

export function InfoCard({ ...props }: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn("py-4 bg-background w-fit text-center gap-2 inline-flex")}
      {...props}
    />
  );
}

export function InfoCardHeader({ ...props }: React.ComponentProps<"div">) {
  return <div className={cn("gap-0 px-6")} {...props} />;
}

export function InfoCardTitle({ ...props }: React.ComponentProps<"div">) {
  return (
    <CardTitle
      className="text-muted-foreground font-medium text-sm whitespace-nowrap "
      {...props}
    />
  );
}
export function InfoCardContent({ ...props }: React.ComponentProps<"div">) {
  return <CardContent className="text-lg font-medium" {...props} />;
}
