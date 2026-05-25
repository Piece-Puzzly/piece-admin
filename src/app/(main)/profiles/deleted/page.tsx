import { redirect } from "next/navigation";

// 탈퇴 유저는 '유저' 메뉴의 역할 탭(/user-list/role-deleted)으로 이동했습니다.
// 구 경로(/profiles/deleted)는 북마크 호환을 위해 새 위치로 리다이렉트합니다.
export default function DeletedProfilePage() {
  redirect("/user-list/role-deleted");
}
