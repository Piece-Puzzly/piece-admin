import * as React from "react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import AppSidebarHeader from "./app-sidebar-header";
import MainGroup from "./main-group";
import SidebarResizer from "./sidebar-resizer";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="top-0 h-dvh! border-none" {...props}>
      <SidebarContent className="p-2">
        <AppSidebarHeader />
        <MainGroup />
      </SidebarContent>
      {/* 우측 끝 드래그 핸들로 너비 조절 (데스크톱) */}
      <SidebarResizer />
    </Sidebar>
  );
}
