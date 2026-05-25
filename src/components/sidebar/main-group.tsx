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

export const navMain = [
  { url: "/dashboard", title: "대시보드" },
  {
    url: "/profiles",
    title: "회원 프로필 심사",
    items: [
      { url: "/profiles/profile", title: "프로필" },
      { url: "/profiles/photo", title: "사진" },
    ],
  },
  {
    url: "/user",
    title: "유저",
    items: [
      { url: "/user-list", title: "유저 조회" },
      { url: "/marketing-consent", title: "마케팅 동의 유저" },
      { url: "/report/reported", title: "신고 유저 검토 및 제재" },
    ],
  },
  {
    url: "/matching",
    title: "매칭",
    items: [
      { url: "/match", title: "수동 매칭" },
      { url: "/match-action", title: "매칭 상태 관리" },
    ],
  },
  {
    url: "/profile-stats",
    title: "프로필 통계",
  },
];
export default function MainGroup() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
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
