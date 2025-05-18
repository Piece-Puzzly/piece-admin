"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebug } from "../hooks/useDebug";
const FormSchema = z.object({
  debug: z.boolean(),
});
export default function DebugSettings() {
  const debug = useDebug((e) => e.debug);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      debug,
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    useDebug.setState({ debug: data.debug });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-sm">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>

          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 flex flex-col items-end"
          >
            <div className="space-y-4 w-full">
              <FormField
                control={form.control}
                name="debug"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>버튼 disable 해제</FormLabel>
                      <FormDescription>
                        모든 버튼의 disable 상태를 해제합니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogClose asChild>
              <Button type="submit">저장</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
