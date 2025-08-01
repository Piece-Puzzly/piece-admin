"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";

export default function TableCollapsible({
  item,
}: {
  item: {
    url: string;
    title: string;
    items: {
      url: string;
      title: string;
      count: number;
    }[];
  };
}) {
  const pathname = usePathname();
  const isParentActive = item.items?.some((sub) => pathname === sub.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className={`text-base font-medium justify-between ${
          isParentActive ? "bg-accent text-foreground" : ""
        }`}
      >
        <span className="text-base">{item.title}</span>
      </SidebarMenuButton>

      <SidebarMenuSub>
        {item.items.map((subItem) => (
          <SidebarMenuSubItem key={subItem.title}>
            <SidebarMenuSubButton
              asChild
              className={
                pathname === subItem.url ? "bg-accent text-foreground" : ""
              }
            >
              <Link href={subItem.url}>
                <span className="text-base font-medium">
                  {subItem.title}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({subItem.count.toLocaleString()})
                  </span>
                </span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
