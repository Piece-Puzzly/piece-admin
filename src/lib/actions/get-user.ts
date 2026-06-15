// lib/actions/get-user.ts
"use server";

import { apiClient, ApiError } from "../api-client";


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
  return apiClient.get<UserInfoResponse>(`/users/${userId}`);
}

// 프로필 조회 결과 — 404(또는 데이터 없음)와 일반 에러를 호출부가 구분할 수 있도록 함
export type UserAllInfoResult =
  | { status: "ok"; data: UserFullInfoResponse }
  | { status: "not-found" }
  | { status: "error"; message: string };

export async function getUserAllInfo(
  user_id: bigint | number
): Promise<UserAllInfoResult> {
  try {
    const data = await apiClient.get<UserFullInfoResponse>(
      `/users/${user_id}/full`
    );
    if (!data) return { status: "not-found" };
    return { status: "ok", data };
  } catch (e) {
    // 알려진 API 에러만 결과로 변환. 404는 프로필 없음으로 처리
    if (e instanceof ApiError) {
      if (e.status === 404) return { status: "not-found" };
      return { status: "error", message: `프로필 조회 실패 (${e.status})` };
    }
    // redirect(NEXT_REDIRECT) 등 Next.js 내부 에러는 그대로 전파
    throw e;
  }
}

export async function getMarketingConsentUsers(): Promise<UserFullInfoResponse | null> {
  return apiClient.get<UserFullInfoResponse>(`/users/marketing-consent`);
}
