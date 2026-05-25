"use client";

import { useCallback, useEffect, useRef } from "react";

// 드래그로 좌측 사이드바 너비를 조절한다.
// --sidebar-width 를 사이드바 그룹 엘리먼트(data-slot="sidebar")에 직접 설정해
// SidebarProvider 리렌더로 wrapper inline 값이 초기화되어도 영향받지 않게 한다.
const MIN_WIDTH = 240;
const MAX_WIDTH = 520;
const STORAGE_KEY = "piece-admin:sidebar-width";

export default function SidebarResizer() {
  const handleRef = useRef<HTMLDivElement>(null);

  const getGroup = useCallback(
    () => handleRef.current?.closest<HTMLElement>('[data-slot="sidebar"]') ?? null,
    []
  );

  const applyWidth = useCallback(
    (px: number) => {
      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(px)));
      getGroup()?.style.setProperty("--sidebar-width", `${clamped}px`);
      return clamped;
    },
    [getGroup]
  );

  // 드래그 중에는 너비 transition을 꺼서 핸들을 즉각 따라오게 한다.
  const setTransition = useCallback(
    (enabled: boolean) => {
      getGroup()
        ?.querySelectorAll<HTMLElement>(
          '[data-slot="sidebar-gap"],[data-slot="sidebar-container"]'
        )
        .forEach((el) => {
          el.style.transition = enabled ? "" : "none";
        });
    },
    [getGroup]
  );

  // 저장된 너비 복원
  useEffect(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved > 0) applyWidth(saved);
  }, [applyWidth]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setTransition(false);

      const onMove = (ev: PointerEvent) => applyWidth(ev.clientX);
      const onUp = (ev: PointerEvent) => {
        const width = applyWidth(ev.clientX);
        localStorage.setItem(STORAGE_KEY, String(width));
        setTransition(true);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.style.removeProperty("cursor");
        document.body.style.removeProperty("user-select");
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [applyWidth, setTransition]
  );

  // 더블클릭 시 기본 너비로 초기화
  const onDoubleClick = useCallback(() => {
    getGroup()?.style.removeProperty("--sidebar-width");
    localStorage.removeItem(STORAGE_KEY);
  }, [getGroup]);

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label="사이드바 너비 조절 (더블클릭: 초기화)"
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className="absolute inset-y-0 right-0 z-30 hidden w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-sidebar-border active:bg-sidebar-border md:block"
    />
  );
}
