"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

// 햄버거 버튼: 좌측 사이드바를 접거나 펼친다.
// 모바일은 시트 토글(openMobile), 데스크톱은 오프캔버스 접힘/펼침(open)을 토글한다.
export default function AppSidebarMenuButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={toggleSidebar}
      aria-label="사이드바 열기/접기"
    >
      <Menu />
    </Button>
  );
}
