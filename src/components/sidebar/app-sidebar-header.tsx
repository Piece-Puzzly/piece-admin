"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

// 패널(사이드바) 내부 상단의 햄버거 — 펼쳐진 사이드바를 접는다.
// 패널 안에 있어 사이드바(z-10)에 가리지 않으므로 항상 클릭이 잘 된다.
export default function AppSidebarHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center px-1 pb-1">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={toggleSidebar}
        aria-label="사이드바 접기"
      >
        <Menu />
      </Button>
    </div>
  );
}
