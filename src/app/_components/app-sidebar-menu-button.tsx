"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

// 모바일에서만 노출: 닫힌 사이드바 시트를 여는 햄버거.
// 데스크톱은 패널 내부 햄버거(AppSidebarHeader)로 접고/펴므로 헤더엔 표시하지 않는다.
export default function AppSidebarMenuButton() {
  const { isMobile, toggleSidebar } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={toggleSidebar}
      aria-label="사이드바 열기"
    >
      <Menu />
    </Button>
  );
}
