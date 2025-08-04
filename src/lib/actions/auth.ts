import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth-options";

export async function checkAuth(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users?page=${1}&size=${1}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    redirect("/login");
  } else {
    return false;
  }
}
