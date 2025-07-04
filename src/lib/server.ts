"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

import {
  BlockedUsersResponses,
  Profile,
  ProfilesResponse,
  ReportedUsersResponses,
} from "./types";

export async function getProfiles(page: number): Promise<ProfilesResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
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

  return res as ProfilesResponse;
}

export async function getFilteredProfile(
  select: "userId" | "profileId" | "nickname",
  value: string
): Promise<Profile> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
      `/users/search?` +
      `&${select}=${value}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  const res: Profile = (await response.json()).data;

  return res;
}

export async function updateProfileStatus(
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}/profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        rejectImage,
        rejectDescription,
      }),
    }
  );

  const response_json = await response.json();

  return response_json;
}

export const getUserById = async (userId: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}`,
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
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
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

export async function getReportedDatas(
  page: number = 0,
  size: number = 10
): Promise<ReportedUsersResponses | null> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
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

  return response_json as ReportedUsersResponses;
}

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
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
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
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/bans/users`,
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

  const response_json = await response.json();

  return response_json;
};

export async function getUserProfileImageDetail(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL + `/users/${userId}/profileImage`,
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
    process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL +
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

  const response_json = await response.json();

  return response_json;
}
