import * as React from "react";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import MainGroup from "./main-group";
import TableGroup from "./table-group";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-0 h-dvh! p-4 border-none" {...props}>
      <SidebarContent>
        <MainGroup />
        <TableGroup />
      </SidebarContent>
    </Sidebar>
  );
}
