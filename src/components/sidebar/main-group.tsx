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
  {
    url: "/profiles",
    title: "회원 프로필 심사",
    items: [
      { url: "/profiles/profile", title: "프로필" },
      { url: "/profiles/photo", title: "사진" },
    ],
  },
  {
    url: "/report",
    title: "신고 유저 검토 및 제재",
    items: [
      { url: "/report/blocked", title: "차단" },
      { url: "/report/reported", title: "신고" },
    ],
  },
  { url: "/match", title: "수동 매칭" },
  { url: "/match-action", title: "매치 수락/거절" },
  {
    url: "/user-list",
    title: "유저 조회",
    items: [
      { url: "/user-list/role-none", title: "미인증 유저" },
      { url: "/user-list/role-register", title: "프로필 미작성 유저" },
      { url: "/user-list/role-pending", title: "심사 미완료 유저" },
      { url: "/user-list/role-user", title: "정상 유저" },
    ],
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
