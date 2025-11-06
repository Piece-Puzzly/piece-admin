"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useMount } from "@/hooks/use-mount";
import { Menu } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";

export default function AppSidebarMenuButton() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMount = useMount();
  const { toggleSidebar } = useSidebar();

  if (!isDesktop && isMount)
    return (
      <Button variant={"ghost"} className="size-8" onClick={toggleSidebar}>
        <Menu />
      </Button>
    );
}
