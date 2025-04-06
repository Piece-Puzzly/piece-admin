import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import { UserProfileValidationResponse } from "@/lib/types";
import { columns, Profile } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Profile[]> {
  const session = await getServerSession(authOptions);
  console.log(session?.accessToken);
  const data = await fetch(
    `https://admin.puzzly.site/admin/v1/users?page=${1}&size=${10}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  const result = (
    (await data.json()).data.content as UserProfileValidationResponse[]
  ).map(
    ({
      userId,
      nickname,
      name,
      birthdate,
      phoneNumber,
      joinDate,
      profileStatus,
      rejectImage,
      rejectDescription,
    }) => {
      return {
        userId,
        nickname,
        name,
        birthdate,
        phoneNumber,
        joinDate,
        profileStatus,
        rejectStatus: { image: rejectImage, description: rejectDescription },
        submit: profileStatus === "완료",
      } as Profile;
    }
  );

  return result;
}

export default async function DemoPage() {
  const data = await getData();
  return <DataTable columns={columns} data={data} />;
}
