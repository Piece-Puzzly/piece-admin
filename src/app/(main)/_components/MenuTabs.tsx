"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/linetabs";
import { usePathname, useRouter } from "next/navigation";

const menuList = ["accounts", "reported"];
const menuInfo: Record<string, { name: string }> = {
  accounts: { name: "회원 프로필 심사" },
  reported: { name: "신고 유저 검토 및 제재" },
};

export default function MenuTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Tabs className="" value={pathname.slice(1)}>
      <TabsList>
        {menuList.map((e) => (
          <TabsTrigger
            onClick={() => {
              router.push(`/${e}`);
            }}
            key={e}
            value={e}
          >
            {menuInfo[e].name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
