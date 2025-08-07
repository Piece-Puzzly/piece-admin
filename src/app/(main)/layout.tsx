import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth-options";
import { AppBreadcrumbs } from "../_components/app-breadcrumbs";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  } else {
    return (
      <div className="flex justify-center">
        <main className="space-y-[20px] relative max-w-screen-2xl w-full flex flex-row">
          <AppSidebar />
          <SidebarInset className="p-[10px] md:p-[20px] overflow-auto w-full">
            <AppBreadcrumbs />
            <div className="">{children}</div>
          </SidebarInset>
        </main>
      </div>
    );
  }
}
