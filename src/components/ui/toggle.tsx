"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm md:text-base font-medium disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary-light text-primary hover:bg-primary-middle/30 hover:text-primary/90 data-[state=on]:hover:bg-primary/90 data-[state=on]:disabled:bg-gray-light-1 data-[state=on]:disabled:border-0 data-[state=on]:disabled:text-gray-white data-[state=on]:disabled:opacity-100",
        outline:
          "border border-foreground bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-gray-light-1 data-[state=on]:border-none",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
