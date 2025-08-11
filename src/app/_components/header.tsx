import LogoutButton from "@/components/logout-button";
import { getServerSession } from "next-auth";
import AppSidebarMenuButton from "./app-sidebar-menu-button";
import DebugSettings from "./debug-settings";
import LogoButton from "./logo-button";

export default async function Header() {
  const session = await getServerSession();
  return (
    <div className="shrink-0 h-12 md:h-16 flex w-full items-center justify-center border-b">
      <div className="w-full max-w-screen-2xl flex justify-between pl-2 md:pl-4 pr-2 md:pr-4 items-center">
        <span className="flex flex-row gap-2 items-center">
          <div className="flex gap-2 items-center ">
            <AppSidebarMenuButton />

            <LogoButton />
          </div>
          {session && (
            <span className="text-sm px-5 py-2.5 font-medium hidden md:block">
              <span className="decoration-grayscale-black underline">
                admin
              </span>
              <span className="text-grayscale-dark3 text-muted-foreground">
                님, 안녕하세요.
              </span>
            </span>
          )}
        </span>
        <div className="flex items-center">
          <DebugSettings />
          {session && <LogoutButton />}
        </div>
      </div>
    </div>
  );
}
