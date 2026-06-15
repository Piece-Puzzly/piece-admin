"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // 주어진 컴포넌트 위치에 맞게 조정

const segmentNameMap: Record<string, string> = {
  user: "유저 상세 정보",
  profiles: "회원 프로필 심사",
  profile: "프로필",
  photo: "사진",
  report: "신고 유저 검토 및 제재",
  blocked: "차단",
  reported: "신고",
  match: "수동 매칭",
  "match-action": "매치 상태 관리",
    "free": "무료 매칭",
    "paid": "유료 매칭",
  tables: "테이블",
  "user-list": "유저 목록",
  "role-none": "미인증 유저",
  "role-register": "프로필 미작성 유저",
  "role-pending": "심사 미완료 유저",
  "role-user": "정상 유저",
  "profile-stats": "프로필 통계",
  dashboard: "대시보드",
  // 필요한 경로명 추가
};

// 경로 세그먼트를 보기 좋은 이름으로 변환하려면 매핑을 추가할 수 있습니다.
const segmentToTitle = (segment: string) => {
  // 간단히 디코딩
  return segmentNameMap[segment] ?? decodeURIComponent(segment);
};

export function AppBreadcrumbs() {
  const pathname = usePathname(); // e.g. /user/12/edit
  const segments = pathname.split("/").filter(Boolean); // ['user','12','edit']

  // 홈은 항상 고정
  const items = [
    { href: "/", title: "홈" },
    ...segments.map((seg, idx) => {
      return {
        href: "/" + segments.slice(0, idx + 1).join("/"),
        title: segmentToTitle(seg),
      };
    }),
  ];

  return (
    <Breadcrumb aria-label="breadcrumb" className="mb-4">
      <BreadcrumbList>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage aria-current="page">
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
