"use client";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export default function SubmitToggle({ submit }: { submit: boolean }) {
  const [pressed, setPressed] = useState(submit);

  return (
    <Toggle
      onClick={async () => {
        setPressed(pressed);
      }}
      pressed={pressed}
      variant={"outline"}
      className="h-[46px] w-full text-lg"
    >
      제출
    </Toggle>
  );
}
