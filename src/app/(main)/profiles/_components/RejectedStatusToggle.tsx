"use client";
import { Toggle } from "@/components/ui/toggle";
import { summitDebug } from "@/lib/debugFlags";
import { UserProfileValidationResponse } from "@/lib/types";

const rejectionType: {
  name: string;
  key: "rejectImage" | "rejectDescription";
}[] = [
  { name: "사진", key: "rejectImage" },
  { name: "소개글", key: "rejectDescription" },
];
export default function RejectedStatusToggle({
  profileStatus,
  rowData,
}: {
  profileStatus: string;
  rowData: UserProfileValidationResponse;
}) {
  // useEffect(() => {}, [rejectStatus.image, rejectStatus.description]);

  return (
    <div className="grid grid-cols-2 gap-x-2 h-[46px]">
      {rejectionType.map(({ name, key }) => (
        <Toggle
          key={name}
          defaultPressed={rowData[key]}
          onPressedChange={(e) => {
            rowData[key] = e;
          }}
          disabled={!summitDebug && profileStatus === "통과"}
          className="h-[44px] px-3 py-[10px] text-base leading-6"
        >
          {name}
        </Toggle>
      ))}
    </div>
  );
}
