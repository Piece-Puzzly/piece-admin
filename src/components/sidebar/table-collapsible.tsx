"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
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
  const { setOpenMobile } = useSidebar();
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
            className={`font-medium justify-between `}
          >
            <span className="">{item.title}</span>

            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  className={
                    pathname === subItem.url ? "bg-accent text-foreground" : ""
                  }
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={subItem.url}>
                    <span className=" font-medium">
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
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
