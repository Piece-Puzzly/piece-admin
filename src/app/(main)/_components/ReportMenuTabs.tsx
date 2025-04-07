"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

const menuList = ["blocked", "reported"];
const menuInfo: Record<string, { name: string }> = {
  blocked: { name: "차단" },
  reported: { name: "신고" },
};

export default function MenuTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const tokens = pathname.split("/").slice(1);
  return (
    tokens[0] === "report" && (
      <Tabs className="" value={tokens[1]}>
        <TabsList>
          {menuList.map((e) => (
            <TabsTrigger
              onClick={() => {
                router.push(`/report/${e}`);
              }}
              key={e}
              value={e}
            >
              {menuInfo[e].name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  );
}
