// lib/actions/get-user.ts
"use server";

import { apiClient } from "../api-client";


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

export async function getUserAllInfo(user_id: bigint | number): Promise<UserFullInfoResponse | null> {
  return apiClient.get<UserFullInfoResponse>(`/users/${user_id}/full`);
}

export async function getMarketingConsentUsers(): Promise<UserFullInfoResponse | null> {
  return apiClient.get<UserFullInfoResponse>(`/users/marketing-consent`);
}
