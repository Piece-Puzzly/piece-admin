import prisma from "@/lib/prisma"; // Prisma 클라이언트 import
import UserTabs from "./_components/user-tabs";

// DB에서 각 역할별 사용자 수를 조회하는 비동기 함수
async function getUserCounts() {
  // $transaction과 Promise.all을 사용해 모든 count 쿼리를 병렬로 실행하여 성능을 최적화합니다.
  const counts = await prisma.$transaction([
    prisma.user_table.count({ where: { role: "NONE" } }),
    prisma.user_table.count({ where: { role: "REGISTER" } }),
    prisma.user_table.count({ where: { role: "PENDING" } }),
    prisma.user_table.count({ where: { role: "USER" } }),
  ]);

  return {
    NONE: counts[0],
    REGISTER: counts[1],
    PENDING: counts[2],
    USER: counts[3],
  };
}

// layout.tsx는 이제 async 함수인 서버 컴포넌트입니다.
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 서버에서 사용자 수를 조회합니다.
  const userCounts = await getUserCounts();

  return (
    <div>
      {/* 조회한 데이터를 UserTabs 컴포넌트에 prop으로 전달 */}
      <UserTabs userCounts={userCounts} />

      {/* 페이지의 실제 컨텐츠가 렌더링되는 부분 */}
      <main className="mt-6">{children}</main>
    </div>
  );
}
