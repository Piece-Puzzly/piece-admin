import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuTabs from "../(main)/_components/MenuTabs";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  let paramsData = (await params).slug;

  if (!paramsData || paramsData.length === 0) {
    paramsData = ["examine"];
  } else if (paramsData.length === 1 && paramsData[0] === "reported") {
    paramsData.push("blocked");
  }


  return (
    <div className="flex justify-center">
      <main className="p-[20px] w-full max-w-screen-xl">
        <MenuTabs params={paramsData} />
      </main>
    </div>
  );
}
