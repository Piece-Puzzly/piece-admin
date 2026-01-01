// lib/actions/get-user.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";
import { checkAuth } from "./auth";

// API 응답 타입 정의
export interface UserInfoResponse {
  nickname: string | null;
  phone: string | null;
  role: string | null;
  is_admin: boolean | null;
  created_at: string | null;
  profile: {
    nickname: string | null;
    birthdate: string | null;
    job: string | null;
    description: string | null;
  } | null;
}

export interface UserFullInfoResponse {
  userId: number;
  name: string | null;
  phoneNumber: string | null;
  role: string | null;
  isAdmin: boolean | null;
  createdAt: string | null;
  profile: {
    profileId: number;
    nickname: string | null;
    description: string | null;
    birthdate: string | null;
    height: number | null;
    weight: number | null;
    job: string | null;
    location: string | null;
    smokingStatus: string | null;
    snsActivityLevel: string | null;
    imageUrl: string | null;
    profileStatus: string | null;
    createdAt: string | null;
  } | null;
  profileImages: {
    profileImageId: number;
    imageUrl: string | null;
    status: string | null;
    createdAt: string | null;
  }[];
  valuePicks: {
    id: number;
    valuePickId: number | null;
    category: string | null;
    question: string | null;
    selectedAnswer: number | null;
  }[];
  valueTalks: {
    id: number;
    valueTalkId: number | null;
    category: string | null;
    summary: string | null;
    answer: string | null;
  }[];
}

export async function getUserInfo(userId: string | number | bigint): Promise<UserInfoResponse | null> {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getUserInfo API error:", response.status);
      return null;
    }

    const { data } = await response.json();

    // API 응답을 기존 형식에 맞게 변환
    return {
      nickname: data.nickname ?? null,
      phone: data.phoneNumber ?? null,
      role: data.role ?? null,
      is_admin: data.isAdmin ?? null,
      created_at: data.createdAt ?? null,
      profile: data.profile ? {
        nickname: data.profile.nickname ?? null,
        birthdate: data.profile.birthdate ?? null,
        job: data.profile.job ?? null,
        description: data.profile.description ?? null,
      } : null,
    };
  } catch (err) {
    console.error("getUserInfo error:", err);
    return null;
  }
}

export async function getUserAllInfo(user_id: bigint | number): Promise<UserFullInfoResponse | null> {
  await checkAuth();

  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  const userId = typeof user_id === "bigint" ? Number(user_id) : user_id;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_BASE_URL}/users/${userId}/full`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("getUserAllInfo API error:", response.status);
      return null;
    }

    const { data } = await response.json();
    return data as UserFullInfoResponse;
  } catch (err) {
    console.error("getUserAllInfo error:", err);
    return null;
  }
}
