"use client";

import AppSidebarMenuButton from "@/app/_components/app-sidebar-menu-button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppSidebarHeader() {
  const isMobile = useIsMobile();
  return isMobile && <AppSidebarMenuButton />;
}
