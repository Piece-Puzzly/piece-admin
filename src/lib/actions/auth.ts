import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";

export async function checkAuth(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return true;
}
