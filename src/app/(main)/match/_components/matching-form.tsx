"use client";

import { useDebug } from "@/app/hooks/use-debug";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as SelectPrimitive from "@radix-ui/react-select";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  idA: z.string({
    required_error: "Please select an profile1.",
  }),
  idB: z.string({
    required_error: "Please select an profile2",
  }),
  date: z.date({ required_error: "Please select an date" }),
  time: z.string({ required_error: "Please select an time." }),
});

export default function MatchingForm({
  data,
}: {
  data: { id: number; nickname: string; disabled: boolean }[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { date: new Date() },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col md:flex-row items-center gap-6 md:gap-[60px]"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col md:flex-row gap-[24px] flex-1">
          <div className="flex-1 items-center grid grid-cols-2 gap-[8px] w-auto md:w-[448px]">
            {["idA", "idB"].map((e) => (
              <FormField
                key={e}
                control={form.control}
                name={e as "idA" | "idB"}
                render={({ field }) => (
                  <FormItem>
                    <ProfileSelect
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      data={data}
                    />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="items-center flex gap-[8px]">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"secondary"}
                          className={cn(
                            "w-[180px] !h-[52px] text-base text-secondary-foreground font-medium px-[16px] flex justify-between "
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy년 MM월 dd일")
                          ) : (
                            <span>매칭 날짜</span>
                          )}
                          <ChevronDownIcon className="size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => {
                        //   const now = new Date();
                        //   const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                        //   return date < startOfDay;
                        // }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <TimeSelect
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button className="h-[52px] w-[200px] text-base">매칭</Button>
      </form>
    </Form>
  );
}

function ProfileSelect({
  data,
  ...props
}: {
  data: { id: number; nickname: string; disabled: boolean }[];
} & React.ComponentProps<typeof SelectPrimitive.Root>) {
  const debug = useDebug((e) => e.debug);
  return (
    <Select {...props}>
      <SelectTrigger className="overflow-hidden w-full max-w-full !h-[52px] text-base text-secondary-foreground font-medium px-[16px]">
        <SelectValue placeholder="닉네임을 선택해 주세요" />
      </SelectTrigger>
      <SelectContent>
        {data.map(({ id, nickname, disabled }) => (
          <SelectItem key={id} value={`${id}`} disabled={!debug && disabled}>
            <div>
              [{id}] {nickname}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TimeSelect({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-[180px] !h-[52px] text-base text-secondary-foreground font-medium px-[16px]">
        <SelectValue placeholder="매칭 시간" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(12)]
          .map((_, i) => {
            return i + 12;
          })
          .map((i) => (
            <SelectItem key={i} value={`${i}`}>
              <div>{i}시</div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
