import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/authOptions";
import MenuTabs from "./_components/MenuTabs";
import ReportMenuTabs from "./_components/ReportMenuTabs";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex justify-center">
      <main className="p-[20px] w-full max-w-screen-xl space-y-[20px]">
        <div className="flex justify-between items-center">
          <MenuTabs />
          <ReportMenuTabs />
        </div>
        {children}
      </main>
    </div>
  );
}
