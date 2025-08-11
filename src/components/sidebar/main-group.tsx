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
import Link from "next/link";
import { usePathname } from "next/navigation";

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

          return (
            <SidebarMenuItem key={item.url}>
              {item.items?.length ? (
                <>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`text-base font-medium ${
                      isParentActive ? "bg-accent text-foreground " : ""
                    }`}
                  >
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>

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
                              <span className="text-base font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={isSingleActive ? "bg-accent text-foreground" : ""}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    <span className="text-base font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
