"use client";

import { enUS } from "date-fns/locale"; // Import the locale
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={enUS}
      showOutsideDays={showOutsideDays}
      className={cn("pt-[5px] pb-[2px] w-[370px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col w-full",
        caption: "flex justify-start relative items-center w-full h-[44px]",
        caption_label: "text-[17px] font-semibold pl-[16px]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-7 bg-transparent p-0 hover:opacity-100"
        ),
        nav_button_previous: "absolute right-10",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex h-[20px] w-full justify-evenly",
        head_cell:
          "text-muted-foreground rounded-md w-8 text-[13px] text-[#3C3C43]/30 font-semibold",
        row: "flex w-full mt-[7px] w-full justify-around px-[16px]",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "date" }),
          "size-[44px] p-0 font-normal aria-selected:bg-[#007AFF]/12 aria-selected:text-[#007AFF] text-[18px] text-medium"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatWeekdayName: (day) =>
          day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft
            className={cn("size-6 stroke-[#007AFF]", className)}
            {...props}
          />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight
            className={cn("size-6 stroke-[#007AFF]", className)}
            {...props}
          />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
