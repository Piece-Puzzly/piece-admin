import { getUserCountsByRole } from "@/lib/actions/user-list";
import UserTabs from "./_components/user-tabs";

// layout.tsx는 이제 async 함수인 서버 컴포넌트입니다.
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버에서 사용자 수를 조회합니다.
  const userCounts = await getUserCountsByRole();

  return (
    <div>
      {/* 조회한 데이터를 UserTabs 컴포넌트에 prop으로 전달 */}
      <UserTabs userCounts={userCounts} />

      {/* 페이지의 실제 컨텐츠가 렌더링되는 부분 */}
      <main className="mt-6">{children}</main>
    </div>
  );
}
