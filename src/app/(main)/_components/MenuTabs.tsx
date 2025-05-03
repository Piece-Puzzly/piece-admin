"use client";

import {
  Tabs as LineTabs,
  TabsList as LineTabsList,
  TabsTrigger as LineTabsTrigger,
} from "@/components/ui/linetabs";
import { usePathname, useRouter } from "next/navigation";

const menuList = ["profiles", "report", "match"];
const menuInfo: Record<string, { name: string }> = {
  profiles: { name: "회원 프로필 심사" },
  report: { name: "신고 유저 검토 및 제재" },
  match: { name: "수동 매칭" },
};

export default function MenuTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const tokens = pathname.split("/").slice(1);
  return (
    <LineTabs
      className="overflow-auto scrollbar-hide whitespace-nowrap w-full"
      value={tokens[0]}
    >
      <LineTabsList>
        {menuList.map((e) => (
          <LineTabsTrigger
            onClick={() => {
              router.push(`/${e}` + (e === "report" ? "/blocked" : ""));
            }}
            key={e}
            value={e}
          >
            {menuInfo[e].name}
          </LineTabsTrigger>
        ))}
      </LineTabsList>
    </LineTabs>
  );
}
