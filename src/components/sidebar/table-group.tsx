import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { getAllTableNamesWithRowCount } from "@/lib/actions/get-tables";
import { authOptions } from "@/lib/auth-options";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TableCollapsible from "./table-collapsible";

export default async function TableGroup() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  const names = (await getAllTableNamesWithRowCount()) as {
    name: string;
    count: number;
  }[];
  const nav = {
    url: "table",
    title: "테이블",
    items: names.map(({ name, count }) => ({
      url: `/tables/${name}`,
      title: name,
      count,
    })),
  };
  return (
    <SidebarGroup>
      <SidebarMenu>
        <TableCollapsible item={nav} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
