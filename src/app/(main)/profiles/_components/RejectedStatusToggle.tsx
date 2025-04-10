"use client";
import { Toggle } from "@/components/ui/toggle";
import { Profile } from "@/lib/types";
import { useEffect } from "react";
const rejectionType: { name: string; key: "image" | "description" }[] = [
  { name: "사진", key: "image" },
  { name: "소개글", key: "description" },
];
export default function RejectedStatusToggle({
  rejectStatus,
  profileStatus,
}: {
  rejectStatus: Profile["rejectStatus"];
  profileStatus: Profile["profileStatus"];
}) {
  useEffect(() => {}, [rejectStatus.image, rejectStatus.description]);
  return (
    <div className="grid grid-cols-2 gap-x-2 h-[46px]">
      {rejectionType.map(
        ({ name, key }: { name: string; key: "image" | "description" }) => (
          <Toggle
            key={name}
            defaultPressed={rejectStatus[key]}
            onPressedChange={(e) => {
              rejectStatus[key] = e;
            }}
            disabled={profileStatus === "통과"}
            className="h-full text-lg"
          >
            {name}
          </Toggle>
        )
      )}
    </div>
  );
}
