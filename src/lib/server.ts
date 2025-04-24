"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "./authOptions";
import { loginServerInfo } from "./loginData";
import {
  BlockedValidationResponses,
  Profile,
  UserProfileValidationResponse,
} from "./types";

export async function getProfiles(page: number) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return;
  }

  const response = await fetch(
    loginServerInfo[session.loginServer].baseUrl +
      `/users?page=${page}&size=${10}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const { data } = await response.json();
  if (data === undefined) {
    redirect("/login");
  }
  const content = data.content;

  const result = (content as UserProfileValidationResponse[]).map(
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
      } as Profile;
    }
  );
  data.content = result;

  return data;
}

export const updateProfileStatus = async (
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }

    const response = await fetch(
      loginServerInfo[session.loginServer].baseUrl + `/users/${userId}/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          rejectImage,
          rejectDescription,
        }),
      }
    );

    revalidatePath("/profiles");
    const response_json = await response.json();
    if (response_json.data === undefined) {
      redirect("/login");
    }
    return response_json;
  } catch (error: unknown) {
    alert(error);
  }
};

export const getUserById = async (userId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const response = await fetch(
      loginServerInfo[session.loginServer].baseUrl + `/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );

    const response_json = await response.json();
    if (response_json.data === undefined) {
      redirect("/login");
    }
    return response_json;
  } catch (e) {
    alert(e);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getBlockDatas = async (page: number = 0, size: number = 10) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const response = await fetch(
      loginServerInfo[session.loginServer].baseUrl +
        `/blocks?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );
    const response_json: BlockedValidationResponses = await response.json();
    // console.log(response_json);
    // if (response_json.data === undefined) {
    //   redirect("/login");
    // }
    console.log(response_json);
    return response_json;
  } catch (e) {
    if (typeof window !== "undefined") {
      alert(e);
    }

    // throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getReportedDatas = async (page: number = 0, size: number = 10) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const response = await fetch(
      loginServerInfo[session.loginServer].baseUrl +
        `/reports?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );
    const response_json = await response.json();
    if (response_json.data === undefined) {
      redirect("/login");
    }
    return response_json;
  } catch (error: unknown) {
    alert(error);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getReportDetail = async (
  userId: number,
  page: number = 0,
  size: number = 10
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return;
    }
    const response = await fetch(
      loginServerInfo[session.loginServer].baseUrl +
        `/reports/users/${userId}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        cache: "no-store",
      }
    );

    const response_json = await response.json();
    if (response_json.data === undefined) {
      redirect("/login");
    }
    return response_json;
  } catch (error: unknown) {
    alert(error);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};
