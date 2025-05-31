"use client";

import {
  Tabs as LineTabs,
  TabsList as LineTabsList,
  TabsTrigger as LineTabsTrigger,
} from "@/components/ui/linetabs";
import { usePathname, useRouter } from "next/navigation";

export const menuInfo: {
  value: string;
  name: string;
  tabs?: { value: string; name: string }[];
}[] = [
  {
    value: "profiles",
    name: "회원 프로필 심사",
    tabs: [
      { value: "profile", name: "프로필" },
      { value: "photo", name: "사진" },
    ],
  },
  {
    value: "report",
    name: "신고 유저 검토 및 제재",
    tabs: [
      { value: "blocked", name: "차단" },
      { value: "reported", name: "신고" },
    ],
  },
  { value: "match", name: "수동 매칭" },
];

export default function MenuTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const tokens = pathname.split("/").slice(1);
  return (
    <LineTabs
      className="overflow-auto scrollbar-hide whitespace-nowrap w-full md:w-auto"
      value={tokens[0]}
    >
      <LineTabsList>
        {menuInfo.map(({ value, name, tabs }) => (
          <LineTabsTrigger
            onClick={() => {
              router.push(`/${value}` + (tabs ? `/${tabs[0].value}` : ""));
            }}
            key={value}
            value={value}
          >
            {name}
          </LineTabsTrigger>
        ))}
      </LineTabsList>
    </LineTabs>
  );
}
