"use server";

import { Profile } from "@/app/(main)/profiles/columns";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "./authOptions";
import { UserProfileValidationResponse } from "./types";

export async function getProfiles(page: number) {
  const session = await getServerSession(authOptions);
  const response = await fetch(
    `https://admin.puzzly.site/admin/v1/users?page=${page}&size=${10}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  const { data } = await response.json();
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
        submit: profileStatus === "완료",
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
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/users/${userId}/profile`,
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
    return await response.json();
  } catch (error: unknown) {
    alert(error);
  }
};

export const getUserById = async (userId: number) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return await response.json();
  } catch (e) {
    console.log(e);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getBlockDatas = async (page: number = 1, size: number = 10) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/blocks?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return await response.json();
  } catch (e) {
    console.log(e);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getReportedDatas = async (page: number = 1, size: number = 10) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/reports?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.log(error);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};

export const getReportDetail = async (
  userId: number,
  page: number = 1,
  size: number = 10
) => {
  try {
    const session = await getServerSession(authOptions);
    const response = await fetch(
      `https://admin.puzzly.site/admin/v1/reports/users/${userId}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return await response.json();
  } catch (error: unknown) {
    console.log(error);
    throw new Error("유저 데이터 불러오기 중 알 수 없는 오류 발생");
  }
};
