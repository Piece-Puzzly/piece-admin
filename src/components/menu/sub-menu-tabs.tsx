"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { menuInfo } from "./menu-tabs";

export default function SubMenuTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const menu = pathname.split("/")[1];
  const currMenuInfo = menuInfo.find((e) => e.value === menu);
  const subMenu = pathname.split("/")[2] || currMenuInfo?.tabs?.[0].value;

  return (
    currMenuInfo?.tabs && (
      <Tabs className=" md:h-[48px] " value={subMenu!}>
        <TabsList>
          {currMenuInfo.tabs.map(({ name, value }) => (
            <TabsTrigger
              className="px-[20px]"
              onClick={() => {
                router.push(`/${menu}/${value}`);
              }}
              key={value}
              value={value}
            >
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  );
}
