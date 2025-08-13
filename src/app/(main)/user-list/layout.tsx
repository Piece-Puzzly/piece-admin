"use client";

import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 1단계에서 저장한 파일 경로
import { roleNameMap } from "@/lib/constants";
import { useRouter } from "next/navigation";

const roles = [
  { href: "/user-list/role-none", role: "NONE" },
  {
    href: "/user-list/role-register",
    role: "REGISTER",
  },
  { href: "/user-list/role-pending", role: "PENDING" },
  { href: "/user-list/role-user", role: "USER" },
];

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 URL 경로(pathname)를 기반으로 활성화된 탭의 'value'를 찾습니다.
  // ex: pathname이 '/admin/users/pending'이면 'pending'을 반환
  const activeTabValue =
    roles.find((tab) => pathname.startsWith(tab.href))?.role || roles[0].role;

  // 탭을 클릭했을 때 해당 URL로 이동시키는 함수
  const handleTabClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      {/* value prop에 현재 활성화된 탭의 값을 전달하여 UI 상태를 동기화합니다. */}
      <Tabs value={activeTabValue}>
        <TabsList>
          {roles.map((tab) => (
            <TabsTrigger
              key={tab.role}
              value={tab.role}
              onClick={() => handleTabClick(tab.href)}
            >
              {roleNameMap[tab.role]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 각 페이지의 실제 컨텐츠(children)는 TabsContent가 아닌
        별도의 div에 렌더링됩니다. 
      */}
      <main className="mt-6">{children}</main>
    </div>
  );
}
