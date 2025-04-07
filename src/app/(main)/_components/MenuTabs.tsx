"use client";

import {
  Tabs as LineTabs,
  TabsList as LineTabsList,
  TabsTrigger as LineTabsTrigger,
} from "@/components/ui/linetabs";
import { usePathname, useRouter } from "next/navigation";

const menuList = ["profiles", "report"];
const menuInfo: Record<string, { name: string }> = {
  profiles: { name: "회원 프로필 심사" },
  report: { name: "신고 유저 검토 및 제재" },
};

export default function MenuTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const tokens = pathname.split("/").slice(1);
  return (
    <LineTabs className="" value={tokens[0]}>
      <LineTabsList>
        {menuList.map((e) => (
          <LineTabsTrigger
            onClick={() => {
              router.push(`/${e}`);
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
