import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import MenuTabs from "./_components/MenuTabs";

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
        <MenuTabs />
        {children}
      </main>
    </div>
  );
}
