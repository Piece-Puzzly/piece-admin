"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

// 운영자가 하는 일 기준 4그룹 IA. (URL은 기존 경로 유지 — 폴더 이동은 별도 단계)
export const navMain = [
  {
    url: "/dashboard",
    title: "대시보드",
    items: [
      { url: "/dashboard", title: "대시보드" },
      { url: "/profile-stats", title: "프로필 통계" },
    ],
  },
  {
    url: "/review",
    title: "심사·제재",
    items: [
      { url: "/profiles/profile/history", title: "심사 내역" },
      { url: "/profiles/profile", title: "프로필 심사" },
      { url: "/profiles/photo", title: "사진 심사" },
      { url: "/report/reported", title: "신고" },
      { url: "/report/blocked", title: "차단" },
    ],
  },
  {
    url: "/matching",
    title: "매칭 관리",
    items: [
      { url: "/match", title: "수동 매칭" },
      { url: "/match-action", title: "매칭 상태 관리" },
    ],
  },
  {
    url: "/users",
    title: "유저 조회",
    items: [
      { url: "/user-list", title: "유저 조회" },
      { url: "/referral-history", title: "초대 이력 조회" },
      { url: "/marketing-consent", title: "마케팅 동의 유저" },
      { url: "/referral-code", title: "추천인 코드 조회" },
    ],
  },
  {
    url: "/puzzle",
    title: "퍼즐 관리",
  },
];
export default function MainGroup() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    // 사이드바가 접히면(아이콘 레일) 메뉴 글씨는 숨기고 패널 내 햄버거만 남긴다.
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarMenu>
        {navMain.map((item) => {
          const isParentActive = item.items?.some(
            (sub) => pathname === sub.url
          );

          // pathname이 item.url과 같거나, item.url + '/'로 시작하면 active 처리
          const isSingleActive =
            pathname === item.url || pathname.startsWith(item.url + "/");

          if (item.items?.length) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isParentActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`font-medium `}
                    >
                      <span className="">{item.title}</span>

                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                isActive ? "bg-accent text-foreground" : ""
                              }
                              onClick={() => setOpenMobile(false)}
                            >
                              <Link href={subItem.url}>
                                <span className="font-medium">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={isSingleActive ? "bg-accent text-foreground" : ""}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
