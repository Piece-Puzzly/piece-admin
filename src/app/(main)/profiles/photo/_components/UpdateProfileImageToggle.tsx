"use client";
import { useDebug } from "@/app/hooks/useDebug";
import { Toggle } from "@/components/ui/toggle";
import { UserProfileImageDetailResponseData } from "@/lib/types";
import { useState } from "react";

const rejectionType: {
  name: string;
  key: string;
}[] = [
  { name: "반려", key: "REJECTED" },
  { name: "통과", key: "ACCEPTED" },
];
export default function UpdateProfileImageToggle({
  profileImageStatus,
  rawData,
}: {
  profileImageStatus: string;
  rawData: UserProfileImageDetailResponseData;
}) {
  const [radio, setRadio] = useState<string>(
    rawData.pendingProfileImage!.profileImageStatus
  );
  const debug = useDebug((e) => e.debug);
  return (
    <div className="grid grid-cols-2 gap-x-2 h-[46px] w-full md:min-w-[180px] items-center">
      {rejectionType.map(({ name, key }) => (
        <Toggle
          key={name}
          pressed={radio === key}
          defaultPressed={
            rawData.pendingProfileImage!.profileImageStatus === key
          }
          onPressedChange={(e) => {
            if (e) {
              setRadio(key);
              rawData.pendingProfileImage!.profileImageStatus = key;
            } else {
              setRadio("PENDING");
              rawData.pendingProfileImage!.profileImageStatus = "PENDING";
            }
          }}
          disabled={!debug && profileImageStatus !== "PENDING"}
          className="h-[40px] md:h-[44px] px-3 py-[10px] leading-6 md:min-w-[80px] w-full md:w-[184px]"
        >
          {name}
        </Toggle>
      ))}
    </div>
  );
}
