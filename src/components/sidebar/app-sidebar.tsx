import * as React from "react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import AppSidebarHeader from "./app-sidebar-header";
import MainGroup from "./main-group";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-0 h-dvh! border-none" {...props}>
      <SidebarContent className="p-2">
        <AppSidebarHeader />
        <MainGroup />
      </SidebarContent>
    </Sidebar>
  );
}
