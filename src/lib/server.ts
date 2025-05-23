"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";
import { loginServerInfo } from "./login-info";
import { BlockedUsersResponses } from "./types";

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

  if (!response.ok) {
    redirect("/login");
  }

  const res = await response.json();

  return res;
}

export const updateProfileStatus = async (
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) => {
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
  return response_json;
};

export const getUserById = async (userId: number) => {
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

  return response_json;
};

export const getBlockDatas = async (page: number = 0, size: number = 10) => {
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

  const response_json: BlockedUsersResponses = await response.json();

  return response_json;
};

export const getReportedDatas = async (page: number = 0, size: number = 10) => {
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

  return response_json;
};

export const getReportDetail = async (
  userId: number,
  page: number = 0,
  size: number = 10
) => {
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

  return response_json;
};

export const banUsers = async (userId: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }

  const response = await fetch(
    loginServerInfo[session.loginServer].baseUrl + `/bans/users`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
      cache: "no-store",
    }
  );

  revalidatePath("/report/reported");

  const response_json = await response.json();

  return response_json;
};

export async function getUserProfileImageDetail(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await fetch(
    loginServerInfo[session.loginServer].baseUrl +
      `/users/${userId}/profileImage`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      cache: "no-store",
    }
  );
  const response_json = await response.json();

  return response_json;
}

export async function UpdateProfileImageStatus(
  profileImageId: number,
  accepted: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await fetch(
    loginServerInfo[session.loginServer].baseUrl +
      `/profileImages/${profileImageId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accepted,
      }),
      cache: "no-store",
    }
  );
  revalidatePath("/profiles/profile");
  const response_json = await response.json();

  return response_json;
}
