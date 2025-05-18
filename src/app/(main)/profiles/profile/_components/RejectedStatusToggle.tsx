"use client";
import { useDebug } from "@/app/hooks/useDebug";
import { Toggle } from "@/components/ui/toggle";
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
  const debug = useDebug((e) => e.debug);
  return (
    <div className="grid grid-cols-2 gap-x-2 h-[46px] min-w-[180px] items-center">
      {rejectionType.map(({ name, key }) => (
        <Toggle
          key={name}
          defaultPressed={rowData[key]}
          onPressedChange={(e) => {
            rowData[key] = e;
          }}
          disabled={!debug && profileStatus === "통과"}
          className="h-[40px] md:h-[44px] px-3 py-[10px] leading-6 min-w-[80px]"
        >
          {name}
        </Toggle>
      ))}
    </div>
  );
}
