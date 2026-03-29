"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { apiFetch, logger } from "./logger";
import { apiClient } from "./api-client";
import { ReportDetailsResponses } from "./types";
import { ProfileDetail } from "./types";
import { revalidatePath } from "next/cache";
import {
  BlockedUsersResponses,
  MatchCandidateResponse,
  MatchHistoryResponse,
  Profile,
  ProfilesResponse,
  Photo,
  ReportedUsersResponses,
} from "./types";

export async function getProfiles(page: number): Promise<ProfilesResponse> {

  return await apiClient.get<ProfilesResponse>("/users", {
    page: page,
    size: 10,
  });
}

export async function getFilteredProfile(
  select: "userId" | "profileId" | "nickname",
  value: string
): Promise<Profile> {

  return await apiClient.get<Profile>("/users/search", {
    select: select,
    value: value,
  });
}

export async function updateProfileStatus(
  userId: number,
  rejectImage: boolean,
  rejectDescription: boolean
) {

  const response = await apiClient.post<Profile>(`/users/${userId}/profile`, {
    rejectImage: rejectImage,
    rejectDescription: rejectDescription,
  });
  revalidatePath("/profiles/profile");
  return response;
}

export const getUserById = async (userId: number) => {
  return await apiClient.get<ProfileDetail>(`/users/${userId}`);
};

export const getBlockDatas = async (page: number = 0, size: number = 10) => {
  const response : BlockedUsersResponses =  await apiClient.get<BlockedUsersResponses>("/blocks", {
    page: page,
    size: size,
  });
  return response;
};

export async function getReportedDatas(
  page: number = 0,
  size: number = 10
): Promise<ReportedUsersResponses | null> {

  return await apiClient.get<ReportedUsersResponses>("/reports", {
    page: page,
    size: size,
  });
}

export const getReportDetail = async (
  userId: number,
  page: number = 0,
  size: number = 10
) => {
  return await apiClient.get<ReportDetailsResponses>(`/reports/users/${userId}`, {
    page: page,
    size: size,
  });
};

export const banUsers = async (userId: number) => {

  return await apiClient.post<void>(`/bans/users`, {
    userId,
  });
};

export async function getUserProfileImageDetail(userId: number) {

  return await apiClient.get<Photo>(`/users/${userId}/profileImage`);
}

export async function UpdateProfileImageStatus(
  profileImageId: number,
  accepted: boolean
) {
  const response = await apiClient.patch<void>(`/profileImages/${profileImageId}`, {
    accepted,
  });
  revalidatePath("/profiles/photo");
  return response;
}

export async function getMatchHistory(
  page: number
): Promise<undefined | MatchHistoryResponse> {

  return await apiClient.get<MatchHistoryResponse>(`/manual-match/history`, {
    page: page,
  });
}

export async function getMatchCandidate(
  page: number
): Promise<undefined | MatchCandidateResponse> {
  return await apiClient.get<MatchCandidateResponse>(`/manual-match/candidates`, {
    page: page,
  });
}

export async function reserveMatch(
  user1Id: number,
  user2Id: number,
  dateTime: string,
  matchType: string
) {

  return await apiClient.post<MatchCandidateResponse>(`/manual-match`, {
    user1Id,
    user2Id,
    dateTime,
    matchType,
  });
}

export async function cancelMatch(matchId: number) {
  return await apiClient.delete<MatchCandidateResponse>(`/manual-match`, {
    manualMatchId: matchId,
  });
}

export async function setPaidMatchStatus(params: {
  matchId: number;
  user1Id: number;
  user2Id: number;
  user1Status: string;
  user2Status: string;
  user1AcceptPaid: boolean;
  user1ImagePaid: boolean;
  user1ContactPaid: boolean;
  user2AcceptPaid: boolean;
  user2ImagePaid: boolean;
  user2ContactPaid: boolean;
}) {
  try {
  
    await apiClient.post<void>(`/manual-match/paid`, params);
    
    return { success: true };

  } catch (error) {

    logger.error("setPaidMatchStatus", error);
    
    // 4. UI(컴포넌트) 쪽에서 토스트 알림 등을 띄울 수 있도록 에러를 던져줍니다.
    throw new Error("요청 처리 중 오류가 발생했습니다.");
  }
}

export async function setFreeMatchStatus(params: {
  matchId: number;
  user1Id: number;
  user2Id: number;
  user1Status: string;
  user2Status: string;
}) {

  await apiClient.post<void>(`/manual-match/free`, params);
}