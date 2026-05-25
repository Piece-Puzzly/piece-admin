"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roleNameMap } from "@/lib/constants"; // 역할 한글 이름을 담은 객체
import { usePathname, useRouter } from "next/navigation";

// 각 탭의 정보를 정의합니다.
const roles = [
  { href: "/user-list/role-none", role: "NONE" as const },
  { href: "/user-list/role-register", role: "REGISTER" as const },
  { href: "/user-list/role-pending", role: "PENDING" as const },
  { href: "/user-list/role-user", role: "USER" as const },
  { href: "/user-list/role-deleted", role: "DELETED" as const },
];

// 서버로부터 받아올 사용자 수 데이터의 타입을 정의합니다.
interface UserTabsProps {
  userCounts: {
    NONE: number;
    REGISTER: number;
    PENDING: number;
    USER: number;
  };
}

export default function UserTabs({ userCounts }: UserTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 URL 경로를 기반으로 활성화된 탭의 'role' 값을 찾습니다.
  const activeTabValue =
    roles.find((tab) => pathname.startsWith(tab.href))?.role || roles[0].role;

  const handleTabClick = (href: string) => {
    router.push(href);
  };

  return (
    <Tabs value={activeTabValue}>
      <TabsList>
        {roles.map((tab) => {
          // DELETED 등 카운트 API에 없는 역할은 수치를 표시하지 않는다.
          const count = (userCounts as Record<string, number | undefined>)[
            tab.role
          ];
          return (
            <TabsTrigger
              key={tab.role}
              value={tab.role}
              onClick={() => handleTabClick(tab.href)}
              className="gap-2" // 이름과 숫자 사이 간격을 위한 클래스
            >
              <span>{roleNameMap[tab.role]}</span>
              {typeof count === "number" && (
                <span className="text-muted-foreground">({count})</span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
